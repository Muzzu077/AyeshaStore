import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft,
  Truck,
  Shield,
  CreditCard
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart 
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/electrical"
                className="btn-primary inline-flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Shopping Cart ({items.length} items)
                  </h1>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const storeColor = storeColors[item.store];
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${storeColor.bg} ${storeColor.text}`}>
                              {item.store.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-lg font-bold text-gray-900">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Total Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{(getCartTotal() * 0.18).toFixed(0)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{(getCartTotal() * 1.18).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full btn-primary text-center py-3 text-lg font-semibold"
              >
                Proceed to Checkout
              </Link>

              {/* Features */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span>Multiple payment options</span>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/electrical"
                  className="w-full btn-outline text-center py-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 