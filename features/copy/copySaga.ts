import { call, put, takeLatest, select } from 'redux-saga/effects';
import { generateMarketingCopy } from '../../services/geminiService';
import { fetchCopyStart, fetchCopySuccess, fetchCopyFailure } from './copySlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
// FIX: Import OracleSessionState from the central types file.
import type { CopyData, RootState, OracleSessionState } from '../../types';

function* handleFetchCopy(): Generator {
  try {
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }
    const copyData = yield call(generateMarketingCopy, session);
    yield put(fetchCopySuccess(copyData as CopyData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchCopyFailure(errorMessage));
  }
}

function* copySaga() {
  yield takeLatest(fetchCopyStart.type, handleFetchCopy);
}

export default copySaga;