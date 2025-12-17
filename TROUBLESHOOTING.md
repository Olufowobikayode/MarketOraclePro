# Market Oracle - Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. "Failed to generate Market Trend: Backend Error: 500"

This error occurs when the Gemini API request fails. Here are the most common causes:

#### **Cause A: Invalid or Missing API Key**

**Symptoms:**
- Error appears immediately after clicking "Generate"
- Backend logs show: `❌ No API Key in request headers`

**Solution:**
```bash
1. Go to Settings (⚙️ icon in header)
2. Click "API Configuration"
3. Enter your Gemini API key
4. Click "Save & Validate"
5. You should see "✅ API Key Validated Successfully"
```

**Get a valid API key:**
- Visit: https://aistudio.google.com/apikey
- Sign in with your Google account
- Click "Create API Key"
- Copy the key (starts with "AIza...")

---

#### **Cause B: MongoDB Not Connected**

**Symptoms:**
- Backend logs show: `⚠️ MongoDB: Connecting...`
- Backend never shows: `✅ Connected to MongoDB Atlas`

**Solution:**

1. **Check your MongoDB URI in `backend/.env`:**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketoracle?retryWrites=true&w=majority
   ```

2. **Common MongoDB URI mistakes:**
   - ❌ Password has special characters without URL encoding
   - ❌ Wrong database name
   - ❌ IP not whitelisted in MongoDB Atlas
   - ❌ User doesn't have read/write permissions

3. **Fix MongoDB Atlas IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - For development: Add `0.0.0.0/0` (all IPs)
   - For production: Add your server's specific IP

4. **URL Encode Special Characters in Password:**
   If your password is `P@ss!word#123`, encode it:
   ```
   @ = %40
   ! = %21
   # = %23
   ```
   Result: `P%40ss%21word%23123`

---

#### **Cause C: Backend Not Running**

**Symptoms:**
- Frontend shows "Network Error" or "Failed to fetch"
- Cannot access http://localhost:3001

**Solution:**
```bash
# Check if backend is running
curl http://localhost:3001

# If not running, start it:
cd backend
npm start

# You should see:
# 🚀 Market Oracle Backend running on port 3001
# 🌍 Environment: development
# ✅ Connected to MongoDB Atlas
```

---

#### **Cause D: Incorrect API URL Configuration**

**Symptoms:**
- Frontend can't reach backend
- Browser console shows CORS errors

**Solution:**

1. **Check `.env` file in root directory:**
   ```bash
   VITE_API_URL=http://localhost:3001/api
   ```

2. **After changing `.env`, restart frontend:**
   ```bash
   # Stop the dev server (Ctrl+C)
   # Restart:
   npm run dev
   ```

---

### 2. Empty Dashboard / No Data Displayed

#### **Symptoms:**
- Dashboard loads but shows no analytics
- "Neural Core" shows "No active focus"

#### **Solution:**

1. **Initialize the Oracle Session:**
   - Click "Initialize" button on dashboard
   - Fill in your niche/market focus
   - Select your purpose (research, business, content, etc.)
   - Click "Awaken Oracle"

2. **Generate Some Data:**
   - Go to any module (e.g., Market Analysis)
   - Enter a query and generate content
   - Data will now appear in dashboard analytics

3. **Check User Authentication:**
   - Dashboard requires user to be logged in
   - If using Telegram Mini App, ensure initData is valid
   - For local testing, demo user is created automatically

---

### 3. Gemini API Quota Exceeded

#### **Symptoms:**
- Error: "The Oracle's energy is depleted (Quota Exceeded)"
- Error 429 in backend logs

#### **Solution:**

1. **Check your API usage:**
   - Go to: https://aistudio.google.com/
   - View your quota limits

2. **Free Tier Limits:**
   - 15 requests per minute
   - 1,500 requests per day
   - If exceeded, wait or upgrade to paid tier

3. **Optimize usage:**
   - Avoid rapid-fire requests
   - Use caching when possible
   - Consider upgrading to paid plan

---

### 4. Backend Logs Showing Errors

#### **Common Log Patterns:**

**Pattern A: API Key Issues**
```
❌ No API Key in request headers
```
**Fix:** Set your Gemini API key in Settings

---

**Pattern B: MongoDB Connection Failed**
```
⚠️ MongoDB connection failed. Retrying in 5 seconds...
MongoServerError: Authentication failed
```
**Fix:** Check MongoDB URI username/password

---

**Pattern C: Gemini API Error**
```
❌ Gemini API Error: 400 INVALID_ARGUMENT
```
**Fix:** API key is invalid or malformed. Generate a new one.

---

**Pattern D: Model Not Found**
```
Error: Model 'gemini-3-pro-preview' not found
```
**Fix:** This is expected - Gemini 3 Pro is not yet available. The app will fall back to available models.

---

### 5. CORS Errors in Browser Console

#### **Symptoms:**
```
Access to fetch at 'http://localhost:3001/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

#### **Solution:**

1. **Verify backend CORS configuration:**
   Backend should allow your frontend origin. Check `backend/server.js`:
   ```javascript
   const allowedOrigins = [
       'http://localhost:3000',
       'http://localhost:5173',
       // ...
   ];
   ```

2. **Restart backend after changes:**
   ```bash
   cd backend
   npm start
   ```

---

### 6. PM2 Process Management Issues

#### **List all PM2 processes:**
```bash
pm2 list
```

#### **View logs:**
```bash
pm2 logs market-oracle-backend --nostream
```

#### **Restart process:**
```bash
pm2 restart market-oracle-backend
```

#### **Kill all processes:**
```bash
pm2 delete all
```

---

### 7. Port Already in Use

#### **Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

#### **Solution:**

**Option A: Kill the process using the port**
```bash
# Find process using port 3001
lsof -i :3001

# Kill it
kill -9 <PID>
```

**Option B: Use a different port**
```bash
# In backend/.env
PORT=3002

# Update frontend .env
VITE_API_URL=http://localhost:3002/api
```

---

## 🔍 Debugging Checklist

Before asking for help, verify:

- [ ] Backend is running (`curl http://localhost:3001`)
- [ ] MongoDB is connected (check backend logs for "✅ Connected")
- [ ] Gemini API key is set and valid (test in Settings)
- [ ] `.env` files are configured correctly
- [ ] Frontend can reach backend (check browser console)
- [ ] No CORS errors in browser console
- [ ] All dependencies are installed (`npm install`)

---

## 📊 Health Check Endpoints

### Backend Health
```bash
curl http://localhost:3001
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

### Test Gemini API (with your key)
```bash
curl -X POST http://localhost:3001/api/gemini/generate \
  -H "Content-Type: application/json" \
  -H "x-gemini-api-key: YOUR_API_KEY_HERE" \
  -d '{
    "model": "gemini-2.5-flash",
    "contents": {"parts": [{"text": "Say hello"}]},
    "config": {}
  }'
```

---

## 🆘 Still Having Issues?

1. **Enable Verbose Logging:**
   - Backend logs are already verbose in development mode
   - Check terminal output for detailed error messages

2. **Check File Permissions:**
   ```bash
   # Ensure .env files are readable
   chmod 600 backend/.env
   chmod 600 .env
   ```

3. **Clear Node Modules and Reinstall:**
   ```bash
   rm -rf node_modules backend/node_modules
   npm install
   cd backend && npm install
   ```

4. **Verify Node.js Version:**
   ```bash
   node --version  # Should be v18 or higher
   ```

---

## 📝 Reporting Issues

When reporting issues, include:
- Error message (full text)
- Backend terminal output
- Browser console errors
- Steps to reproduce
- Your environment (OS, Node version, etc.)

---

**Last Updated:** 2024-01-15
