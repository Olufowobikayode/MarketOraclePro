# Market Oracle - Deployment Checklist

## ✅ Pre-Deployment Checklist

### Local Setup Verification

- [ ] Node.js v18+ installed
- [ ] All dependencies installed (`npm install` in root and backend)
- [ ] `.env` files configured (both root and backend)
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string tested
- [ ] Gemini API key obtained
- [ ] Backend starts without errors (`cd backend && npm start`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access frontend at http://localhost:5173
- [ ] Can access backend at http://localhost:3001
- [ ] Health check returns "mongodb": "connected"

### MongoDB Atlas Configuration

- [ ] Cluster created (M0 Free tier is fine for testing)
- [ ] Database user created with read/write permissions
- [ ] Password saved securely
- [ ] Special characters in password URL-encoded
- [ ] Network access configured (0.0.0.0/0 for development)
- [ ] Connection string tested locally
- [ ] Database name set to `marketoracle`

### GitHub Repository

- [ ] Code pushed to GitHub
- [ ] `.env` files NOT committed (should be in .gitignore)
- [ ] All changes committed
- [ ] Repository is public or Render has access
- [ ] Branch name is `main` or noted for deployment

---

## 🚀 Render Deployment Checklist

### Backend Service

- [ ] New Web Service created on Render
- [ ] GitHub repository connected
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Environment variables added:
  - [ ] `MONGODB_URI` - Full connection string
  - [ ] `PORT` - Set to `3001`
  - [ ] `NODE_ENV` - Set to `production`
  - [ ] `FRONTEND_URL` - Will add after frontend deployment
- [ ] Service deployed successfully
- [ ] Backend URL noted: `https://_____.onrender.com`
- [ ] Health check tested: `curl https://your-backend.onrender.com`
- [ ] Response shows `"mongodb": "connected"`

### Frontend Service

- [ ] New Web Service created on Render
- [ ] GitHub repository connected
- [ ] Root directory left empty (deploy from root)
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm run start`
- [ ] Environment variables added:
  - [ ] `VITE_API_URL` - Backend URL + `/api`
- [ ] Service deployed successfully
- [ ] Frontend URL noted: `https://_____.onrender.com`
- [ ] Can access frontend in browser

### Linking Frontend & Backend

- [ ] Go back to backend service on Render
- [ ] Edit environment variables
- [ ] Set `FRONTEND_URL` to frontend URL
- [ ] Save changes (backend will redeploy)
- [ ] Wait for backend redeploy to complete

---

## 🧪 Testing Checklist

### Basic Functionality

- [ ] Frontend loads without errors
- [ ] No console errors in browser DevTools
- [ ] Can click through pages
- [ ] Settings modal opens
- [ ] Dashboard displays properly

### Oracle Initialization

- [ ] Can access Oracle Gateway page
- [ ] Can enter niche (e.g., "sustainable fashion")
- [ ] Can select purpose
- [ ] Initialization completes successfully
- [ ] Redirected to dashboard

### API Key Configuration

- [ ] Can open Settings
- [ ] Can enter Gemini API key
- [ ] Can click "Save & Validate"
- [ ] Validation succeeds
- [ ] Success message appears

### Feature Testing

- [ ] Market Analysis generates results
- [ ] Keyword Research works
- [ ] Platform Finder returns data
- [ ] Product Finder searches successfully
- [ ] No "Backend Error: 500" messages
- [ ] Results display in cards
- [ ] Can add cards to comparison
- [ ] Can save favorites

### MongoDB Data Persistence

- [ ] User profile created on first login
- [ ] Activities logged in MongoDB
- [ ] Search history saved
- [ ] Favorites saved
- [ ] Analytics updated
- [ ] Can view activity history

---

## 🔍 Verification Steps

### 1. Backend Health Check

```bash
curl https://your-backend.onrender.com
```

Expected response:
```json
{
  "status": "online",
  "service": "Market Oracle Backend",
  "version": "2.0",
  "mongodb": "connected",
  "features": [...]
}
```

### 2. Test Gemini API Endpoint

```bash
curl -X POST https://your-backend.onrender.com/api/gemini/generate \
  -H "Content-Type: application/json" \
  -H "x-gemini-api-key: YOUR_GEMINI_KEY" \
  -d '{
    "model": "gemini-2.5-flash",
    "contents": {"parts": [{"text": "Say hello"}]},
    "config": {}
  }'
```

Should return Gemini API response (not an error).

### 3. Check MongoDB Collections

Using MongoDB Compass or Studio 3T:

1. Connect to your Atlas cluster
2. Navigate to `marketoracle` database
3. Verify collections exist:
   - `users`
   - `activities`
   - `searchhistories`
   - `favorites`
   - `analytics`
   - `apiusages`

### 4. Check Backend Logs

In Render dashboard → Backend service → Logs:

Look for:
```
✅ Connected to MongoDB Atlas
🚀 Market Oracle Backend running on port 3001
🌍 Environment: production
📊 MongoDB: Connected
```

### 5. Check Frontend Logs

In Render dashboard → Frontend service → Logs:

Look for successful build and no runtime errors.

---

## 🐛 Common Issues & Quick Fixes

### MongoDB shows "disconnected"

**Quick Fix:**
1. Check MongoDB Atlas → Network Access
2. Ensure `0.0.0.0/0` is whitelisted
3. Verify connection string in backend env vars
4. URL encode special characters in password

### "Backend Error: 500" on all features

**Quick Fix:**
1. Open Settings in the app
2. Enter a valid Gemini API key
3. Click "Save & Validate"
4. Try generating content again

### CORS errors in browser console

**Quick Fix:**
1. Verify `FRONTEND_URL` is set in backend
2. Format: `https://your-app.onrender.com` (no trailing slash)
3. Backend should auto-redeploy after saving

### Render service won't start

**Quick Fix:**
1. Check Render logs for errors
2. Verify build/start commands are correct
3. Ensure all required env vars are set
4. Check if Node.js version is compatible

---

## 📊 Post-Deployment Monitoring

### Daily Checks (First Week)

- [ ] Check Render service status (both frontend & backend)
- [ ] Review error logs
- [ ] Monitor MongoDB Atlas metrics
- [ ] Check API usage quota
- [ ] Test critical features

### Weekly Maintenance

- [ ] Review MongoDB storage usage
- [ ] Check Gemini API costs (if using paid tier)
- [ ] Update dependencies if needed
- [ ] Review and archive old logs
- [ ] Test all major features

### Monthly Tasks

- [ ] Review and optimize database queries
- [ ] Clean up old activity logs if needed
- [ ] Update documentation
- [ ] Consider backups
- [ ] Review security settings

---

## 🔐 Security Post-Deployment

### Immediate Actions

- [ ] Remove `0.0.0.0/0` from MongoDB Network Access
- [ ] Add only Render's IP addresses to whitelist
- [ ] Enable MongoDB Atlas backup
- [ ] Set up monitoring alerts
- [ ] Review CORS settings

### Ongoing Security

- [ ] Rotate MongoDB password monthly
- [ ] Monitor for unusual API usage patterns
- [ ] Keep dependencies updated
- [ ] Review access logs regularly
- [ ] Implement rate limiting if needed

---

## 📈 Performance Optimization

### If Using Free Tier

- [ ] Set up UptimeRobot to prevent service sleep
- [ ] Ping backend every 10 minutes
- [ ] Warn users about cold start delays
- [ ] Consider caching frequently accessed data

### For Production

- [ ] Upgrade to paid Render tier
- [ ] Use MongoDB M10 cluster for better performance
- [ ] Enable CDN for static assets
- [ ] Implement Redis caching if needed
- [ ] Monitor response times

---

## 🎉 Deployment Success Criteria

Your deployment is successful when:

✅ Frontend loads without errors
✅ Backend responds to health checks
✅ MongoDB shows "connected" status
✅ Users can set their Gemini API keys
✅ All features generate results
✅ No 500 errors on feature usage
✅ Data persists across sessions
✅ Dashboard displays user analytics
✅ Logs show no critical errors

---

## 📞 Support Resources

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Gemini API Docs:** https://ai.google.dev/docs
- **Troubleshooting Guide:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Setup Guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

**Deployment Date:** ________________

**Deployed By:** ________________

**URLs:**
- Frontend: ________________________________
- Backend: ________________________________
- MongoDB: ________________________________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**Last Updated:** 2024-01-15
