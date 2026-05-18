# 🏪 Ayesha Store - Complete E-commerce Platform

A comprehensive online store platform for family-run businesses, featuring three specialized stores: Electrical, Plumbing, and Spare Parts.

## 🌟 Features

### 🛍️ **Customer Features**
- **Multi-Store Shopping**: Browse and shop from Electrical, Plumbing, and Spare Parts stores
- **Product Catalog**: Comprehensive product listings with images, descriptions, and specifications
- **Shopping Cart**: Add, remove, and manage items with quantity controls
- **User Authentication**: Secure registration and login system
- **Order Management**: Track orders from placement to delivery
- **Payment Integration**: Razorpay payment gateway with COD option
- **Wishlist**: Save favorite products for later
- **Address Management**: Multiple shipping addresses
- **Product Reviews**: Rate and review products

### 👨‍💼 **Admin Features**
- **Store Management**: Separate admin panels for each store
- **Product Management**: Add, edit, and manage products with image uploads
- **Order Management**: Process orders, update status, and track deliveries
- **User Management**: Manage customers and store administrators
- **Analytics Dashboard**: Sales reports, order statistics, and performance metrics
- **Inventory Management**: Stock tracking and low-stock alerts

### 🔧 **Technical Features**
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live cart updates and order status
- **Image Optimization**: Cloudinary integration for fast image loading
- **Security**: JWT authentication, input validation, and CORS protection
- **Performance**: Optimized loading and caching strategies

## 🏗️ Architecture

### **Frontend (React)**
- **Framework**: React 18 with React Router
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### **Backend (Node.js + Express)**
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based access control
- **File Upload**: Cloudinary + Multer
- **Payment**: Razorpay integration
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Express-validator

### **Database (MongoDB)**
- **Users**: Customer and admin management
- **Products**: Catalog with categories and specifications
- **Orders**: Complete order lifecycle tracking
- **Categories**: Hierarchical product categorization

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Cloudinary account
- Razorpay account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AyeshaStore
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Update .env with your configuration
npm run dev
```

### 3. Frontend Setup
```bash
# In the root directory
npm install
cp env.example .env
# Update .env with your configuration
npm start
```

### 4. Database Seeding
```bash
cd backend
npm run seed
```

## 📁 Project Structure

```
AyeshaStore/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Database seeding
│   └── server.js           # Main server file
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── context/            # React Context providers
│   ├── services/           # API services
│   └── data/               # Static data
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🔐 Authentication

### User Roles
- **Customer**: Regular shoppers
- **Store Admin**: Manage specific store (Electrical/Plumbing/Spare Parts)
- **Super Admin**: Full system access

### Sample Admin Credentials
```
Super Admin: admin@ayeshastore.com / admin123456
Electrical: electrical@ayeshastore.com / electrical123
Spare Parts: spareparts@ayeshastore.com / spareparts123
Plumbing: plumbing@ayeshastore.com / plumbing123
```

## 🛒 Store Categories

### 🔌 Electrical Store
- Ceiling Fans
- LED Lights
- Switchboards
- Electrical Wires
- Bulbs & Tubes

### 🔧 Spare Parts Store
- Fan Spares
- Motor Components
- Repair Toolkits
- Switches & Connectors

### 🚿 Plumbing Store
- Water Tanks
- PVC Pipes
- Taps & Faucets
- Sanitary Fittings
- Bathroom Accessories

## 💳 Payment Integration

### Razorpay Features
- **Online Payments**: Credit/Debit cards, UPI, Net Banking
- **Payment Security**: PCI DSS compliant
- **Order Verification**: Webhook-based payment confirmation
- **COD Option**: Cash on Delivery for local orders

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive design for tablets
- **Desktop Experience**: Full-featured desktop interface
- **Touch-Friendly**: Intuitive touch interactions

## 🚀 Deployment

### Production Deployment
- **Frontend**: Vercel (automatic deployments)
- **Backend**: Render (scalable hosting)
- **Database**: MongoDB Atlas (cloud database)
- **Images**: Cloudinary (CDN and optimization)

### Environment Setup
```bash
# Backend (.env)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=your-razorpay-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name

# Frontend (.env)
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/payments/create-order` - Create order
- `POST /api/payments/verify-payment` - Verify payment

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

## 🔧 Development

### Adding New Features
1. **Backend**: Add routes in `backend/routes/`
2. **Frontend**: Add components in `src/components/`
3. **Database**: Update models in `backend/models/`
4. **API**: Update services in `src/services/`

### Code Style
- **ESLint**: Configured for consistent code style
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Standardized commit messages

## 📈 Performance

### Optimization Features
- **Image Optimization**: Cloudinary CDN
- **Code Splitting**: React lazy loading
- **Caching**: Browser and CDN caching
- **Compression**: Gzip compression
- **Database Indexing**: Optimized queries

## 🔒 Security

### Security Measures
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin security
- **Rate Limiting**: API abuse prevention
- **Helmet**: Security headers
- **Password Hashing**: bcrypt encryption

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- **Email**: support@ayeshastore.com
- **Issues**: GitHub Issues
- **Documentation**: Check the `/docs` folder

## 🎯 Roadmap

### Upcoming Features
- [ ] **Mobile App**: React Native mobile application
- [ ] **Advanced Analytics**: Detailed sales analytics
- [ ] **Inventory Management**: Advanced stock management
- [ ] **Multi-language Support**: Internationalization
- [ ] **Advanced Search**: Elasticsearch integration
- [ ] **Email Notifications**: Order and marketing emails
- [ ] **Loyalty Program**: Customer rewards system

---

**Built with ❤️ for Ayesha Store Family Business**

*Empowering family-run stores with modern e-commerce technology*
