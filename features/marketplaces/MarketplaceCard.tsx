
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { MarketplaceData, RootState } from '../../types';
import CardActionBar from '../../components/CardActionBar';
import { toggleCardSelection } from '../comparison/comparisonSlice';

interface MarketplaceCardProps {
  card: MarketplaceData;
  onSelect: () => void;
}

const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
}

const getSentimentColor = (score: number) => {
    if (score >= 75) return 'bg-green-900 text-green-300 border-green-700';
    if (score >= 50) return 'bg-yellow-900 text-yellow-300 border-yellow-700';
    return 'bg-red-900 text-red-300 border-red-700';
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ card, onSelect }) => {
  const dispatch = useDispatch();
  const { selectedCards } = useSelector((state: RootState) => state.comparison);
  const isSelected = selectedCards.some(c => c.id === card.id);

  const handleToggleSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleCardSelection(card));
  };
  
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
        <div className="p-4 cursor-pointer hover:bg-stone-700/50" onClick={onSelect}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-md font-bold text-amber-400 mb-2">{card.title}</h3>
              <p className="text-sm text-stone-400 line-clamp-2">{card.description}</p>
              
              {card.sentimentScore !== undefined && (
                  <div className="mt-3 flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSentimentColor(card.sentimentScore)}`}>
                          Reddit/HN Sentiment: {card.sentimentScore}%
                      </span>
                  </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-3xl font-bold ${getScoreColor(card.opportunityScore)}`}>{card.opportunityScore}</div>
              <div className="text-xs text-stone-400">Opp. Score</div>
            </div>
          </div>
        </div>
      </div>
      <CardActionBar card={card} />
    </div>
  );
};

export default MarketplaceCard;
