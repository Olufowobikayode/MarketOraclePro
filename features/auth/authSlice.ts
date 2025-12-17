
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true, 
  error: null,
  apiKey: localStorage.getItem('user_gemini_api_key') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkTelegramAuth(state) {
      state.loading = true;
    },
    loginDemo(state) {
        state.loading = true;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    setApiKey(state, action: PayloadAction<string>) {
        state.apiKey = action.payload;
        localStorage.setItem('user_gemini_api_key', action.payload);
    },
    clearApiKey(state) {
        state.apiKey = null;
        localStorage.removeItem('user_gemini_api_key');
    },
    updateUserPlan(state, action: PayloadAction<User['plan']>) {
        if (state.user) {
            state.user.plan = action.payload;
        }
    }
  },
});

export const {
  checkTelegramAuth,
  loginDemo,
  loginSuccess,
  loginFailure,
  logout,
  setApiKey,
  clearApiKey,
  updateUserPlan
} = authSlice.actions;

export default authSlice.reducer;
