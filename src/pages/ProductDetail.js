import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  Shield, 
  ArrowLeft,
  Check,
  Zap,
  Wrench,
  Droplets
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const storeIcons = {
    electrical: <Zap className="w-5 h-5" />,
    'spare-parts': <Wrench className="w-5 h-5" />,
    plumbing: <Droplets className="w-5 h-5" />
  };

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
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to={`/${product.store}`} className="hover:text-primary-600 capitalize">
            {product.store.replace('-', ' ')}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-4">
              {[product.image, product.image, product.image].map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Store Badge */}
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${storeColor.bg} ${storeColor.text}`}>
                {storeIcons[product.store]}
                <span className="ml-1">{product.store.replace('-', ' ').toUpperCase()}</span>
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Brand */}
            <p className="text-lg text-gray-600">Brand: {product.brand}</p>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary py-3 text-lg font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Availability</p>
                <p className={`text-sm ${
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
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">Warranty</p>
                <p className="text-sm text-gray-600">{product.warranty}</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-600" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between p-4 border-b border-gray-200 last:border-b-0">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would show related products */}
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
              <p className="text-gray-600">Related products coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 