
import { call, put, takeLatest, delay, select } from 'redux-saga/effects';
import { 
    generateImageFromPrompt,
    editImageWithPrompt,
    generateVideoFromPrompt,
    checkVideoOperationStatus,
    analyzeMediaContent,
    getCurrentApiKey
} from '../../services/geminiService';
import { 
    generateImageStart, 
    editImageStart,
    generateVideoStart,
    analyzeMediaStart,
    mediaJobProgress,
    mediaJobSuccess, 
    mediaJobFailure
} from './mediaSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState, MediaJob, StackType } from '../../types';

// --- IMAGE GENERATION (Flash & Pro) ---
function* handleGenerateImage(action: PayloadAction<{ prompt: string; aspectRatio: string; usePro?: boolean; size?: string; cardId?: string; stackType?: StackType }>): Generator {
  const { prompt, aspectRatio, usePro, size, cardId, stackType } = action.payload;
  const jobId = `img-${Date.now()}`;
  try {
    yield put(mediaJobProgress({ 
        jobId, 
        jobType: 'generate-image',
        status: 'processing', 
        progress: 10, 
        prompt, 
        originatingCardId: cardId, 
        stackType 
    }));
    
    const imageUrl = yield call(generateImageFromPrompt, prompt, aspectRatio, usePro, size);
    
    yield put(mediaJobSuccess({
      jobId,
      asset: {
        id: `asset-${Date.now()}`,
        type: 'image',
        url: imageUrl as string,
        prompt: prompt,
      }
    }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(mediaJobFailure({ jobId, error: errorMessage }));
  }
}

// --- IMAGE EDITING ---
function* handleEditImage(action: PayloadAction<{ prompt: string; imageBase64: string; cardId?: string }>): Generator {
    const { prompt, imageBase64, cardId } = action.payload;
    const jobId = `edit-${Date.now()}`;
    try {
        yield put(mediaJobProgress({ 
            jobId, 
            jobType: 'edit-image',
            status: 'processing', 
            progress: 20, 
            prompt, 
            originatingCardId: cardId 
        }));

        const imageUrl = yield call(editImageWithPrompt, imageBase64, prompt);

        yield put(mediaJobSuccess({
            jobId,
            asset: {
                id: `asset-${Date.now()}`,
                type: 'image',
                url: imageUrl as string,
                prompt: prompt,
            }
        }));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        yield put(mediaJobFailure({ jobId, error: errorMessage }));
    }
}

// --- VIDEO GENERATION (Veo) ---
function* handleGenerateVideo(action: PayloadAction<{ prompt: string; aspectRatio: string; imageBase64?: string; cardId?: string; stackType?: StackType }>): Generator {
    const { prompt, aspectRatio, imageBase64, cardId, stackType } = action.payload;
    const jobId = `vid-${Date.now()}`;
    try {
        yield put(mediaJobProgress({ 
            jobId, 
            jobType: 'generate-video',
            status: 'queued', 
            progress: 5, 
            prompt, 
            originatingCardId: cardId, 
            stackType 
        }));
        
        let operation = yield call(generateVideoFromPrompt, prompt, aspectRatio, imageBase64);
        yield put(mediaJobProgress({ 
            jobId, 
            jobType: 'generate-video',
            status: 'processing', 
            progress: 15, 
            prompt, 
            originatingCardId: cardId, 
            stackType 
        }));

        while (operation && !(operation as any).done) {
            yield delay(10000); // Poll every 10 seconds
            operation = yield call(checkVideoOperationStatus, operation);
            
            const currentJob = (yield select((state: RootState) => state.media.jobs[jobId])) as MediaJob | undefined;
            const currentProgress = currentJob ? currentJob.progress : 15;
            const nextProgress = Math.min(currentProgress + 10, 90);

            yield put(mediaJobProgress({ 
                jobId, 
                jobType: 'generate-video',
                status: 'processing', 
                progress: nextProgress, 
                prompt, 
                originatingCardId: cardId, 
                stackType 
            }));
        }

        const videoUri = (operation as any).response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) {
            throw new Error("Video generation completed but no video URI was found.");
        }
        
        const workingApiKey = yield call(getCurrentApiKey);
        const finalUrl = `${videoUri}&key=${workingApiKey}`;
        
        yield put(mediaJobSuccess({
            jobId,
            asset: {
                id: `asset-${Date.now()}`,
                type: 'video',
                url: finalUrl,
                prompt,
            }
        }));

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(mediaJobFailure({ jobId, error: errorMessage }));
    }
}

// --- MEDIA ANALYSIS ---
function* handleAnalyzeMedia(action: PayloadAction<{ mediaBase64: string; mimeType: string; prompt: string }>): Generator {
    const { mediaBase64, mimeType, prompt } = action.payload;
    const jobId = `ana-${Date.now()}`;
    try {
        yield put(mediaJobProgress({ 
            jobId, 
            jobType: 'analyze-media',
            status: 'processing', 
            progress: 25, 
            prompt 
        }));
        
        const result = yield call(analyzeMediaContent, mediaBase64, mimeType, prompt);

        yield put(mediaJobSuccess({
            jobId,
            analysisResult: result as any
        }));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        yield put(mediaJobFailure({ jobId, error: errorMessage }));
    }
}

function* mediaSaga() {
  yield takeLatest(generateImageStart.type, handleGenerateImage);
  yield takeLatest(editImageStart.type, handleEditImage);
  yield takeLatest(generateVideoStart.type, handleGenerateVideo);
  yield takeLatest(analyzeMediaStart.type, handleAnalyzeMedia);
}

export default mediaSaga;
