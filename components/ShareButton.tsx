
import React from 'react';
import { useToast } from '../hooks/useToast';

interface ShareButtonProps {
  text: string;
  title?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ text, title = "Goddess Saga Insight" }) => {
  const showToast = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        showToast('Could not share content', 'error');
      }
    } else {
      showToast('Web Share not supported on this browser.', 'error');
    }
  };

  return (
    <button onClick={handleShare} aria-label="Share" className="flex flex-col items-center text-stone-400 hover:text-amber-400 transition-colors text-xs">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>
        <span className="mt-1">Share</span>
    </button>
  );
};

export default ShareButton;