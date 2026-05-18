import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session and validate with backend
    const checkAuth = async () => {
      const token = localStorage.getItem('ayesha-token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.status === 'success') {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Error validating user session:', error);
          localStorage.removeItem('ayesha-token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.status === 'success') {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      return { success: false, error: response.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.status === 'success') {
        // Auto-login after successful registration
        const loginResponse = await authAPI.login({
          email: userData.email,
          password: userData.password
        });
        
        if (loginResponse.status === 'success') {
          setUser(loginResponse.data.user);
          return { success: true, user: loginResponse.data.user };
        }
      }
      return { success: false, error: response.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('ayesha-token');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.status === 'success') {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      return { success: false, error: response.message || 'Profile update failed' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message || 'Profile update failed' };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return { success: response.status === 'success', message: response.message };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message || 'Password change failed' };
    }
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'store-admin');
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const isStoreAdmin = () => {
    return user && user.role === 'store-admin';
  };

  const getStore = () => {
    return user?.store || null;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated,
    isAdmin,
    hasRole,
    isStoreAdmin,
    getStore,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 