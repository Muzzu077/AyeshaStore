const express = require('express');
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { protect, authorize, authorizeStore } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin/Store Admin)
router.get('/dashboard', protect, authorize('admin', 'store-admin'), authorizeStore, async (req, res) => {
  try {
    const { store } = req.query;

    // Build filter for store admins
    const filter = {};
    if (req.user.role === 'store-admin') {
      filter.store = req.user.store;
    } else if (store) {
      filter.store = store;
    }

    // Get product statistics
    const productStats = await Product.aggregate([
      { $match: { ...filter, isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          lowStockProducts: {
            $sum: { $cond: [{ $lte: ['$stock', '$minStock'] }, 1, 0] }
          },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    // Get order statistics
    const orderFilter = {};
    if (req.user.role === 'store-admin') {
      orderFilter['items.store'] = req.user.store;
    } else if (store) {
      orderFilter['items.store'] = store;
    }

    const orderStats = await Order.aggregate([
      { $match: orderFilter },
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

    // Get user statistics
    const userStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          customers: {
            $sum: { $cond: [{ $eq: ['$role', 'customer'] }, 1, 0] }
          },
          storeAdmins: {
            $sum: { $cond: [{ $eq: ['$role', 'store-admin'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find(orderFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .select('orderNumber orderStatus finalAmount createdAt')
      .lean();

    // Get low stock products
    const lowStockProducts = await Product.find({
      ...filter,
      isActive: true,
      $expr: { $lte: ['$stock', '$minStock'] }
    })
    .select('name stock minStock price')
    .limit(10)
    .lean();

    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      { $match: orderFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          totalRevenue: 1,
          price: '$product.price',
          images: '$product.images'
        }
      }
    ]);

    const result = {
      products: productStats[0] || {
        totalProducts: 0,
        totalStock: 0,
        lowStockProducts: 0,
        totalValue: 0
      },
      orders: orderStats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
      },
      users: userStats[0] || {
        totalUsers: 0,
        customers: 0,
        storeAdmins: 0
      },
      recentOrders,
      lowStockProducts,
      topSellingProducts
    };

    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', protect, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['customer', 'admin', 'store-admin']).withMessage('Invalid role'),
  query('search').optional().isString().withMessage('Search must be a string')
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

    const { page = 1, limit = 20, role, search } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await User.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      status: 'success',
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create store admin
// @route   POST /api/admin/store-admin
// @access  Private (Admin)
router.post('/store-admin', protect, authorize('admin'), [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('store').isIn(['electrical', 'plumbing', 'spare-parts']).withMessage('Invalid store')
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

    const { name, email, password, phone, store } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Create store admin
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'store-admin',
      store
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      message: 'Store admin created successfully',
      data: {
        user: userResponse
      }
    });
  } catch (error) {
    console.error('Create store admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
router.put('/users/:id/status', protect, authorize('admin'), [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
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

    const { id } = req.params;
    const { isActive } = req.body;

    // Prevent deactivating own account
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot deactivate your own account'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get sales report
// @route   GET /api/admin/sales-report
// @access  Private (Admin/Store Admin)
router.get('/sales-report', protect, authorize('admin', 'store-admin'), authorizeStore, [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('store').optional().isIn(['electrical', 'plumbing', 'spare-parts']).withMessage('Invalid store')
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

    const { startDate, endDate, store } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Build order filter
    const orderFilter = {};
    if (Object.keys(dateFilter).length > 0) {
      orderFilter.createdAt = dateFilter;
    }

    // Filter by store
    if (req.user.role === 'store-admin') {
      orderFilter['items.store'] = req.user.store;
    } else if (store) {
      orderFilter['items.store'] = store;
    }

    // Get sales data
    const salesData = await Order.aggregate([
      { $match: orderFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          totalItems: { $sum: { $size: '$items' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get store-wise sales
    const storeWiseSales = await Order.aggregate([
      { $match: orderFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.store',
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalItems: { $sum: '$items.quantity' }
        }
      }
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      { $match: orderFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          totalRevenue: 1,
          price: '$product.price'
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        salesData,
        storeWiseSales,
        topProducts
      }
    });
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
