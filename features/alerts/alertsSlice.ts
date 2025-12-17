
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertsState, TrendAlert } from '../../types';

const initialState: AlertsState = {
    activeAlerts: [],
    triggeredAlertMessage: null
};

const alertsSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        addAlert(state, action: PayloadAction<{ keyword: string; minVelocity: string }>) {
            const newAlert: TrendAlert = {
                id: `alert-${Date.now()}`,
                keyword: action.payload.keyword,
                minVelocity: action.payload.minVelocity,
                isActive: true
            };
            state.activeAlerts.push(newAlert);
        },
        removeAlert(state, action: PayloadAction<string>) {
            state.activeAlerts = state.activeAlerts.filter(a => a.id !== action.payload);
        },
        triggerAlert(state, action: PayloadAction<string>) {
            state.triggeredAlertMessage = action.payload;
        },
        clearTriggeredAlert(state) {
            state.triggeredAlertMessage = null;
        }
    }
});

export const { addAlert, removeAlert, triggerAlert, clearTriggeredAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
