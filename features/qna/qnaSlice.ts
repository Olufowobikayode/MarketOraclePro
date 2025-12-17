
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { QnaState, ChatMessage } from '../../types';

const initialState: QnaState = {
  messages: [
    {
      role: 'assistant',
      content: "I have analyzed the provided reports. How can I help you further?",
    },
  ],
  loading: false,
  error: null,
};

const qnaSlice = createSlice({
  name: 'qna',
  initialState,
  reducers: {
    sendQuestionStart(state, action: PayloadAction<{ question: string; selectedContexts: string[] }>) {
      state.messages.push({ role: 'user', content: action.payload.question });
      // Add empty assistant message placeholder for streaming
      state.messages.push({ role: 'assistant', content: '' });
      state.loading = true;
      state.error = null;
    },
    streamQuestionUpdate(state, action: PayloadAction<string>) {
        // Append text to the last message (which is the assistant's placeholder)
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content += action.payload;
        }
    },
    sendQuestionSuccess(state) {
      // Just mark loading as false, content is already updated via stream
      state.loading = false;
    },
    sendQuestionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      const lastMsg = state.messages[state.messages.length - 1];
      if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content === '') {
          lastMsg.content = `I'm sorry, I encountered an error. ${action.payload}`;
      } else {
          state.messages.push({ role: 'assistant', content: `Error: ${action.payload}` });
      }
    },
  },
});

export const { sendQuestionStart, streamQuestionUpdate, sendQuestionSuccess, sendQuestionFailure } = qnaSlice.actions;
export default qnaSlice.reducer;
