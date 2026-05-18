import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Package,
  Calendar,
  Phone,
  Mail,
  Home,
  Building
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useOrders } from '../context/OrderContext';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  const { currentUser, logoutUser, addAddress, updateUser } = useUser();
  const { getOrdersByCustomer } = useOrders();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/account');
    return null;
  }

  const userOrders = getOrdersByCustomer ? getOrdersByCustomer(currentUser.email) : [];

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <User className="w-5 h-5" /> },
    { id: 'orders', name: 'My Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'addresses', name: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
    { id: 'profile', name: 'Profile', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    addAddress(addressForm);
    setAddressForm({
      type: 'home',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
    setShowAddAddress(false);
    toast.success('Address added successfully');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{userOrders.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Saved Addresses</p>
                    <p className="text-2xl font-bold text-gray-900">{currentUser.addresses?.length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Member Since</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {userOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">{order.items.length} items • ₹{order.total.toLocaleString()}</p>
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
                ))}
                {userOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No orders yet</p>
                    <button 
                      onClick={() => navigate('/electrical')}
                      className="mt-2 text-primary-600 hover:text-primary-700"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
              <div className="text-sm text-gray-600">
                Total: {userOrders.length} orders
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {userOrders.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {userOrders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Order #{order.id.slice(-6)}</h4>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
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
                      
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Total: ₹{order.total.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
                          </div>
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No orders yet</p>
                  <p className="text-sm mb-4">Start shopping to see your orders here</p>
                  <button 
                    onClick={() => navigate('/electrical')}
                    className="btn-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">My Addresses</h3>
              <button
                onClick={() => setShowAddAddress(true)}
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </button>
            </div>

            {showAddAddress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h4>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                    <select
                      value={addressForm.type}
                      onChange={(e) => setAddressForm({...addressForm, type: e.target.value})}
                      className="input-field"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      required
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                        className="input-field"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                        className="input-field"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <input
                        type="text"
                        required
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                        className="input-field"
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUser.addresses?.map((address) => (
                <div key={address.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      {address.type === 'home' ? (
                        <Home className="w-5 h-5 text-blue-600" />
                      ) : address.type === 'work' ? (
                        <Building className="w-5 h-5 text-green-600" />
                      ) : (
                        <MapPin className="w-5 h-5 text-purple-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900 capitalize">{address.type}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                  </div>
                </div>
              ))}
              {(!currentUser.addresses || currentUser.addresses.length === 0) && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No addresses saved</p>
                  <p className="text-sm mb-4">Add your first address to make checkout easier</p>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="btn-primary"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={currentUser.firstName}
                      className="input-field"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={currentUser.lastName}
                      className="input-field"
                      readOnly
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={currentUser.email}
                      className="input-field"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={currentUser.phone}
                      className="input-field"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <input
                    type="text"
                    value={new Date(currentUser.createdAt).toLocaleDateString()}
                    className="input-field"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {tabs.find(tab => tab.id === activeTab) ? tabs.find(tab => tab.id === activeTab).name : 'Unknown'}
            </h3>
            <p className="text-gray-600">
              This feature is coming soon. Stay tuned for updates!
            </p>
          </div>
        );
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
              <h1 className="text-xl font-bold text-gray-900">My Account</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser.firstName}!
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

export default UserDashboard; 