
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { analyzeSocials, regenerateSocialPost, getMoreHashtags } from '../../services/geminiService';
import { 
    fetchSocialsStart, 
    fetchSocialsSuccess, 
    fetchSocialsFailure,
    regeneratePostStart,
    regeneratePostSuccess,
    regeneratePostFailure,
    boostHashtagsStart,
    boostHashtagsSuccess,
    boostHashtagsFailure
} from './socialsSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
// FIX: Import OracleSessionState from the central types file.
import type { SocialsData, RootState, SocialsPlatformAnalysis, OracleSessionState } from '../../types';
import { PayloadAction } from '@reduxjs/toolkit';

function* handleFetchSocials(): Generator {
  try {
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }
    const socialsData = yield call(analyzeSocials, session);
    yield put(fetchSocialsSuccess(socialsData as SocialsData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchSocialsFailure(errorMessage));
  }
}

function* handleRegeneratePost(action: PayloadAction<{ postId: string; newPostType: string }>): Generator {
  const { postId, newPostType } = action.payload;
  try {
    const fullState = (yield select()) as RootState;
    const session = fullState.oracleSession;
    
    // Find the original post to provide context
    const originalPost = fullState.socials.data[0]?.platformAnalysis.find(p => p.id === postId);

    if (!originalPost) {
        throw new Error("Original post not found for regeneration.");
    }

    const regeneratedPost = yield call(regenerateSocialPost, session, originalPost as SocialsPlatformAnalysis, newPostType);
    yield put(regeneratePostSuccess(regeneratedPost as SocialsPlatformAnalysis));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(regeneratePostFailure({ postId, error: errorMessage }));
  }
}

function* handleBoostHashtags(action: PayloadAction<{ postId: string }>): Generator {
    const { postId } = action.payload;
    try {
        const fullState = (yield select()) as RootState;
        const session = fullState.oracleSession;
        const originalPost = fullState.socials.data[0]?.platformAnalysis.find(p => p.id === postId);

        if (!originalPost) {
            throw new Error("Post not found.");
        }

        const additionalHashtags = yield call(
            getMoreHashtags, 
            session, 
            originalPost.platform, 
            originalPost.content, 
            originalPost.hashtags
        );

        yield put(boostHashtagsSuccess({ postId, additionalHashtags: additionalHashtags as string[] }));

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(boostHashtagsFailure({ postId, error: errorMessage }));
    }
}

function* socialsSaga() {
  yield takeLatest(fetchSocialsStart.type, handleFetchSocials);
  yield takeLatest(regeneratePostStart.type, handleRegeneratePost);
  yield takeLatest(boostHashtagsStart.type, handleBoostHashtags);
}

export default socialsSaga;
