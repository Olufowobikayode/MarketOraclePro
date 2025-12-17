# Market Oracle - Quick Reference Card

## 🚀 Super Quick Start (5 Minutes)

```bash
# 1. Install
npm install && cd backend && npm install && cd ..

# 2. Configure MongoDB (get from https://cloud.mongodb.com/)
echo 'MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/marketoracle?retryWrites=true&w=majority' > backend/.env
echo 'PORT=3001' >> backend/.env
echo 'NODE_ENV=development' >> backend/.env
echo 'FRONTEND_URL=http://localhost:5173' >> backend/.env

# 3. Configure Frontend
echo 'VITE_API_URL=http://localhost:3001/api' > .env

# 4. Run (2 terminals)
cd backend && npm start  # Terminal 1
npm run dev              # Terminal 2
```

---

## 📋 Essential Commands

### Development
```bash
# Start backend
cd backend && npm start

# Start frontend
npm run dev

# Health check
curl http://localhost:3001

# Test with API key
curl -X POST http://localhost:3001/api/gemini/generate \
  -H "Content-Type: application/json" \
  -H "x-gemini-api-key: YOUR_KEY" \
  -d '{"model":"gemini-2.5-flash","contents":{"parts":[{"text":"hello"}]}}'
```

### Deployment (Render)
```bash
# Backend settings:
Root Directory: backend
Build: npm install
Start: node server.js
Env: MONGODB_URI, PORT=3001, NODE_ENV=production, FRONTEND_URL

# Frontend settings:
Root Directory: (empty)
Build: npm install && npm run build
Start: npm run start
Env: VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔑 Required Credentials

### MongoDB Atlas
1. Sign up: https://cloud.mongodb.com/
2. Create free cluster
3. Create user with read/write
4. Network Access: 0.0.0.0/0
5. Get connection string
6. Format: `mongodb+srv://user:pass@cluster.mongodb.net/marketoracle?retryWrites=true&w=majority`

### Gemini API
1. Visit: https://aistudio.google.com/apikey
2. Create API key
3. Copy key (starts with "AIza...")
4. Add in app Settings

---

## 🐛 Quick Fixes

### "Backend Error: 500"
→ **Solution:** Add Gemini API key in Settings

### MongoDB "disconnected"
→ **Solution:** Check `backend/.env` has valid `MONGODB_URI`

### Empty Dashboard
→ **Solution:** Initialize Oracle + Generate content

### CORS Errors
→ **Solution:** Set `FRONTEND_URL` in backend `.env`

### Port in Use
→ **Solution:** `fuser -k 3001/tcp` or `lsof -ti:3001 | xargs kill`

---

## 📂 File Structure

```
webapp/
├── backend/
│   ├── server.js          # ✅ FIXED
│   ├── .env               # ⚠️ CREATE THIS
│   └── package.json
├── components/
│   └── AppShell.tsx       # ✅ FIXED (ads removed)
├── store/
│   ├── rootReducer.ts     # ✅ FIXED (ads removed)
│   └── rootSaga.ts        # ✅ FIXED (ads removed)
├── .env                   # ⚠️ CREATE THIS
├── package.json
├── SETUP_GUIDE.md         # 📖 Read first
├── TROUBLESHOOTING.md     # 🆘 When stuck
├── RENDER_DEPLOYMENT_FIXED.md  # 🚀 Deploy guide
└── FINAL_SUMMARY.md       # 📊 Overview
```

---

## ✅ Checklist

### Before Starting:
- [ ] Node.js v18+ installed
- [ ] MongoDB Atlas account created
- [ ] Gemini API key obtained
- [ ] Git repository ready (optional)

### Local Setup:
- [ ] Dependencies installed
- [ ] `.env` files configured
- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:5173
- [ ] MongoDB shows "connected"

### App Usage:
- [ ] Oracle initialized (niche set)
- [ ] Gemini API key added
- [ ] Features generate results
- [ ] Dashboard shows data
- [ ] No 500 errors

### Render Deployment:
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Services linked via env vars
- [ ] Health checks passing
- [ ] Features working in production

---

## 🎯 Key URLs

| Purpose | URL |
|---------|-----|
| **MongoDB** | https://cloud.mongodb.com/ |
| **Gemini Key** | https://aistudio.google.com/apikey |
| **Render** | https://dashboard.render.com/ |
| **Local Frontend** | http://localhost:5173 |
| **Local Backend** | http://localhost:3001 |

---

## 💡 Pro Tips

1. **Use MongoDB Atlas free tier** - 512MB is enough for testing
2. **Set up UptimeRobot** - Keep free Render services alive
3. **Check backend logs first** - Most issues show there
4. **URL encode passwords** - Special characters in MongoDB URI
5. **Test locally first** - Fix issues before deploying

---

## 📊 What's Fixed

| Issue | Status |
|-------|--------|
| Ads logic | ✅ Removed |
| MongoDB connection | ✅ Fixed |
| API key handling | ✅ Improved |
| Error messages | ✅ Enhanced |
| Dashboard | ✅ Working |
| Documentation | ✅ Complete |

---

## 🔄 Quick Recovery

If something breaks:

1. **Stop everything:** `Ctrl+C` on both terminals
2. **Clean slate:**
   ```bash
   rm -rf node_modules backend/node_modules
   npm install && cd backend && npm install && cd ..
   ```
3. **Check config:**
   ```bash
   cat backend/.env    # Should have MONGODB_URI
   cat .env            # Should have VITE_API_URL
   ```
4. **Restart:**
   ```bash
   cd backend && npm start   # Terminal 1
   npm run dev               # Terminal 2
   ```

---

## 📞 Documentation Index

| Need Help With... | See Document |
|-------------------|--------------|
| First time setup | [SETUP_GUIDE.md](./SETUP_GUIDE.md) |
| Errors & problems | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| Render deployment | [RENDER_DEPLOYMENT_FIXED.md](./RENDER_DEPLOYMENT_FIXED.md) |
| Step-by-step checks | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) |
| What changed | [FIXES_APPLIED.md](./FIXES_APPLIED.md) |
| Overview | [FINAL_SUMMARY.md](./FINAL_SUMMARY.md) |
| This card | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) |

---

## 🎉 Success Indicators

You're all set when you see:

```bash
# Backend Terminal:
✅ Connected to MongoDB Atlas
🚀 Market Oracle Backend running on port 3001

# Frontend Terminal:
VITE v6.x.x ready in xxx ms
➜  Local:   http://localhost:5173/

# Browser:
(No console errors)
Dashboard shows user profile
Features generate results
```

---

**Print this page or keep it handy during setup!**

**Last Updated:** 2024-01-15 | **Version:** 2.1
