
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateImageStart, generateVideoStart } from './mediaSlice';
import type { RootState, CardBase, MediaJob } from '../../types';
import MediaDisplay from './MediaDisplay';

interface MediaGeneratorPanelProps {
  card: CardBase;
}

const MediaGeneratorPanel: React.FC<MediaGeneratorPanelProps> = ({ card }) => {
  const [prompt, setPrompt] = useState(`A promotional image for ${card.title}`);
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.media.jobs);

  const relevantJobs = useMemo(() => {
    return (Object.values(jobs) as MediaJob[]).filter(job => job.originatingCardId === card.id).sort((a,b) => b.jobId.localeCompare(a.jobId));
  }, [jobs, card.id]);
  
  const activeJob = relevantJobs.find(job => job.status === 'queued' || job.status === 'processing');

  const handleGenerateImage = () => {
    // FIX: Add default aspectRatio and fix payload to match updated action creator.
    dispatch(generateImageStart({ cardId: card.id, stackType: card.stackType, prompt, aspectRatio: '1:1' }));
  };
  const handleGenerateVideo = () => {
    // FIX: Fix payload to match updated action creator.
    dispatch(generateVideoStart({ cardId: card.id, stackType: card.stackType, prompt, aspectRatio: '16:9' }));
  };

  const JobStatus: React.FC<{ job: MediaJob }> = ({ job }) => (
    <div className="bg-stone-700/50 p-3 rounded-lg text-center my-2">
      <p className="text-sm font-semibold text-amber-300">Generation in progress...</p>
      <p className="text-xs text-stone-400 capitalize">{job.status} ({job.progress}%)</p>
       <div className="w-full bg-stone-600 rounded-full h-1.5 mt-2">
          <div className="bg-amber-500 h-1.5 rounded-full" style={{width: `${job.progress}%`}}></div>
      </div>
    </div>
  );

  return (
    <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-bold text-amber-400 mb-3">Generate Media</h3>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full bg-stone-700 text-white border border-stone-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
        rows={3}
        placeholder="Enter a prompt for your media..."
        disabled={!!activeJob}
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleGenerateImage}
          disabled={!!activeJob}
          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-lg text-xs hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Image
        </button>
        <button
          onClick={handleGenerateVideo}
          disabled={!!activeJob}
          className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-lg text-xs hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Video
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {activeJob && <JobStatus job={activeJob} />}
        {relevantJobs.map(job => (
            job.status === 'completed' && job.asset ? <MediaDisplay key={job.jobId} asset={job.asset} /> : null
        ))}
      </div>
    </div>
  );
};

export default MediaGeneratorPanel;
