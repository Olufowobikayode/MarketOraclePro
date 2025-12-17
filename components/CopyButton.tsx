
import React from 'react';
import { useToast } from '../hooks/useToast';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const showToast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Copied to clipboard!');
    }, (err) => {
      showToast('Failed to copy', 'error');
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <button onClick={handleCopy} aria-label="Copy" className="flex flex-col items-center text-stone-400 hover:text-amber-400 transition-colors text-xs">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
      <span className="mt-1">Copy</span>
    </button>
  );
};

export default CopyButton;