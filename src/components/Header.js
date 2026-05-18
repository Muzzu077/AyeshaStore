import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  User,
  Zap,
  Wrench,
  Droplets
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { searchProducts } from '../data/products';
import toast from 'react-hot-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const adminMenuRef = useRef(null);
  
  const { getCartCount } = useCart();
  const { user: adminUser, logout: adminLogout } = useAuth();
  const { currentUser, logoutUser } = useUser();
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setIsAdminMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = searchProducts(query);
      setSearchResults(results.slice(0, 5));
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleAdminLogout = () => {
    adminLogout();
    toast.success('Admin logged out successfully');
    navigate('/');
  };

  const handleUserLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const storeLinks = [
    {
      name: 'Electrical',
      path: '/electrical',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Spare Parts',
      path: '/spare-parts',
      icon: <Wrench className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Plumbing',
      path: '/plumbing',
      icon: <Droplets className="w-5 h-5" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mr-8">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">AYESHA</h1>
              <p className="text-xs text-gray-600">Online Store</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {storeLinks.map((store) => (
              <Link
                key={store.name}
                to={store.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${store.bgColor} ${store.color} hover:bg-opacity-80`}
              >
                {store.icon}
                <span className="font-medium">{store.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => setShowSearch(false)}
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">₹{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Account */}
            {currentUser ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-500 transition-colors"
                  onClick={() => setIsAccountMenuOpen((open) => !open)}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{currentUser.firstName}</span>
                </button>
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link to="/account/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      My Account
                    </Link>
                    <button
                      onClick={handleUserLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/account" className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                <User className="w-4 h-4" />
                <span className="hidden sm:block">Account</span>
              </Link>
            )}

            {/* Admin Panel */}
            {adminUser ? (
              <div className="relative" ref={adminMenuRef}>
                <button
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-500 transition-colors"
                  onClick={() => setIsAdminMenuOpen((open) => !open)}
                >
                  <span className="hidden sm:block text-sm font-medium">{adminUser.name}</span>
                </button>
                {isAdminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleAdminLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/admin" className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                <span className="hidden sm:block">Admin</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {storeLinks.map((store) => (
                <Link
                  key={store.name}
                  to={store.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${store.bgColor} ${store.color}`}
                >
                  {store.icon}
                  <span className="font-medium">{store.name}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 