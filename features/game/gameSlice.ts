
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameState, LeaderboardEntry } from '../../types';

const initialState: GameState = {
    points: 0,
    rank: 0,
    leaderboard: [],
    dailyLoginClaimed: false,
    referralCount: 0,
    loading: false,
    error: null,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        initializeGame(state) {
            state.loading = true;
        },
        fetchLeaderboardStart(state) {
            state.loading = true;
        },
        fetchLeaderboardSuccess(state, action: PayloadAction<LeaderboardEntry[]>) {
            state.leaderboard = action.payload;
            state.loading = false;
        },
        fetchLeaderboardFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        },
        updatePoints(state, action: PayloadAction<{ points: number; reason: string }>) {
            state.points = action.payload.points;
        },
        addPoints(state, action: PayloadAction<{ amount: number; reason: string }>) {
            // Optimistic update
            state.points += action.payload.amount;
        },
        setLeaderboard(state, action: PayloadAction<LeaderboardEntry[]>) {
            state.leaderboard = action.payload;
        },
        claimDailyLogin(state) {
            if (!state.dailyLoginClaimed) {
                state.points += 10;
                state.dailyLoginClaimed = true;
            }
        },
        watchAdComplete(state) {
            state.points += 50;
        },
        gameError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { 
    initializeGame, 
    fetchLeaderboardStart,
    fetchLeaderboardSuccess,
    fetchLeaderboardFailure,
    updatePoints, 
    addPoints, 
    setLeaderboard, 
    claimDailyLogin, 
    watchAdComplete, 
    gameError 
} = gameSlice.actions;
export default gameSlice.reducer;
