
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { TrendData, RootState, MediaJob } from '../../types';
import CardActionBar from '../../components/CardActionBar';
import { toggleCardSelection } from '../comparison/comparisonSlice';

interface TrendCardProps {
  card: TrendData;
  onSelect: () => void;
}

const getVelocityColor = (velocity?: string) => {
    if (!velocity) return 'bg-stone-700 text-stone-300';
    const v = velocity.toLowerCase();
    if (v.includes('explosive')) return 'bg-red-900 text-red-200 border border-red-700 animate-pulse';
    if (v.includes('high')) return 'bg-orange-900 text-orange-200 border border-orange-700';
    if (v.includes('steady')) return 'bg-green-900 text-green-200 border border-green-700';
    if (v.includes('declining')) return 'bg-stone-700 text-stone-400';
    return 'bg-blue-900 text-blue-200 border border-blue-700';
};

const TrendCard: React.FC<TrendCardProps> = ({ card, onSelect }) => {
  const dispatch = useDispatch();
  const { jobs, selectedCards } = useSelector((state: RootState) => ({
    jobs: state.media.jobs,
    selectedCards: state.comparison.selectedCards,
  }));
  const isSelected = selectedCards.some(c => c.id === card.id);

  const handleToggleSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleCardSelection(card));
  };


  // Find the most recent, completed job (image or video) for this card
  const completedJob = (Object.values(jobs) as MediaJob[])
    .filter(job => 
        job.originatingCardId === card.id && 
        job.status === 'completed' && 
        job.asset
    )
    .sort((a, b) => b.jobId.localeCompare(a.jobId))[0];

  // Check if there is any job currently in progress for this card
  const pendingJob = (Object.values(jobs) as MediaJob[])
    .find(job => 
        job.originatingCardId === card.id && 
        (job.status === 'processing' || job.status === 'queued')
    );
    
  const sourceCount = card.sources?.length || 0;

  return (
    <div className={`bg-stone-800 border rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-stone-700'}`}>
      <div className="relative">
         <button 
          onClick={handleToggleSelection} 
          aria-label={isSelected ? 'Deselect for comparison' : 'Select for comparison'}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-amber-500 text-white' : 'bg-stone-900/50 text-stone-300 hover:bg-stone-700'}`}
        >
          {isSelected ? 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> :
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          }
        </button>
        <div className="cursor-pointer" onClick={onSelect}>
          {completedJob && completedJob.asset ? (
            completedJob.asset.type === 'image' ? (
              <img src={completedJob.asset.url} alt={card.title} className="w-full h-40 object-cover" />
            ) : (
              <video src={completedJob.asset.url} className="w-full h-40 object-cover" controls muted autoPlay loop playsInline />
            )
          ) : pendingJob ? (
            <div className="w-full h-40 bg-stone-700/50 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-amber-400"></div>
              <p className="text-xs text-stone-300 mt-2">
                {pendingJob.jobId.startsWith('vid-') ? 'Generating video...' : 'Generating image...'}
              </p>
            </div>
          ) : null}
          
          <div className={
            `p-4 ${completedJob?.asset 
              ? 'absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm' 
              : ''
            }`
          }>
            <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-md font-bold text-amber-400">{card.title}</h3>
                {card.velocity && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide whitespace-nowrap ${getVelocityColor(card.velocity)}`}>
                        {card.velocity}
                    </span>
                )}
            </div>
            <p className="text-sm text-stone-400 line-clamp-2 mb-2">{card.description}</p>
            
            {sourceCount > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-stone-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    <span>{sourceCount} Sources</span>
                </div>
            )}
          </div>
        </div>
      </div>
      <CardActionBar card={card} />
    </div>
  );
};

export default TrendCard;
