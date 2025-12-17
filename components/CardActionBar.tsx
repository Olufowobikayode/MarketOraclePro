
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateImageStart, generateVideoStart } from '../features/media/mediaSlice';
import type { CardBase, RootState, MediaJob } from '../types';
import ShareButton from './ShareButton';
import CopyButton from './CopyButton';

interface CardActionBarProps {
  card: CardBase;
}

const ActionButton: React.FC<{ onClick: (e: React.MouseEvent) => void; children: React.ReactNode; label: string; disabled?: boolean; isLoading?: boolean }> = ({ onClick, children, label, disabled, isLoading }) => (
    <button 
        onClick={onClick} 
        aria-label={label} 
        className="flex flex-col items-center text-stone-400 hover:text-amber-400 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-stone-400" 
        disabled={disabled || isLoading}
    >
        {isLoading ? (
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
            children
        )}
        <span className="mt-1">{label}</span>
    </button>
);

const CardActionBar: React.FC<CardActionBarProps> = ({ card }) => {
  const dispatch = useDispatch();
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);
  const jobs = useSelector((state: RootState) => state.media.jobs);

  // Check for active jobs for this specific card
  const activeJob = useMemo(() => {
      return (Object.values(jobs) as MediaJob[]).find(job => 
          job.originatingCardId === card.id && 
          (job.status === 'queued' || job.status === 'processing')
      );
  }, [jobs, card.id]);

  const isGeneratingImage = activeJob && activeJob.jobType === 'generate-image';
  const isGeneratingVideo = activeJob && activeJob.jobType === 'generate-video';

  const handleGenerateImage = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent opening modal if clicking the action button directly
      // Professional Image Prompt Engineering
      // Explicitly instruct to avoid text and focus on visual elements
      const visualPrompt = `A high-quality, photorealistic professional image representing the concept of: ${card.title}. 
      Context: ${card.description.substring(0, 150)}. 
      Style: Cinematic lighting, 8k resolution, highly detailed. 
      IMPORTANT: DO NOT INCLUDE ANY TEXT, WORDS, OR LETTERS IN THE IMAGE. PURELY VISUAL REPRESENTATION.`;

      dispatch(generateImageStart({
          cardId: card.id,
          stackType: card.stackType,
          prompt: visualPrompt,
          aspectRatio: '1:1'
      }));
  };

  const handleGenerateVideo = (e: React.MouseEvent) => {
      e.stopPropagation();
      const visualPrompt = `A cinematic 15-second video visualizing the concept: ${card.title}. 
      Scene description: ${card.description.substring(0, 200)}. 
      High production value, professional lighting.`;

      dispatch(generateVideoStart({
          cardId: card.id,
          stackType: card.stackType,
          prompt: visualPrompt,
          aspectRatio: '16:9'
      }));
  };

  const shareText = `${card.title}\n\n${card.description}`;
  
  return (
    <div className="mt-4 pt-2 border-t border-stone-700/50 flex justify-around items-center" onClick={(e) => e.stopPropagation()}>
        <ShareButton text={shareText} />
        <CopyButton textToCopy={shareText} />
      <ActionButton onClick={handleGenerateImage} label="Image" disabled={!isAvailable} isLoading={isGeneratingImage}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </ActionButton>
      <ActionButton onClick={handleGenerateVideo} label="Video" disabled={!isAvailable} isLoading={isGeneratingVideo}>
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
      </ActionButton>
    </div>
  );
};

export default CardActionBar;
