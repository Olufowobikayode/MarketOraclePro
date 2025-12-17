
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { analyzeNicheTrends } from '../../services/geminiService';
import { 
    fetchTrendsStart, 
    fetchTrendsSuccess, 
    fetchTrendsFailure,
    fetchMoreTrendsStart,
    fetchMoreTrendsSuccess,
    fetchMoreTrendsFailure 
} from './trendsSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import { triggerAlert } from '../alerts/alertsSlice';
import type { TrendData, RootState, OracleSessionState, AlertsState } from '../../types';

function* checkAlerts(newTrends: TrendData[]): Generator {
    const alertsState: AlertsState = (yield select((state: RootState) => state.alerts)) as AlertsState;
    const activeAlerts = alertsState.activeAlerts;

    if (activeAlerts.length === 0) return;

    for (const alert of activeAlerts) {
        if (!alert.isActive) continue;

        for (const trend of newTrends) {
            const matchesKeyword = !alert.keyword || 
                trend.title.toLowerCase().includes(alert.keyword.toLowerCase()) || 
                trend.description.toLowerCase().includes(alert.keyword.toLowerCase());
            
            const trendVelocityLower = trend.velocity ? trend.velocity.toLowerCase() : '';
            const minVelocityLower = alert.minVelocity.toLowerCase();
            
            let matchesVelocity = true;
            if (minVelocityLower !== 'any') {
                // Simple hierarchy check: Explosive > High > Steady > Emerging > Declining
                const hierarchy = ['explosive', 'high', 'steady', 'emerging', 'declining'];
                const trendIndex = hierarchy.indexOf(trendVelocityLower);
                const alertIndex = hierarchy.indexOf(minVelocityLower);
                
                // If known velocity, check if trend is "higher or equal" (lower index) than alert requirement
                if (trendIndex !== -1 && alertIndex !== -1) {
                    matchesVelocity = trendIndex <= alertIndex;
                } else {
                    // Fallback string match
                    matchesVelocity = trendVelocityLower.includes(minVelocityLower);
                }
            }

            if (matchesKeyword && matchesVelocity) {
                yield put(triggerAlert(`Alert Triggered: ${trend.title} (${trend.velocity})`));
                // Break after first match per alert to avoid spamming for the same alert rule
                break; 
            }
        }
    }
}

function* handleFetchTrends(): Generator {
  try {
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }

    // Rely solely on Gemini's googleSearch tool, no external pre-fetching
    const trendsData = yield call(analyzeNicheTrends, session);
    
    yield put(fetchTrendsSuccess(trendsData as TrendData[]));
    yield call(checkAlerts, trendsData as TrendData[]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchTrendsFailure(errorMessage));
  }
}

function* handleFetchMoreTrends(): Generator {
    try {
        const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
        const currentData: TrendData[] = (yield select((state: RootState) => state.trends.data)) as TrendData[];
        
        if (!session.isInitiated) {
            throw new Error("Oracle session not initiated.");
        }

        const excludeTitles = currentData.map(item => item.title);

        const trendsData = yield call(analyzeNicheTrends, session, excludeTitles);
        
        yield put(fetchMoreTrendsSuccess(trendsData as TrendData[]));
        yield call(checkAlerts, trendsData as TrendData[]);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(fetchMoreTrendsFailure(errorMessage));
    }
}

function* trendsSaga() {
  yield takeLatest(fetchTrendsStart.type, handleFetchTrends);
  yield takeLatest(fetchMoreTrendsStart.type, handleFetchMoreTrends);
}

export default trendsSaga;
