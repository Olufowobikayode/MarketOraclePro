
import { all } from 'redux-saga/effects';
import trendsSaga from '../features/trends/trendsSaga';
import keywordsSaga from '../features/keywords/keywordsSaga';
import marketplacesSaga from '../features/marketplaces/marketplacesSaga';
import contentSaga from '../features/content/contentSaga';
import socialsSaga from '../features/socials/socialsSaga';
import copySaga from '../features/copy/copySaga';
import qnaSaga from '../features/qna/qnaSaga';
import mediaSaga from '../features/media/mediaSaga';
import venturesSaga from '../features/ventures/venturesSaga';
import arbitrageSaga from '../features/arbitrage/arbitrageSaga';
import scenariosSaga from '../features/scenarios/scenariosSaga';
import comparisonSaga from '../features/comparison/comparisonSaga';
import authSaga from '../features/auth/authSaga';
import apiStatusSaga from '../features/apiStatus/apiStatusSaga';
import adSaga from '../features/ads/adSaga';
import storeAnalysisSaga from '../features/storeAnalysis/storeAnalysisSaga';
import productFinderSaga from '../features/productFinder/productFinderSaga';
import leadsSaga from '../features/leads/leadsSaga';

export default function* rootSaga() {
  yield all([
    trendsSaga(),
    keywordsSaga(),
    marketplacesSaga(),
    contentSaga(),
    socialsSaga(),
    copySaga(),
    qnaSaga(),
    mediaSaga(),
    venturesSaga(),
    arbitrageSaga(),
    scenariosSaga(),
    comparisonSaga(),
    authSaga(),
    apiStatusSaga(),
    adSaga(),
    storeAnalysisSaga(),
    productFinderSaga(),
    leadsSaga(),
  ]);
}
