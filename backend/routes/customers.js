const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Customer = require('../models/Customer');

const router = express.Router();

// Create or update customer
router.post('/', protect, authorize('admin','store-admin'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    const data = { ...req.body, createdBy: req.user._id };
    const doc = await Customer.create(data);
    res.status(201).json({ status: 'success', data: { customer: doc } });
  } catch (err) {
    console.error('Create customer error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

router.get('/', protect, authorize('admin','store-admin'), async (req, res) => {
  try {
    const list = await Customer.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ status: 'success', data: { customers: list } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;


