# Ayesha Store Backend API

A comprehensive Node.js + Express backend API for the Ayesha Online Store e-commerce platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: CRUD operations for products with image uploads
- **Order Management**: Complete order lifecycle with status tracking
- **Payment Integration**: Razorpay payment gateway integration
- **User Management**: Customer and admin user management
- **Admin Dashboard**: Comprehensive admin panel with analytics
- **File Upload**: Cloudinary integration for image management
- **Data Validation**: Express-validator for request validation
- **Security**: Helmet, CORS, rate limiting, and input sanitization

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary + Multer
- **Payment**: Razorpay
- **Validation**: Express-validator
- **Security**: Helmet, CORS, bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/ayesha-store
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Razorpay Configuration
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. **Seed the database** (Optional)
   ```bash
   npm run seed
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filtering, sorting, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin/Store Admin)
- `PUT /api/products/:id` - Update product (Admin/Store Admin)
- `DELETE /api/products/:id` - Delete product (Admin/Store Admin)
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/categories/:store` - Get product categories

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `GET /api/orders/admin/stats` - Get order statistics (Admin)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify Razorpay payment
- `POST /api/payments/create-cod-order` - Create COD order
- `GET /api/payments/methods` - Get payment methods

### Users
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `POST /api/users/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist
- `GET /api/users/wishlist` - Get wishlist
- `GET /api/users/dashboard` - Get user dashboard

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/users` - Get all users (Admin)
- `POST /api/admin/store-admin` - Create store admin (Admin)
- `PUT /api/admin/users/:id/status` - Update user status (Admin)
- `GET /api/admin/sales-report` - Get sales report (Admin)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **customer**: Regular customers
- **store-admin**: Store-specific administrators
- **admin**: Super administrator

## 📊 Database Models

### User
- Personal information (name, email, phone)
- Role-based access control
- Address management
- Wishlist functionality

### Product
- Product details (name, description, price)
- Category and store association
- Image management
- Stock tracking
- Reviews and ratings

### Order
- Order items and quantities
- Shipping information
- Payment details
- Status tracking
- Order history

### Category
- Category management
- Store association
- Hierarchical structure

## 🚀 Deployment

### Using Render (Recommended)

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure environment variables**
4. **Set build command**: `npm install`
5. **Set start command**: `npm start`

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayesha-store
JWT_SECRET=your-production-jwt-secret
RAZORPAY_KEY_ID=your-production-razorpay-key
RAZORPAY_KEY_SECRET=your-production-razorpay-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 🧪 Testing

```bash
npm test
```

## 📝 API Documentation

The API follows RESTful conventions and returns JSON responses with the following structure:

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Request validation
- **Password Hashing**: bcryptjs for password security
- **JWT**: Secure token-based authentication

## 📈 Monitoring & Logging

- Console logging for development
- Error handling middleware
- Request validation
- Database connection monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@ayeshastore.com or create an issue in the repository.

---

**Built with ❤️ for Ayesha Store**
