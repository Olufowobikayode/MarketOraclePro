
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MarketplacesState, MarketplaceData } from '../../types';

const initialState: MarketplacesState = {
  data: [],
  loading: false,
  error: null,
};

const marketplacesSlice = createSlice({
  name: 'marketplaces',
  initialState,
  reducers: {
    fetchMarketplacesStart(state) {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    fetchMarketplacesSuccess(state, action: PayloadAction<MarketplaceData[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchMarketplacesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMoreMarketplacesStart(state) {
        state.loading = true;
        state.error = null;
    },
    fetchMoreMarketplacesSuccess(state, action: PayloadAction<MarketplaceData[]>) {
        state.loading = false;
        state.data = [...state.data, ...action.payload];
    },
    fetchMoreMarketplacesFailure(state, action: PayloadAction<string>) {
        state.loading = false;
        state.error = action.payload;
    },
  },
});

export const { 
    fetchMarketplacesStart, 
    fetchMarketplacesSuccess, 
    fetchMarketplacesFailure,
    fetchMoreMarketplacesStart,
    fetchMoreMarketplacesSuccess,
    fetchMoreMarketplacesFailure
} = marketplacesSlice.actions;
export default marketplacesSlice.reducer;