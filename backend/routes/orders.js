const express = require('express');
const { query, body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize, authorizeStore } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    // Build filter
    const filter = { user: req.user._id };
    if (status) filter.orderStatus = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name images')
      .lean();

    // Get total count
    const total = await Order.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      status: 'success',
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images brand')
      .lean();

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        status: 'error',
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      note: 'Order cancelled by customer',
      updatedBy: req.user._id
    });

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    await order.save();

    res.json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus
        }
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Store Admin)
router.put('/:id/status', protect, authorize('admin', 'store-admin'), authorizeStore, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status'),
  body('note').optional().trim().isLength({ max: 500 }).withMessage('Note cannot be more than 500 characters'),
  body('trackingNumber').optional().trim().isLength({ max: 100 }).withMessage('Tracking number cannot be more than 100 characters'),
  body('courierName').optional().trim().isLength({ max: 100 }).withMessage('Courier name cannot be more than 100 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, note, trackingNumber, courierName } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if store admin is trying to update order from their store
    if (req.user.role === 'store-admin') {
      const orderStores = [...new Set(order.items.map(item => item.store))];
      if (!orderStores.includes(req.user.store)) {
        return res.status(403).json({
          status: 'error',
          message: `You can only update orders from ${req.user.store} store`
        });
      }
    }

    // Update order status
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      note: note || `Order status updated to ${status}`,
      updatedBy: req.user._id
    });

    // Update tracking info if provided
    if (trackingNumber || courierName) {
      order.trackingInfo = {
        ...order.trackingInfo,
        ...(trackingNumber && { trackingNumber }),
        ...(courierName && { courierName })
      };
    }

    // Set delivery date if status is delivered
    if (status === 'delivered') {
      order.trackingInfo.actualDelivery = new Date();
    }

    await order.save();

    res.json({
      status: 'success',
      message: 'Order status updated successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
          trackingInfo: order.trackingInfo
        }
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin/Store Admin)
router.get('/admin/all', protect, authorize('admin', 'store-admin'), authorizeStore, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status'),
  query('store').optional().isIn(['electrical', 'plumbing', 'spare-parts']).withMessage('Invalid store'),
  query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 20, status, store, paymentStatus } = req.query;

    // Build filter
    const filter = {};

    if (status) filter.orderStatus = status;
    if (paymentStatus) filter['paymentInfo.status'] = paymentStatus;
    
    // Filter by store for store admins
    if (req.user.role === 'store-admin') {
      filter['items.store'] = req.user.store;
    } else if (store) {
      filter['items.store'] = store;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .lean();

    // Get total count
    const total = await Order.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      status: 'success',
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private (Admin/Store Admin)
router.get('/admin/stats', protect, authorize('admin', 'store-admin'), authorizeStore, async (req, res) => {
  try {
    const { store } = req.query;

    // Build filter
    const filter = {};
    if (req.user.role === 'store-admin') {
      filter['items.store'] = req.user.store;
    } else if (store) {
      filter['items.store'] = store;
    }

    // Get order statistics
    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('orderNumber orderStatus finalAmount createdAt')
      .lean();

    const result = stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0
    };

    res.json({
      status: 'success',
      data: {
        stats: result,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
