

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendQuestionStart } from '../features/qna/qnaSlice';
import type { RootState, ChatMessage } from '../types';
import ErrorDisplay from '../components/ErrorDisplay';

const CommuneWithOraclePage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state: RootState) => state.qna);
  const { trends, keywords, marketplaces, content } = useSelector((state: RootState) => ({
    trends: state.trends.data,
    keywords: state.keywords.data,
    marketplaces: state.marketplaces.data,
    content: state.content.data,
  }));
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const contextExists = trends.length > 0 || keywords.length > 0 || marketplaces.length > 0 || content.length > 0;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !loading) {
      // FIX: The sendQuestionStart action requires a `selectedContexts` property.
      // Since this component doesn't have context selection UI, pass an empty array.
      dispatch(sendQuestionStart({ question, selectedContexts: [] }));
      setQuestion('');
    }
  };
  
  const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
      <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
         {!isUser && <span className="text-2xl -mb-1">🔮</span>}
        <div className={`max-w-md px-4 py-2 rounded-2xl ${isUser ? 'bg-amber-800' : 'bg-stone-700'}`}>
          <p className="text-white whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 h-full flex flex-col max-w-4xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-amber-300">Commune with the Oracle</h2>
        <p className="text-stone-400 text-sm">
          Ask strategic questions based on the prophecies you have received.
        </p>
         {!contextExists && (
            <div className="mt-2 text-center bg-yellow-900/50 border border-yellow-500 text-yellow-300 px-3 py-2 rounded-lg text-xs">
                <strong>Heed this:</strong> For the clearest answers, first seek prophecies on other scrolls.
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-stone-800/50 p-4 rounded-lg border border-stone-700/50 space-y-4 mb-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
         {loading && (
             <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-stone-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
             </div>
         )}
        <div ref={endOfMessagesRef} />
      </div>

      <div>
        {error && <ErrorDisplay message={error} />}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., 'What is the greatest risk?'"
            className="flex-grow bg-stone-700 text-white border-2 border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50"
            disabled={loading || !question.trim()}
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommuneWithOraclePage;