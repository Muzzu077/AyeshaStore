# 🚀 Deployment Guide - Ayesha Store

This guide will help you deploy the Ayesha Store application to production using Vercel (Frontend) and Render (Backend).

## 📋 Prerequisites

Before deploying, make sure you have:

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - For frontend deployment
3. **Render Account** - For backend deployment
4. **MongoDB Atlas Account** - For database (or use Render's free MongoDB)
5. **Cloudinary Account** - For image uploads
6. **Razorpay Account** - For payment processing

## 🎯 Deployment Architecture

```
Frontend (React) → Vercel
Backend (Node.js) → Render
Database (MongoDB) → MongoDB Atlas / Render
Images → Cloudinary
Payments → Razorpay
```

## 🔧 Step 1: Backend Deployment (Render)

### 1.1 Prepare Backend for Production

1. **Update package.json scripts** (already done):
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Create production environment variables**:
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayesha-store
   JWT_SECRET=your-super-secret-jwt-key-here
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

### 1.2 Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `ayesha-store-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade for production)

5. **Add Environment Variables**:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Generate a strong secret key
   - `RAZORPAY_KEY_ID` = Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET` = Your Razorpay key secret
   - `CLOUDINARY_CLOUD_NAME` = Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` = Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` = Your Cloudinary API secret
   - `FRONTEND_URL` = Your Vercel frontend URL (update after frontend deployment)

6. **Click "Create Web Service"**

### 1.3 Database Setup (MongoDB Atlas)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a new cluster** (free tier available)
3. **Create a database user**
4. **Whitelist IP addresses** (0.0.0.0/0 for Render)
5. **Get connection string** and update `MONGODB_URI` in Render

### 1.4 Seed the Database

After deployment, you can seed the database by running:
```bash
# SSH into your Render service or use Render's shell
npm run seed
```

## 🎨 Step 2: Frontend Deployment (Vercel)

### 2.1 Prepare Frontend for Production

1. **Create environment variables file**:
   ```env
   REACT_APP_API_URL=https://your-backend-domain.onrender.com/api
   REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key-id
   REACT_APP_APP_NAME=Ayesha Store
   ```

2. **Update API configuration** in `src/services/api.js` (already done)

### 2.2 Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Add Environment Variables**:
   - `REACT_APP_API_URL` = Your Render backend URL + `/api`
   - `REACT_APP_RAZORPAY_KEY_ID` = Your Razorpay key ID
   - `REACT_APP_APP_NAME` = Ayesha Store

6. **Click "Deploy"**

### 2.3 Update Backend CORS

After getting your Vercel URL, update the `FRONTEND_URL` environment variable in Render to match your Vercel domain.

## 🔐 Step 3: Configure External Services

### 3.1 Cloudinary Setup

1. **Go to [Cloudinary Dashboard](https://cloudinary.com/console)**
2. **Get your credentials**:
   - Cloud Name
   - API Key
   - API Secret
3. **Add to Render environment variables**

### 3.2 Razorpay Setup

1. **Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)**
2. **Get your API keys**:
   - Key ID
   - Key Secret
3. **Add to both Render and Vercel environment variables**

## 🧪 Step 4: Testing the Deployment

### 4.1 Test Backend API

1. **Check health endpoint**: `https://your-backend.onrender.com/api/health`
2. **Test authentication**: Try registering a new user
3. **Test products**: Fetch products from the API

### 4.2 Test Frontend

1. **Visit your Vercel URL**
2. **Test user registration/login**
3. **Test product browsing**
4. **Test cart functionality**
5. **Test checkout process**

## 📊 Step 5: Monitoring and Maintenance

### 5.1 Render Monitoring

- **Check logs** in Render dashboard
- **Monitor performance** and response times
- **Set up alerts** for downtime

### 5.2 Vercel Monitoring

- **Check deployment status**
- **Monitor build logs**
- **Set up analytics** if needed

### 5.3 Database Monitoring

- **Monitor MongoDB Atlas** for performance
- **Set up alerts** for connection issues
- **Regular backups** (Atlas handles this automatically)

## 🔧 Step 6: Production Optimizations

### 6.1 Backend Optimizations

1. **Enable compression** (already configured)
2. **Set up rate limiting** (already configured)
3. **Add request logging**
4. **Set up error monitoring** (Sentry, etc.)

### 6.2 Frontend Optimizations

1. **Enable Vercel Analytics**
2. **Set up error tracking**
3. **Optimize images** (already using Cloudinary)
4. **Enable caching** (Vercel handles this)

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check `FRONTEND_URL` in backend environment variables
   - Ensure the URL matches exactly (including https://)

2. **Database Connection Issues**:
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format
   - Check database user permissions

3. **Payment Issues**:
   - Verify Razorpay keys are correct
   - Check webhook URLs
   - Ensure test/live mode consistency

4. **Image Upload Issues**:
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper CORS settings

### Debug Commands

```bash
# Check backend logs
# Go to Render dashboard → Your service → Logs

# Check frontend build logs
# Go to Vercel dashboard → Your project → Deployments

# Test API endpoints
curl https://your-backend.onrender.com/api/health
```

## 📈 Scaling Considerations

### For Higher Traffic

1. **Upgrade Render plan** (Starter or higher)
2. **Use MongoDB Atlas M10+ cluster**
3. **Implement Redis caching**
4. **Add CDN for static assets**
5. **Set up load balancing**

### Security Enhancements

1. **Enable HTTPS everywhere**
2. **Set up proper CORS policies**
3. **Implement API rate limiting**
4. **Add request validation**
5. **Set up monitoring and alerting**

## 📞 Support

If you encounter issues:

1. **Check the logs** in both Render and Vercel
2. **Verify environment variables** are set correctly
3. **Test API endpoints** individually
4. **Check external service configurations**

## 🎉 Success!

Once everything is deployed and working:

1. **Update your domain** (if using custom domain)
2. **Set up monitoring**
3. **Configure backups**
4. **Plan for scaling**

Your Ayesha Store is now live! 🚀

---

**Deployment Checklist:**
- [ ] Backend deployed to Render
- [ ] Database configured and seeded
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] External services connected
- [ ] Testing completed
- [ ] Monitoring set up
