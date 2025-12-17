
import { put, takeLatest } from 'redux-saga/effects';
import {
  createPostStart,
  createPostSuccess,
  createPostFailure,
} from './blogSlice';
import type { BlogPost, ContentData } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

function* handleCreatePost(action: PayloadAction<{ postData: ContentData }>): Generator {
  try {
    const { postData } = action.payload;
    
    // In a real application, this would be an API call to save the post.
    // Here, we're just adding a timestamp and updating the state.
    const newPost: BlogPost = {
      ...postData,
      publishedAt: new Date().toISOString(),
    };

    yield put(createPostSuccess(newPost));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    yield put(createPostFailure(errorMessage));
  }
}

function* blogSaga() {
  yield takeLatest(createPostStart.type, handleCreatePost);
}

export default blogSaga;
