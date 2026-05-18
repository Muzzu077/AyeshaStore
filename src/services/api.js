// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('ayesha-token');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('ayesha-token', token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('ayesha-token');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  // Update profile
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Logout
  logout: () => {
    removeAuthToken();
  },
};

// Products API
export const productsAPI = {
  // Get all products
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get single product
  getProduct: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  // Create product (Admin)
  createProduct: async (productData) => {
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData).forEach(key => {
      if (key === 'images' && Array.isArray(productData[key])) {
        productData[key].forEach((image, index) => {
          formData.append('images', image);
        });
      } else if (key === 'features' || key === 'specifications') {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });

    return apiRequest('/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
  },

  // Update product (Admin)
  updateProduct: async (id, productData) => {
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData).forEach(key => {
      if (key === 'images' && Array.isArray(productData[key])) {
        productData[key].forEach((image, index) => {
          formData.append('images', image);
        });
      } else if (key === 'features' || key === 'specifications') {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });

    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
  },

  // Delete product (Admin)
  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Add product review
  addReview: async (id, reviewData) => {
    return apiRequest(`/products/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Get product categories
  getCategories: async (store) => {
    return apiRequest(`/products/categories/${store}`);
  },
};

// Orders API
export const ordersAPI = {
  // Get user orders
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  // Get single order
  getOrder: async (id) => {
    return apiRequest(`/orders/${id}`);
  },

  // Cancel order
  cancelOrder: async (id) => {
    return apiRequest(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  },

  // Update order status (Admin)
  updateOrderStatus: async (id, statusData) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // Get all orders (Admin)
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders/admin/all${queryString ? `?${queryString}` : ''}`);
  },

  // Get order statistics (Admin)
  getOrderStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders/admin/stats${queryString ? `?${queryString}` : ''}`);
  },
};

// Payments API
export const paymentsAPI = {
  // Create Razorpay order
  createOrder: async (orderData) => {
    return apiRequest('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Verify Razorpay payment
  verifyPayment: async (paymentData) => {
    return apiRequest('/payments/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Create COD order
  createCODOrder: async (orderData) => {
    return apiRequest('/payments/create-cod-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get payment methods
  getPaymentMethods: async () => {
    return apiRequest('/payments/methods');
  },
};

// Users API
export const usersAPI = {
  // Add address
  addAddress: async (addressData) => {
    return apiRequest('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    return apiRequest(`/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  // Delete address
  deleteAddress: async (addressId) => {
    return apiRequest(`/users/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    return apiRequest(`/users/wishlist/${productId}`, {
      method: 'POST',
    });
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    return apiRequest(`/users/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },

  // Get wishlist
  getWishlist: async () => {
    return apiRequest('/users/wishlist');
  },

  // Get user dashboard
  getDashboard: async () => {
    return apiRequest('/users/dashboard');
  },
};

// Admin API
export const adminAPI = {
  // Get admin dashboard
  getDashboard: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/dashboard${queryString ? `?${queryString}` : ''}`);
  },

  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  // Create store admin
  createStoreAdmin: async (adminData) => {
    return apiRequest('/admin/store-admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },

  // Update user status
  updateUserStatus: async (userId, statusData) => {
    return apiRequest(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // Get sales report
  getSalesReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/sales-report${queryString ? `?${queryString}` : ''}`);
  },
};

// Quotation module APIs
export const customersAPI = {
  list: async () => apiRequest('/customers'),
  create: async (data) => apiRequest('/customers', { method: 'POST', body: JSON.stringify(data) }),
};

export const pricingAPI = {
  getByBrand: async (brand) => apiRequest(`/brand-pricing/${encodeURIComponent(brand)}`),
  upsert: async (data) => apiRequest('/brand-pricing', { method: 'POST', body: JSON.stringify(data) }),
};

export const quotationsAPI = {
  create: async (data) => apiRequest('/quotations', { method: 'POST', body: JSON.stringify(data) }),
  list: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/quotations${qs ? `?${qs}` : ''}`);
  },
  get: async (id) => apiRequest(`/quotations/${id}`),
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiRequest('/health');
  },
};

export default {
  authAPI,
  productsAPI,
  ordersAPI,
  paymentsAPI,
  usersAPI,
  adminAPI,
  healthAPI,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
};
