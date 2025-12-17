
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdState } from '../../types';

interface ExtendedAdState extends AdState {
    isContentReady: boolean;
}

const initialState: ExtendedAdState = {
  isAdOpen: false,
  isContentReady: false,
};

const adSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    showAd(state) {
      state.isAdOpen = true;
      // When showing ad via this method, we assume content is NOT ready yet 
      // unless specified otherwise, but usually the saga handles the flow.
    },
    closeAd(state) {
      state.isAdOpen = false;
    },
    setAdContentReady(state, action: PayloadAction<boolean>) {
        state.isContentReady = action.payload;
    }
  },
});

export const { showAd, closeAd, setAdContentReady } = adSlice.actions;
export default adSlice.reducer;
