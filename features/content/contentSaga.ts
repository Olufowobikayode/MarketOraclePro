
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { generateContentIdeas } from '../../services/geminiService';
import { 
    fetchContentStart, 
    fetchContentSuccess, 
    fetchContentFailure,
    fetchMoreContentStart,
    fetchMoreContentSuccess,
    fetchMoreContentFailure
} from './contentSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
// FIX: Import OracleSessionState from the central types file.
import type { ContentData, RootState, OracleSessionState } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

function* handleFetchContent(action: PayloadAction<{ topic: string } | undefined>): Generator {
  try {
    const topicFromAction = action.payload?.topic;
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    let topicToUse: string;

    if (topicFromAction) {
      topicToUse = topicFromAction;
    } else {
      if (!session.isInitiated) {
        throw new Error("Oracle session not initiated.");
      }
      topicToUse = session.niche;
    }
    
    // Pass the whole session so the service can use the tone
    const contentData = yield call(generateContentIdeas, topicToUse, session);
    yield put(fetchContentSuccess(contentData as ContentData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchContentFailure(errorMessage));
  }
}

function* handleFetchMoreContent(action: PayloadAction<{ topic: string } | undefined>): Generator {
    try {
      const topicFromAction = action.payload?.topic;
      const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
      const currentData: ContentData[] = (yield select((state: RootState) => state.content.data)) as ContentData[];
      let topicToUse: string;
  
      if (topicFromAction) {
        topicToUse = topicFromAction;
      } else {
        if (!session.isInitiated) {
          throw new Error("Oracle session not initiated.");
        }
        topicToUse = session.niche;
      }
      
      const excludeTitles = currentData.map(item => item.title);
      const contentData = yield call(generateContentIdeas, topicToUse, session, excludeTitles);
      yield put(fetchMoreContentSuccess(contentData as ContentData[]));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      if (errorMessage.includes("has exceeded its quota")) {
          yield put(setApiOutage(errorMessage));
      }
      yield put(fetchMoreContentFailure(errorMessage));
    }
  }

function* contentSaga() {
  yield takeLatest(fetchContentStart.type, handleFetchContent);
  yield takeLatest(fetchMoreContentStart.type, handleFetchMoreContent);
}

export default contentSaga;