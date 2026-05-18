import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ElectricalStore from './pages/ElectricalStore';
import SparePartsStore from './pages/SparePartsStore';
import PlumbingStore from './pages/PlumbingStore';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import ElectricalQuotation from './pages/ElectricalQuotation';
import ElectricalQuotationHistory from './pages/ElectricalQuotationHistory';
import UserAccount from './pages/UserAccount';
import UserDashboard from './pages/UserDashboard';
import Contact from './pages/Contact';
import About from './pages/About';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <UserProvider>
            <div className="min-h-screen bg-gray-50">
          <Header />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HomePage />
                </motion.div>
              } />
              <Route path="/electrical" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ElectricalStore />
                </motion.div>
              } />
              <Route path="/spare-parts" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SparePartsStore />
                </motion.div>
              } />
              <Route path="/plumbing" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PlumbingStore />
                </motion.div>
              } />
              <Route path="/product/:id" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductDetail />
                </motion.div>
              } />
              <Route path="/cart" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Cart />
                </motion.div>
              } />
              <Route path="/checkout" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Checkout />
                </motion.div>
              } />
              <Route path="/admin" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminPanel />
                </motion.div>
              } />
              <Route path="/admin/quotations/new" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ElectricalQuotation />
                </motion.div>
              } />
              <Route path="/admin/quotations" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ElectricalQuotationHistory />
                </motion.div>
              } />
              <Route path="/account" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserAccount />
                </motion.div>
              } />
              <Route path="/account/dashboard" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserDashboard />
                </motion.div>
              } />
              <Route path="/contact" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Contact />
                </motion.div>
              } />
              <Route path="/about" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <About />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
          </UserProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 