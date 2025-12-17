
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { HistoryState, SavedSession, RootState } from '../../types';
import { setStoreAnalysisData } from '../storeAnalysis/storeAnalysisSlice';
import { setProductResults } from '../productFinder/productFinderSlice';
import { setLeadsData } from '../leads/leadsSlice';

// Load initial history from localStorage
const loadHistory = (): SavedSession[] => {
    try {
        const stored = localStorage.getItem('oracle_history');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

const initialState: HistoryState = {
    sessions: loadHistory(),
    loading: false,
    error: null,
};

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        saveSession(state, action: PayloadAction<RootState>) {
            const rootState = action.payload;
            const sessionData = rootState.oracleSession;
            
            if (!sessionData.niche) return; // Don't save empty sessions

            // Check if a session with this niche already exists to update it, or create new
            const existingIndex = state.sessions.findIndex(s => s.oracleSession.niche === sessionData.niche);
            
            const newSession: SavedSession = {
                id: existingIndex >= 0 ? state.sessions[existingIndex].id : `session-${Date.now()}`,
                createdAt: existingIndex >= 0 ? state.sessions[existingIndex].createdAt : new Date().toISOString(),
                lastModified: new Date().toISOString(),
                oracleSession: sessionData,
                data: {
                    trends: rootState.trends.data,
                    keywords: rootState.keywords.data,
                    marketplaces: rootState.marketplaces.data,
                    content: rootState.content.data,
                    socials: rootState.socials.data,
                    copy: rootState.copy.data,
                    arbitrage: rootState.arbitrage.data,
                    scenarios: rootState.scenarios.data,
                    ventures: {
                        visions: rootState.ventures.visions,
                        blueprint: rootState.ventures.blueprint
                    },
                    storeAnalysis: rootState.storeAnalysis.data,
                    productFinder: rootState.productFinder.results,
                    leads: rootState.leads.emails
                }
            };

            if (existingIndex >= 0) {
                state.sessions[existingIndex] = newSession;
            } else {
                state.sessions.unshift(newSession);
            }

            localStorage.setItem('oracle_history', JSON.stringify(state.sessions));
        },
        deleteSession(state, action: PayloadAction<string>) {
            state.sessions = state.sessions.filter(s => s.id !== action.payload);
            localStorage.setItem('oracle_history', JSON.stringify(state.sessions));
        },
        clearHistory(state) {
            state.sessions = [];
            localStorage.removeItem('oracle_history');
        }
    }
});

export const { saveSession, deleteSession, clearHistory } = historySlice.actions;
export default historySlice.reducer;
