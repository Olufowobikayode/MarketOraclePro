
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadsState, Lead } from '../../types';

const initialState: LeadsState = {
  emails: [],
  loading: false,
  validating: false,
  error: null,
  site: '',
  strategy: 'standard',
  parameters: [],
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    fetchLeadsStart(state, action: PayloadAction<{ site: string; parameters: string[]; strategy: string }>) {
      state.loading = true;
      state.error = null;
      state.site = action.payload.site;
      state.parameters = action.payload.parameters;
      state.strategy = action.payload.strategy;
      // Clear previous if new search
      state.emails = []; 
    },
    fetchLeadsSuccess(state, action: PayloadAction<Lead[]>) {
      state.loading = false;
      state.emails = action.payload;
    },
    fetchLeadsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMoreLeadsStart(state) {
        state.loading = true;
        state.error = null;
    },
    fetchMoreLeadsSuccess(state, action: PayloadAction<Lead[]>) {
        state.loading = false;
        state.emails = [...state.emails, ...action.payload];
    },
    fetchMoreLeadsFailure(state, action: PayloadAction<string>) {
        state.loading = false;
        state.error = action.payload;
    },
    setLeadsData(state, action: PayloadAction<Lead[]>) {
        state.emails = action.payload;
    },
    // Validation Actions
    validateLeadsStart(state) {
        state.validating = true;
    },
    validateLeadUpdate(state, action: PayloadAction<{ email: string; isValid: boolean; status: string }>) {
        const index = state.emails.findIndex(l => l.email === action.payload.email);
        if (index !== -1) {
            state.emails[index].isValid = action.payload.isValid;
            state.emails[index].validationStatus = action.payload.status as any;
        }
    },
    validateLeadsFinished(state) {
        state.validating = false;
    }
  },
});

export const { 
    fetchLeadsStart, 
    fetchLeadsSuccess, 
    fetchLeadsFailure,
    fetchMoreLeadsStart,
    fetchMoreLeadsSuccess,
    fetchMoreLeadsFailure,
    setLeadsData,
    validateLeadsStart,
    validateLeadUpdate,
    validateLeadsFinished
} = leadsSlice.actions;
export default leadsSlice.reducer;
