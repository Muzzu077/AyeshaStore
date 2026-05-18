const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  store: {
    type: String,
    required: [true, 'Store is required'],
    enum: ['electrical', 'plumbing', 'spare-parts']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    alt: String
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minStock: {
    type: Number,
    default: 5,
    min: [0, 'Minimum stock cannot be negative']
  },
  features: [String],
  specifications: {
    type: Map,
    of: String
  },
  warranty: {
    type: String,
    default: '1 Year'
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ store: 1, category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

// Virtual for average rating
productSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

// Virtual for review count
productSchema.virtual('reviewCount').get(function() {
  return this.reviews.length;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Update rating when reviews change
productSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = Math.round((sum / this.reviews.length) * 10) / 10;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
