
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { analyzeStoreCompetitor } from '../../services/geminiService';
import { 
    fetchStoreAnalysisStart, 
    fetchStoreAnalysisSuccess, 
    fetchStoreAnalysisFailure 
} from './storeAnalysisSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import type { StoreAnalysisData, RootState, OracleSessionState } from '../../types';
import { PayloadAction } from '@reduxjs/toolkit';

function* handleFetchStoreAnalysis(action: PayloadAction<{ myUrl: string; competitorUrl: string }>): Generator {
  try {
    const { myUrl, competitorUrl } = action.payload;
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }

    const data = yield call(analyzeStoreCompetitor, myUrl, competitorUrl, session);
    yield put(fetchStoreAnalysisSuccess(data as StoreAnalysisData));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchStoreAnalysisFailure(errorMessage));
  }
}

function* storeAnalysisSaga() {
  yield takeLatest(fetchStoreAnalysisStart.type, handleFetchStoreAnalysis);
}

export default storeAnalysisSaga;
