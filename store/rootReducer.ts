
import { combineReducers } from '@reduxjs/toolkit';
import oracleSessionReducer from '../features/oracleSession/oracleSessionSlice';
import trendsReducer from '../features/trends/trendsSlice';
import keywordsReducer from '../features/keywords/keywordsSlice';
import marketplacesReducer from '../features/marketplaces/marketplacesSlice';
import contentReducer from '../features/content/contentSlice';
import socialsReducer from '../features/socials/socialsSlice';
import copyReducer from '../features/copy/copySlice';
import qnaReducer from '../features/qna/qnaSlice';
import mediaReducer from '../features/media/mediaSlice';
import venturesReducer from '../features/ventures/venturesSlice';
import arbitrageReducer from '../features/arbitrage/arbitrageSlice';
import scenariosReducer from '../features/scenarios/scenariosSlice';
import comparisonReducer from '../features/comparison/comparisonSlice';
import authReducer from '../features/auth/authSlice';
import apiStatusReducer from '../features/apiStatus/apiStatusSlice';
import historyReducer from '../features/history/historySlice';
import uiReducer from '../features/ui/uiSlice';
import alertsReducer from '../features/alerts/alertsSlice';
import storeAnalysisReducer from '../features/storeAnalysis/storeAnalysisSlice';
import productFinderReducer from '../features/productFinder/productFinderSlice';
import leadsReducer from '../features/leads/leadsSlice';

const rootReducer = combineReducers({
  oracleSession: oracleSessionReducer,
  trends: trendsReducer,
  keywords: keywordsReducer,
  marketplaces: marketplacesReducer,
  content: contentReducer,
  socials: socialsReducer,
  copy: copyReducer,
  qna: qnaReducer,
  media: mediaReducer,
  ventures: venturesReducer,
  arbitrage: arbitrageReducer,
  scenarios: scenariosReducer,
  comparison: comparisonReducer,
  auth: authReducer,
  apiStatus: apiStatusReducer,
  history: historyReducer,
  ui: uiReducer,
  alerts: alertsReducer,
  storeAnalysis: storeAnalysisReducer,
  productFinder: productFinderReducer,
  leads: leadsReducer,
});

export default rootReducer;
