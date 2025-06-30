# 🏪 Store Ledger App

A full-stack inventory management application built with React, Node.js, Express, and MongoDB. Manage your store inventory with real-time tracking, sales management, and secure authentication.

![Store Ledger App](https://images.pexels.com/photos/7947664/pexels-photo-7947664.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based auth with OTP verification via email/SMS
- 📦 **Inventory Management**: Add, edit, delete products with SI units
- 💰 **Sales Tracking**: Record sales with automatic inventory updates
- 📊 **Dashboard Analytics**: Real-time stats and low stock alerts
- 🌙 **Dark Mode**: Beautiful light/dark theme toggle
- 📱 **Responsive Design**: Works perfectly on all devices
- ⚡ **Real-time Updates**: Instant inventory updates after sales
- 🔔 **Stock Alerts**: Get notified when products are running low

## 🚀 Live Demo

- **Frontend**: [https://store-ledger-app.netlify.app](https://store-ledger-app.netlify.app)
- **Backend API**: [https://store-ledger-api.up.railway.app](https://store-ledger-api.up.railway.app)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Context API** for state management
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **bcrypt** for password hashing
- **Nodemailer** for email OTP
- **Twilio** for SMS OTP

### Security
- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Rate limiting (100 requests/15min)
- Input validation with express-validator
- CORS protection
- Helmet security headers
- MongoDB injection protection

## 📸 Screenshots

### Dashboard
![Dashboard](https://images.pexels.com/photos/7947664/pexels-photo-7947664.jpeg?auto=compress&cs=tinysrgb&w=800)

### Authentication
![Auth](https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800)

### Product Management
![Products](https://images.pexels.com/photos/7947665/pexels-photo-7947665.jpeg?auto=compress&cs=tinysrgb&w=800)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account (for email OTP)
- Twilio account (for SMS OTP - optional)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/store-ledger-app.git
cd store-ledger-app
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with database and API keys
npm run dev
```

### 3. Frontend Setup
```bash
# In root directory
npm install
cp .env.example .env
# Configure your .env file with backend URL
npm run dev
```

### 4. Environment Configuration

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/store-ledger
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
PORT=3000
NODE_ENV=development
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales Endpoints
- `GET /api/sales` - Get sales history
- `POST /api/sales` - Record new sale

## 🏗️ Project Structure

```
store-ledger-app/
├── backend/                 # Node.js backend
│   ├── middleware/         # Auth & error handling
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── server.js          # Entry point
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── dist/                  # Built frontend
└── docs/                  # Documentation
```

## 🚀 Deployment

### Quick Deploy (Recommended)

1. **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Free)
2. **Backend**: [Railway](https://railway.app) (~$5/month)
3. **Frontend**: [Netlify](https://netlify.com) (Free)

### Detailed Deployment Guide
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### One-Click Deploy

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template/your-template)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/store-ledger-app)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons

## 📞 Support

If you have any questions or need help, please:
- Open an [issue](https://github.com/yourusername/store-ledger-app/issues)
- Email: your-email@example.com
- Twitter: [@yourusername](https://twitter.com/yourusername)

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by [Your Name](https://github.com/yourusername)**