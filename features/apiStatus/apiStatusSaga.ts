import { call, put, take, delay } from 'redux-saga/effects';
import { setApiOutage, resetApiStatus } from './apiStatusSlice';
import { checkApiHealth } from '../../services/geminiService';

const HEALTH_CHECK_INTERVAL = 60 * 1000; // 60 seconds

function* watchApiOutage(): Generator {
  while (true) {
    // Wait for an outage to be triggered
    yield take(setApiOutage.type);
    
    console.log('API outage detected. Starting health checks...');

    // Loop until the API is back online
    while (true) {
      try {
        // Wait for a specified interval
        yield delay(HEALTH_CHECK_INTERVAL);

        // Check if the API is back
        const isApiHealthy = (yield call(checkApiHealth)) as boolean;

        if (isApiHealthy) {
          console.log('API has recovered. Resetting status.');
          yield put(resetApiStatus());
          // Break the inner loop to wait for the next outage
          break; 
        } else {
            console.log('API still unhealthy. Will check again in 60 seconds.');
        }
      } catch (error) {
        console.error('Error during API health check saga:', error);
        // If the health check itself fails unexpectedly, wait before retrying
        yield delay(HEALTH_CHECK_INTERVAL);
      }
    }
  }
}

export default watchApiOutage;
