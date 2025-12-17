
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  checkTelegramAuth,
  loginDemo,
  loginSuccess,
  loginFailure,
} from './authSlice';
import { api } from '../../services/api';
import type { User, TelegramWebApp } from '../../types';

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        }
    }
}

// Validation via Backend
const verifyTelegramUser = async (initData: string): Promise<User> => {
    return await api.auth(initData);
};

function* handleCheckTelegramAuth(): Generator {
    try {
        // Expand app on load
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }

        const webApp = window.Telegram?.WebApp;
        if (webApp && webApp.initData) {
             const user = yield call(verifyTelegramUser, webApp.initData);
             yield put(loginSuccess(user as User));
        } else {
             // FIX: Explicitly fail so loading state clears and we redirect to Login
             // This allows the user to see the Login Page and choose Demo or Manual Entry
             yield put(loginFailure("No Telegram data found."));
        }
    } catch (error: any) {
        yield put(loginFailure(error.message));
    }
}

function* handleDemoLogin(): Generator {
    yield new Promise(resolve => setTimeout(resolve, 500));
    yield put(loginSuccess({
        id: 'demo-god-mode',
        telegramId: 777,
        username: 'demo_seeker',
        firstName: 'Demo Seeker',
        photoUrl: '', 
        plan: 'premium'
    }));
}

function* authSaga() {
  yield takeLatest(checkTelegramAuth.type, handleCheckTelegramAuth);
  yield takeLatest(loginDemo.type, handleDemoLogin);
}

export default authSaga;
