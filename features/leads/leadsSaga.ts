
import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import { generateLeads } from '../../services/geminiService';
import { api } from '../../services/api';
import { 
    fetchLeadsStart, 
    fetchLeadsSuccess, 
    fetchLeadsFailure,
    fetchMoreLeadsStart,
    fetchMoreLeadsSuccess,
    fetchMoreLeadsFailure,
    validateLeadsStart,
    validateLeadUpdate,
    validateLeadsFinished
} from './leadsSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import type { Lead, RootState, OracleSessionState } from '../../types';
import { PayloadAction } from '@reduxjs/toolkit';

function* handleFetchLeads(action: PayloadAction<{ site: string; parameters: string[]; strategy: string }>): Generator {
  try {
    const { site, parameters, strategy } = action.payload;
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }

    const leadsData = yield call(generateLeads, site, parameters, strategy, session);
    yield put(fetchLeadsSuccess(leadsData as Lead[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchLeadsFailure(errorMessage));
  }
}

function* handleFetchMoreLeads(): Generator {
    try {
        const state: RootState = (yield select()) as RootState;
        const session = state.oracleSession;
        const { site, parameters, emails, strategy } = state.leads;

        if (!session.isInitiated) throw new Error("Session not initiated");

        const excludeEmails = emails.map(l => l.email);
        const leadsData = yield call(generateLeads, site, parameters, strategy, session, excludeEmails);
        
        yield put(fetchMoreLeadsSuccess(leadsData as Lead[]));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(fetchMoreLeadsFailure(errorMessage));
    }
}

function* handleValidateLeads(): Generator {
    const emails: Lead[] = (yield select((state: RootState) => state.leads.emails)) as Lead[];
    
    // Process in batches or sequentially to not overwhelm the free API
    for (const lead of emails) {
        // Skip if already validated
        if (lead.validationStatus !== 'pending' && lead.validationStatus !== undefined) continue;

        try {
            // Call external validation API
            const result: any = yield call(api.validateEmailWithExternalApi, lead.email);
            
            let isValid = false;
            let status = 'unknown';

            if (result) {
                // Logic for Disify response
                // { format: true, dns: true, disposable: false, ... }
                if (result.format && result.dns && !result.disposable) {
                    isValid = true;
                    status = 'valid';
                } else if (result.disposable) {
                    isValid = false;
                    status = 'risky'; // Disposable email
                } else if (!result.format || !result.dns) {
                    isValid = false;
                    status = 'invalid';
                }
            } else {
                // Fallback regex validation if API fails
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = regex.test(lead.email);
                status = isValid ? 'unknown' : 'invalid'; 
            }

            yield put(validateLeadUpdate({ email: lead.email, isValid, status }));
            
            // Small delay to be polite to the API
            yield new Promise(resolve => setTimeout(resolve, 300)); 

        } catch (e) {
            yield put(validateLeadUpdate({ email: lead.email, isValid: false, status: 'unknown' }));
        }
    }
    yield put(validateLeadsFinished());
}

function* leadsSaga() {
  yield takeLatest(fetchLeadsStart.type, handleFetchLeads);
  yield takeLatest(fetchMoreLeadsStart.type, handleFetchMoreLeads);
  yield takeLatest(validateLeadsStart.type, handleValidateLeads);
}

export default leadsSaga;
