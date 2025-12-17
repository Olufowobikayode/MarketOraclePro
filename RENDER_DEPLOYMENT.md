# 🚀 Market Oracle - Render Deployment Guide

This guide will walk you through deploying the Market Oracle application to Render.com, which provides free hosting for both frontend and backend services.

## 📋 Prerequisites

Before deploying to Render, ensure you have:

1. ✅ A [Render.com](https://render.com) account (free tier available)
2. ✅ A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account with a cluster set up
3. ✅ Your MongoDB connection string ready
4. ✅ This project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## 🏗️ Architecture Overview

The application consists of two services:

1. **Backend API** (Node.js/Express) - Web Service
   - Handles API requests
   - Connects to MongoDB Atlas
   - Proxies Gemini AI requests
   
2. **Frontend** (React/Vite) - Static Site
   - Serves the React application
   - Communicates with backend API

## 📦 Deployment Options

### Option 1: Automatic Deployment (render.yaml - Recommended)

The project includes a `render.yaml` file for automatic deployment.

#### Step 1: Push to Git Repository

```bash
cd /home/user/webapp

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Add your remote repository
git remote add origin https://github.com/YOUR_USERNAME/market-oracle.git

# Push to main branch
git push -u origin main
```

#### Step 2: Connect to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your Git repository
4. Select the repository containing your Market Oracle code
5. Render will automatically detect the `render.yaml` file

#### Step 3: Configure Environment Variables

Render will create both services. You need to set environment variables for each:

**Backend Service (`market-oracle-backend`):**
- `MONGODB_URI`: Your MongoDB Atlas connection string
  - Example: `mongodb+srv://username:password@cluster0.mongodb.net/marketoracle?retryWrites=true&w=majority`
- `PORT`: `3001` (auto-set by Render, but you can verify)
- `NODE_ENV`: `production`
- `FRONTEND_URL`: (Will be set after frontend deploys)

**Frontend Service (`market-oracle-frontend`):**
- `VITE_API_URL`: Your backend API URL
  - Example: `https://market-oracle-backend.onrender.com/api`
  - ⚠️ **Important**: Add `/api` at the end!

#### Step 4: Deploy

1. Click **"Apply"** to create both services
2. Wait for both services to build and deploy (5-10 minutes)
3. Once backend is live, copy its URL
4. Update frontend's `VITE_API_URL` with the backend URL
5. Trigger a frontend redeploy

### Option 2: Manual Deployment

If you prefer to deploy services manually:

#### Deploy Backend API

1. **Create Web Service**
   - Go to Render Dashboard → **"New +"** → **"Web Service"**
   - Connect your repository
   - Configure:
     - **Name**: `market-oracle-backend`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Plan**: Free

2. **Add Environment Variables**
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `PORT`: `3001`

3. **Deploy** and wait for it to complete

4. **Copy Backend URL** (e.g., `https://market-oracle-backend.onrender.com`)

#### Deploy Frontend Static Site

1. **Create Static Site**
   - Go to Render Dashboard → **"New +"** → **"Static Site"**
   - Connect your repository
   - Configure:
     - **Name**: `market-oracle-frontend`
     - **Branch**: `main`
     - **Root Directory**: (leave empty or `/`)
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`

2. **Add Environment Variables**
   - `VITE_API_URL`: `https://market-oracle-backend.onrender.com/api`
     - ⚠️ Replace with your actual backend URL
     - ⚠️ Don't forget the `/api` suffix!

3. **Deploy** and wait for it to complete

4. **Access Your App** at the provided URL (e.g., `https://market-oracle-frontend.onrender.com`)

## 🔧 Post-Deployment Configuration

### Update Backend CORS

After frontend is deployed, update backend environment variable:

1. Go to backend service settings
2. Add environment variable:
   - `FRONTEND_URL`: `https://market-oracle-frontend.onrender.com`
3. Save and redeploy backend

### MongoDB Atlas Network Access

Ensure MongoDB Atlas allows connections from Render:

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Note: This is safe as long as you use strong credentials
5. Confirm

### Test Your Deployment

1. **Backend Health Check**
   ```bash
   curl https://market-oracle-backend.onrender.com/
   ```
   Should return:
   ```json
   {
     "status": "online",
     "service": "Market Oracle Backend",
     "version": "2.0",
     "mongodb": "connected"
   }
   ```

2. **Frontend Access**
   - Open `https://market-oracle-frontend.onrender.com`
   - You should see the Market Oracle dashboard

3. **API Connection Test**
   - Try logging in or using any feature
   - Check browser console for any CORS or connection errors

## 🐛 Troubleshooting

### Backend Not Connecting to MongoDB

**Problem**: Backend logs show MongoDB connection errors

**Solutions**:
1. Verify `MONGODB_URI` is correct in environment variables
2. Check MongoDB Atlas Network Access allows Render IPs
3. Ensure MongoDB user has proper permissions
4. Check connection string format includes database name

### Frontend Can't Reach Backend

**Problem**: API requests fail with CORS or network errors

**Solutions**:
1. Verify `VITE_API_URL` includes `/api` suffix
2. Check backend URL is correct (no trailing slash)
3. Ensure backend service is running (check logs)
4. Verify CORS is properly configured in backend

### Free Tier Sleep Mode

**Problem**: Services sleep after 15 minutes of inactivity

**Solutions**:
1. First request may take 30-60 seconds to wake up
2. Consider upgrading to paid plan for always-on services
3. Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 10 minutes

### Build Failures

**Problem**: Deployment fails during build

**Solutions**:

**Frontend Build Issues**:
```bash
# Locally test the build
npm install
npm run build
```

**Backend Build Issues**:
```bash
# Test backend dependencies
cd backend
npm install
node server.js
```

### Environment Variables Not Working

**Problem**: App can't access environment variables

**Solutions**:
1. Ensure variables are set in Render dashboard
2. Frontend variables MUST start with `VITE_`
3. After changing env vars, trigger a redeploy
4. Check build logs for variable values (be careful with secrets)

## 📊 Monitoring Your Deployment

### Render Dashboard

Monitor your services:
- **Logs**: Real-time logs for debugging
- **Metrics**: CPU, Memory, Bandwidth usage
- **Events**: Deploy history and status

### Backend Logs

Check backend logs for:
- MongoDB connection status
- API request errors
- Gemini API usage

### Frontend Console

Check browser console for:
- API connection errors
- CORS issues
- JavaScript errors

## 💰 Cost Considerations

### Free Tier Limits

**Render Free Tier** (per month):
- 750 hours of web service runtime
- Free SSL certificates
- Automatic deploys from Git
- Services spin down after 15 min of inactivity

**MongoDB Atlas Free Tier** (M0):
- 512 MB storage
- Shared RAM
- No backup
- Sufficient for development/testing

### Upgrading

If you need:
- Always-on services (no sleep)
- Custom domains
- More storage/bandwidth
- Faster performance

Consider upgrading to Render's paid plans starting at $7/month per service.

## 🔐 Security Best Practices

1. **Never commit sensitive data**
   - Keep `.env` files in `.gitignore`
   - Use Render's environment variables feature

2. **Use strong MongoDB credentials**
   - Generate strong passwords
   - Rotate credentials regularly

3. **Enable HTTPS only**
   - Render provides free SSL certificates
   - Force HTTPS redirects

4. **API Key Security**
   - Users provide their own Gemini API keys
   - Keys are sent via headers, never stored

5. **CORS Configuration**
   - Only allow trusted frontend origins
   - Update CORS when changing domains

## 🚀 Continuous Deployment

Render automatically deploys when you push to your connected branch:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# Render automatically:
# 1. Detects the push
# 2. Builds the services
# 3. Deploys if build succeeds
# 4. Keeps old version if build fails
```

## 📞 Support & Resources

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Project Issues**: Check your Git repository issues

## 🎉 Success!

If everything is working:
- ✅ Backend API is responding at `https://your-backend.onrender.com`
- ✅ Frontend is accessible at `https://your-frontend.onrender.com`
- ✅ MongoDB is connected and storing data
- ✅ All features are functional

Your Market Oracle app is now live and accessible worldwide! 🌍

---

**Last Updated**: December 17, 2025  
**Version**: 2.0  
**Deployment Platform**: Render.com + MongoDB Atlas
