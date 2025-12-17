
// backend/server.js
// RUN: npm install
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Robust CORS setup
app.use(cors({
    origin: '*', // Allow all origins for development flexibility
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key']
}));

app.use(express.json({ limit: '10mb' }));

// --- IN-MEMORY DATABASE (Fallback) ---
const memoryUsers = [];
let isMongoConnected = false;

// --- MONGODB CONNECTION WITH RETRY ---
const connectWithRetry = () => {
    if (!process.env.MONGODB_URI) {
        console.warn('⚠️ MONGODB_URI not set. Server running in MEMORY-ONLY mode.');
        return;
    }

    mongoose.connect(process.env.MONGODB_URI)
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

// --- USER SCHEMA ---
const userSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true, unique: true },
    username: String,
    firstName: String,
    points: { type: Number, default: 100 },
    plan: { type: String, default: 'premium' },
    lastLogin: Date,
    referrals: [Number]
});

let User;
try {
    User = mongoose.model('User');
} catch {
    User = mongoose.model('User', userSchema);
}

// --- TELEGRAM VALIDATION ---
const verifyTelegramWebAppData = (telegramInitData) => {
    if (!process.env.BOT_TOKEN) return true;

    const urlParams = new URLSearchParams(telegramInitData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    urlParams.sort();

    let dataCheckString = '';
    for (const [key, value] of urlParams.entries()) {
        dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calculatedHash === hash;
};

// --- HELPER: GET USER ---
const findUser = async (telegramId) => {
    if (isMongoConnected) {
        try {
            return await User.findOne({ telegramId });
        } catch (e) {
            console.error("Mongo Find Error:", e);
            return null;
        }
    } else {
        return memoryUsers.find(u => u.telegramId === telegramId);
    }
};

const createUser = async (userData) => {
    const newUserObj = {
        telegramId: userData.id,
        username: userData.username,
        firstName: userData.first_name,
        points: 100,
        plan: 'premium',
        lastLogin: new Date(),
        referrals: []
    };

    if (isMongoConnected) {
        try {
            const userDocs = new User(newUserObj);
            return await userDocs.save();
        } catch (e) {
            console.error("Mongo Save Error, falling back to memory:", e);
            memoryUsers.push(newUserObj);
            return newUserObj;
        }
    } else {
        memoryUsers.push(newUserObj);
        return newUserObj;
    }
};

const updateUserPoints = async (telegramId, amount) => {
    if (isMongoConnected) {
        try {
            await User.findOneAndUpdate({ telegramId }, { $inc: { points: amount } });
        } catch (e) {
            console.error("Mongo Update Error:", e);
        }
    } else {
        const user = memoryUsers.find(u => u.telegramId === telegramId);
        if (user) user.points += amount;
    }
};

// --- ROUTES ---

// Health Check
app.get('/', (req, res) => res.send('Market Oracle Backend Online'));

// 1. Auth / Login
app.post('/api/auth/telegram', async (req, res) => {
    const { initData } = req.body;
    
    if (process.env.BOT_TOKEN && !verifyTelegramWebAppData(initData)) {
        return res.status(403).json({ error: 'Invalid hash' });
    }

    try {
        const urlParams = new URLSearchParams(initData);
        const userString = urlParams.get('user');
        
        if (!userString) {
             return res.json({
                id: 'god-mode-user',
                firstName: 'Oracle Seeker',
                username: 'seeker',
                points: 9999,
                plan: 'premium',
                isNewUser: false
             });
        }

        const userData = JSON.parse(userString);
        let user = await findUser(userData.id);
        let isNewUser = false;
        
        if (!user) {
            user = await createUser(userData);
            isNewUser = true;
        } else {
            const today = new Date().toDateString();
            const last = user.lastLogin ? new Date(user.lastLogin).toDateString() : null;
            
            if (today !== last) {
                user.points = (user.points || 0) + 10;
                user.lastLogin = new Date();
                if (isMongoConnected) {
                    try {
                        await user.save();
                    } catch(e) { /* ignore */ }
                }
            }
        }

        const userObj = user.toObject ? user.toObject() : user;
        res.json({ ...userObj, isNewUser });

    } catch (error) {
        console.error("Auth Error:", error);
        res.json({
            id: 'fallback-user',
            firstName: 'Traveler',
            username: 'traveler',
            points: 100,
            plan: 'premium',
            isNewUser: false
        });
    }
});

// 2. Leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        let topUsers;
        if (isMongoConnected) {
            try {
                topUsers = await User.find().sort({ points: -1 }).limit(10).select('firstName points');
            } catch (e) {
                topUsers = [];
            }
        } else {
            const mockGods = [
                { firstName: "CryptoKing", points: 2500 },
                { firstName: "AlphaWolf", points: 1800 },
                { firstName: "Satoshi", points: 1500 },
            ];
            topUsers = [...memoryUsers, ...mockGods]
                .sort((a, b) => b.points - a.points)
                .slice(0, 10);
        }
        res.json(topUsers);
    } catch (error) {
        res.json([]);
    }
});

// 3. Add Points
app.post('/api/points/add', async (req, res) => {
    const { telegramId, amount } = req.body;
    await updateUserPoints(telegramId, amount);
    res.json({ success: true });
});

// 4. GEMINI PROXY (Logic moved to Backend)
app.post('/api/gemini/generate', async (req, res) => {
    // Extract the User's API Key from the header
    const userApiKey = req.headers['x-gemini-api-key'];

    if (!userApiKey) {
        return res.status(401).json({ error: "No API Key provided. Please connect your key in Settings." });
    }

    const { model, contents, config } = req.body;

    try {
        // Initialize Gemini with the USER'S key, not a server env key
        const ai = new GoogleGenAI({ apiKey: userApiKey });
        
        const response = await ai.models.generateContent({
            model: model || 'gemini-3-pro-preview',
            contents,
            config
        });

        // Return the full response structure to maintain frontend compatibility
        res.json(response);

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        
        // Pass through the exact status code from Google (e.g. 429 for Quota)
        const status = error.status || error.response?.status || 500;
        const message = error.message || "Internal AI Error";
        
        res.status(status).json({ error: message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
