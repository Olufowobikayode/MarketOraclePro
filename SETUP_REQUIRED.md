# 🚨 Setup Required - Market Oracle

## ⚡ Quick Status

✅ **Frontend**: Running on http://localhost:3000  
❌ **Backend**: Waiting for MongoDB configuration

## 🔧 Required Configuration

### 1. MongoDB Atlas Setup (REQUIRED)

The backend **requires** a MongoDB database to function. You need to:

1. **Create a FREE MongoDB Atlas account**: https://www.mongodb.com/cloud/atlas/register
2. **Create a cluster** (free tier is sufficient)
3. **Create a database user** with read/write permissions
4. **Whitelist IP addresses**: Add `0.0.0.0/0` to allow all IPs (or your specific IPs)
5. **Get your connection string**: It looks like:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/database?retryWrites=true&w=majority
   ```

### 2. Configure Backend Environment

Edit the file `/home/user/webapp/backend/.env` and add your MongoDB URI:

```bash
# Backend Environment Variables
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/marketoracle?retryWrites=true&w=majority

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# GROQ API Configuration (Optional - for deep analysis)
GROQ_API_KEY=
```

### 3. Restart Backend

After adding your MongoDB URI:

```bash
cd /home/user/webapp
pm2 restart market-oracle-backend
pm2 logs market-oracle-backend --nostream
```

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Market Oracle Backend running on port 3001
```

## 📋 Current Application Status

### Frontend ✅
- **URL**: http://localhost:3000
- **Status**: Running successfully
- **Build**: Production build complete

### Backend ❌
- **Expected URL**: http://localhost:3001
- **Status**: Stopped (waiting for MongoDB URI)
- **Issue**: MONGODB_URI environment variable not set
- **Solution**: Follow steps above to configure MongoDB

## 🎯 Features Overview

Market Oracle is an AI-powered market intelligence platform with:

### Core Features
- 📈 **Trend Analysis** - Real-time market trend tracking
- 🔑 **Keyword Research** - SEO keyword intelligence
- 🛍️ **Marketplace Finder** - E-commerce platform discovery
- 📝 **Content Strategy** - AI-driven content planning
- 📱 **Social Media Intelligence** - Social analytics
- ✍️ **Copywriting Assistant** - Marketing copy generation
- ❓ **Q&A Oracle** - Intelligent question-answering
- 🔍 **Product Finder** - Product research
- 🎯 **Competitor Analysis** - Competitive intelligence
- 📊 **Scenario Planner** - Business scenario modeling
- 🎨 **Media Generation** - AI visual content creation
- 💡 **Venture Ideas** - Business opportunity discovery
- 💰 **Arbitrage Finder** - Price differential identification
- 👥 **Lead Generation** - Prospect discovery

### Backend Features
- ✨ Activity tracking across all features
- 📚 Search history with categories and tags
- ⭐ Favorites system with notes
- 📊 Advanced analytics and user stats
- 🔌 API usage tracking
- 🔐 Enhanced user management

## 🔐 API Keys Required

### MongoDB (REQUIRED for backend)
- **Required**: Yes
- **Setup**: See steps above
- **Cost**: FREE tier available

### Google Gemini API (REQUIRED for AI features)
- **Required**: Yes (users provide their own)
- **Setup**: Get at https://aistudio.google.com/apikey
- **Input**: In app Settings modal
- **Cost**: FREE tier available

### GROQ API (OPTIONAL for deep analysis)
- **Required**: No
- **Setup**: Get at https://console.groq.com/keys
- **Input**: Add to backend/.env as GROQ_API_KEY
- **Cost**: FREE tier available

## 🚀 After MongoDB Setup

Once MongoDB is configured:

1. **Access the application**: http://localhost:3000
2. **Initialize Oracle**: Complete the gateway page (set niche/focus)
3. **Set Gemini API Key**: In Settings modal (each user provides their own)
4. **Start exploring**: Use any of the 14+ features

## 📞 Need Help?

### Check Logs
```bash
# Backend logs
pm2 logs market-oracle-backend --nostream

# Frontend logs
pm2 logs market-oracle-frontend --nostream

# All logs
pm2 logs --nostream
```

### Test Backend Health (after MongoDB setup)
```bash
curl http://localhost:3001/
```

Should return:
```json
{
  "status": "online",
  "service": "Market Oracle Backend",
  "mongodb": "connected"
}
```

### Common Issues

**Issue**: Backend keeps restarting
- **Cause**: No MongoDB URI configured
- **Solution**: Add MONGODB_URI to backend/.env

**Issue**: "Backend Error: 500" in app
- **Cause**: Backend not connected to MongoDB
- **Solution**: Configure MongoDB URI and restart backend

**Issue**: Features not working
- **Cause**: No Gemini API key set
- **Solution**: Each user must provide their own Gemini API key in Settings

## 📖 Documentation

- **README.md** - Full project documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **TROUBLESHOOTING.md** - Common issues and solutions
- **RENDER_DEPLOYMENT.md** - Production deployment guide
- **API_EXAMPLES.md** - API usage examples

---

**Status**: ✅ Frontend Ready | ⏳ Backend Waiting for MongoDB  
**Next Step**: Configure MongoDB Atlas and update backend/.env
