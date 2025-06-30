# 🚀 Store Ledger App - Deployment Guide

## 📋 Prerequisites

Before deploying, you'll need accounts for:
- [MongoDB Atlas](https://www.mongodb.com/atlas) (Database)
- [Railway](https://railway.app) or [Heroku](https://heroku.com) (Backend)
- [Netlify](https://netlify.com) or [Vercel](https://vercel.com) (Frontend)
- [Gmail](https://gmail.com) (Email OTP)
- [Twilio](https://twilio.com) (SMS OTP - Optional)

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Choose "Build a Database" → "Shared" (Free)
   - Select cloud provider and region
   - Create cluster (takes 1-3 minutes)

3. **Create Database User**
   - Go to "Database Access"
   - Add new database user
   - Choose "Password" authentication
   - Save username and password

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP Address → "Allow access from anywhere" (0.0.0.0/0)

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

## 🔧 Step 2: Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend` folder as root directory

3. **Set Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/store-ledger
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-random
   FRONTEND_URL=https://your-app-name.netlify.app
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   NODE_ENV=production
   PORT=3000
   ```

4. **Get Backend URL**
   - Copy the generated Railway URL (e.g., `https://your-app.up.railway.app`)

## 📧 Step 3: Email Setup (Gmail)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification → Turn on

2. **Generate App Password**
   - Security → 2-Step Verification → App passwords
   - Select app: "Mail", device: "Other"
   - Copy the 16-character password

3. **Update Environment Variables**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## 📱 Step 4: SMS Setup (Twilio - Optional)

1. **Create Twilio Account**
   - Go to [Twilio](https://twilio.com)
   - Sign up for free account ($15 credit)

2. **Get Phone Number**
   - Console → Phone Numbers → Manage → Buy a number
   - Choose a number with SMS capability

3. **Get Credentials**
   - Console Dashboard → Account SID and Auth Token
   - Update environment variables

## 🌐 Step 5: Frontend Deployment (Netlify)

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect GitHub repository

3. **Set Environment Variables**
   - Site settings → Environment variables
   - Add: `VITE_API_URL=https://your-railway-app.up.railway.app/api`

4. **Configure Redirects**
   - The `netlify.toml` file handles SPA routing

## 🔄 Step 6: Update API URLs

Update your frontend environment:
```env
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

Update your backend CORS:
```env
FRONTEND_URL=https://your-netlify-app.netlify.app
```

## ✅ Step 7: Test Deployment

1. **Test Backend**
   - Visit: `https://your-railway-app.up.railway.app/api/health`
   - Should return: `{"status":"OK"}`

2. **Test Frontend**
   - Visit your Netlify URL
   - Try registering a new account
   - Test OTP verification
   - Test product management

## 🔐 Security Checklist

- ✅ Strong JWT secret (32+ characters)
- ✅ MongoDB user with limited permissions
- ✅ CORS configured for your domain only
- ✅ Rate limiting enabled
- ✅ Input validation on all endpoints
- ✅ Passwords hashed with bcrypt
- ✅ Environment variables secured

## 🚨 Troubleshooting

**Backend Issues:**
- Check Railway logs for errors
- Verify all environment variables are set
- Test MongoDB connection

**Frontend Issues:**
- Check browser console for errors
- Verify API URL is correct
- Check network tab for failed requests

**OTP Issues:**
- Verify Gmail app password is correct
- Check Twilio account balance
- Look at backend logs for OTP generation

## 📊 Monitoring

**Railway:**
- View logs and metrics in Railway dashboard
- Set up alerts for downtime

**Netlify:**
- Monitor build logs and deploy status
- Set up form notifications

**MongoDB Atlas:**
- Monitor database performance
- Set up alerts for high usage

## 💰 Cost Estimation

**Free Tier Limits:**
- MongoDB Atlas: 512MB storage
- Railway: $5/month after free tier
- Netlify: 100GB bandwidth/month
- Twilio: $15 free credit

**Scaling:**
- Expect $10-20/month for small production app
- Monitor usage and upgrade as needed

Your Store Ledger App is now production-ready! 🎉