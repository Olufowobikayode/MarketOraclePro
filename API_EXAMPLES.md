# 🔌 Market Oracle API - Testing Examples

## Base URLs
- **Local Backend**: http://localhost:3001/api
- **Sandbox Backend**: https://3001-ixcg2s3y44r7ean2gnsqk-ad490db5.sandbox.novita.ai/api

## 🏥 Health Check

```bash
curl http://localhost:3001/
```

**Response:**
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

## 👤 Authentication & Users

### 1. Login/Register User
```bash
curl -X POST http://localhost:3001/api/auth/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "initData": "user=%7B%22id%22%3A123456%7D"
  }'
```

**Response:**
```json
{
  "telegramId": 123456,
  "username": "demo",
  "firstName": "Demo",
  "points": 100,
  "plan": "premium",
  "loginCount": 1,
  "totalActivities": 0,
  "isNewUser": true
}
```

### 2. Get User Profile
```bash
curl http://localhost:3001/api/user/123456
```

### 3. Update User Profile
```bash
curl -X PUT http://localhost:3001/api/user/123456 \
  -H "Content-Type: application/json" \
  -d '{
    "apiKeyConnected": true,
    "email": "user@example.com"
  }'
```

### 4. Get Leaderboard
```bash
curl http://localhost:3001/api/leaderboard
```

**Response:**
```json
[
  {
    "firstName": "CryptoKing",
    "username": "cryptoking",
    "points": 2500,
    "totalActivities": 150
  }
]
```

### 5. Add Points
```bash
curl -X POST http://localhost:3001/api/points/add \
  -H "Content-Type: application/json" \
  -d '{
    "telegramId": 123456,
    "amount": 10
  }'
```

## 📝 Activity Tracking

### 6. Log Activity
```bash
curl -X POST http://localhost:3001/api/activity \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123456,
    "username": "demo",
    "activityType": "trend_analysis",
    "query": "AI trends 2024",
    "description": "Analyzed AI market trends",
    "resultCount": 25,
    "pointsUsed": 5,
    "metadata": {
      "category": "technology",
      "timeSpent": 120
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "activity": {
    "_id": "...",
    "userId": 123456,
    "activityType": "trend_analysis",
    "query": "AI trends 2024",
    "timestamp": "2024-12-17T12:30:00.000Z"
  }
}
```

### 7. Get Activity History
```bash
# Get all activities
curl "http://localhost:3001/api/activity/123456"

# With pagination
curl "http://localhost:3001/api/activity/123456?limit=10&page=1"

# Filter by type
curl "http://localhost:3001/api/activity/123456?activityType=trend_analysis"
```

**Response:**
```json
{
  "activities": [
    {
      "userId": 123456,
      "activityType": "trend_analysis",
      "query": "AI trends 2024",
      "resultCount": 25,
      "timestamp": "2024-12-17T12:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## 📚 Search History

### 8. Add to Search History
```bash
curl -X POST http://localhost:3001/api/history \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123456,
    "username": "demo",
    "category": "trends",
    "query": "AI trends 2024",
    "resultSummary": "Found 25 trending AI topics",
    "resultCount": 25,
    "tags": ["AI", "technology", "2024"]
  }'
```

### 9. Get Search History
```bash
# All history
curl "http://localhost:3001/api/history/123456"

# By category
curl "http://localhost:3001/api/history/123456?category=trends"

# With pagination
curl "http://localhost:3001/api/history/123456?limit=20&page=1"
```

## ⭐ Favorites

### 10. Add to Favorites
```bash
curl -X POST http://localhost:3001/api/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123456,
    "username": "demo",
    "category": "trends",
    "title": "AI Trends 2024 Analysis",
    "description": "Comprehensive AI market analysis",
    "content": {
      "trends": ["GenAI", "LLMs", "Edge AI"],
      "growth": 85
    },
    "query": "AI trends 2024",
    "tags": ["AI", "favorite", "important"],
    "notes": "Review quarterly"
  }'
```

### 11. Get Favorites
```bash
# All favorites
curl "http://localhost:3001/api/favorites/123456"

# By category
curl "http://localhost:3001/api/favorites/123456?category=trends"

# Exclude archived
curl "http://localhost:3001/api/favorites/123456?isArchived=false"
```

### 12. Delete Favorite
```bash
curl -X DELETE http://localhost:3001/api/favorites/FAVORITE_ID
```

## 📊 Analytics

### 13. Get User Analytics
```bash
curl "http://localhost:3001/api/analytics/123456"
```

**Response:**
```json
{
  "userId": 123456,
  "totalSearches": 150,
  "totalActivities": 200,
  "pointsSpent": 500,
  "streak": 7,
  "longestStreak": 15,
  "mostUsedCategories": [
    { "category": "trend_analysis", "count": 50 },
    { "category": "keyword_research", "count": 35 }
  ],
  "achievements": [
    {
      "name": "First Steps",
      "description": "Completed 10 activities",
      "earnedAt": "2024-12-10T10:00:00.000Z"
    },
    {
      "name": "Week Warrior",
      "description": "7-day activity streak",
      "earnedAt": "2024-12-17T12:00:00.000Z"
    }
  ],
  "weeklyActivities": 45
}
```

### 14. Get API Usage Stats
```bash
# Last 7 days (default)
curl "http://localhost:3001/api/usage/123456"

# Last 30 days
curl "http://localhost:3001/api/usage/123456?days=30"
```

**Response:**
```json
{
  "usage": [
    {
      "requestType": "generateContent",
      "model": "gemini-3-pro-preview",
      "requestDuration": 2500,
      "success": true,
      "timestamp": "2024-12-17T12:00:00.000Z"
    }
  ],
  "stats": {
    "totalRequests": 50,
    "successfulRequests": 48,
    "failedRequests": 2,
    "averageDuration": 2300,
    "modelUsage": {
      "gemini-3-pro-preview": 40,
      "gemini-2-flash": 10
    }
  }
}
```

## 🔍 Search

### 15. Search Across All Data
```bash
# Search everything
curl "http://localhost:3001/api/search/123456?q=AI&type=all"

# Search history only
curl "http://localhost:3001/api/search/123456?q=trends&type=history"

# Search favorites only
curl "http://localhost:3001/api/search/123456?q=important&type=favorites"

# Search activities only
curl "http://localhost:3001/api/search/123456?q=analysis&type=activities"
```

**Response:**
```json
{
  "history": [
    {
      "query": "AI trends 2024",
      "category": "trends",
      "timestamp": "2024-12-17T12:00:00.000Z"
    }
  ],
  "favorites": [
    {
      "title": "AI Trends Analysis",
      "category": "trends",
      "tags": ["AI", "important"]
    }
  ],
  "activities": [
    {
      "activityType": "trend_analysis",
      "query": "AI market",
      "description": "Analyzed AI trends"
    }
  ]
}
```

## 🤖 Gemini AI Integration

### 16. Generate Content (Proxy)
```bash
curl -X POST http://localhost:3001/api/gemini/generate \
  -H "Content-Type: application/json" \
  -H "x-gemini-api-key: YOUR_GEMINI_API_KEY" \
  -d '{
    "model": "gemini-3-pro-preview",
    "userId": 123456,
    "username": "demo",
    "contents": [
      {
        "role": "user",
        "parts": [{ "text": "What are the top AI trends in 2024?" }]
      }
    ],
    "config": {
      "temperature": 0.7,
      "maxOutputTokens": 1024
    }
  }'
```

**Important**: Replace `YOUR_GEMINI_API_KEY` with actual Gemini API key.

## 🧪 Complete Testing Flow

```bash
# 1. Login
USER=$(curl -s -X POST http://localhost:3001/api/auth/telegram \
  -H "Content-Type: application/json" \
  -d '{"initData":"user=%7B%22id%22%3A999%7D"}' | jq -r '.telegramId')

echo "User ID: $USER"

# 2. Log an activity
curl -s -X POST http://localhost:3001/api/activity \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": $USER,
    \"username\": \"testuser\",
    \"activityType\": \"trend_analysis\",
    \"query\": \"test query\",
    \"description\": \"Testing activity logging\"
  }" | jq

# 3. Add to history
curl -s -X POST http://localhost:3001/api/history \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": $USER,
    \"username\": \"testuser\",
    \"category\": \"trends\",
    \"query\": \"test search\",
    \"resultCount\": 10
  }" | jq

# 4. Get analytics
curl -s "http://localhost:3001/api/analytics/$USER" | jq

# 5. Get activity history
curl -s "http://localhost:3001/api/activity/$USER?limit=5" | jq
```

## 📦 Batch Operations

### Create Multiple Activities
```bash
for i in {1..5}; do
  curl -s -X POST http://localhost:3001/api/activity \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": 123456,
      \"username\": \"demo\",
      \"activityType\": \"trend_analysis\",
      \"query\": \"Test query $i\",
      \"description\": \"Batch test $i\"
    }"
  echo ""
done
```

## 🔧 Utility Scripts

### Check MongoDB Connection
```bash
curl -s http://localhost:3001/ | jq '.mongodb'
```

### Get User Stats Summary
```bash
USER_ID=123456
echo "=== User Stats ==="
echo "Profile:"
curl -s "http://localhost:3001/api/user/$USER_ID" | jq '{username, points, plan, totalActivities}'
echo -e "\nAnalytics:"
curl -s "http://localhost:3001/api/analytics/$USER_ID" | jq '{totalSearches, streak, achievements: (.achievements | length)}'
```

---

**Note**: All examples use `localhost:3001` - replace with sandbox URL for remote testing:
`https://3001-ixcg2s3y44r7ean2gnsqk-ad490db5.sandbox.novita.ai/api`
