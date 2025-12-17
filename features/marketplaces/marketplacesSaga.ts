
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { analyzeMarketplaces } from '../../services/geminiService';
import { 
    fetchMarketplacesStart, 
    fetchMarketplacesSuccess, 
    fetchMarketplacesFailure,
    fetchMoreMarketplacesStart,
    fetchMoreMarketplacesSuccess,
    fetchMoreMarketplacesFailure
} from './marketplacesSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
// FIX: Import OracleSessionState from the central types file.
import type { MarketplaceData, RootState, OracleSessionState } from '../../types';

function* handleFetchMarketplaces(): Generator {
  try {
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
     if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }
    const marketplacesData = yield call(analyzeMarketplaces, session);
    yield put(fetchMarketplacesSuccess(marketplacesData as MarketplaceData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchMarketplacesFailure(errorMessage));
  }
}

function* handleFetchMoreMarketplaces(): Generator {
    try {
        const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
        const currentData: MarketplaceData[] = (yield select((state: RootState) => state.marketplaces.data)) as MarketplaceData[];

        if (!session.isInitiated) {
            throw new Error("Oracle session not initiated.");
        }

        const excludeTitles = currentData.map(item => item.title);
        const marketplacesData = yield call(analyzeMarketplaces, session, excludeTitles);
        yield put(fetchMoreMarketplacesSuccess(marketplacesData as MarketplaceData[]));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(fetchMoreMarketplacesFailure(errorMessage));
    }
}

function* marketplacesSaga() {
  yield takeLatest(fetchMarketplacesStart.type, handleFetchMarketplaces);
  yield takeLatest(fetchMoreMarketplacesStart.type, handleFetchMoreMarketplaces);
}

export default marketplacesSaga;