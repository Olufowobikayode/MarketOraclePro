# 🔮 Market Oracle - AI-Powered Market Intelligence Platform

<div align="center">
<img src="https://img.shields.io/badge/Status-Active-success" alt="Status" />
<img src="https://img.shields.io/badge/Version-2.0-blue" alt="Version" />
<img src="https://img.shields.io/badge/MongoDB-Atlas-green" alt="MongoDB" />
<img src="https://img.shields.io/badge/AI-Gemini_Pro-orange" alt="AI" />
</div>

## 📋 Project Overview

**Market Oracle** is a sophisticated mobile-first market intelligence and strategic assistant that combines trend analysis, keyword research, e-commerce insights, content strategy, and AI-powered Q&A into a highly interactive, card-driven application with advanced data tracking and analytics.

### 🎯 Key Features

#### **Core Intelligence Features**
- 📈 **Trend Analysis** - Real-time market trend tracking and forecasting
- 🔑 **Keyword Research** - SEO-optimized keyword intelligence and suggestions
- 🛍️ **Marketplace Finder** - E-commerce platform discovery and analysis
- 📝 **Content Strategy** - AI-driven content planning and optimization
- 📱 **Social Media Intelligence** - Social platform analytics and insights
- ✍️ **Copywriting Assistant** - AI-powered marketing copy generation
- ❓ **Q&A Oracle** - Intelligent question-answering system
- 🔍 **Product Finder** - Smart product research and recommendations
- 🎯 **Competitor Analysis** - Deep competitive intelligence gathering
- 📊 **Scenario Planner** - Strategic business scenario modeling
- 🎨 **Media Generation** - AI-powered visual content creation
- 💡 **Venture Ideas** - Business opportunity discovery and validation
- 💰 **Arbitrage Finder** - Price differential identification
- 👥 **Lead Generation** - Targeted prospect discovery

#### **Enhanced Backend Features (v2.0)**

✨ **Activity Tracking System**
- Logs all user actions across the platform
- Tracks query performance and result counts
- Records points usage and metadata
- Provides detailed activity history with pagination

📚 **Search History Management**
- Saves all searches with categories and tags
- Stores query parameters and result summaries
- Enables quick access to previous searches
- Supports filtering by category and date

⭐ **Favorites System**
- Save important searches and results
- Add custom notes and tags to favorites
- Archive/unarchive functionality
- Full-text search across saved items

📊 **Advanced Analytics**
- User engagement metrics and statistics
- Activity streaks and achievements
- Most-used categories tracking
- Top search terms analysis
- Weekly and monthly active time tracking
- Personalized achievement system

🔌 **API Usage Tracking**
- Monitors Gemini API requests per user
- Tracks token usage and request duration
- Success/failure rate analytics
- Model usage distribution stats

🔐 **Enhanced User Management**
- Comprehensive user profiles
- Points and referral systems
- Plan tiers (Free/Premium/Enterprise)
- Login tracking and daily bonuses
- API key connection status

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: MongoDB Atlas (Cloud)
- **AI Engine**: Google Gemini Pro (User-provided API key)
- **State Management**: Redux Toolkit + Redux Saga
- **Process Manager**: PM2

### Database Schema

```javascript
// Users Collection
{
  telegramId: Number,
  username: String,
  firstName: String,
  points: Number,
  plan: String,
  apiKeyConnected: Boolean,
  lastLogin: Date,
  totalActivities: Number,
  favoriteCount: Number,
  referrals: [Number]
}

// Activities Collection
{
  userId: Number,
  activityType: String,
  query: String,
  description: String,
  resultCount: Number,
  pointsUsed: Number,
  metadata: Object,
  timestamp: Date
}

// SearchHistory Collection
{
  userId: Number,
  category: String,
  query: String,
  resultSummary: String,
  resultCount: Number,
  tags: [String],
  timestamp: Date
}

// Favorites Collection
{
  userId: Number,
  category: String,
  title: String,
  content: Object,
  notes: String,
  isArchived: Boolean,
  timestamp: Date
}

// Analytics Collection
{
  userId: Number,
  totalSearches: Number,
  totalActivities: Number,
  pointsSpent: Number,
  streak: Number,
  longestStreak: Number,
  achievements: [Object],
  mostUsedCategories: [Object]
}
```

## 🚀 Live Deployment

### Current URLs
- **Frontend**: https://3000-ixcg2s3y44r7ean2gnsqk-ad490db5.sandbox.novita.ai
- **Backend API**: https://3001-ixcg2s3y44r7ean2gnsqk-ad490db5.sandbox.novita.ai
- **API Health**: https://3001-ixcg2s3y44r7ean2gnsqk-ad490db5.sandbox.novita.ai/

### API Status
```json
{
  "status": "online",
  "service": "Market Oracle Backend",
  "version": "2.0",
  "mongodb": "connected",
  "features": [
    "User Management",
    "Activity Tracking",
    "Search History",
    "Favorites",
    "Analytics",
    "API Usage Tracking"
  ]
}
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (for production)
- Google Gemini API key (users provide their own)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd webapp
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Configure environment variables**
Create `.env.local` in the root directory:
```env
# Backend MongoDB connection
MONGODB_URI=mongodb+srv://marketoracle:OracleSecure2024@cluster0.mongodb.net/marketoracle?retryWrites=true&w=majority

# Server configuration
PORT=3001
NODE_ENV=development

# Frontend API URL
VITE_API_URL=http://localhost:3001/api

# Note: Users provide their own Gemini API key in the app
```

5. **Start services with PM2**
```bash
# Clean up any existing processes
pm2 delete all

# Start both frontend and backend
pm2 start ecosystem.config.cjs

# Check status
pm2 list

# View logs
pm2 logs --nostream
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/

### PM2 Commands

```bash
# List all processes
pm2 list

# Check logs (non-blocking)
pm2 logs --nostream

# Check specific service logs
pm2 logs market-oracle-backend --nostream
pm2 logs market-oracle-frontend --nostream

# Restart services
pm2 restart market-oracle-backend
pm2 restart market-oracle-frontend

# Stop services
pm2 stop all

# Delete services
pm2 delete all
```

## 📡 API Endpoints

### Authentication & Users
- `POST /api/auth/telegram` - Authenticate user via Telegram
- `GET /api/user/:userId` - Get user profile
- `PUT /api/user/:userId` - Update user profile
- `GET /api/leaderboard` - Get top users by points
- `POST /api/points/add` - Add/subtract points

### Activity Tracking
- `POST /api/activity` - Log user activity
- `GET /api/activity/:userId` - Get activity history (paginated)

### Search History
- `POST /api/history` - Add to search history
- `GET /api/history/:userId` - Get search history (paginated, filterable)

### Favorites
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites/:userId` - Get favorites (paginated, filterable)
- `DELETE /api/favorites/:favoriteId` - Delete favorite

### Analytics
- `GET /api/analytics/:userId` - Get user analytics and stats
- `GET /api/usage/:userId` - Get API usage statistics

### AI Integration
- `POST /api/gemini/generate` - Proxy for Gemini API (requires x-gemini-api-key header)

### Search
- `GET /api/search/:userId` - Search across history, favorites, and activities

### Example API Request

```javascript
// Log an activity
const response = await fetch('http://localhost:3001/api/activity', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 123456,
    username: 'john_doe',
    activityType: 'trend_analysis',
    query: 'AI trends 2024',
    description: 'Analyzed AI market trends',
    resultCount: 25,
    pointsUsed: 5,
    metadata: { category: 'technology' }
  })
});

// Get user analytics
const analytics = await fetch('http://localhost:3001/api/analytics/123456');
const data = await analytics.json();
console.log(data.streak); // Current activity streak
console.log(data.achievements); // Earned achievements
```

## 🔐 Security & API Keys

### User-Provided Gemini API Keys
**IMPORTANT**: Users must provide their own Google Gemini API key to use AI features.

1. **Get a Gemini API key**: https://aistudio.google.com/app/apikey
2. **Enter in Settings**: Users input their key in the app's Settings modal
3. **Secure transmission**: Key is sent via `x-gemini-api-key` header (never stored in backend)

### MongoDB Atlas Connection
- Backend uses hardcoded MongoDB Atlas URI
- Connection string includes credentials and database name
- Automatic retry logic if connection fails
- Supports both connected and in-memory fallback modes

## 📊 Data Models & Features

### Activity Types
```javascript
[
  'trend_analysis', 'keyword_research', 'marketplace_finder',
  'content_strategy', 'social_media', 'copywriting',
  'qna_oracle', 'product_finder', 'competitor_analysis',
  'scenario_planner', 'media_generation', 'venture_ideas',
  'arbitrage_finder', 'lead_generation', 'login', 'api_key_update'
]
```

### Search Categories
```javascript
[
  'trends', 'keywords', 'marketplaces', 'content',
  'social', 'copywriting', 'qna', 'products',
  'competitors', 'scenarios', 'media', 'ventures',
  'arbitrage', 'leads'
]
```

### Achievement System
Users earn achievements for milestones:
- **First Steps**: Complete 10 activities
- **Week Warrior**: Maintain 7-day streak
- **Century Club**: 100 searches completed
- **Power User**: 1000 total activities
- **Elite Oracle**: 30-day streak

## 🎨 User Interface

### Main Features
- **Card-driven interface** - Intuitive, swipeable cards for each feature
- **Mobile-first design** - Optimized for Telegram Mini Apps
- **Bottom navigation** - Easy access to Dashboard, History, Favorites, Analytics
- **Settings modal** - API key management and profile settings
- **Toast notifications** - Real-time feedback for user actions
- **Loading states** - Smooth loading indicators for AI operations

### Navigation Structure
```
├── Dashboard (Home)
│   ├── Trend Analysis
│   ├── Keyword Research
│   ├── Marketplace Finder
│   ├── Content Strategy
│   ├── Social Media
│   └── ... (14+ features)
├── History
│   ├── Search History
│   ├── Activity Log
│   └── Filters by Category
├── Favorites
│   ├── Saved Searches
│   ├── Bookmarked Results
│   └── Custom Notes
├── Analytics
│   ├── Usage Stats
│   ├── Streaks & Achievements
│   ├── Category Breakdown
│   └── API Usage
└── Settings
    ├── API Key Setup
    ├── Profile Management
    └── Plan Information
```

## 🔄 Development Workflow

### Making Changes

1. **Modify code**
```bash
# Frontend changes (src/, components/, features/)
# Backend changes (backend/server.js)
```

2. **Restart affected services**
```bash
# Frontend only
pm2 restart market-oracle-frontend

# Backend only
pm2 restart market-oracle-backend

# Both
pm2 restart all
```

3. **Check logs for errors**
```bash
pm2 logs --nostream
```

4. **Commit changes**
```bash
git add .
git commit -m "feat: your feature description"
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB connection in logs
pm2 logs market-oracle-backend --nostream

# Backend will retry connection every 5 seconds
# Verify MONGODB_URI in .env.local is correct
```

### Port Already in Use
```bash
# Kill processes on ports
fuser -k 3000/tcp  # Frontend
fuser -k 3001/tcp  # Backend

# Or delete all PM2 processes
pm2 delete all
```

### Frontend Not Loading
```bash
# Check if Vite is running
pm2 logs market-oracle-frontend --nostream

# Restart frontend
pm2 restart market-oracle-frontend
```

### API Requests Failing
```bash
# Verify backend is running
curl http://localhost:3001/

# Check CORS settings if external access
# Update VITE_API_URL in .env.local if needed
```

## 📈 Performance & Optimization

### Current Status
- ✅ Frontend: Vite dev server with HMR
- ✅ Backend: Express with MongoDB Atlas
- ✅ Database: Cloud-hosted (low latency)
- ✅ AI: User-provided API keys (no backend costs)

### Optimization Strategies
- **Pagination**: All list endpoints support limit/page params
- **Indexing**: MongoDB indexes on userId, timestamp fields
- **Caching**: Activity stats cached for recent queries
- **Lazy Loading**: Frontend components load on demand
- **API Throttling**: Gemini requests tracked per user

## 🚧 Roadmap & Future Features

### Planned Features
- [ ] Real-time notifications via WebSocket
- [ ] Export data to CSV/JSON
- [ ] Advanced data visualization with charts
- [ ] Team collaboration features
- [ ] API rate limiting per user
- [ ] Email notifications for achievements
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Voice input for queries

### Backend Enhancements
- [ ] Redis caching layer
- [ ] GraphQL API option
- [ ] Webhook support for integrations
- [ ] Data backup and export
- [ ] Advanced analytics dashboard
- [ ] Machine learning recommendations

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

Currently, this is a private project. For questions or suggestions, contact the development team.

## 📞 Support

For technical support or feature requests:
- Check the logs: `pm2 logs --nostream`
- Review API documentation above
- Contact: support@marketoracle.ai

---

**Last Updated**: December 17, 2025  
**Version**: 2.0  
**Status**: ✅ Active (Production Ready)

Built with ❤️ using React, Express, MongoDB Atlas, and Google Gemini AI
