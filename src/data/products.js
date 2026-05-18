// Removed duplicate products array to avoid redeclaration error.
// ...existing code...
export const products = [
  // Electrical Store Products
  {
        id: 'elec-001',
        name: 'Crompton Ceiling Fan',
        price: 2500,
        originalPrice: 3000,
        category: 'Ceiling Fans',
        store: 'electrical',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop', // Updated image
        description: 'Energy-efficient ceiling fan with remote control, 1200mm sweep, 5-star rating',
        features: ['Remote Control', 'Energy Efficient', '5-Star Rating', '1200mm Sweep'],
        stock: 15,
        rating: 4.5,
        reviews: 128,
        brand: 'Crompton',
        warranty: '2 Years',
        specifications: {
          'Power': '75W',
          'Speed': '3 Speed',
          'Sweep': '1200mm',
          'Material': 'ABS Plastic'
        }
      },
      // New Fan Product 1
      {
        id: 'elec-005',
        name: 'Usha Table Fan',
        price: 1450,
        originalPrice: 1700,
        category: 'Table Fans',
        store: 'electrical',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop',
        description: 'Portable table fan with 3 speed settings and oscillation feature.',
        features: ['Portable', '3 Speed', 'Oscillation', 'Low Noise'],
        stock: 20,
        rating: 4.3,
        reviews: 54,
        brand: 'Usha',
        warranty: '1 Year',
        specifications: {
          'Power': '55W',
          'Speed': '3 Speed',
          'Sweep': '400mm',
          'Material': 'Plastic'
        }
      },
      // New Fan Product 2
      {
        id: 'elec-006',
        name: 'Bajaj Exhaust Fan',
        price: 1100,
        originalPrice: 1350,
        category: 'Exhaust Fans',
        store: 'electrical',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop',
        description: 'Durable exhaust fan for kitchens and bathrooms, rust-proof body.',
        features: ['Rust Proof', 'High Air Delivery', 'Low Power Consumption'],
        stock: 18,
        rating: 4.1,
        reviews: 39,
        brand: 'Bajaj',
        warranty: '1 Year',
        specifications: {
          'Power': '40W',
          'Size': '200mm',
          'Material': 'Metal',
          'Color': 'White'
        }
    },
  {
    id: 'elec-002',
    name: 'Philips LED Bulb Pack',
    price: 299,
    originalPrice: 399,
    category: 'LED Lights',
    store: 'electrical',
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&h=400&fit=crop',
    description: 'Pack of 4 LED bulbs, 9W each, warm white light, energy saving',
    features: ['Energy Saving', 'Warm White', '9W Power', 'Pack of 4'],
    stock: 50,
    rating: 4.3,
    reviews: 89,
    brand: 'Philips',
    warranty: '1 Year',
    specifications: {
      'Power': '9W',
      'Color': 'Warm White',
      'Lifespan': '15000 Hours',
      'Base': 'B22'
    }
  },
  {
    id: 'elec-003',
    name: 'Havells Switchboard',
    price: 450,
    originalPrice: 550,
    category: 'Switchboards',
    store: 'electrical',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Modular switchboard with 6 switches, fire retardant material',
    features: ['Modular Design', 'Fire Retardant', '6 Switches', 'Easy Installation'],
    stock: 25,
    rating: 4.2,
    reviews: 67,
    brand: 'Havells',
    warranty: '1 Year',
    specifications: {
      'Switches': '6',
      'Material': 'Fire Retardant',
      'Color': 'White',
      'Mounting': 'Surface'
    }
  },
  {
    id: 'elec-004',
    name: 'Finolex Electrical Wire',
    price: 1200,
    originalPrice: 1500,
    category: 'Electrical Wires',
    store: 'electrical',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: '100m roll of 2.5 sq mm copper wire, ISI marked, fire resistant',
    features: ['ISI Marked', 'Fire Resistant', '100m Roll', '2.5 sq mm'],
    stock: 30,
    rating: 4.6,
    reviews: 156,
    brand: 'Finolex',
    warranty: '1 Year',
    specifications: {
      'Length': '100m',
      'Gauge': '2.5 sq mm',
      'Material': 'Copper',
      'Insulation': 'PVC'
    }
  },
  {
    id: 'elec-007',
    name: 'Syska LED Bulb',
    price: 120,
    originalPrice: 150,
    category: 'Bulbs',
    store: 'electrical',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop',
    description: 'Bright 9W LED bulb, energy efficient and long-lasting.',
    features: ['9W Power', 'Energy Efficient', 'Long Life', 'Cool White'],
    stock: 100,
    rating: 4.6,
    reviews: 210,
    brand: 'Syska',
    warranty: '1 Year',
    specifications: {
      'Power': '9W',
      'Color': 'Cool White',
      'Base': 'B22',
      'Lifespan': '15000 Hours'
    }
  },
  {
    id: 'elec-008',
    name: 'Philips LED Tube Light',
    price: 350,
    originalPrice: 420,
    category: 'Tube Lights',
    store: 'electrical',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop',
    description: '4ft LED tube light, bright and energy saving.',
    features: ['4ft Length', 'LED', 'Energy Saving', 'Cool Daylight'],
    stock: 60,
    rating: 4.4,
    reviews: 98,
    brand: 'Philips',
    warranty: '2 Years',
    specifications: {
      'Length': '4ft',
      'Power': '20W',
      'Color': 'Cool Daylight',
      'Material': 'Polycarbonate'
    }
  },

  // Spare Parts Store Products
  {
    id: 'spare-001',
    name: 'Fan Blade Set',
    price: 180,
    originalPrice: 220,
    category: 'Fan Spares',
    store: 'spare-parts',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: 'Set of 3 fan blades, compatible with most ceiling fans',
    features: ['Set of 3', 'Universal Fit', 'ABS Material', 'Easy Installation'],
    stock: 40,
    rating: 4.1,
    reviews: 45,
    brand: 'Generic',
    warranty: '6 Months',
    specifications: {
      'Quantity': '3 Blades',
      'Material': 'ABS Plastic',
      'Length': '1200mm',
      'Color': 'White'
    }
  },
  {
    id: 'spare-002',
    name: 'Motor Bearing Set',
    price: 85,
    originalPrice: 100,
    category: 'Motor Cores',
    store: 'spare-parts',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: 'High-quality ball bearings for fan motors, reduces noise and friction',
    features: ['Ball Bearing', 'Noise Reduction', 'Long Life', 'Easy Fit'],
    stock: 60,
    rating: 4.4,
    reviews: 78,
    brand: 'SKF',
    warranty: '1 Year',
    specifications: {
      'Type': 'Ball Bearing',
      'Size': '6202',
      'Material': 'Steel',
      'Seal': 'Shielded'
    }
  },
  {
    id: 'spare-003',
    name: 'Electrical Switch',
    price: 35,
    originalPrice: 45,
    category: 'Switches & Connectors',
    store: 'spare-parts',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Single pole switch, 6A rating, suitable for lighting circuits',
    features: ['6A Rating', 'Single Pole', 'Easy Installation', 'Durable'],
    stock: 100,
    rating: 4.0,
    reviews: 34,
    brand: 'Generic',
    warranty: '6 Months',
    specifications: {
      'Rating': '6A',
      'Poles': 'Single',
      'Material': 'Plastic',
      'Mounting': 'Surface'
    }
  },
  {
    id: 'spare-004',
    name: 'Repair Toolkit',
    price: 450,
    originalPrice: 550,
    category: 'Toolkits',
    store: 'spare-parts',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: 'Complete toolkit for electrical repairs, includes 15 essential tools',
    features: ['15 Tools', 'Carrying Case', 'Professional Grade', 'Warranty'],
    stock: 20,
    rating: 4.7,
    reviews: 92,
    brand: 'Stanley',
    warranty: '2 Years',
    specifications: {
      'Tools': '15 Pieces',
      'Case': 'Included',
      'Material': 'Steel',
      'Weight': '2.5kg'
    }
  },

  // Plumbing Store Products
  {
    id: 'plumb-001',
    name: 'Sintex Water Tank',
    price: 3500,
    originalPrice: 4200,
    category: 'Water Tanks',
    store: 'plumbing',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: '1000L capacity water tank, UV resistant, food grade material',
    features: ['1000L Capacity', 'UV Resistant', 'Food Grade', 'Durable'],
    stock: 12,
    rating: 4.5,
    reviews: 67,
    brand: 'Sintex',
    warranty: '5 Years',
    specifications: {
      'Capacity': '1000L',
      'Material': 'Food Grade Plastic',
      'Color': 'Blue',
      'Height': '1.2m'
    }
  },
  {
    id: 'plumb-002',
    name: 'PVC Pipe Set',
    price: 800,
    originalPrice: 950,
    category: 'PVC Pipes',
    store: 'plumbing',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: 'Set of 10 PVC pipes, 2-inch diameter, 3m length each',
    features: ['10 Pipes', '2-inch Diameter', '3m Length', 'UV Resistant'],
    stock: 35,
    rating: 4.2,
    reviews: 43,
    brand: 'Astral',
    warranty: '1 Year',
    specifications: {
      'Quantity': '10 Pipes',
      'Diameter': '2 inch',
      'Length': '3m each',
      'Material': 'PVC'
    }
  },
  {
    id: 'plumb-003',
    name: 'Mixer Tap',
    price: 1200,
    originalPrice: 1400,
    category: 'Taps & Faucets',
    store: 'plumbing',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: 'Single lever mixer tap, chrome finish, ceramic cartridge',
    features: ['Single Lever', 'Chrome Finish', 'Ceramic Cartridge', 'Easy Installation'],
    stock: 28,
    rating: 4.4,
    reviews: 89,
    brand: 'Jaquar',
    warranty: '2 Years',
    specifications: {
      'Type': 'Single Lever',
      'Finish': 'Chrome',
      'Cartridge': 'Ceramic',
      'Mounting': 'Wall'
    }
  },
  {
    id: 'plumb-004',
    name: 'Pipe Fittings Kit',
    price: 650,
    originalPrice: 750,
    category: 'Valves & Fittings',
    store: 'plumbing',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: 'Complete kit with elbows, tees, couplings, and clamps',
    features: ['Complete Kit', 'Multiple Sizes', 'Durable', 'Easy Installation'],
    stock: 45,
    rating: 4.1,
    reviews: 56,
    brand: 'Generic',
    warranty: '1 Year',
    specifications: {
      'Pieces': '25',
      'Sizes': '1/2" to 2"',
      'Material': 'PVC',
      'Type': 'Assorted'
    }
  },
  {
    id: 'plumb-005',
    name: 'Ceramic Wash Basin',
    price: 1800,
    originalPrice: 2200,
    category: 'Wash Basins',
    store: 'plumbing',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop',
    description: 'Wall-mounted ceramic wash basin, glossy finish, easy to clean',
    features: ['Wall Mounted', 'Glossy Finish', 'Ceramic', 'Easy to Clean'],
    stock: 20,
    rating: 4.3,
    reviews: 34,
    brand: 'Cera',
    warranty: '2 Years',
    specifications: {
      'Material': 'Ceramic',
      'Mounting': 'Wall',
      'Finish': 'Glossy',
      'Color': 'White'
    }
  },
  {
    id: 'plumb-006',
    name: 'Western Commode',
    price: 4200,
    originalPrice: 4800,
    category: 'Commodes',
    store: 'plumbing',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop',
    description: 'Western style commode with soft close seat cover',
    features: ['Western Style', 'Soft Close Seat', 'Ceramic', 'Easy Installation'],
    stock: 10,
    rating: 4.6,
    reviews: 21,
    brand: 'Hindware',
    warranty: '5 Years',
    specifications: {
      'Material': 'Ceramic',
      'Type': 'Western',
      'Seat': 'Soft Close',
      'Color': 'White'
    }
  },
  {
    id: 'plumb-007',
    name: 'Ceramic Urinal',
    price: 1500,
    originalPrice: 1800,
    category: 'Urinals',
    store: 'plumbing',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop',
    description: 'Wall-hung ceramic urinal, compact and easy to install',
    features: ['Wall Hung', 'Ceramic', 'Compact', 'Easy to Install'],
    stock: 15,
    rating: 4.2,
    reviews: 12,
    brand: 'Parryware',
    warranty: '2 Years',
    specifications: {
      'Material': 'Ceramic',
      'Mounting': 'Wall',
      'Color': 'White',
      'Type': 'Urinal'
    }
  },
  {
    id: 'plumb-008',
    name: 'Bathroom Accessories Set',
    price: 950,
    originalPrice: 1200,
    category: 'Bathroom Accessories',
    store: 'plumbing',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop',
    description: 'Set of 5 stainless steel bathroom accessories (towel rod, soap dish, tumbler holder, robe hook, shelf)',
    features: ['Stainless Steel', '5 Pieces', 'Rust Resistant', 'Modern Design'],
    stock: 30,
    rating: 4.5,
    reviews: 18,
    brand: 'Prestige',
    warranty: '1 Year',
    specifications: {
      'Material': 'Stainless Steel',
      'Pieces': '5',
      'Finish': 'Chrome',
      'Type': 'Accessories Set'
    }
  },
  {
    id: 'plumb-009',
    name: 'Sanitary Fittings Kit',
    price: 1200,
    originalPrice: 1500,
    category: 'Sanitary Fittings',
    store: 'plumbing',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop',
    description: 'Kit with angle valves, bottle trap, waste coupling, and more',
    features: ['Complete Kit', 'Brass', 'Chrome Finish', 'Easy Installation'],
    stock: 18,
    rating: 4.4,
    reviews: 22,
    brand: 'Jaquar',
    warranty: '2 Years',
    specifications: {
      'Material': 'Brass',
      'Finish': 'Chrome',
      'Type': 'Sanitary Fittings',
      'Kit': 'Included'
    }
  }
];

export default products;

export const categories = {
  electrical: [
    'Ceiling Fans',
    'Table Fans', 
    'Exhaust Fans',
    'LED Lights',
    'Bulbs',
    'Tube Lights',
    'Switchboards',
    'MCBs',
    'Sockets',
    'Electrical Wires',
    'Cable Rolls'
  ],
  'spare-parts': [
    'Fan Spares',
    'Blades',
    'Covers',
    'Regulators',
    'Motor Cores',
    'Bearings',
    'Switches & Connectors',
    'Toolkits',
    'Repair Kits'
  ],
  plumbing: [
    'Water Tanks',
    'PVC Pipes',
    'Taps',
    'Faucets',
    'Showers',
    'Valves',
    'Fittings',
    'Pipe Clamps',
    'Sink Accessories',
    'Wash Basins',
    'Commodes',
    'Urinals',
    'Bathroom Accessories',
    'Sanitary Fittings'
  ]
};

export const getProductsByStore = (store) => {
  return products.filter(product => product.store === store);
};

export const getProductsByCategory = (store, category) => {
  return products.filter(product => product.store === store && product.category === category);
};

export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery)
  );
};