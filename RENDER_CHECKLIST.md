# ✅ Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.com.

## 📋 Pre-Deployment

- [ ] Code is committed to Git
- [ ] Repository is pushed to GitHub/GitLab/Bitbucket
- [ ] MongoDB Atlas cluster is set up and accessible
- [ ] MongoDB connection string is ready
- [ ] All dependencies are in package.json files
- [ ] Build works locally: `npm run build`

## 🚀 Render Setup

### Backend Service

- [ ] Create Web Service on Render
- [ ] Connect to your Git repository
- [ ] Select correct branch (main)
- [ ] Set root directory: `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Add environment variables:
  - [ ] `MONGODB_URI` - Your MongoDB connection string
  - [ ] `NODE_ENV` - Set to `production`
  - [ ] `PORT` - Set to `3001` (optional, auto-set by Render)
- [ ] Deploy backend service
- [ ] **Copy backend URL** for frontend configuration

### Frontend Service

- [ ] Create Static Site on Render
- [ ] Connect to your Git repository
- [ ] Select correct branch (main)
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Add environment variables:
  - [ ] `VITE_API_URL` - Your backend URL + `/api`
    - Example: `https://market-oracle-backend.onrender.com/api`
- [ ] Deploy frontend service

## 🔧 Post-Deployment

### Backend Verification

- [ ] Backend service shows "Live" status in Render
- [ ] Check backend logs for MongoDB connection
- [ ] Test health endpoint: `curl https://YOUR-BACKEND.onrender.com/`
- [ ] Should return JSON with service status

### Frontend Verification

- [ ] Frontend service shows "Live" status in Render
- [ ] Open frontend URL in browser
- [ ] Check browser console for errors
- [ ] Verify no CORS errors

### MongoDB Atlas

- [ ] Network Access allows all IPs (0.0.0.0/0)
- [ ] Database user has correct permissions
- [ ] Connection string is correct in backend environment

### Update Backend CORS (Optional)

- [ ] Go to backend service settings
- [ ] Add `FRONTEND_URL` environment variable
- [ ] Set to your frontend URL
- [ ] Redeploy backend if needed

## ✅ Testing

- [ ] Frontend loads successfully
- [ ] Can interact with UI elements
- [ ] Login/authentication works (if applicable)
- [ ] API requests work (check Network tab)
- [ ] MongoDB data is being saved
- [ ] All features function properly

## 🐛 Troubleshooting

If something doesn't work:

1. **Check Render Logs**
   - Backend service logs
   - Frontend build logs

2. **Check Browser Console**
   - JavaScript errors
   - Network errors
   - CORS issues

3. **Verify Environment Variables**
   - All required variables are set
   - No typos in URLs
   - MongoDB URI is correct

4. **Test API Endpoints**
   ```bash
   # Test backend health
   curl https://YOUR-BACKEND.onrender.com/
   
   # Test API endpoint
   curl https://YOUR-BACKEND.onrender.com/api/leaderboard
   ```

5. **Common Issues**
   - ❌ "Cannot connect to backend" → Check `VITE_API_URL` has `/api` suffix
   - ❌ "MongoDB connection failed" → Check Network Access in MongoDB Atlas
   - ❌ "CORS error" → Verify backend CORS configuration
   - ❌ "Build failed" → Check build logs, verify dependencies

## 📚 Reference Documents

- **Detailed Guide**: `RENDER_DEPLOYMENT.md`
- **Summary**: `DEPLOYMENT_SUMMARY.md`
- **Project README**: `README.md`

## 🎉 Success!

When everything works:
- ✅ Backend API responds
- ✅ Frontend loads
- ✅ Features work
- ✅ Data persists in MongoDB

**Your app is live! 🚀**

Share your URLs:
- Frontend: `https://YOUR-FRONTEND.onrender.com`
- Backend: `https://YOUR-BACKEND.onrender.com`

---

**Need Help?** Check `RENDER_DEPLOYMENT.md` for detailed troubleshooting.
