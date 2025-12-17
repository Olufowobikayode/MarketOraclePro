import { call, put, takeLatest, select } from 'redux-saga/effects';
import { generateComparativeAnalysis } from '../../services/geminiService';
import {
  generateComparisonStart,
  generateComparisonSuccess,
  generateComparisonFailure,
} from './comparisonSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
// FIX: Import OracleSessionState from the central types file.
import type { RootState, CardBase, ComparativeReport, OracleSessionState } from '../../types';

function* handleGenerateComparison(): Generator {
  try {
    const session = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    const selectedCards = (yield select((state: RootState) => state.comparison.selectedCards)) as CardBase[];

    if (selectedCards.length < 2) {
      throw new Error("Please select at least two cards to compare.");
    }
    
    const report = yield call(generateComparativeAnalysis, selectedCards, session);
    yield put(generateComparisonSuccess(report as ComparativeReport));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(generateComparisonFailure(errorMessage));
  }
}

function* comparisonSaga() {
  yield takeLatest(generateComparisonStart.type, handleGenerateComparison);
}

export default comparisonSaga;