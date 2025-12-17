
import { call, put, takeLatest, delay, select, takeLeading } from 'redux-saga/effects';
import { generateInitialVisions, generateDetailedBlueprint } from '../../services/geminiService';
import {
    fetchVisionsStart,
    fetchVisionsProgress,
    fetchVisionsSuccess,
    fetchVisionsFailure,
    fetchMoreVisionsStart,
    fetchMoreVisionsSuccess,
    fetchMoreVisionsFailure,
    fetchBlueprintStart,
    fetchBlueprintProgress,
    fetchBlueprintSuccess,
    fetchBlueprintFailure,
} from './venturesSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
// FIX: Import OracleSessionState from the central types file.
import type { VentureVision, VentureBlueprint, RootState, OracleSessionState } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

function* handleFetchVisions(): Generator {
  try {
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }
    
    yield put(fetchVisionsProgress({ message: 'Generating initial concepts...', percentage: 25 }));
    yield delay(1500);
    
    yield put(fetchVisionsProgress({ message: 'Analyzing market data...', percentage: 60 }));
    yield delay(1500);

    const visionsData = yield call(generateInitialVisions, session);
    yield put(fetchVisionsSuccess(visionsData as VentureVision[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchVisionsFailure(errorMessage));
  }
}

function* handleFetchMoreVisions(): Generator {
    try {
      const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
      const currentData: VentureVision[] = (yield select((state: RootState) => state.ventures.visions)) as VentureVision[];

      if (!session.isInitiated) {
        throw new Error("Oracle session not initiated.");
      }
      
      yield put(fetchVisionsProgress({ message: 'Scouting new horizons...', percentage: 30 }));
      yield delay(1500);
  
      const excludeTitles = currentData.map(item => item.title);
      const visionsData = yield call(generateInitialVisions, session, excludeTitles);
      yield put(fetchMoreVisionsSuccess(visionsData as VentureVision[]));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      if (errorMessage.includes("has exceeded its quota")) {
          yield put(setApiOutage(errorMessage));
      }
      yield put(fetchMoreVisionsFailure(errorMessage));
    }
  }

function* handleFetchBlueprint(action: PayloadAction<{ vision: VentureVision }>): Generator {
    try {
      const vision = action.payload.vision;
      const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
      
      yield put(fetchBlueprintProgress({ message: 'Drafting blueprint...', percentage: 30 }));
      yield delay(2000);
      
      yield put(fetchBlueprintProgress({ message: 'Finalizing strategic plan...', percentage: 70 }));
      yield delay(2000);
  
      const blueprintData = yield call(generateDetailedBlueprint, vision, session);
      yield put(fetchBlueprintSuccess(blueprintData as VentureBlueprint));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      if (errorMessage.includes("has exceeded its quota")) {
          yield put(setApiOutage(errorMessage));
      }
      yield put(fetchBlueprintFailure(errorMessage));
    }
}

function* venturesSaga() {
  yield takeLatest(fetchVisionsStart.type, handleFetchVisions);
  yield takeLatest(fetchMoreVisionsStart.type, handleFetchMoreVisions);
  yield takeLeading(fetchBlueprintStart.type, handleFetchBlueprint);
}

export default venturesSaga;