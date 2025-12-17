
// backend/server.js - Enhanced Market Oracle Backend
// Features: User management, Activity tracking, Search history, Favorites, Analytics

// Load environment variables (works for both local and Render)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');

// ✅ CORRECT IMPORT (verified with @google/genai v1.18.0+)
const { GoogleGenAI } = require('@google/genai');

// 🔒 CRITICAL VALIDATION: Ensure SDK loaded correctly
if (!GoogleGenAI || typeof GoogleGenAI !== 'function') {
    console.error('❌ CRITICAL ERROR: @google/genai SDK failed to load!');
    console.error('Please reinstall the SDK:');
    console.error('  cd backend && npm install @google/genai@latest');
    process.exit(1);
}

console.log('✅ @google/genai SDK loaded successfully');
console.log('📦 SDK Version: Supports Gemini 2.0+');

const app = express();

// Robust CORS setup - Allow frontend from any origin
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    /\.onrender\.com$/,  // Allow all Render domains
    /\.pages\.dev$/      // Allow Cloudflare Pages if needed
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Check if origin matches allowed patterns
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') return origin === allowed;
            if (allowed instanceof RegExp) return allowed.test(origin);
            return false;
        });
        
        if (isAllowed || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true); // Allow all in this case for flexibility
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key']
}));

app.use(express.json({ limit: '10mb' }));

// --- MONGODB CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI;
let isMongoConnected = false;

const connectWithRetry = () => {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI not set in environment variables. Cannot start server.');
        console.error('Please set MONGODB_URI in your .env file or environment variables.');
        process.exit(1);
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('✅ Connected to MongoDB Atlas');
            isMongoConnected = true;
        })
        .catch(err => {
            console.warn('⚠️ MongoDB connection failed. Retrying in 5 seconds...', err.message);
            isMongoConnected = false;
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

// --- DATABASE SCHEMAS ---

// User Schema with enhanced fields
const userSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true, unique: true },
    username: String,
    firstName: String,
    lastName: String,
    photoUrl: String,
    email: String,
    points: { type: Number, default: 100 },
    plan: { type: String, default: 'premium', enum: ['free', 'premium', 'enterprise'] },
    apiKeyConnected: { type: Boolean, default: false },
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    referrals: [{ type: Number }],
    referredBy: { type: Number },
    totalActivities: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Activity Log Schema - tracks all user actions
const activitySchema = new mongoose.Schema({
    userId: { type: Number, required: true, index: true },
    username: String,
    activityType: { 
        type: String, 
        required: true,
        enum: [
            'trend_analysis', 'keyword_research', 'marketplace_finder', 
            'content_strategy', 'social_media', 'copywriting', 
            'qna_oracle', 'product_finder', 'competitor_analysis',
            'scenario_planner', 'media_generation', 'venture_ideas',
            'arbitrage_finder', 'lead_generation', 'login', 'api_key_update'
        ]
    },
    query: String, // The search query or action performed
    description: String, // Detailed description of the activity
    resultCount: { type: Number, default: 0 }, // Number of results returned
    pointsUsed: { type: Number, default: 0 }, // Points consumed for this activity
    metadata: { type: mongoose.Schema.Types.Mixed }, // Flexible field for activity-specific data
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Search History Schema - stores search queries and results
const searchHistorySchema = new mongoose.Schema({
    userId: { type: Number, required: true, index: true },
    username: String,
    category: { 
        type: String, 
        required: true,
        enum: [
            'trends', 'keywords', 'marketplaces', 'content', 
            'social', 'copywriting', 'qna', 'products', 
            'competitors', 'scenarios', 'media', 'ventures',
            'arbitrage', 'leads'
        ]
    },
    query: { type: String, required: true },
    queryParams: { type: mongoose.Schema.Types.Mixed }, // Additional parameters
    resultSummary: String, // Brief summary of results
    resultCount: { type: Number, default: 0 },
    isFavorite: { type: Boolean, default: false },
    tags: [String], // User-defined tags for organization
    timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Favorites Schema - stores user's favorite searches and results
const favoriteSchema = new mongoose.Schema({
    userId: { type: Number, required: true, index: true },
    username: String,
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    content: { type: mongoose.Schema.Types.Mixed }, // Actual content saved
    query: String, // Original query that generated this
    tags: [String],
    notes: String, // User's personal notes
    isArchived: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Analytics Schema - aggregated stats and insights
const analyticsSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true, index: true },
    username: String,
    totalSearches: { type: Number, default: 0 },
    totalActivities: { type: Number, default: 0 },
    totalFavorites: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    pointsSpent: { type: Number, default: 0 },
    mostUsedCategories: [{ 
        category: String, 
        count: Number 
    }],
    topSearchTerms: [{ 
        term: String, 
        count: Number 
    }],
    lastActivityDate: Date,
    weeklyActiveTime: { type: Number, default: 0 }, // in minutes
    monthlyActiveTime: { type: Number, default: 0 }, // in minutes
    streak: { type: Number, default: 0 }, // consecutive days active
    longestStreak: { type: Number, default: 0 },
    achievements: [{
        name: String,
        description: String,
        earnedAt: Date
    }],
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// API Usage Schema - tracks Gemini API usage per user
const apiUsageSchema = new mongoose.Schema({
    userId: { type: Number, required: true, index: true },
    username: String,
    requestType: String, // e.g., 'generateContent', 'chatSession'
    model: String, // e.g., 'gemini-3-pro-preview'
    tokensUsed: { type: Number, default: 0 },
    requestDuration: { type: Number }, // milliseconds
    success: { type: Boolean, default: true },
    errorMessage: String,
    timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Create Models
const User = mongoose.model('User', userSchema);
const Activity = mongoose.model('Activity', activitySchema);
const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
const Favorite = mongoose.model('Favorite', favoriteSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);
const ApiUsage = mongoose.model('ApiUsage', apiUsageSchema);

// --- HELPER FUNCTIONS ---

// Calculate user streak
const calculateStreak = async (userId) => {
    const activities = await Activity.find({ userId })
        .sort({ timestamp: -1 })
        .limit(365)
        .select('timestamp');
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let activity of activities) {
        const activityDate = new Date(activity.timestamp);
        activityDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (daysDiff > streak) {
            break;
        }
    }
    
    return streak;
};

// Update user analytics
const updateAnalytics = async (userId, username, activityType, pointsUsed = 0) => {
    try {
        let analytics = await Analytics.findOne({ userId });
        
        if (!analytics) {
            analytics = new Analytics({ 
                userId, 
                username,
                totalActivities: 0,
                totalSearches: 0,
                pointsSpent: 0
            });
        }
        
        analytics.totalActivities += 1;
        analytics.totalSearches += 1;
        analytics.pointsSpent += pointsUsed;
        analytics.lastActivityDate = new Date();
        
        // Update most used categories
        const categoryIndex = analytics.mostUsedCategories.findIndex(
            c => c.category === activityType
        );
        
        if (categoryIndex >= 0) {
            analytics.mostUsedCategories[categoryIndex].count += 1;
        } else {
            analytics.mostUsedCategories.push({ category: activityType, count: 1 });
        }
        
        // Sort and keep top 10
        analytics.mostUsedCategories.sort((a, b) => b.count - a.count);
        analytics.mostUsedCategories = analytics.mostUsedCategories.slice(0, 10);
        
        // Calculate streak
        const streak = await calculateStreak(userId);
        analytics.streak = streak;
        if (streak > analytics.longestStreak) {
            analytics.longestStreak = streak;
        }
        
        // Check for achievements
        if (analytics.totalActivities === 10 && !analytics.achievements.find(a => a.name === 'First Steps')) {
            analytics.achievements.push({
                name: 'First Steps',
                description: 'Completed 10 activities',
                earnedAt: new Date()
            });
        }
        
        if (analytics.streak === 7 && !analytics.achievements.find(a => a.name === 'Week Warrior')) {
            analytics.achievements.push({
                name: 'Week Warrior',
                description: '7-day activity streak',
                earnedAt: new Date()
            });
        }
        
        await analytics.save();
        return analytics;
    } catch (error) {
        console.error('Error updating analytics:', error);
    }
};

// --- ROUTES ---

// Health Check
app.get('/', (req, res) => {
    res.json({ 
        status: 'online',
        service: 'Market Oracle Backend',
        version: '2.0',
        mongodb: isMongoConnected ? 'connected' : 'disconnected',
        features: [
            'User Management',
            'Activity Tracking',
            'Search History',
            'Favorites',
            'Analytics',
            'API Usage Tracking'
        ]
    });
});

// 1. Auth / Login
app.post('/api/auth/telegram', async (req, res) => {
    try {
        const { initData } = req.body;
        
        // Parse user data from Telegram initData
        let userData = { id: 'demo-user', first_name: 'Demo', username: 'demo' };
        
        if (initData) {
            try {
                const urlParams = new URLSearchParams(initData);
                const userString = urlParams.get('user');
                if (userString) {
                    userData = JSON.parse(userString);
                }
            } catch (e) {
                console.log('Using demo user data');
            }
        }
        
        let user = await User.findOne({ telegramId: userData.id });
        let isNewUser = false;
        
        if (!user) {
            user = new User({
                telegramId: userData.id,
                username: userData.username || 'user',
                firstName: userData.first_name || 'User',
                lastName: userData.last_name,
                photoUrl: userData.photo_url,
                points: 100,
                plan: 'premium',
                loginCount: 1,
                lastLogin: new Date()
            });
            await user.save();
            isNewUser = true;
            
            // Create analytics entry
            await new Analytics({ 
                userId: user.telegramId, 
                username: user.username 
            }).save();
            
            // Log activity
            await new Activity({
                userId: user.telegramId,
                username: user.username,
                activityType: 'login',
                description: 'First login - Welcome to Market Oracle!',
                timestamp: new Date()
            }).save();
        } else {
            // Update existing user
            const today = new Date().toDateString();
            const last = user.lastLogin ? new Date(user.lastLogin).toDateString() : null;
            
            if (today !== last) {
                user.points = (user.points || 0) + 10; // Daily login bonus
                user.loginCount += 1;
                user.lastLogin = new Date();
                await user.save();
                
                // Log daily login activity
                await new Activity({
                    userId: user.telegramId,
                    username: user.username,
                    activityType: 'login',
                    description: 'Daily login - +10 points',
                    pointsUsed: -10,
                    timestamp: new Date()
                }).save();
            }
        }
        
        const userObj = user.toObject();
        res.json({ ...userObj, isNewUser });
        
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// 2. Get User Profile
app.get('/api/user/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ telegramId: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Update User Profile
app.put('/api/user/:userId', async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findOneAndUpdate(
            { telegramId: req.params.userId },
            { ...updates, updatedAt: new Date() },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Log Activity
app.post('/api/activity', async (req, res) => {
    try {
        const { userId, username, activityType, query, description, resultCount, pointsUsed, metadata } = req.body;
        
        const activity = new Activity({
            userId,
            username,
            activityType,
            query,
            description,
            resultCount: resultCount || 0,
            pointsUsed: pointsUsed || 0,
            metadata: metadata || {},
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date()
        });
        
        await activity.save();
        
        // Update user total activities
        await User.findOneAndUpdate(
            { telegramId: userId },
            { $inc: { totalActivities: 1 } }
        );
        
        // Update analytics
        await updateAnalytics(userId, username, activityType, pointsUsed);
        
        res.json({ success: true, activity });
    } catch (error) {
        console.error('Activity logging error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 5. Get Activity History
app.get('/api/activity/:userId', async (req, res) => {
    try {
        const { limit = 50, page = 1, activityType } = req.query;
        const query = { userId: req.params.userId };
        
        if (activityType) {
            query.activityType = activityType;
        }
        
        const activities = await Activity.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Activity.countDocuments(query);
        
        res.json({
            activities,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Add to Search History
app.post('/api/history', async (req, res) => {
    try {
        const { userId, username, category, query, queryParams, resultSummary, resultCount, tags } = req.body;
        
        const history = new SearchHistory({
            userId,
            username,
            category,
            query,
            queryParams: queryParams || {},
            resultSummary: resultSummary || '',
            resultCount: resultCount || 0,
            tags: tags || [],
            timestamp: new Date()
        });
        
        await history.save();
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. Get Search History
app.get('/api/history/:userId', async (req, res) => {
    try {
        const { limit = 50, page = 1, category } = req.query;
        const query = { userId: req.params.userId };
        
        if (category) {
            query.category = category;
        }
        
        const history = await SearchHistory.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await SearchHistory.countDocuments(query);
        
        res.json({
            history,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 8. Add to Favorites
app.post('/api/favorites', async (req, res) => {
    try {
        const { userId, username, category, title, description, content, query, tags, notes } = req.body;
        
        const favorite = new Favorite({
            userId,
            username,
            category,
            title,
            description: description || '',
            content: content || {},
            query: query || '',
            tags: tags || [],
            notes: notes || '',
            timestamp: new Date()
        });
        
        await favorite.save();
        
        // Update user favorite count
        await User.findOneAndUpdate(
            { telegramId: userId },
            { $inc: { favoriteCount: 1 } }
        );
        
        res.json({ success: true, favorite });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 9. Get Favorites
app.get('/api/favorites/:userId', async (req, res) => {
    try {
        const { limit = 50, page = 1, category, isArchived } = req.query;
        const query = { userId: req.params.userId };
        
        if (category) {
            query.category = category;
        }
        
        if (isArchived !== undefined) {
            query.isArchived = isArchived === 'true';
        }
        
        const favorites = await Favorite.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Favorite.countDocuments(query);
        
        res.json({
            favorites,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 10. Delete Favorite
app.delete('/api/favorites/:favoriteId', async (req, res) => {
    try {
        const favorite = await Favorite.findByIdAndDelete(req.params.favoriteId);
        
        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }
        
        // Update user favorite count
        await User.findOneAndUpdate(
            { telegramId: favorite.userId },
            { $inc: { favoriteCount: -1 } }
        );
        
        res.json({ success: true, message: 'Favorite deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 11. Get Analytics
app.get('/api/analytics/:userId', async (req, res) => {
    try {
        let analytics = await Analytics.findOne({ userId: req.params.userId });
        
        if (!analytics) {
            const user = await User.findOne({ telegramId: req.params.userId });
            analytics = new Analytics({ 
                userId: req.params.userId, 
                username: user?.username || 'user' 
            });
            await analytics.save();
        }
        
        // Get recent activity stats
        const recentActivities = await Activity.find({ 
            userId: req.params.userId,
            timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });
        
        const categoryStats = {};
        recentActivities.forEach(activity => {
            categoryStats[activity.activityType] = (categoryStats[activity.activityType] || 0) + 1;
        });
        
        res.json({
            ...analytics.toObject(),
            recentActivityStats: categoryStats,
            weeklyActivities: recentActivities.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 12. Leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ points: -1 })
            .limit(10)
            .select('firstName username points plan totalActivities loginCount');
        
        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 13. Add Points
app.post('/api/points/add', async (req, res) => {
    try {
        const { telegramId, amount } = req.body;
        
        const user = await User.findOneAndUpdate(
            { telegramId },
            { $inc: { points: amount } },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update analytics
        await Analytics.findOneAndUpdate(
            { userId: telegramId },
            { $inc: { pointsEarned: amount > 0 ? amount : 0 } }
        );
        
        res.json({ success: true, newPoints: user.points });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 14. GEMINI PROXY (User provides their own API key)
app.post('/api/gemini/generate', async (req, res) => {
    const userApiKey = req.headers['x-gemini-api-key'];
    
    console.log('📨 Gemini API Request received');
    console.log('🔑 API Key present:', !!userApiKey);
    console.log('📦 Request body keys:', Object.keys(req.body));
    
    // VALIDATION: Require user API key
    if (!userApiKey || typeof userApiKey !== 'string' || userApiKey.trim() === '') {
        console.error('❌ No API Key in request headers');
        return res.status(401).json({ 
            error: "No API Key provided",
            message: "Please connect your Gemini API key in Settings.",
            action: "connect_key",
            link: "https://aistudio.google.com/apikey"
        });
    }
    
    const { model, contents, config } = req.body;
    const startTime = Date.now();
    
    try {
        console.log('🤖 Initializing Gemini AI with model:', model || 'gemini-3-pro-preview');
        
        // 🔒 SECURITY: Validate SDK constructor exists (prevent fallback)
        if (typeof GoogleGenAI !== 'function') {
            throw new Error('GoogleGenAI constructor is not available. SDK misconfigured.');
        }
        
        // 🔒 SECURITY: Initialize with ONLY user-provided API key
        // NEVER fallback to process.env or global credentials
        const ai = new GoogleGenAI({ 
            apiKey: userApiKey.trim()  // ✅ Use ONLY user key
        });
        
        // 🔒 VALIDATION: Ensure instance created successfully
        if (!ai || !ai.models) {
            throw new Error('Failed to initialize Gemini AI instance.');
        }
        
        // 🔍 DEBUG: Log key prefix for verification (first 10 chars only)
        console.log('🔑 Using key prefix:', userApiKey.substring(0, 10) + '...');
        console.log('🚀 Sending request to Gemini API...');
        
        const response = await ai.models.generateContent({
            model: model || 'gemini-3-pro-preview',
            contents,
            config
        });
        
        const duration = Date.now() - startTime;
        console.log(`✅ Gemini API success in ${duration}ms`);
        
        // Log API usage
        const userId = req.body.userId || 'unknown';
        const username = req.body.username || 'unknown';
        
        if (isMongoConnected) {
            try {
                await new ApiUsage({
                    userId,
                    username,
                    requestType: 'generateContent',
                    model: model || 'gemini-3-pro-preview',
                    requestDuration: duration,
                    success: true,
                    timestamp: new Date()
                }).save();
            } catch (dbError) {
                console.warn('⚠️ Failed to log API usage to MongoDB:', dbError.message);
            }
        }
        
        res.json(response);
        
    } catch (error) {
        console.error('❌ Gemini API Error:', error.message);
        console.error('Error details:', error);
        
        const duration = Date.now() - startTime;
        const userId = req.body.userId || 'unknown';
        const username = req.body.username || 'unknown';
        
        // Log failed API usage (error message only, no key)
        if (isMongoConnected) {
            try {
                await new ApiUsage({
                    userId,
                    username,
                    requestType: 'generateContent',
                    model: model || 'gemini-3-pro-preview',
                    requestDuration: duration,
                    success: false,
                    errorMessage: error.message,
                    timestamp: new Date()
                }).save();
            } catch (dbError) {
                console.warn('⚠️ Failed to log API usage to MongoDB:', dbError.message);
            }
        }
        
        // 🔒 USER-FRIENDLY ERROR HANDLING
        const errorMessage = error.message?.toLowerCase() || '';
        
        // Quota Exceeded (429)
        if (errorMessage.includes('quota') || errorMessage.includes('429') || error.status === 429) {
            return res.status(429).json({
                error: "Quota Exceeded",
                message: "Your Gemini API key has run out of quota.\n\n" +
                    "This means:\n" +
                    "• Your API key reached its monthly limit\n" +
                    "• Free tier: 15 requests/min, ~1500/month\n" +
                    "• You may need to enable billing\n\n" +
                    "How to fix:\n" +
                    "1. Visit Google AI Studio\n" +
                    "2. Check your quota usage\n" +
                    "3. Enable billing for higher limits\n\n" +
                    "Note: This is YOUR API key's quota, not an app issue.",
                action: "check_quota",
                link: "https://aistudio.google.com/apikey"
            });
        }
        
        // Invalid API Key (400/401)
        if (errorMessage.includes('invalid') || errorMessage.includes('api key') || 
            errorMessage.includes('400') || errorMessage.includes('401') ||
            error.status === 400 || error.status === 401) {
            return res.status(401).json({
                error: "Invalid API Key",
                message: "The API key you provided is not recognized by Google.\n\n" +
                    "Please check:\n" +
                    "• Key is copied correctly (no extra spaces)\n" +
                    "• Key is from Google AI Studio\n" +
                    "• Key hasn't been deleted\n\n" +
                    "Try reconnecting your API key in Settings.",
                action: "reconnect_key",
                link: "https://aistudio.google.com/apikey"
            });
        }
        
        // Generic Error
        const status = error.status || error.response?.status || 500;
        res.status(status).json({ 
            error: error.message || 'Internal AI Error',
            message: 'Something went wrong. Please try again in a moment.'
        });
    }
});

// 15. Get API Usage Stats
app.get('/api/usage/:userId', async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
        
        const usage = await ApiUsage.find({
            userId: req.params.userId,
            timestamp: { $gte: startDate }
        }).sort({ timestamp: -1 });
        
        const stats = {
            totalRequests: usage.length,
            successfulRequests: usage.filter(u => u.success).length,
            failedRequests: usage.filter(u => !u.success).length,
            averageDuration: usage.reduce((sum, u) => sum + (u.requestDuration || 0), 0) / usage.length,
            modelUsage: {}
        };
        
        usage.forEach(u => {
            stats.modelUsage[u.model] = (stats.modelUsage[u.model] || 0) + 1;
        });
        
        res.json({ usage, stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 16. Search across all user data
app.get('/api/search/:userId', async (req, res) => {
    try {
        const { q, type = 'all' } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Search query required' });
        }
        
        const searchRegex = new RegExp(q, 'i');
        const results = {};
        
        if (type === 'all' || type === 'history') {
            results.history = await SearchHistory.find({
                userId: req.params.userId,
                $or: [
                    { query: searchRegex },
                    { resultSummary: searchRegex },
                    { tags: searchRegex }
                ]
            }).limit(20).sort({ timestamp: -1 });
        }
        
        if (type === 'all' || type === 'favorites') {
            results.favorites = await Favorite.find({
                userId: req.params.userId,
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { query: searchRegex },
                    { tags: searchRegex },
                    { notes: searchRegex }
                ]
            }).limit(20).sort({ timestamp: -1 });
        }
        
        if (type === 'all' || type === 'activities') {
            results.activities = await Activity.find({
                userId: req.params.userId,
                $or: [
                    { query: searchRegex },
                    { description: searchRegex }
                ]
            }).limit(20).sort({ timestamp: -1 });
        }
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`🚀 Market Oracle Backend running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 MongoDB: ${isMongoConnected ? 'Connected' : 'Connecting...'}`);
    console.log(`🔑 API Key: User-provided (via x-gemini-api-key header)`);
});
