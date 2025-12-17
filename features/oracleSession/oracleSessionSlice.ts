
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OracleSessionState } from '../../types';

const initialState: OracleSessionState = {
  niche: '',
  purpose: '',
  targetAudience: '',
  brandVoice: '',
  campaignGoal: '',
  language: 'English',
  country: 'Global',
  isInitiated: false,
};

const oracleSessionSlice = createSlice({
  name: 'oracleSession',
  initialState,
  reducers: {
    initiateSession(state, action: PayloadAction<Omit<OracleSessionState, 'isInitiated'>>) {
      state.niche = action.payload.niche;
      state.purpose = action.payload.purpose;
      state.targetAudience = action.payload.targetAudience;
      state.brandVoice = action.payload.brandVoice;
      state.campaignGoal = action.payload.campaignGoal;
      // Use provided language/country or fallback to defaults
      state.language = action.payload.language || 'English';
      state.country = action.payload.country || 'Global';
      state.isInitiated = true;
    },
    updateLocalization(state, action: PayloadAction<{ language: string; country: string }>) {
        state.language = action.payload.language;
        state.country = action.payload.country;
    },
    clearSession(state) {
      state.niche = '';
      state.purpose = '';
      state.targetAudience = '';
      state.brandVoice = '';
      state.campaignGoal = '';
      state.language = 'English';
      state.country = 'Global';
      state.isInitiated = false;
    },
  },
});

export const { initiateSession, clearSession, updateLocalization } = oracleSessionSlice.actions;
export default oracleSessionSlice.reducer;
