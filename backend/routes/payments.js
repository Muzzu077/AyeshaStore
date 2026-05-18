const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, [
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('items.*.productId').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Name is required'),
  body('shippingAddress.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').matches(/^\d{6}$/).withMessage('Valid pincode is required')
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

    const { items, shippingAddress, notes } = req.body;

    // Validate and get products
    const productIds = items.map(item => item.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more products not found or unavailable'
      });
    }

    // Calculate order total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      
      if (!product) {
        return res.status(400).json({
          status: 'error',
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        store: product.store
      });
    }

    // Calculate shipping charges (free above ₹500, otherwise ₹50)
    const shippingCharges = totalAmount >= 500 ? 0 : 50;
    const finalAmount = totalAmount + shippingCharges;

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: 'razorpay',
        status: 'pending'
      },
      totalAmount,
      shippingCharges,
      finalAmount,
      notes,
      statusHistory: [{
        status: 'pending',
        note: 'Order created'
      }]
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    // Update order with Razorpay order ID
    order.paymentInfo.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          shippingCharges: order.shippingCharges,
          finalAmount: order.finalAmount,
          items: order.items
        },
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID
        }
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify-payment
// @access  Private
router.post('/verify-payment', protect, [
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Razorpay signature is required')
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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Find order
    const order = await Order.findOne({
      'paymentInfo.razorpayOrderId': razorpay_order_id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payment signature'
      });
    }

    // Update order with payment details
    order.paymentInfo.status = 'paid';
    order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
    order.paymentInfo.razorpaySignature = razorpay_signature;
    order.orderStatus = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      note: 'Payment verified and order confirmed'
    });

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    await order.save();

    res.json({
      status: 'success',
      message: 'Payment verified successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentInfo.status
        }
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create COD order
// @route   POST /api/payments/create-cod-order
// @access  Private
router.post('/create-cod-order', protect, [
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('items.*.productId').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Name is required'),
  body('shippingAddress.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').matches(/^\d{6}$/).withMessage('Valid pincode is required')
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

    const { items, shippingAddress, notes } = req.body;

    // Validate and get products
    const productIds = items.map(item => item.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more products not found or unavailable'
      });
    }

    // Calculate order total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      
      if (!product) {
        return res.status(400).json({
          status: 'error',
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        store: product.store
      });
    }

    // Calculate shipping charges (free above ₹500, otherwise ₹50)
    const shippingCharges = totalAmount >= 500 ? 0 : 50;
    const finalAmount = totalAmount + shippingCharges;

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: 'cod',
        status: 'pending'
      },
      orderStatus: 'confirmed',
      totalAmount,
      shippingCharges,
      finalAmount,
      notes,
      statusHistory: [{
        status: 'confirmed',
        note: 'COD order created'
      }]
    });

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      status: 'success',
      message: 'COD order created successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
          paymentMethod: order.paymentInfo.method,
          totalAmount: order.totalAmount,
          shippingCharges: order.shippingCharges,
          finalAmount: order.finalAmount,
          items: order.items
        }
      }
    });
  } catch (error) {
    console.error('Create COD order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Public
router.get('/methods', (req, res) => {
  res.json({
    status: 'success',
    data: {
      methods: [
        {
          id: 'razorpay',
          name: 'Online Payment',
          description: 'Pay securely with Razorpay',
          icon: 'credit-card',
          available: true
        },
        {
          id: 'cod',
          name: 'Cash on Delivery',
          description: 'Pay when your order is delivered',
          icon: 'money',
          available: true
        }
      ]
    }
  });
});

module.exports = router;
