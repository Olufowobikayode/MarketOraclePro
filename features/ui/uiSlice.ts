
import { createSlice } from '@reduxjs/toolkit';
import { UiState } from '../../types';

const initialState: UiState = {
  isSettingsOpen: false,
  telegramTheme: {
    bgColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#3390ec',
    buttonTextColor: '#ffffff'
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSettings(state) {
      state.isSettingsOpen = true;
    },
    closeSettings(state) {
      state.isSettingsOpen = false;
    },
  },
});

export const { openSettings, closeSettings } = uiSlice.actions;
export default uiSlice.reducer;