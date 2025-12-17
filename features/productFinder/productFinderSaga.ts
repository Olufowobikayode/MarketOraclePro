
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { findCheapestProducts, findProcurementAgents, verifyEntityDeepDive } from '../../services/geminiService';
import { 
    findProductsStart, 
    findProductsSuccess, 
    findProductsFailure,
    fetchMoreProductsStart,
    fetchMoreProductsSuccess,
    fetchMoreProductsFailure,
    fetchAgentsStart,
    fetchAgentsSuccess,
    fetchAgentsFailure,
    verifySellerStart,
    verifySellerSuccess,
    verifySellerFailure,
    verifyAgentStart,
    verifyAgentSuccess,
    verifyAgentFailure
} from './productFinderSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import type { ProductResultData, ProcurementAgent, RootState, OracleSessionState, VerificationResult } from '../../types';
import { PayloadAction } from '@reduxjs/toolkit';

function* handleFindProducts(action: PayloadAction<{ query: string; imageBase64: string | null }>): Generator {
  try {
    const { query, imageBase64 } = action.payload;
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }

    // New search always passes empty exclude list
    const data = yield call(findCheapestProducts, query, imageBase64, session, []);
    yield put(findProductsSuccess(data as ProductResultData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(findProductsFailure(errorMessage));
  }
}

function* handleFetchMoreProducts(action: PayloadAction<{ query: string }>): Generator {
    try {
        const { query } = action.payload;
        const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
        const currentResults: ProductResultData[] = (yield select((state: RootState) => state.productFinder.results)) as ProductResultData[];

        if (!session.isInitiated) {
            throw new Error("Oracle session not initiated.");
        }

        // Create exclude list from current titles and store names to avoid duplicates
        const excludeList = currentResults.map(p => `${p.title} (${p.storeName})`);

        const data = yield call(findCheapestProducts, query, null, session, excludeList);
        yield put(fetchMoreProductsSuccess(data as ProductResultData[]));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(fetchMoreProductsFailure(errorMessage));
    }
}

function* handleFetchAgents(action: PayloadAction<{ userCountry: string }>): Generator {
    try {
        const { userCountry } = action.payload;
        const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
        
        if (!session.isInitiated) {
            throw new Error("Oracle session not initiated.");
        }

        const data = yield call(findProcurementAgents, userCountry, session);
        yield put(fetchAgentsSuccess(data as ProcurementAgent[]));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(fetchAgentsFailure(errorMessage));
    }
}

function* handleVerifySeller(action: PayloadAction<{ productId: string; sellerName: string; url: string; platform: string }>): Generator {
    try {
        const { productId, sellerName, url, platform } = action.payload;
        const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
        
        const verification = yield call(verifyEntityDeepDive, sellerName, url, platform, session);
        yield put(verifySellerSuccess({ productId, verification: verification as VerificationResult }));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Verification failed.';
        yield put(verifySellerFailure({ productId: action.payload.productId, error: errorMessage }));
    }
}

function* handleVerifyAgent(action: PayloadAction<{ agentId: string; name: string; url: string }>): Generator {
    try {
        const { agentId, name, url } = action.payload;
        const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
        
        const verification = yield call(verifyEntityDeepDive, name, url, 'Agent', session);
        yield put(verifyAgentSuccess({ agentId, verification: verification as VerificationResult }));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Verification failed.';
        yield put(verifyAgentFailure({ agentId: action.payload.agentId, error: errorMessage }));
    }
}

function* productFinderSaga() {
  yield takeLatest(findProductsStart.type, handleFindProducts);
  yield takeLatest(fetchMoreProductsStart.type, handleFetchMoreProducts);
  yield takeLatest(fetchAgentsStart.type, handleFetchAgents);
  yield takeLatest(verifySellerStart.type, handleVerifySeller);
  yield takeLatest(verifyAgentStart.type, handleVerifyAgent);
}

export default productFinderSaga;
