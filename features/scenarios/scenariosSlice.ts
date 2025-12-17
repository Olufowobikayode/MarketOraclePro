
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ScenariosState, ScenarioData } from '../../types';

const initialState: ScenariosState = {
  data: [],
  loading: false,
  error: null,
  goalQuery: '',
};

const scenariosSlice = createSlice({
  name: 'scenarios',
  initialState,
  reducers: {
    fetchScenariosStart(state, action: PayloadAction<{ goalQuery: string }>) {
      state.loading = true;
      state.error = null;
      state.data = [];
      state.goalQuery = action.payload.goalQuery;
    },
    fetchScenariosSuccess(state, action: PayloadAction<ScenarioData[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchScenariosFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchScenariosStart, fetchScenariosSuccess, fetchScenariosFailure } = scenariosSlice.actions;
export default scenariosSlice.reducer;
