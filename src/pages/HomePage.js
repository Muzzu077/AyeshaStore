import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Wrench, 
  Droplets,
  Star,
  ShoppingCart,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, getProductsByStore } from '../data/products';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Get featured products (top rated from each store)
    const electricalProducts = getProductsByStore('electrical').slice(0, 2);
    const sparePartsProducts = getProductsByStore('spare-parts').slice(0, 2);
    const plumbingProducts = getProductsByStore('plumbing').slice(0, 2);
    
    setFeaturedProducts([...electricalProducts, ...sparePartsProducts, ...plumbingProducts]);
  }, []);

  const heroSlides = [
    {
      title: "All Your Home Needs in One Place!",
      subtitle: "Quality electrical, spare parts, and plumbing supplies",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop",
      cta: "Shop Now",
      link: "/electrical"
    },
    {
      title: "Professional Tools & Spare Parts",
      subtitle: "Everything you need for repairs and maintenance",
      image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=1200&h=600&fit=crop",
      cta: "Explore Parts",
      link: "/spare-parts"
    },
    {
      title: "Complete Plumbing Solutions",
      subtitle: "From pipes to fixtures, we have it all",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=600&fit=crop",
      cta: "View Plumbing",
      link: "/plumbing"
    }
  ];

  const storeCategories = [
    {
      name: "Electrical Store",
      description: "Fans, lights, switches, and electrical supplies",
      icon: <Zap className="w-12 h-12" />,
      path: "/electrical",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      categories: ["Ceiling Fans", "LED Lights", "Switchboards", "Electrical Wires"]
    },
    {
      name: "Spare Parts Store",
      description: "Fan spares, motor parts, and repair tools",
      icon: <Wrench className="w-12 h-12" />,
      path: "/spare-parts",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      categories: ["Fan Spares", "Motor Cores", "Switches", "Toolkits"]
    },
    {
      name: "Plumbing Store",
      description: "Pipes, taps, fittings, and plumbing supplies",
      icon: <Droplets className="w-12 h-12" />,
      path: "/plumbing",
      color: "from-cyan-400 to-blue-500",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
      categories: ["Water Tanks", "PVC Pipes", "Taps", "Fittings"]
    }
  ];

  const offers = [
    {
      title: "Fan + Wire Combo",
      description: "Get 15% off when you buy a ceiling fan with electrical wire",
      discount: "15% OFF",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    },
    {
      title: "Plumbing Kit Discount",
      description: "Complete plumbing kit with 20% discount",
      discount: "20% OFF",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop"
    },
    {
      title: "Toolkit Bundle",
      description: "Professional toolkit with free delivery",
      discount: "FREE DELIVERY",
      image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&h=300&fit=crop"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl md:text-6xl font-bold text-white mb-4"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-gray-200 mb-8"
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Link
                        to={slide.link}
                        className="inline-flex items-center px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Hero Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Hero Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Store Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Stores
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our three specialized stores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storeCategories.map((store, index) => (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link to={store.path} className="block">
                  <div className={`${store.bgColor} rounded-xl p-8 h-full hover:shadow-lg transition-all`}>
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${store.color} flex items-center justify-center text-white mb-6`}>
                      {store.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {store.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {store.description}
                    </p>
                    <div className="space-y-2">
                      {store.categories.map((category) => (
                        <div key={category} className={`text-sm ${store.textColor}`}>
                          • {category}
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Top-rated products from all our stores
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/electrical"
              className="btn-primary inline-flex items-center"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Offers Carousel */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Special Offers
            </h2>
            <p className="text-xl text-primary-100">
              Don't miss out on these amazing deals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                    {offer.discount}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {offer.description}
                  </p>
                  {index === 0 && (
                    <Link to="/electrical" className="w-full btn-primary inline-block text-center">Shop Now</Link>
                  )}
                  {index === 1 && (
                    <Link to="/plumbing" className="w-full btn-primary inline-block text-center">Shop Now</Link>
                  )}
                  {index === 2 && (
                    <Link to="/spare-parts" className="w-full btn-primary inline-block text-center">Shop Now</Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Help? Contact Us
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Our team is here to help you find the right products
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex items-center justify-center space-x-3 text-white">
                <Phone className="w-6 h-6 text-primary-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white">
                <Mail className="w-6 h-6 text-primary-400" />
                <span>info@ayesha.com</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white">
                <MapPin className="w-6 h-6 text-primary-400" />
                <span>Visit Our Store</span>
              </div>
            </div>

            <Link
              to="/contact"
              className="btn-outline border-white text-white hover:bg-white hover:text-gray-900"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 