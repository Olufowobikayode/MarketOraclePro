
import { call, put, takeLatest, select, take } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { answerQuestionStream } from '../../services/geminiService';
import { sendQuestionStart, streamQuestionUpdate, sendQuestionSuccess, sendQuestionFailure } from './qnaSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import type { RootState } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

// Helper to bridge AsyncIterator to Saga EventChannel to avoid 'await' in generator
function createStreamChannel(stream: AsyncGenerator<string, void, unknown>) {
  return eventChannel(emitter => {
    const readStream = async () => {
      try {
        for await (const chunk of stream) {
          if (chunk) emitter(chunk);
        }
        emitter(END);
      } catch (e) {
        emitter(new Error(String(e)));
        emitter(END);
      }
    };
    readStream();
    return () => {
        // Optional cleanup
    };
  });
}

function* handleSendQuestion(action: PayloadAction<{ question: string; selectedContexts: string[] }>): Generator {
  try {
    const { question, selectedContexts } = action.payload;
    const fullState = (yield select()) as RootState;
    const session = fullState.oracleSession;

    const contextData: { [key: string]: any } = {};
    if (selectedContexts.includes('trends') && fullState.trends.data.length > 0) {
      contextData.marketAnalysis = fullState.trends.data;
    }
    if (selectedContexts.includes('keywords') && fullState.keywords.data.length > 0) {
      contextData.keywordResearch = fullState.keywords.data;
    }
    if (selectedContexts.includes('marketplaces') && fullState.marketplaces.data.length > 0) {
      contextData.platformFinder = fullState.marketplaces.data;
    }
    if (selectedContexts.includes('content') && fullState.content.data.length > 0) {
      contextData.contentStrategy = fullState.content.data;
    }
    if (selectedContexts.includes('socials') && fullState.socials.data.length > 0) {
      contextData.socialMediaStrategy = fullState.socials.data;
    }
    if (selectedContexts.includes('copy') && fullState.copy.data.length > 0) {
      contextData.copywriting = fullState.copy.data;
    }
    if (selectedContexts.includes('arbitrage') && fullState.arbitrage.data.length > 0) {
      contextData.salesArbitrage = fullState.arbitrage.data;
    }
    if (selectedContexts.includes('scenarios') && fullState.scenarios.data.length > 0) {
      contextData.scenarioPlanner = fullState.scenarios.data;
    }
    // New Contexts added for full access
    if (selectedContexts.includes('storeAnalysis') && fullState.storeAnalysis.data.length > 0) {
        contextData.storeCompetitorAnalysis = fullState.storeAnalysis.data;
    }
    if (selectedContexts.includes('products') && fullState.productFinder.results.length > 0) {
        contextData.productFindings = fullState.productFinder.results;
    }
    if (selectedContexts.includes('leads') && fullState.leads.emails.length > 0) {
        contextData.leadsGenerated = fullState.leads.emails;
    }
    // Add Media History
    const mediaHistory = Object.values(fullState.media.jobs).filter(j => j.status === 'completed');
    if (mediaHistory.length > 0) {
        contextData.mediaHistory = mediaHistory.map(j => ({
            type: j.jobType,
            prompt: j.prompt,
            analysis: j.analysisResult
        }));
    }

    const context = JSON.stringify(contextData, null, 2);

    // Call the service to get the AsyncGenerator
    const stream = yield call(answerQuestionStream, session, context, question);

    // Create a Saga EventChannel to consume the stream
    const channel = yield call(createStreamChannel, stream as AsyncGenerator<string, void, unknown>);

    while (true) {
        const chunk: any = yield take(channel);
        if (chunk === END) {
            break;
        }
        if (chunk instanceof Error) {
            throw chunk;
        }
        yield put(streamQuestionUpdate(chunk));
    }

    yield put(sendQuestionSuccess());

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(sendQuestionFailure(errorMessage));
  }
}

function* qnaSaga() {
  yield takeLatest(sendQuestionStart.type, handleSendQuestion);
}

export default qnaSaga;
