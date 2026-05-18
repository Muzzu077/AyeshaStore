import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  Target, 
  Heart,
  Zap,
  Wrench,
  Droplets,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const stats = [
    { number: '15+', label: 'Years Experience', icon: <Award className="w-8 h-8" /> },
    { number: '1000+', label: 'Happy Customers', icon: <Users className="w-8 h-8" /> },
    { number: '500+', label: 'Products', icon: <Target className="w-8 h-8" /> },
    { number: '24/7', label: 'Support', icon: <Heart className="w-8 h-8" /> }
  ];

  const values = [
    {
      title: 'Quality',
      description: 'We never compromise on quality. Every product in our stores meets the highest standards.',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: 'Trust',
      description: 'Building long-term relationships with our customers through honest and transparent service.',
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: 'Innovation',
      description: 'Constantly updating our product range with the latest technology and solutions.',
      icon: <Target className="w-6 h-6" />
    },
    {
      title: 'Service',
      description: 'Providing exceptional customer service and technical support to all our customers.',
      icon: <Users className="w-6 h-6" />
    }
  ];

  const team = [
    {
      name: 'Gadwal Kalimulla',
      role: 'Electrical Store Manager',
      description: 'Expert in electrical supplies with 20+ years of experience.',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      name: 'Gadwal Amanulla',
      role: 'Spare Parts Specialist',
      description: 'Master of spare parts and repair solutions.',
      icon: <Wrench className="w-8 h-8" />,
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Bakkar Sohail',
      role: 'Plumbing Solutions',
      description: 'Professional plumbing supplies and installation expert.',
      icon: <Droplets className="w-8 h-8" />,
      color: 'from-cyan-400 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            About AYESHA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-100 max-w-3xl mx-auto"
          >
            A family-run business dedicated to providing quality electrical, spare parts, 
            and plumbing supplies to homes and businesses across India.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-primary-600 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  AYESHA was founded in 2000 as a small family business with a simple mission: 
                  to provide quality electrical, spare parts, and plumbing supplies to our local community.
                </p>
                <p>
                  What started as a single store has grown into a trusted name in the industry, 
                  serving thousands of customers across the region. Our success is built on the 
                  foundation of family values, quality products, and exceptional service.
                </p>
                <p>
                  Today, we operate three specialized stores - Electrical, Spare Parts, and Plumbing - 
                  each managed by a family member who brings their expertise and passion to serve 
                  our customers better.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-96 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">A</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">AYESHA</h3>
                  <p className="text-primary-100">Since 2008</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <div className="text-primary-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The family members who make AYESHA what it is today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${member.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {member.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-6"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-100 max-w-3xl mx-auto"
          >
            To be the most trusted and preferred destination for all electrical, spare parts, 
            and plumbing needs, providing quality products and exceptional service to help 
            our customers build and maintain their homes and businesses.
          </motion.p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose AYESHA?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes us different from the rest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Family Business
              </h3>
              <p className="text-gray-600">
                Run by family members who care about quality and customer satisfaction, 
                not just profits.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Expert Knowledge
              </h3>
              <p className="text-gray-600">
                Years of experience in the industry with deep technical knowledge 
                to help you make the right choices.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quality Products
              </h3>
              <p className="text-gray-600">
                We only stock products from trusted brands that meet our high 
                quality standards.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Competitive Prices
              </h3>
              <p className="text-gray-600">
                Fair and competitive pricing without compromising on quality 
                or service.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Local Support
              </h3>
              <p className="text-gray-600">
                Local business with local support. We're here when you need us, 
                with quick response times.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                One-Stop Solution
              </h3>
              <p className="text-gray-600">
                From electrical to plumbing, get everything you need in one place 
                with our three specialized stores.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 