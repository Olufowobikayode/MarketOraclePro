
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SocialsState, SocialsData, SocialsPlatformAnalysis } from '../../types';

const initialState: SocialsState = {
  data: [],
  loading: false,
  error: null,
  regeneratingPostId: null,
  boostingPostId: null,
};

const socialsSlice = createSlice({
  name: 'socials',
  initialState,
  reducers: {
    fetchSocialsStart(state) {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    fetchSocialsSuccess(state, action: PayloadAction<SocialsData[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchSocialsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Actions for regenerating a single post
    regeneratePostStart(state, action: PayloadAction<{ postId: string; newPostType: string }>) {
        state.regeneratingPostId = action.payload.postId;
        state.error = null;
    },
    regeneratePostSuccess(state, action: PayloadAction<SocialsPlatformAnalysis>) {
        const updatedPost = action.payload;
        if (state.data.length > 0) {
            const postIndex = state.data[0].platformAnalysis.findIndex(p => p.id === updatedPost.id);
            if (postIndex !== -1) {
                state.data[0].platformAnalysis[postIndex] = updatedPost;
            }
        }
        state.regeneratingPostId = null;
    },
    regeneratePostFailure(state, action: PayloadAction<{ postId: string; error: string }>) {
        state.regeneratingPostId = null;
        state.error = action.payload.error;
    },
    // Actions for Boosting Hashtags
    boostHashtagsStart(state, action: PayloadAction<{ postId: string }>) {
        state.boostingPostId = action.payload.postId;
        state.error = null;
    },
    boostHashtagsSuccess(state, action: PayloadAction<{ postId: string; additionalHashtags: string[] }>) {
        const { postId, additionalHashtags } = action.payload;
        if (state.data.length > 0) {
            const postIndex = state.data[0].platformAnalysis.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                state.data[0].platformAnalysis[postIndex].hashtags = [
                    ...state.data[0].platformAnalysis[postIndex].hashtags,
                    ...additionalHashtags
                ];
            }
        }
        state.boostingPostId = null;
    },
    boostHashtagsFailure(state, action: PayloadAction<{ postId: string; error: string }>) {
        state.boostingPostId = null;
        state.error = action.payload.error;
    },
    clearSocialsError(state) {
      state.error = null;
    },
  },
});

export const { 
    fetchSocialsStart, 
    fetchSocialsSuccess, 
    fetchSocialsFailure,
    regeneratePostStart,
    regeneratePostSuccess,
    regeneratePostFailure,
    boostHashtagsStart,
    boostHashtagsSuccess,
    boostHashtagsFailure,
    clearSocialsError,
} = socialsSlice.actions;

export default socialsSlice.reducer;
