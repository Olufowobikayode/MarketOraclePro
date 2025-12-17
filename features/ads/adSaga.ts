
import { put, takeEvery, take } from 'redux-saga/effects';
import { showAd, setAdContentReady } from './adSlice';
import { fetchTrendsStart } from '../trends/trendsSlice';
import { fetchKeywordsStart } from '../keywords/keywordsSlice';
import { fetchMarketplacesStart } from '../marketplaces/marketplacesSlice';
import { fetchContentStart } from '../content/contentSlice';
import { fetchSocialsStart, regeneratePostStart } from '../socials/socialsSlice';
import { fetchCopyStart } from '../copy/copySlice';
import { fetchArbitrageStart } from '../arbitrage/arbitrageSlice';
import { fetchScenariosStart } from '../scenarios/scenariosSlice';
import { fetchVisionsStart, fetchBlueprintStart } from '../ventures/venturesSlice';
import { sendQuestionStart } from '../qna/qnaSlice';
import type { PayloadAction } from '@reduxjs/toolkit';

// List of all "Start" actions that should trigger the Ad-as-Loading-Screen
const triggerActions = [
    fetchTrendsStart.type,
    fetchKeywordsStart.type,
    fetchMarketplacesStart.type,
    fetchContentStart.type,
    fetchSocialsStart.type,
    fetchCopyStart.type,
    fetchArbitrageStart.type,
    fetchScenariosStart.type,
    fetchVisionsStart.type,
    fetchBlueprintStart.type,
    sendQuestionStart.type,
    regeneratePostStart.type
];

function* handleAdLifecycle(action: PayloadAction<any>): Generator {
    // 1. Reset readiness and Show Ad immediately
    yield put(setAdContentReady(false));
    yield put(showAd());

    // 2. Determine success/failure counterparts
    // Assumption: All our slices follow the Redux Toolkit pattern: nameStart -> nameSuccess / nameFailure
    const type = action.type;
    const successType = type.replace('Start', 'Success');
    const failureType = type.replace('Start', 'Failure');

    // 3. Wait for either success or failure of the specific request
    // This suspends the saga until the API responds
    yield take([successType, failureType]);

    // 4. Signal that content is ready
    // The AdInterstitial component will handle the auto-close based on this flag and its own minimum timer.
    yield put(setAdContentReady(true));
}

function* adSaga() {
  // Use takeEvery to handle concurrent requests if any, though usually one active at a time.
  yield takeEvery(triggerActions, handleAdLifecycle);
}

export default adSaga;
