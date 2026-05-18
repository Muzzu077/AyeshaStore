const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Quotation = require('../models/Quotation');
const Customer = require('../models/Customer');

const router = express.Router();

// Create quotation (Electrical admin only)
router.post('/', protect, authorize('admin','store-admin'), [
  body('brand').isIn(['Havells','Finolex','GM','Polycab','Goldmedal','Apar','V-Guard']).withMessage('Invalid brand'),
  body('customer').optional().isMongoId().withMessage('Invalid customer id'),
  body('customerName').trim().isLength({ min: 2 }).withMessage('Customer name required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item required'),
  body('items.*.description').notEmpty(),
  body('items.*.quantity').isFloat({ min: 0 }),
  body('items.*.listPrice').isFloat({ min: 0 }),
  body('items.*.coilPrice').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
    }

    if (req.user.role === 'store-admin' && req.user.store !== 'electrical') {
      return res.status(403).json({ status: 'error', message: 'Only electrical store admins can create quotations' });
    }

    const { brand, customer, customerName, items, terms, dateOfOffer } = req.body;

    const calcItems = items.map(it => ({
      description: it.description,
      quantity: Number(it.quantity),
      listPrice: Number(it.listPrice),
      coilPrice: Number(it.coilPrice),
      lineTotal: Number(it.quantity) * Number(it.coilPrice)
    }));

    const subtotal = calcItems.reduce((s, it) => s + it.lineTotal, 0);
    const gstPercent = 18;
    const gstAmount = +(subtotal * gstPercent / 100).toFixed(2);
    const grandTotal = +(subtotal + gstAmount).toFixed(2);

    const doc = await Quotation.create({
      brand,
      store: 'electrical',
      customer: customer || undefined,
      customerName,
      dateOfOffer: dateOfOffer || new Date(),
      items: calcItems,
      subtotal,
      gstPercent,
      gstAmount,
      grandTotal,
      terms,
      createdBy: req.user._id
    });

    res.status(201).json({ status: 'success', data: { quotation: doc } });
  } catch (err) {
    console.error('Create quotation error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// List quotations (electrical)
router.get('/', protect, authorize('admin','store-admin'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    if (req.user.role === 'store-admin' && req.user.store !== 'electrical') {
      return res.status(403).json({ status: 'error', message: 'Only electrical store admins can view quotations' });
    }
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;
    const filter = { store: 'electrical' };
    const [items, total] = await Promise.all([
      Quotation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('customer','name contactNumber').lean(),
      Quotation.countDocuments(filter)
    ]);
    res.json({ status: 'success', data: { quotations: items, pagination: { page, total, totalPages: Math.ceil(total/limit) } } });
  } catch (err) {
    console.error('List quotations error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Get by id
router.get('/:id', protect, authorize('admin','store-admin'), async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id).populate('customer','name contactNumber address').lean();
    if (!q) return res.status(404).json({ status: 'error', message: 'Not found' });
    res.json({ status: 'success', data: { quotation: q } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;


