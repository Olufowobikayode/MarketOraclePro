
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ArbitrageState, ArbitrageData } from '../../types';

const initialState: ArbitrageState = {
  data: [],
  loading: false,
  error: null,
  productQuery: '',
};

const arbitrageSlice = createSlice({
  name: 'arbitrage',
  initialState,
  reducers: {
    fetchArbitrageStart(state, action: PayloadAction<{ productQuery: string }>) {
      state.loading = true;
      state.error = null;
      state.data = [];
      state.productQuery = action.payload.productQuery;
    },
    fetchArbitrageSuccess(state, action: PayloadAction<ArbitrageData[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchArbitrageFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMoreArbitrageStart(state) {
        state.loading = true;
        state.error = null;
    },
    fetchMoreArbitrageSuccess(state, action: PayloadAction<ArbitrageData[]>) {
        state.loading = false;
        state.data = [...state.data, ...action.payload];
    },
    fetchMoreArbitrageFailure(state, action: PayloadAction<string>) {
        state.loading = false;
        state.error = action.payload;
    },
  },
});

export const { 
    fetchArbitrageStart, 
    fetchArbitrageSuccess, 
    fetchArbitrageFailure,
    fetchMoreArbitrageStart,
    fetchMoreArbitrageSuccess,
    fetchMoreArbitrageFailure
} = arbitrageSlice.actions;
export default arbitrageSlice.reducer;
