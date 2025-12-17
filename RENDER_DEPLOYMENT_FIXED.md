# Market Oracle - Render Deployment Guide (Updated)

## 🚀 Overview

This guide will help you deploy Market Oracle to Render with MongoDB Atlas integration. The ads logic has been completely removed, and all issues have been fixed.

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at https://render.com
3. **MongoDB Atlas** - Free tier available at https://www.mongodb.com/cloud/atlas
4. **Gemini API Key** - Get from https://aistudio.google.com/apikey (users will provide their own)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create Cluster

1. Go to https://cloud.mongodb.com/
2. Click "Build a Database"
3. Choose **FREE** tier (M0 Sandbox)
4. Select a region close to your users
5. Name your cluster (e.g., "market-oracle-cluster")
6. Click "Create"

### 1.2 Create Database User

1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Choose **Password** authentication
4. Username: `marketoracle` (or your choice)
5. Password: Generate a strong password (save it!)
6. User Privileges: **Read and write to any database**
7. Click "Add User"

### 1.3 Whitelist IPs

1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add `0.0.0.0/0`)
4. Confirm

> ⚠️ For production, you should whitelist only Render's IP addresses. For now, allowing all IPs is fine for testing.

### 1.4 Get Connection String

1. Go to **Database** → Click "Connect"
2. Choose "Connect your application"
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://marketoracle:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password
6. Replace `?retryWrites` with `/marketoracle?retryWrites` (database name)

**Final connection string should look like:**
```
mongodb+srv://marketoracle:YourPassword123@cluster0.xxxxx.mongodb.net/marketoracle?retryWrites=true&w=majority
```

> 💡 **Important:** If your password has special characters, URL encode them:
> - `@` → `%40`
> - `#` → `%23`
> - `!` → `%21`

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Log in to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing Market Oracle

### 2.2 Configure Backend Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `market-oracle-backend` |
| **Region** | Choose closest to your users |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` (for testing) |

### 2.3 Add Environment Variables

Click "Advanced" → "Add Environment Variable":

| Key | Value | Example |
|-----|-------|---------|
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/marketoracle?retryWrites=true&w=majority` |
| `PORT` | `3001` | - |
| `NODE_ENV` | `production` | - |
| `FRONTEND_URL` | *(leave empty for now, add after frontend deploy)* | `https://market-oracle-frontend.onrender.com` |

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Your backend will be available at: `https://market-oracle-backend.onrender.com`

### 2.5 Verify Backend

Test the health endpoint:
```bash
curl https://market-oracle-backend.onrender.com
```

Should return:
```json
{
  "status": "online",
  "service": "Market Oracle Backend",
  "version": "2.0",
  "mongodb": "connected",
  "features": [...]
}
```

If `mongodb` shows `"disconnected"`, check your MongoDB URI and network access settings.

---

## 🎨 Step 3: Deploy Frontend to Render

### 3.1 Create Another Web Service

1. In Render dashboard, click "New +" → "Web Service"
2. Select the same GitHub repository

### 3.2 Configure Frontend Service

| Setting | Value |
|---------|-------|
| **Name** | `market-oracle-frontend` |
| **Region** | Same as backend |
| **Branch** | `main` |
| **Root Directory** | *(leave empty - deploy from root)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Instance Type** | `Free` |

### 3.3 Add Environment Variables

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://market-oracle-backend.onrender.com/api` |

> Replace with your actual backend URL from Step 2.4

### 3.4 Deploy

1. Click "Create Web Service"
2. Wait 3-5 minutes for build and deployment
3. Your frontend will be at: `https://market-oracle-frontend.onrender.com`

---

## 🔗 Step 4: Link Frontend and Backend

### 4.1 Update Backend CORS

Go back to your **backend service** on Render:

1. Click "Environment" tab
2. Edit `FRONTEND_URL` variable
3. Set to your frontend URL: `https://market-oracle-frontend.onrender.com`
4. Click "Save Changes"
5. Backend will auto-redeploy

---

## ✅ Step 5: Test the Application

### 5.1 Access Your App

Visit: `https://market-oracle-frontend.onrender.com`

### 5.2 Initialize Oracle

1. Click "Initialize" or "Awaken Oracle"
2. Enter a niche (e.g., "sustainable fashion")
3. Select purpose
4. Click submit

### 5.3 Set API Key

1. Click Settings (⚙️ icon in header)
2. Enter your Gemini API key
3. Click "Save & Validate"
4. Should see "✅ API Key Validated Successfully"

### 5.4 Test Features

Try generating:
- Market trends
- Keywords
- Content ideas

If you get errors, check the troubleshooting section below.

---

## 🐛 Troubleshooting

### Backend Shows "mongodb": "disconnected"

**Causes:**
1. Wrong MongoDB URI
2. IP not whitelisted
3. User doesn't have permissions
4. Special characters in password not URL encoded

**Fix:**
1. Go to MongoDB Atlas → Database Access
2. Verify user has read/write permissions
3. Go to Network Access → Add `0.0.0.0/0`
4. URL encode password special characters
5. Update `MONGODB_URI` in Render environment variables
6. Backend will auto-redeploy

---

### "Failed to generate Market Trend: Backend Error: 500"

**Causes:**
1. No Gemini API key set
2. Invalid API key
3. Backend not reachable

**Fix:**
1. Go to Settings in the app
2. Enter valid Gemini API key
3. Test with a simple query

---

### CORS Errors

**Cause:** Frontend URL not added to backend CORS whitelist

**Fix:**
1. Ensure `FRONTEND_URL` is set in backend environment variables
2. Format: `https://your-app.onrender.com` (no trailing slash)
3. Backend will auto-redeploy after saving

---

### Render Free Tier Limitations

⚠️ **Important:** Free tier services on Render:
- Spin down after 15 minutes of inactivity
- Take 30-60 seconds to wake up on first request
- Have limited resources

**Workarounds:**
1. Use a service like UptimeRobot to ping your backend every 10 minutes
2. Consider upgrading to paid tier for production use

---

## 🔐 Security Recommendations

### Production Checklist

- [ ] Use strong MongoDB passwords (16+ characters)
- [ ] Whitelist only Render IPs in MongoDB (not `0.0.0.0/0`)
- [ ] Enable MongoDB Atlas backup
- [ ] Set up monitoring and alerts
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatically handled by Render)
- [ ] Regularly rotate API keys

---

## 📊 Monitoring

### Check Backend Logs

1. Go to Render dashboard → Your backend service
2. Click "Logs" tab
3. Look for:
   - `✅ Connected to MongoDB Atlas`
   - `🚀 Market Oracle Backend running on port 3001`

### Check Frontend Logs

1. Go to frontend service → "Logs"
2. Check for build errors or runtime issues

### MongoDB Atlas Monitoring

1. Go to MongoDB Atlas → Database → Monitoring
2. View:
   - Connections
   - Operations per second
   - Network traffic

---

## 🚀 Custom Domain (Optional)

### Add Custom Domain to Frontend

1. In Render dashboard, go to your frontend service
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `oracle.yourdomain.com`)
4. Update DNS records as instructed
5. Render will auto-provision SSL certificate

### Update Backend CORS

Don't forget to add your custom domain to backend's `FRONTEND_URL`!

---

## 💰 Cost Estimate

### Free Tier (Development)
- MongoDB Atlas: **Free** (512 MB storage)
- Render Frontend: **Free** (with limitations)
- Render Backend: **Free** (with limitations)
- **Total: $0/month**

### Paid Tier (Production)
- MongoDB Atlas: **$9/month** (M10 cluster)
- Render Frontend: **$7/month** (starter)
- Render Backend: **$7/month** (starter)
- **Total: ~$23/month**

---

## 📝 Environment Variables Reference

### Backend Environment Variables

```bash
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/marketoracle?retryWrites=true&w=majority
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend Environment Variables

```bash
# Required
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## ✨ What's Fixed in This Version

✅ **Ads logic completely removed** - No more ad interruptions
✅ **MongoDB connection fixed** - Proper environment variable handling
✅ **API key handling improved** - Better error messages and validation
✅ **Verbose logging added** - Easier debugging
✅ **User dashboard working** - Displays analytics properly
✅ **Better error handling** - Clear error messages for users

---

## 🎉 Deployment Complete!

Your Market Oracle is now live! Share your URL with users and start providing AI-powered market intelligence.

**Next Steps:**
1. Test all features thoroughly
2. Monitor MongoDB usage
3. Set up Gemini API keys for users
4. Consider adding custom domain
5. Enable backups in MongoDB Atlas

---

**Questions or Issues?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Last Updated:** 2024-01-15
