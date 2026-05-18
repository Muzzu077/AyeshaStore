import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail,
  Phone,
  MapPin,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const UserAccount = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const { loginUser, registerUser, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated()) {
    navigate('/account/dashboard');
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const result = loginUser(formData.email, formData.password);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.firstName}!`);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      navigate('/account/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    try {
      registerUser(userData);
      toast.success('Account created successfully! Welcome to Ayesha Store!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      navigate('/account/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Login/Register</h2>
          <p className="text-lg text-gray-600 mb-6">Great to have you back!</p>
        </div>

        {isLogin && (
          <form onSubmit={handleLogin} className="space-y-6 border border-dashed border-gray-300 rounded-xl p-8 bg-white">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Username or email <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input id="remember" name="remember" type="checkbox" className="mr-1" />
                <label htmlFor="remember" className="text-xs text-gray-600">Remember</label>
              </div>
            </div>
            <input
              id="email"
              name="email"
              type="text"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="input-field w-full mb-4"
              placeholder=""
            />
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <a href="#" className="text-xs text-gray-600 hover:underline">Lost?</a>
            </div>
            <div className="relative mb-4">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="input-field w-full pr-10"
                placeholder=""
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button type="submit" className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg tracking-wider text-base hover:bg-red-600 transition mb-2">
              SIGN IN TO YOUR ACCOUNT
            </button>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-2 text-gray-400 text-sm">Or login with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <div className="flex space-x-4 mb-2">
              <button type="button" className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-2 bg-white hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0"/></svg>
                Facebook
              </button>
              <button type="button" className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-2 bg-white hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M21.805 10.023h-9.765v3.954h5.627c-.242 1.236-1.457 3.627-5.627 3.627-3.389 0-6.146-2.805-6.146-6.25s2.757-6.25 6.146-6.25c1.93 0 3.227.822 3.97 1.53l2.713-2.63C16.09 2.43 13.97 1.25 11.5 1.25 5.872 1.25 1 6.122 1 11.75s4.872 10.5 10.5 10.5c6.045 0 10.5-4.455 10.5-10.5 0-.7-.08-1.38-.195-2.027z"/></svg>
                Google
              </button>
            </div>
            <div className="text-center text-sm mt-4">
              Not a member? <button type="button" className="text-blue-600 hover:underline" onClick={() => setIsLogin(false)}>Create an account</button>
            </div>
          </form>
        )}
        {/* Registration form remains unchanged */}
        {!isLogin && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required={!isLogin}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter first name"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required={!isLogin}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter last name"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required={!isLogin}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter phone number"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter email address"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required={!isLogin}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirm password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-2 text-gray-400 text-sm">Or sign up with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <div className="flex space-x-4 mb-2">
              <button type="button" className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-2 bg-white hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0"/></svg>
                Sign up with Facebook
              </button>
              <button type="button" className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-2 bg-white hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M21.805 10.023h-9.765v3.954h5.627c-.242 1.236-1.457 3.627-5.627 3.627-3.389 0-6.146-2.805-6.146-6.25s2.757-6.25 6.146-6.25c1.93 0 3.227.822 3.97 1.53l2.713-2.63C16.09 2.43 13.97 1.25 11.5 1.25 5.872 1.25 1 6.122 1 11.75s4.872 10.5 10.5 10.5c6.045 0 10.5-4.455 10.5-10.5 0-.7-.08-1.38-.195-2.027z"/></svg>
                Sign up with Google
              </button>
            </div>
            <button type="submit" className="w-full btn-primary py-3">
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </>
            </button>
          </form>
        )}

        <div className="text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
              });
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {isLogin 
              ? "Don't have an account? Sign up here"
              : "Already have an account? Sign in here"
            }
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserAccount; 