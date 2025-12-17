
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, MediaJob } from '../types';
import { generateImageStart } from '../features/media/mediaSlice';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  cardId?: string; // Optional: To associate with media
  stackType?: any;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ isOpen, onClose, title, children, cardId, stackType }) => {
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.media.jobs);

  if (!isOpen) return null;

  // Find associated media
  const completedJob = cardId ? (Object.values(jobs) as MediaJob[])
    .filter(job => 
        job.originatingCardId === cardId && 
        job.status === 'completed' && 
        job.asset
    )
    .sort((a, b) => b.jobId.localeCompare(a.jobId))[0] : null;

  const handleRegenerateImage = () => {
      if (!cardId) return;
      // Use basic visual prompt logic similar to CardActionBar
      const visualPrompt = `High quality image of ${title}. Professional style. NO TEXT.`;
      dispatch(generateImageStart({
          cardId: cardId,
          stackType: stackType || 'trends',
          prompt: visualPrompt,
          aspectRatio: '1:1'
      }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-end"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`w-full max-h-[95vh] bg-stone-900 rounded-t-2xl shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-4 border-b border-stone-700/50 flex items-center justify-between sticky top-0 bg-stone-900 rounded-t-2xl z-20">
           <div className="w-8"></div> {/* Spacer */}
          <h2 className="text-lg font-bold text-center text-white truncate px-2">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-700 hover:bg-stone-600 text-stone-300"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Display Media at Top if available */}
          {completedJob && completedJob.asset && (
              <div className="mb-6 bg-black rounded-lg overflow-hidden border border-stone-700 relative group">
                  {completedJob.asset.type === 'image' ? (
                      <img src={completedJob.asset.url} alt={title} className="w-full h-auto max-h-80 object-contain mx-auto" />
                  ) : (
                      <video src={completedJob.asset.url} className="w-full h-auto max-h-80 mx-auto" controls />
                  )}
                  
                  {/* Media Controls Overlay */}
                  <div className="absolute top-2 right-2 flex gap-2">
                      <a 
                        href={completedJob.asset.url} 
                        download={`oracle-media-${completedJob.jobId}`} 
                        target="_blank"
                        rel="noreferrer"
                        className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                        title="Download"
                      >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      </a>
                      <button 
                        onClick={handleRegenerateImage}
                        className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                        title="Regenerate Image"
                      >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                      </button>
                  </div>
              </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;
