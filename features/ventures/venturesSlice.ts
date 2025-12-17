
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { VenturesState, VentureVision, VentureBlueprint } from '../../types';

const initialState: VenturesState = {
  visions: [],
  selectedVision: null,
  blueprint: null,
  visionsLoading: false,
  blueprintLoading: false,
  visionsError: null,
  blueprintError: null,
  progress: null,
};

const venturesSlice = createSlice({
  name: 'ventures',
  initialState,
  reducers: {
    // Visions Flow
    fetchVisionsStart(state) {
      state.visionsLoading = true;
      state.visionsError = null;
      state.visions = [];
      state.blueprint = null;
      state.progress = { message: 'Initiating vision quest...', percentage: 0 };
    },
    fetchVisionsProgress(state, action: PayloadAction<{ message: string; percentage: number }>) {
        state.progress = action.payload;
    },
    fetchVisionsSuccess(state, action: PayloadAction<VentureVision[]>) {
      state.visionsLoading = false;
      state.visions = action.payload;
      state.progress = null;
    },
    fetchVisionsFailure(state, action: PayloadAction<string>) {
      state.visionsLoading = false;
      state.visionsError = action.payload;
      state.progress = null;
    },
    
    // Fetch More Visions
    fetchMoreVisionsStart(state) {
        state.visionsLoading = true;
        state.visionsError = null;
        state.progress = { message: 'Seeking further visions...', percentage: 0 };
    },
    fetchMoreVisionsSuccess(state, action: PayloadAction<VentureVision[]>) {
        state.visionsLoading = false;
        state.visions = [...state.visions, ...action.payload];
        state.progress = null;
    },
    fetchMoreVisionsFailure(state, action: PayloadAction<string>) {
        state.visionsLoading = false;
        state.visionsError = action.payload;
        state.progress = null;
    },

    // Blueprint Flow
    selectVision(state, action: PayloadAction<VentureVision>) {
        state.selectedVision = action.payload;
    },
    fetchBlueprintStart(state, action: PayloadAction<{ vision: VentureVision }>) {
        state.blueprintLoading = true;
        state.blueprintError = null;
        state.blueprint = null;
        state.progress = { message: 'Blueprint chosen. Forging destiny...', percentage: 0 };
    },
    fetchBlueprintProgress(state, action: PayloadAction<{ message: string; percentage: number }>) {
        state.progress = action.payload;
    },
    fetchBlueprintSuccess(state, action: PayloadAction<VentureBlueprint>) {
      state.blueprintLoading = false;
      state.blueprint = action.payload;
      state.progress = null;
    },
    fetchBlueprintFailure(state, action: PayloadAction<string>) {
      state.blueprintLoading = false;
      state.blueprintError = action.payload;
      state.progress = null;
    },
    clearBlueprint(state) {
        state.blueprint = null;
        state.selectedVision = null;
        state.blueprintError = null;
    }
  },
});

export const {
  fetchVisionsStart,
  fetchVisionsProgress,
  fetchVisionsSuccess,
  fetchVisionsFailure,
  fetchMoreVisionsStart,
  fetchMoreVisionsSuccess,
  fetchMoreVisionsFailure,
  selectVision,
  fetchBlueprintStart,
  fetchBlueprintProgress,
  fetchBlueprintSuccess,
  fetchBlueprintFailure,
  clearBlueprint,
} = venturesSlice.actions;

export default venturesSlice.reducer;