# 🚀 Market Oracle - Quick Start Guide

## ⚡ Instant Access (Current Deployment)

### Live URLs
- **Frontend Application**: https://3000-ixcg2s3y44r7ean2gnsqk-ad490db5.sandbox.novita.ai
- **Backend API**: https://3001-ixcg2s3y44r7ean2gnsqk-ad490db5.sandbox.novita.ai

### 📱 How to Use

1. **Open the Frontend URL** in your browser
2. **Enter your Gemini API Key** in Settings (required for AI features)
   - Get your free API key: https://aistudio.google.com/app/apikey
3. **Start exploring** the 14+ market intelligence features!

## 🔑 Getting Your Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in Market Oracle Settings → API Key Setup
6. Click "Connect"

## 🎯 Key Features to Try

1. **📈 Trend Analysis** - Discover what's hot in your market
2. **🔑 Keyword Research** - Find SEO-optimized keywords
3. **🛍️ Marketplace Finder** - Discover best platforms for your products
4. **📝 Content Strategy** - Get AI-powered content ideas
5. **💡 Venture Ideas** - Generate business opportunities
6. **🎯 Competitor Analysis** - Analyze your competition
7. **📊 Analytics Dashboard** - Track your usage and achievements

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or use hardcoded connection)

### Quick Setup
```bash
# 1. Navigate to project
cd /home/user/webapp

# 2. Install dependencies (if not already done)
npm install
cd backend && npm install && cd ..

# 3. Start services
pm2 start ecosystem.config.cjs

# 4. Check status
pm2 list

# 5. View logs
pm2 logs --nostream
```

### Access Locally
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📊 Current System Status

```bash
# Check PM2 services
pm2 list

# View logs (non-blocking)
pm2 logs --nostream

# Restart services
pm2 restart all

# Stop services
pm2 stop all
```

## 🔧 Common Commands

```bash
# Clean ports and restart
fuser -k 3000/tcp && fuser -k 3001/tcp && pm2 restart all

# View backend logs only
pm2 logs market-oracle-backend --nostream

# View frontend logs only
pm2 logs market-oracle-frontend --nostream

# Test backend health
curl http://localhost:3001/

# Git commands
git status
git log --oneline
git add .
git commit -m "your message"
```

## 🎨 Main Features

### Dashboard
All 14+ market intelligence tools accessible from one interface:
- Trend Analysis
- Keyword Research
- Marketplace Finder
- Content Strategy
- Social Media Intelligence
- Copywriting Assistant
- Q&A Oracle
- Product Finder
- Competitor Analysis
- Scenario Planner
- Media Generation
- Venture Ideas
- Arbitrage Finder
- Lead Generation

### History
- View all your past searches
- Filter by category
- Quick re-run previous queries
- Export to CSV (coming soon)

### Favorites
- Save important results
- Add custom notes
- Organize with tags
- Archive old items

### Analytics
- Activity streaks
- Points and achievements
- Most-used features
- API usage statistics
- Weekly/monthly reports

## 🔐 Security Notes

- **User API Keys**: Users provide their own Gemini API keys (not stored in backend)
- **MongoDB**: Uses hardcoded connection string (production should use env vars)
- **CORS**: Currently set to allow all origins (restrict in production)
- **Authentication**: Telegram-based auth (demo mode available)

## 📱 Mobile Usage

Market Oracle is optimized for:
- Telegram Mini Apps
- Mobile browsers
- PWA support (coming soon)
- Touch-friendly interface
- Swipeable cards

## 🆘 Troubleshooting

### Frontend won't load
```bash
pm2 restart market-oracle-frontend
pm2 logs market-oracle-frontend --nostream
```

### Backend API errors
```bash
pm2 restart market-oracle-backend
curl http://localhost:3001/
```

### MongoDB connection failed
- Check logs: `pm2 logs market-oracle-backend --nostream`
- Backend will retry every 5 seconds
- In-memory fallback mode available

### Ports already in use
```bash
fuser -k 3000/tcp
fuser -k 3001/tcp
pm2 delete all
pm2 start ecosystem.config.cjs
```

## 📞 Need Help?

1. Check README.md for full documentation
2. Review PM2 logs: `pm2 logs --nostream`
3. Test API health: `curl http://localhost:3001/`
4. Verify services: `pm2 list`

## 🎯 Next Steps

1. ✅ Set up your Gemini API key
2. ✅ Explore all 14+ features
3. ✅ Check your analytics dashboard
4. ✅ Save your favorite searches
5. ✅ Track your activity history
6. 🔜 Earn achievements
7. 🔜 Build your streak
8. 🔜 Reach the leaderboard

---

**Happy Exploring! 🔮**

For detailed documentation, see [README.md](README.md)
