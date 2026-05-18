import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { user, login, logout, isAuthenticated } = useAuth();
  const { getOrdersByStore, getTotalSalesByStore, getRecentOrders, updateOrderStatus } = useOrders();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(credentials);
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
        setCredentials({ email: '', password: '' });
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-gray-600">
              Access your store management panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter email"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3">
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'products', name: 'Products', icon: <Package className="w-5 h-5" /> },
    { id: 'orders', name: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'customers', name: 'Customers', icon: <Users className="w-5 h-5" /> },
    ...(user?.role === 'store-admin' && user?.store === 'electrical' ? [
      { id: 'electrical-quotations', name: 'Electrical Quotations', icon: <LayoutDashboard className="w-5 h-5" /> },
    ] : []),
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        const storeOrders = getOrdersByStore(user?.role || 'electrical');
        const totalSales = getTotalSalesByStore(user?.role || 'electrical');
        const recentOrders = getRecentOrders(5);
        
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{storeOrders.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{storeOrders.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl font-bold text-purple-600">₹</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalSales.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => {
                    const storeItems = order.items.filter(item => item.store === user?.role);
                    const storeTotal = storeItems.reduce((total, item) => total + (item.price * item.quantity), 0);
                    
                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                          <p className="text-sm text-gray-600">{storeItems.length} items • ₹{storeTotal.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No orders yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">GK</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Gadwal Kalimulla</p>
                      <p className="text-sm text-gray-600">Electrical Store Manager</p>
                      <p className="text-sm text-blue-600">+91 9885327992</p>
                      <p className="text-sm text-blue-600">+91 9440620627</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">GA</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Gadwal Amanulla</p>
                      <p className="text-sm text-gray-600">Spare Parts Specialist</p>
                      <p className="text-sm text-green-600">+91 9966539877</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-bold">BS</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bakkar Sohailad</p>
                      <p className="text-sm text-gray-600">Plumbing Solutions</p>
                      <p className="text-sm text-purple-600">+91 7801018524</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Store Address</h4>
                    <p className="text-sm text-gray-600">
                      Gonegandla Road, Near Hafiz Masjid<br />
                      Yemmiganur, Kurnool District<br />
                      Andhra Pradesh - 518360
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Business Hours</h4>
                    <p className="text-sm text-gray-600">
                      Sunday - Monday : 9:00 AM - 8:00 PM<br />
                      Saturday : 9:00 AM - 4:00 PM <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'orders':
        const allStoreOrders = getOrdersByStore(user?.role || 'electrical');
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
              <div className="text-sm text-gray-600">
                Total: {allStoreOrders.length} orders
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allStoreOrders.length > 0 ? (
                    allStoreOrders.map((order) => {
                      const storeItems = order.items.filter(item => item.store === user?.role);
                      const storeTotal = storeItems.reduce((total, item) => total + (item.price * item.quantity), 0);
                      
                      return (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                              <div className="text-sm text-gray-500">{order.customer.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {storeItems.length} items
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{storeTotal.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No orders found for this store</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <button className="btn-primary inline-flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3].map((item) => (
                    <tr key={item}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Product {item}</div>
                            <div className="text-sm text-gray-500">Brand {item}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Category {item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{item * 500}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item * 10}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        if (activeTab === 'electrical-quotations') {
          window.location.href = '/admin/quotations';
          return null;
        }
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user ? user.name : 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 