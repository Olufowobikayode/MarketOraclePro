
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MediaState, MediaJob, MediaAsset, StackType, MediaAnalysisResult } from '../../types';

const initialState: MediaState = {
  jobs: {},
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    // Generic Job Progress Handler
    mediaJobProgress(state, action: PayloadAction<MediaJob>) {
        const job = action.payload;
        if (!state.jobs[job.jobId]) {
            state.jobs[job.jobId] = job;
        } else {
            state.jobs[job.jobId] = { ...state.jobs[job.jobId], ...job };
        }
    },
    // Triggers for Sagas
    generateImageStart(state, action: PayloadAction<{ prompt: string, aspectRatio: string, usePro?: boolean, size?: string, cardId?: string, stackType?: StackType }>) {},
    editImageStart(state, action: PayloadAction<{ prompt: string, imageBase64: string, cardId?: string }>) {},
    generateVideoStart(state, action: PayloadAction<{ prompt: string, aspectRatio: string, imageBase64?: string, cardId?: string, stackType?: StackType }>) {},
    analyzeMediaStart(state, action: PayloadAction<{ mediaBase64: string, mimeType: string, prompt: string }>) {},

    // Success/Failure Handlers
    mediaJobSuccess(state, action: PayloadAction<{ jobId: string; asset?: MediaAsset, analysisResult?: MediaAnalysisResult }>) {
        const { jobId, asset, analysisResult } = action.payload;
        if(state.jobs[jobId]){
            state.jobs[jobId].status = 'completed';
            state.jobs[jobId].progress = 100;
            if(asset) state.jobs[jobId].asset = asset;
            if(analysisResult) state.jobs[jobId].analysisResult = analysisResult;
        }
    },
    mediaJobFailure(state, action: PayloadAction<{ jobId: string; error: string }>) {
        const { jobId, error } = action.payload;
        if(state.jobs[jobId]){
            state.jobs[jobId].status = 'failed';
            state.jobs[jobId].progress = 100;
            state.jobs[jobId].error = error;
        }
    },
  },
});

export const { 
    mediaJobProgress,
    generateImageStart,
    editImageStart,
    generateVideoStart,
    analyzeMediaStart,
    mediaJobSuccess, 
    mediaJobFailure
} = mediaSlice.actions;

export default mediaSlice.reducer;
