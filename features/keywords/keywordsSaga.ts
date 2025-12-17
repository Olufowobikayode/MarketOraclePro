
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { analyzeKeywords } from '../../services/geminiService';
import { 
    fetchKeywordsStart, 
    fetchKeywordsSuccess, 
    fetchKeywordsFailure,
    fetchMoreKeywordsStart,
    fetchMoreKeywordsSuccess,
    fetchMoreKeywordsFailure
} from './keywordsSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
// FIX: Import OracleSessionState from the central types file.
import type { KeywordData, RootState, OracleSessionState } from '../../types';

function* handleFetchKeywords(): Generator {
  try {
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }
    const keywordsData = yield call(analyzeKeywords, session);
    yield put(fetchKeywordsSuccess(keywordsData as KeywordData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchKeywordsFailure(errorMessage));
  }
}

function* handleFetchMoreKeywords(): Generator {
    try {
        const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
        const currentData: KeywordData[] = (yield select((state: RootState) => state.keywords.data)) as KeywordData[];

        if (!session.isInitiated) {
            throw new Error("Oracle session not initiated.");
        }

        const excludeTitles = currentData.map(item => item.title);
        const keywordsData = yield call(analyzeKeywords, session, excludeTitles);
        yield put(fetchMoreKeywordsSuccess(keywordsData as KeywordData[]));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(fetchMoreKeywordsFailure(errorMessage));
    }
}

function* keywordsSaga() {
  yield takeLatest(fetchKeywordsStart.type, handleFetchKeywords);
  yield takeLatest(fetchMoreKeywordsStart.type, handleFetchMoreKeywords);
}

export default keywordsSaga;