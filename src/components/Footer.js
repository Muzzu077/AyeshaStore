import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Zap,
  Wrench,
  Droplets
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const storeLinks = [
    {
      name: 'Electrical Store',
      path: '/electrical',
      icon: <Zap className="w-5 h-5" />,
      description: 'Fans, lights, switches, and electrical supplies'
    },
    {
      name: 'Spare Parts Store',
      path: '/spare-parts',
      icon: <Wrench className="w-5 h-5" />,
      description: 'Fan spares, motor parts, and repair tools'
    },
    {
      name: 'Plumbing Store',
      path: '/plumbing',
      icon: <Droplets className="w-5 h-5" />,
      description: 'Pipes, taps, fittings, and plumbing supplies'
    }
  ];

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Returns', path: '/returns' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AYESHA</h3>
                <p className="text-sm text-gray-400">Online Store</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              All Your Home Needs in One Place! Quality electrical, spare parts, and plumbing supplies for your home and business.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Our Stores */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Our Stores</h4>
            <div className="space-y-3">
              {storeLinks.map((store) => (
                <Link
                  key={store.name}
                  to={store.path}
                  className="flex items-start space-x-3 group"
                >
                  <div className="text-primary-400 group-hover:text-primary-300 transition-colors">
                    {store.icon}
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary-300 transition-colors">
                      {store.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {store.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm text-gray-400">+91 9885327992</p>
                  <p className="text-sm text-gray-400">+91 9440620627</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm text-gray-400">info@ayesha.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1" />
                <div>
                  <p className="font-medium">Visit Us</p>
                  <p className="text-sm text-gray-400">
                    Gonegandla Road, Near Hafiz Masjid<br />
                    Yemmiganur, Kurnool District<br />
                    Andhra Pradesh - 518360
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} AYESHA Online Store. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 