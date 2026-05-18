const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const BrandPricing = require('../models/BrandPricing');

const router = express.Router();

// Upsert brand pricing (admin/store-admin of electrical)
router.post('/', protect, authorize('admin','store-admin'), [
  body('brand').isIn(['Havells','Finolex','GM','Polycab','Goldmedal','Apar','V-Guard']).withMessage('Invalid brand'),
  body('items').isArray().withMessage('Items must be array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    if (req.user.role === 'store-admin' && req.user.store !== 'electrical') {
      return res.status(403).json({ status: 'error', message: 'Only electrical store admins can update pricing' });
    }
    const { brand, items, logoUrl } = req.body;
    const doc = await BrandPricing.findOneAndUpdate(
      { brand, store: 'electrical' },
      { brand, store: 'electrical', items, logoUrl, updatedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.json({ status: 'success', data: { pricing: doc } });
  } catch (err) {
    console.error('Upsert brand pricing error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

router.get('/:brand', protect, authorize('admin','store-admin'), async (req, res) => {
  try {
    const doc = await BrandPricing.findOne({ brand: req.params.brand, store: 'electrical' }).lean();
    res.json({ status: 'success', data: { pricing: doc } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;


