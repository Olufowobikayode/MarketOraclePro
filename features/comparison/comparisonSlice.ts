import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ComparisonState, ComparativeReport, CardBase } from '../../types';

const initialState: ComparisonState = {
  selectedCards: [],
  report: null,
  loading: false,
  error: null,
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    toggleCardSelection(state, action: PayloadAction<CardBase>) {
      const cardIndex = state.selectedCards.findIndex(c => c.id === action.payload.id);
      if (cardIndex >= 0) {
        state.selectedCards.splice(cardIndex, 1);
      } else {
        state.selectedCards.push(action.payload);
      }
    },
    clearSelection(state) {
      state.selectedCards = [];
    },
    generateComparisonStart(state) {
      state.loading = true;
      state.error = null;
      state.report = null;
    },
    generateComparisonSuccess(state, action: PayloadAction<ComparativeReport>) {
      state.loading = false;
      state.report = action.payload;
    },
    generateComparisonFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearComparisonReport(state) {
      state.report = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  toggleCardSelection,
  clearSelection,
  generateComparisonStart,
  generateComparisonSuccess,
  generateComparisonFailure,
  clearComparisonReport,
} = comparisonSlice.actions;

export default comparisonSlice.reducer;
