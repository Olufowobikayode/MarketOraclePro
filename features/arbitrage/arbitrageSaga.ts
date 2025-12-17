
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { analyzeProductArbitrage } from '../../services/geminiService';
import { 
    fetchArbitrageStart, 
    fetchArbitrageSuccess, 
    fetchArbitrageFailure,
    fetchMoreArbitrageStart,
    fetchMoreArbitrageSuccess,
    fetchMoreArbitrageFailure
} from './arbitrageSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import type { ArbitrageData, RootState, OracleSessionState } from '../../types';
import { PayloadAction } from '@reduxjs/toolkit';

function* handleFetchArbitrage(action: PayloadAction<{ productQuery: string }>): Generator {
  try {
    const { productQuery } = action.payload;
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }

    const arbitrageData = yield call(analyzeProductArbitrage, productQuery, session);
    yield put(fetchArbitrageSuccess(arbitrageData as ArbitrageData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchArbitrageFailure(errorMessage));
  }
}

function* handleFetchMoreArbitrage(): Generator {
    try {
        const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
        const state: RootState = (yield select()) as RootState;
        const { productQuery, data } = state.arbitrage;

        if (!session.isInitiated) throw new Error("Session not initiated");

        // Exclude current titles to avoid duplicates
        const exclude = data.map(item => item.title);

        const arbitrageData = yield call(analyzeProductArbitrage, productQuery, session, exclude);
        yield put(fetchMoreArbitrageSuccess(arbitrageData as ArbitrageData[]));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(fetchMoreArbitrageFailure(errorMessage));
    }
}

function* arbitrageSaga() {
  yield takeLatest(fetchArbitrageStart.type, handleFetchArbitrage);
  yield takeLatest(fetchMoreArbitrageStart.type, handleFetchMoreArbitrage);
}

export default arbitrageSaga;
