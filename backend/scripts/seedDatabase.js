const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@ayeshastore.com',
    password: 'admin123456',
    phone: '9876543210',
    role: 'admin',
    isActive: true
  },
  {
    name: 'Gadwal Kalimulla',
    email: 'electrical@ayeshastore.com',
    password: 'electrical123',
    phone: '9876543211',
    role: 'store-admin',
    store: 'electrical',
    isActive: true
  },
  {
    name: 'Gadwal Amanulla',
    email: 'spareparts@ayeshastore.com',
    password: 'spareparts123',
    phone: '9876543212',
    role: 'store-admin',
    store: 'spare-parts',
    isActive: true
  },
  {
    name: 'Bakkar Sohail',
    email: 'plumbing@ayeshastore.com',
    password: 'plumbing123',
    phone: '9876543213',
    role: 'store-admin',
    store: 'plumbing',
    isActive: true
  }
];

const sampleProducts = [
  // Electrical Store Products
  {
    name: 'Crompton Ceiling Fan',
    price: 2500,
    originalPrice: 3000,
    category: 'Ceiling Fans',
    store: 'electrical',
    brand: 'Crompton',
    description: 'Energy-efficient ceiling fan with remote control, 1200mm sweep, 5-star rating',
    features: ['Remote Control', 'Energy Efficient', '5-Star Rating', '1200mm Sweep'],
    stock: 15,
    rating: 4.5,
    warranty: '2 Years',
    specifications: {
      'Power': '75W',
      'Speed': '3 Speed',
      'Sweep': '1200mm',
      'Material': 'ABS Plastic'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop',
      alt: 'Crompton Ceiling Fan'
    }]
  },
  {
    name: 'Philips LED Bulb Pack',
    price: 299,
    originalPrice: 399,
    category: 'LED Lights',
    store: 'electrical',
    brand: 'Philips',
    description: 'Pack of 4 LED bulbs, 9W each, warm white light, energy saving',
    features: ['Energy Saving', 'Warm White', '9W Power', 'Pack of 4'],
    stock: 50,
    rating: 4.3,
    warranty: '1 Year',
    specifications: {
      'Power': '9W',
      'Color': 'Warm White',
      'Lifespan': '15000 Hours',
      'Base': 'B22'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&h=400&fit=crop',
      alt: 'Philips LED Bulb Pack'
    }]
  },
  {
    name: 'Havells Switchboard',
    price: 450,
    originalPrice: 550,
    category: 'Switchboards',
    store: 'electrical',
    brand: 'Havells',
    description: 'Modular switchboard with 6 switches, fire retardant material',
    features: ['Modular Design', 'Fire Retardant', '6 Switches', 'Easy Installation'],
    stock: 25,
    rating: 4.2,
    warranty: '1 Year',
    specifications: {
      'Switches': '6',
      'Material': 'Fire Retardant',
      'Color': 'White',
      'Mounting': 'Surface'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
      alt: 'Havells Switchboard'
    }]
  },
  {
    name: 'Finolex Electrical Wire',
    price: 1200,
    originalPrice: 1500,
    category: 'Electrical Wires',
    store: 'electrical',
    brand: 'Finolex',
    description: '100m roll of 2.5 sq mm copper wire, ISI marked, fire resistant',
    features: ['ISI Marked', 'Fire Resistant', '100m Roll', '2.5 sq mm'],
    stock: 30,
    rating: 4.6,
    warranty: '1 Year',
    specifications: {
      'Length': '100m',
      'Gauge': '2.5 sq mm',
      'Material': 'Copper',
      'Insulation': 'PVC'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      alt: 'Finolex Electrical Wire'
    }]
  },

  // Spare Parts Store Products
  {
    name: 'Fan Blade Set',
    price: 180,
    originalPrice: 220,
    category: 'Fan Spares',
    store: 'spare-parts',
    brand: 'Generic',
    description: 'Set of 3 fan blades, compatible with most ceiling fans',
    features: ['Set of 3', 'Universal Fit', 'ABS Material', 'Easy Installation'],
    stock: 40,
    rating: 4.1,
    warranty: '6 Months',
    specifications: {
      'Quantity': '3 Blades',
      'Material': 'ABS Plastic',
      'Length': '1200mm',
      'Color': 'White'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      alt: 'Fan Blade Set'
    }]
  },
  {
    name: 'Motor Bearing Set',
    price: 85,
    originalPrice: 100,
    category: 'Motor Cores',
    store: 'spare-parts',
    brand: 'SKF',
    description: 'High-quality ball bearings for fan motors, reduces noise and friction',
    features: ['Ball Bearing', 'Noise Reduction', 'Long Life', 'Easy Fit'],
    stock: 60,
    rating: 4.4,
    warranty: '1 Year',
    specifications: {
      'Type': 'Ball Bearing',
      'Size': '6202',
      'Material': 'Steel',
      'Seal': 'Shielded'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      alt: 'Motor Bearing Set'
    }]
  },
  {
    name: 'Repair Toolkit',
    price: 450,
    originalPrice: 550,
    category: 'Toolkits',
    store: 'spare-parts',
    brand: 'Stanley',
    description: 'Complete toolkit for electrical repairs, includes 15 essential tools',
    features: ['15 Tools', 'Carrying Case', 'Professional Grade', 'Warranty'],
    stock: 20,
    rating: 4.7,
    warranty: '2 Years',
    specifications: {
      'Tools': '15 Pieces',
      'Case': 'Included',
      'Material': 'Steel',
      'Weight': '2.5kg'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      alt: 'Repair Toolkit'
    }]
  },

  // Plumbing Store Products
  {
    name: 'Sintex Water Tank',
    price: 3500,
    originalPrice: 4200,
    category: 'Water Tanks',
    store: 'plumbing',
    brand: 'Sintex',
    description: '1000L capacity water tank, UV resistant, food grade material',
    features: ['1000L Capacity', 'UV Resistant', 'Food Grade', 'Durable'],
    stock: 12,
    rating: 4.5,
    warranty: '5 Years',
    specifications: {
      'Capacity': '1000L',
      'Material': 'Food Grade Plastic',
      'Color': 'Blue',
      'Height': '1.2m'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      alt: 'Sintex Water Tank'
    }]
  },
  {
    name: 'PVC Pipe Set',
    price: 800,
    originalPrice: 950,
    category: 'PVC Pipes',
    store: 'plumbing',
    brand: 'Astral',
    description: 'Set of 10 PVC pipes, 2-inch diameter, 3m length each',
    features: ['10 Pipes', '2-inch Diameter', '3m Length', 'UV Resistant'],
    stock: 35,
    rating: 4.2,
    warranty: '1 Year',
    specifications: {
      'Quantity': '10 Pipes',
      'Diameter': '2 inch',
      'Length': '3m each',
      'Material': 'PVC'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      alt: 'PVC Pipe Set'
    }]
  },
  {
    name: 'Mixer Tap',
    price: 1200,
    originalPrice: 1400,
    category: 'Taps & Faucets',
    store: 'plumbing',
    brand: 'Jaquar',
    description: 'Single lever mixer tap, chrome finish, ceramic cartridge',
    features: ['Single Lever', 'Chrome Finish', 'Ceramic Cartridge', 'Easy Installation'],
    stock: 28,
    rating: 4.4,
    warranty: '2 Years',
    specifications: {
      'Type': 'Single Lever',
      'Finish': 'Chrome',
      'Cartridge': 'Ceramic',
      'Mounting': 'Wall'
    },
    images: [{
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      alt: 'Mixer Tap'
    }]
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayesha-store');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create users
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
    }
    console.log('👥 Created sample users');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Get admin user for createdBy field
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    // Create products
    for (const productData of sampleProducts) {
      const product = new Product({
        ...productData,
        createdBy: adminUser._id
      });
      await product.save();
    }
    console.log('📦 Created sample products');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Get admin user for createdBy field
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    const categories = [
      // Electrical categories
      { name: 'Ceiling Fans', store: 'electrical', description: 'Energy efficient ceiling fans' },
      { name: 'LED Lights', store: 'electrical', description: 'LED lighting solutions' },
      { name: 'Switchboards', store: 'electrical', description: 'Electrical switchboards and panels' },
      { name: 'Electrical Wires', store: 'electrical', description: 'Copper and aluminum wires' },
      
      // Spare parts categories
      { name: 'Fan Spares', store: 'spare-parts', description: 'Fan replacement parts' },
      { name: 'Motor Cores', store: 'spare-parts', description: 'Motor components and bearings' },
      { name: 'Toolkits', store: 'spare-parts', description: 'Repair and maintenance tools' },
      
      // Plumbing categories
      { name: 'Water Tanks', store: 'plumbing', description: 'Water storage tanks' },
      { name: 'PVC Pipes', store: 'plumbing', description: 'PVC pipes and fittings' },
      { name: 'Taps & Faucets', store: 'plumbing', description: 'Water taps and faucets' }
    ];

    for (const categoryData of categories) {
      const category = new Category({
        ...categoryData,
        createdBy: adminUser._id
      });
      await category.save();
    }
    console.log('📂 Created sample categories');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await seedUsers();
    await seedCategories();
    await seedProducts();
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Admin Credentials:');
    console.log('Admin: admin@ayeshastore.com / admin123456');
    console.log('Electrical: electrical@ayeshastore.com / electrical123');
    console.log('Spare Parts: spareparts@ayeshastore.com / spareparts123');
    console.log('Plumbing: plumbing@ayeshastore.com / plumbing123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
