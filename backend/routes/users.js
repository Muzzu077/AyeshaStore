const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
router.post('/addresses', protect, [
  body('type').isIn(['home', 'work', 'other']).withMessage('Type must be home, work, or other'),
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('address').trim().isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters'),
  body('city').trim().isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('state').trim().isLength({ min: 2, max: 50 }).withMessage('State must be between 2 and 50 characters'),
  body('pincode').matches(/^\d{6}$/).withMessage('Please provide a valid 6-digit pincode'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean')
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

    const { type, name, phone, address, city, state, pincode, isDefault = false } = req.body;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await User.findByIdAndUpdate(
        req.user._id,
        { $set: { 'addresses.$[].isDefault': false } }
      );
    }

    // Add new address
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          addresses: {
            type,
            name,
            phone,
            address,
            city,
            state,
            pincode,
            isDefault
          }
        }
      },
      { new: true }
    ).select('-password');

    res.status(201).json({
      status: 'success',
      message: 'Address added successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
router.put('/addresses/:addressId', protect, [
  body('type').optional().isIn(['home', 'work', 'other']).withMessage('Type must be home, work, or other'),
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('address').optional().trim().isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters'),
  body('city').optional().trim().isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('state').optional().trim().isLength({ min: 2, max: 50 }).withMessage('State must be between 2 and 50 characters'),
  body('pincode').optional().matches(/^\d{6}$/).withMessage('Please provide a valid 6-digit pincode'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean')
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

    const { addressId } = req.params;
    const updateData = req.body;

    // If this is set as default, unset other default addresses
    if (updateData.isDefault) {
      await User.findByIdAndUpdate(
        req.user._id,
        { $set: { 'addresses.$[].isDefault': false } }
      );
    }

    // Update the specific address
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, 'addresses._id': addressId },
      { $set: { 'addresses.$': { ...updateData, _id: addressId } } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Address updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
router.delete('/addresses/:addressId', protect, async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: { _id: addressId } } },
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
      message: 'Address deleted successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.json({
      status: 'success',
      message: 'Product added to wishlist',
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
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
      message: 'Product removed from wishlist',
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price images rating brand')
      .select('wishlist')
      .lean();

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const Order = require('../models/Order');
    const Product = require('../models/Product');

    // Get user's order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$finalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.product', 'name images')
      .select('orderNumber orderStatus finalAmount createdAt')
      .lean();

    // Get wishlist count
    const wishlistCount = req.user.wishlist.length;

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      deliveredOrders: 0
    };

    res.json({
      status: 'success',
      data: {
        stats,
        recentOrders,
        wishlistCount
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
