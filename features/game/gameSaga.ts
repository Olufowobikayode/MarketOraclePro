
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { 
    initializeGame, 
    fetchLeaderboardSuccess, 
    fetchLeaderboardFailure, 
    addPoints,
    fetchLeaderboardStart
} from './gameSlice';
import { api } from '../../services/api';
import type { RootState, LeaderboardEntry } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

function* handleInitializeGame(): Generator {
    try {
        yield put(fetchLeaderboardStart());
        const leaderboard = yield call(api.getLeaderboard);
        yield put(fetchLeaderboardSuccess(leaderboard as LeaderboardEntry[]));
    } catch (error: any) {
        yield put(fetchLeaderboardFailure(error.message));
    }
}

function* handleAddPoints(action: PayloadAction<{ amount: number; reason: string }>): Generator {
    try {
        const user = (yield select((state: RootState) => state.auth.user)) as any;
        if (user && user.telegramId) {
            yield call(api.addPoints, user.telegramId, action.payload.amount, action.payload.reason);
        }
    } catch (error) {
        console.error("Failed to sync points:", error);
    }
}

function* gameSaga() {
    yield takeLatest(initializeGame.type, handleInitializeGame);
    yield takeLatest(addPoints.type, handleAddPoints);
}

export default gameSaga;
