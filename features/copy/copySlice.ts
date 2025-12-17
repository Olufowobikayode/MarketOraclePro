
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CopyState, CopyData } from '../../types';

const initialState: CopyState = {
  data: [],
  loading: false,
  error: null,
};

const copySlice = createSlice({
  name: 'copy',
  initialState,
  reducers: {
    fetchCopyStart(state) {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    fetchCopySuccess(state, action: PayloadAction<CopyData[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchCopyFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCopyStart, fetchCopySuccess, fetchCopyFailure } = copySlice.actions;
export default copySlice.reducer;
