const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect, authorize, authorizeStore, optionalAuth } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('store').optional().isIn(['electrical', 'plumbing', 'spare-parts']).withMessage('Invalid store'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sort').optional().isIn(['price-asc', 'price-desc', 'rating-desc', 'newest', 'name-asc']).withMessage('Invalid sort option'),
  query('search').optional().isString().withMessage('Search must be a string')
], optionalAuth, async (req, res) => {
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

    const {
      page = 1,
      limit = 12,
      store,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (store) filter.store = store;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price-asc':
        sortObj = { price: 1 };
        break;
      case 'price-desc':
        sortObj = { price: -1 };
        break;
      case 'rating-desc':
        sortObj = { rating: -1 };
        break;
      case 'name-asc':
        sortObj = { name: 1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reviews.user', 'name')
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name')
      .populate('createdBy', 'name')
      .lean();

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not available'
      });
    }

    // Get related products from the same store and category
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      store: product.store,
      category: product.category,
      isActive: true
    })
    .limit(4)
    .select('name price images rating')
    .lean();

    res.json({
      status: 'success',
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin/Store Admin)
router.post('/', protect, authorize('admin', 'store-admin'), authorizeStore, uploadMultiple('images', 5), [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('store').isIn(['electrical', 'plumbing', 'spare-parts']).withMessage('Invalid store'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('specifications').optional().isObject().withMessage('Specifications must be an object')
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

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      store,
      brand,
      stock,
      features = [],
      specifications = {},
      warranty = '1 Year',
      tags = []
    } = req.body;

    // Check if store admin is trying to create product for their store
    if (req.user.role === 'store-admin' && req.user.store !== store) {
      return res.status(403).json({
        status: 'error',
        message: `You can only create products for ${req.user.store} store`
      });
    }

    // Prepare product data
    const productData = {
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      store,
      brand,
      stock: parseInt(stock),
      features,
      specifications,
      warranty,
      tags,
      createdBy: req.user._id
    };

    // Add images if uploaded
    if (req.imagesInfo && req.imagesInfo.length > 0) {
      productData.images = req.imagesInfo.map(img => ({
        url: img.url,
        public_id: img.public_id,
        alt: name
      }));
    }

    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Store Admin)
router.put('/:id', protect, authorize('admin', 'store-admin'), authorizeStore, uploadMultiple('images', 5), [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
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

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if store admin is trying to update product from their store
    if (req.user.role === 'store-admin' && req.user.store !== product.store) {
      return res.status(403).json({
        status: 'error',
        message: `You can only update products from ${req.user.store} store`
      });
    }

    // Update product data
    const updateData = { ...req.body, updatedBy: req.user._id };

    // Handle price conversion
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);

    // Add new images if uploaded
    if (req.imagesInfo && req.imagesInfo.length > 0) {
      const newImages = req.imagesInfo.map(img => ({
        url: img.url,
        public_id: img.public_id,
        alt: updateData.name || product.name
      }));
      updateData.images = [...product.images, ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Product updated successfully',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin/Store Admin)
router.delete('/:id', protect, authorize('admin', 'store-admin'), authorizeStore, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if store admin is trying to delete product from their store
    if (req.user.role === 'store-admin' && req.user.store !== product.store) {
      return res.status(403).json({
        status: 'error',
        message: `You can only delete products from ${req.user.store} store`
      });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    product.updatedBy = req.user._id;
    await product.save();

    res.json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot be more than 500 characters')
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

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this product'
      });
    }

    // Add review
    const review = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment || ''
    };

    product.reviews.push(review);
    await product.save();

    // Populate the new review
    await product.populate('reviews.user', 'name');

    res.status(201).json({
      status: 'success',
      message: 'Review added successfully',
      data: {
        review: product.reviews[product.reviews.length - 1]
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get product categories
// @route   GET /api/products/categories/:store
// @access  Public
router.get('/categories/:store', async (req, res) => {
  try {
    const { store } = req.params;

    if (!['electrical', 'plumbing', 'spare-parts'].includes(store)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid store'
      });
    }

    const categories = await Product.aggregate([
      { $match: { store, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      status: 'success',
      data: {
        categories: categories.map(cat => ({
          name: cat._id,
          count: cat.count
        }))
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
