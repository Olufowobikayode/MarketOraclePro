# Market Oracle - Complete Setup Guide

## 🎯 Overview

Market Oracle is a powerful AI-driven market intelligence platform that helps entrepreneurs and businesses make data-driven decisions. The app uses Google's Gemini AI (user-provided API key) and MongoDB for data persistence.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
3. **Google Gemini API Key** - [Get API Key](https://aistudio.google.com/apikey)

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd /home/user/webapp

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

#### Backend Configuration (`backend/.env`)

Create `backend/.env` with your MongoDB credentials:

```bash
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/marketoracle?retryWrites=true&w=majority

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**How to get MongoDB URI:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `marketoracle`

#### Frontend Configuration (`.env`)

Create `.env` in the root directory:

```bash
# Backend API URL
VITE_API_URL=http://localhost:3001/api
```

### 3. Run the Application

You need to run both frontend and backend simultaneously.

#### Option A: Using Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd /home/user/webapp/backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd /home/user/webapp
npm run dev
```

#### Option B: Using PM2 (Recommended for Sandbox)

```bash
# Start backend
cd /home/user/webapp/backend
pm2 start server.js --name market-oracle-backend

# Start frontend (in separate terminal)
cd /home/user/webapp
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

### 5. Configure Gemini API Key

1. Sign up for Google AI Studio: https://aistudio.google.com/
2. Get your API key: https://aistudio.google.com/apikey
3. In the app, go to **Settings** (gear icon in header)
4. Enter your Gemini API key
5. Click "Save & Validate"

## 🔧 Configuration Details

### MongoDB Database Schema

The app automatically creates these collections:
- **users** - User profiles and authentication
- **activities** - User activity logs
- **searchhistories** - Search query history
- **favorites** - Saved items
- **analytics** - User analytics and stats
- **apiusages** - API usage tracking

### API Key Security

- ✅ User API keys are stored in localStorage (frontend only)
- ✅ Keys are sent via `x-gemini-api-key` header to backend
- ✅ Backend proxies requests to Gemini API
- ✅ Keys are never stored in the database
- ✅ Each user provides their own API key

## 🌐 Deployment

### Deploying to Render

#### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Environment Variables:**
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=3001
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-url.onrender.com
     ```

#### Frontend Deployment

1. Create another Web Service on Render
2. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

## 📊 Features

- **Market Analysis** - Real-time trend detection
- **Keyword Research** - SEO and search volume analysis
- **Platform Finder** - Discover marketplaces
- **Product Finder** - Find cheapest products across platforms
- **Leads Hunter** - Extract business leads from websites
- **Store Enhancer** - Competitor analysis
- **Sales Arbitrage** - Find price gaps
- **Scenario Planner** - Strategic simulations
- **Venture Ideas** - Business idea generation
- **Content Strategy** - Viral content planning
- **Social Media** - Multi-platform post generation
- **Copywriting** - Marketing copy creation
- **Media Studio** - AI image generation
- **AI Q&A** - Interactive oracle assistant
- **Live Oracle** - Voice-based interactions

## 🐛 Troubleshooting

### "Backend Error: 500" on Features

**Problem:** API requests fail with 500 error

**Solutions:**
1. Check MongoDB connection:
   ```bash
   # In backend terminal, you should see:
   ✅ Connected to MongoDB Atlas
   ```
2. Verify your Gemini API key is valid
3. Check backend logs for specific errors

### Empty Dashboard

**Problem:** Dashboard shows no data

**Solutions:**
1. Ensure you've completed the "Oracle Gateway" initiation
2. Check that your API key is set in Settings
3. Try refreshing the page

### MongoDB Connection Failed

**Problem:** Backend can't connect to MongoDB

**Solutions:**
1. Verify your MongoDB URI is correct
2. Check your MongoDB Atlas IP whitelist (add `0.0.0.0/0` for development)
3. Ensure your database user has read/write permissions
4. Check if your password has special characters - they may need URL encoding

### API Key Not Working

**Problem:** "Invalid API Key" errors

**Solutions:**
1. Get a new key from https://aistudio.google.com/apikey
2. Ensure you're using a valid Google account
3. Check if your API quota is exceeded
4. Try copying the key again (no extra spaces)

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore` by default
2. **Use strong MongoDB passwords** - Include special characters
3. **Whitelist IPs in MongoDB** - Restrict access to known IPs in production
4. **Rotate API keys regularly** - Change Gemini keys periodically
5. **Use environment variables** - Never hardcode secrets

## 📝 Development Tips

### Hot Reload

Both frontend (Vite) and backend (nodemon) support hot reload:
- Frontend: Changes reflect immediately
- Backend: Install `nodemon` for auto-restart on changes

### Debugging

Enable detailed logging:
```bash
# Backend logs are automatically verbose in development
# Check terminal for:
🔑 API Key present: true
🚀 Sending request to Gemini API...
✅ Gemini API success in 1234ms
```

### Database Queries

Use MongoDB Compass or Studio 3T to visually inspect your database:
- Download: https://www.mongodb.com/try/download/compass
- Connect using your MongoDB URI

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs for detailed error messages
3. Ensure all environment variables are set correctly
4. Verify MongoDB and Gemini API are accessible

## 📄 License

Copyright © 2024 Market Oracle. All rights reserved.

---

**Happy Building! 🚀**
