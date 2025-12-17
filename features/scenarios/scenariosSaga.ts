import { call, put, takeLatest, select } from 'redux-saga/effects';
import { runStrategicSimulation } from '../../services/geminiService';
import { fetchScenariosStart, fetchScenariosSuccess, fetchScenariosFailure } from './scenariosSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import type { ScenarioData, RootState, OracleSessionState } from '../../types';
import { PayloadAction } from '@reduxjs/toolkit';

function* handleFetchScenarios(action: PayloadAction<{ goalQuery: string }>): Generator {
  try {
    const { goalQuery } = action.payload;
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }

    const scenariosData = yield call(runStrategicSimulation, goalQuery, session);
    yield put(fetchScenariosSuccess(scenariosData as ScenarioData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchScenariosFailure(errorMessage));
  }
}

function* scenariosSaga() {
  yield takeLatest(fetchScenariosStart.type, handleFetchScenarios);
}

export default scenariosSaga;