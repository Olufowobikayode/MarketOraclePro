
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

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
    }
};
