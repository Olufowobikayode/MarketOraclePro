
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { StoreAnalysisState, StoreAnalysisData } from '../../types';

const initialState: StoreAnalysisState = {
  data: [],
  loading: false,
  error: null,
};

const storeAnalysisSlice = createSlice({
  name: 'storeAnalysis',
  initialState,
  reducers: {
    fetchStoreAnalysisStart(state, action: PayloadAction<{ myUrl: string; competitorUrl: string }>) {
      state.loading = true;
      state.error = null;
    },
    fetchStoreAnalysisSuccess(state, action: PayloadAction<StoreAnalysisData>) {
      state.loading = false;
      state.data.unshift(action.payload);
    },
    fetchStoreAnalysisFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setStoreAnalysisData(state, action: PayloadAction<StoreAnalysisData[]>) {
        state.data = action.payload;
    }
  },
});

export const { 
    fetchStoreAnalysisStart, 
    fetchStoreAnalysisSuccess, 
    fetchStoreAnalysisFailure,
    setStoreAnalysisData
} = storeAnalysisSlice.actions;
export default storeAnalysisSlice.reducer;
