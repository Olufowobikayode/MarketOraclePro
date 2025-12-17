import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ApiStatusState {
  isAvailable: boolean;
  outageMessage: string | null;
}

const initialState: ApiStatusState = {
  isAvailable: true,
  outageMessage: null,
};

const apiStatusSlice = createSlice({
  name: 'apiStatus',
  initialState,
  reducers: {
    setApiOutage(state, action: PayloadAction<string>) {
      state.isAvailable = false;
      state.outageMessage = action.payload;
    },
    resetApiStatus(state) {
      state.isAvailable = true;
      state.outageMessage = null;
    }
  },
});

export const { setApiOutage, resetApiStatus } = apiStatusSlice.actions;
export default apiStatusSlice.reducer;
