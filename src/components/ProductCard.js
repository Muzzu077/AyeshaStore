// ...existing code...
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const storeColors = {
    electrical: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-200'
    },
    'spare-parts': {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    plumbing: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
      border: 'border-cyan-200'
    }
  };

  const storeColor = storeColors[product.store];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="card overflow-hidden">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Badges: Offer and Store, stacked vertically */}
            <div className="absolute top-3 left-3 flex flex-col items-start space-y-2 z-10">
              {discountPercentage > 0 && (
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow classic-shadow tracking-wide">
                  -{discountPercentage}%
                </div>
              )}
              <div className={`px-3 py-1 rounded-full shadow classic-shadow text-xs font-semibold border ${storeColor.bg} ${storeColor.text} ${storeColor.border} tracking-wide`}>
                {product.store.replace('-', ' ').toUpperCase()}
              </div>
            </div>
            {/* Quick Actions */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleAddToCart}
                className="bg-[#bfa14a] text-white p-2 rounded-full hover:bg-[#1a2233] transition-colors shadow-lg border border-[#bfa14a]"
                title="Add to Cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
            {/* Wishlist Button */}
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button className="bg-white text-gray-600 p-2 rounded-full hover:text-red-500 transition-colors shadow-lg border border-gray-200">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Brand */}
            <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
            
            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mb-3">
              {product.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full ${storeColor.bg} ${storeColor.text}`}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Stock Status */}
            <div className="flex items-center justify-between">
              <span className={`text-sm ${
                product.stock > 10 
                  ? 'text-green-600' 
                  : product.stock > 0 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
              }`}>
                {product.stock > 10 
                  ? 'In Stock' 
                  : product.stock > 0 
                    ? `Only ${product.stock} left` 
                    : 'Out of Stock'
                }
              </span>
              
              {/* Warranty */}
              <span className="text-xs text-gray-500">
                {product.warranty} Warranty
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 