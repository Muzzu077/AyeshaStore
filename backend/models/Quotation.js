const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  listPrice: { type: Number, required: true, min: 0 },
  coilPrice: { type: Number, required: true, min: 0 },
  lineTotal: { type: Number, required: true, min: 0 },
});

const quotationSchema = new mongoose.Schema({
  quotationNumber: { type: String, unique: true },
  store: { type: String, enum: ['electrical'], default: 'electrical' },
  brand: { type: String, enum: ['Havells','Finolex','GM','Polycab','Goldmedal','Apar','V-Guard'], required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  dateOfOffer: { type: Date, default: Date.now },
  items: [quotationItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  gstPercent: { type: Number, default: 18 },
  gstAmount: { type: Number, required: true, min: 0 },
  grandTotal: { type: Number, required: true, min: 0 },
  terms: { type: String, default: 'Including taxes @18%\nValidity only 3 days\nMaterial supply 7 working days' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

quotationSchema.index({ store: 1, createdAt: -1 });

quotationSchema.pre('save', async function(next) {
  if (this.quotationNumber) return next();
  const count = await mongoose.model('Quotation').countDocuments();
  this.quotationNumber = `AYE-Q-${String(count + 1).padStart(6, '0')}`;
  next();
});

module.exports = mongoose.model('Quotation', quotationSchema);


