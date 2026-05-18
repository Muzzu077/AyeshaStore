const mongoose = require('mongoose');

const priceItemSchema = new mongoose.Schema({
  description: { type: String, required: true }, // e.g., "1.0 Sqmm 90 Mtrs"
  listPrice: { type: Number, required: true, min: 0 },
  coilPrice: { type: Number, required: true, min: 0 },
});

const brandPricingSchema = new mongoose.Schema({
  brand: { 
    type: String, 
    required: true, 
    enum: ['Havells','Finolex','GM','Polycab','Goldmedal','Apar','V-Guard'] 
  },
  store: { type: String, enum: ['electrical','plumbing','spare-parts'], default: 'electrical' },
  items: [priceItemSchema],
  logoUrl: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

brandPricingSchema.index({ brand: 1, store: 1 }, { unique: true });

module.exports = mongoose.model('BrandPricing', brandPricingSchema);


