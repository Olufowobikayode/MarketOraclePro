
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

// Helper: Fail fast if the backend is sleeping or unreachable
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 8000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout); // timeout for backend/api
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

export const api = {
    auth: async (initData: string) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/auth/telegram`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData })
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Authentication failed');
            }
            return await res.json();
        } catch (error) {
            console.warn("API Auth Error (Falling back to local mode):", error);
            // Fallback for development/demo if backend is offline
            // Ensure plan is 'premium' so user can test all features
            return {
                id: 'offline-user',
                firstName: 'Traveler',
                username: 'traveler',
                points: 100,
                plan: 'premium',
                isNewUser: false // Assume established for offline fallback
            };
        }
    },
    validateEmailWithExternalApi: async (email: string) => {
        // Using Disify API (Free, Public)
        // Note: This API validates format, DNS, and disposable status. 
        // It does not always guarantee the inbox exists (SMTP check) due to CORS/limits on free tiers, but it's a good first pass.
        try {
            const res = await fetchWithTimeout(`https://disify.com/api/email/${email}`, {}, 5000);
            if (!res.ok) throw new Error("Validation API unavailable");
            return await res.json();
        } catch (error) {
            // console.warn("Email Validation Failed:", error);
            return null;
        }
    },
    getLeaderboard: async () => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/leaderboard`);
            if (!res.ok) throw new Error("Failed to fetch leaderboard");
            return await res.json();
        } catch (error) {
            console.warn("API Leaderboard Error:", error);
            return [];
        }
    },
    addPoints: async (telegramId: number | string, amount: number, reason: string) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/points/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramId, amount, reason })
            });
            return res.ok;
        } catch (error) {
            console.warn("API Add Points Error:", error);
            return false;
        }
    },
    
    // Enhanced API endpoints for new features
    logActivity: async (data: {
        userId: number | string;
        username: string;
        activityType: string;
        query?: string;
        description?: string;
        resultCount?: number;
        pointsUsed?: number;
        metadata?: any;
    }) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/activity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Log Activity Error:", error);
            return null;
        }
    },
    
    getActivityHistory: async (userId: number | string, params?: { limit?: number; page?: number; activityType?: string }) => {
        try {
            const queryParams = new URLSearchParams(params as any).toString();
            const res = await fetchWithTimeout(`${API_URL}/activity/${userId}?${queryParams}`);
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Get Activity History Error:", error);
            return null;
        }
    },
    
    addToHistory: async (data: {
        userId: number | string;
        username: string;
        category: string;
        query: string;
        queryParams?: any;
        resultSummary?: string;
        resultCount?: number;
        tags?: string[];
    }) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Add To History Error:", error);
            return null;
        }
    },
    
    getSearchHistory: async (userId: number | string, params?: { limit?: number; page?: number; category?: string }) => {
        try {
            const queryParams = new URLSearchParams(params as any).toString();
            const res = await fetchWithTimeout(`${API_URL}/history/${userId}?${queryParams}`);
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Get Search History Error:", error);
            return null;
        }
    },
    
    addToFavorites: async (data: {
        userId: number | string;
        username: string;
        category: string;
        title: string;
        description?: string;
        content?: any;
        query?: string;
        tags?: string[];
        notes?: string;
    }) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/favorites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Add To Favorites Error:", error);
            return null;
        }
    },
    
    getFavorites: async (userId: number | string, params?: { limit?: number; page?: number; category?: string; isArchived?: boolean }) => {
        try {
            const queryParams = new URLSearchParams(params as any).toString();
            const res = await fetchWithTimeout(`${API_URL}/favorites/${userId}?${queryParams}`);
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Get Favorites Error:", error);
            return null;
        }
    },
    
    deleteFavorite: async (favoriteId: string) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/favorites/${favoriteId}`, {
                method: 'DELETE'
            });
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Delete Favorite Error:", error);
            return null;
        }
    },
    
    getAnalytics: async (userId: number | string) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/analytics/${userId}`);
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Get Analytics Error:", error);
            return null;
        }
    },
    
    getApiUsage: async (userId: number | string, days: number = 7) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/usage/${userId}?days=${days}`);
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Get Usage Error:", error);
            return null;
        }
    },
    
    search: async (userId: number | string, query: string, type: string = 'all') => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/search/${userId}?q=${encodeURIComponent(query)}&type=${type}`);
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Search Error:", error);
            return null;
        }
    },
    
    updateUserProfile: async (userId: number | string, updates: any) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Update Profile Error:", error);
            return null;
        }
    },
    
    getUserProfile: async (userId: number | string) => {
        try {
            const res = await fetchWithTimeout(`${API_URL}/user/${userId}`);
            return res.ok ? await res.json() : null;
        } catch (error) {
            console.warn("API Get Profile Error:", error);
            return null;
        }
    }
};
