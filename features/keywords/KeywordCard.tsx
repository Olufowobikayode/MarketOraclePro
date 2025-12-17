
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { KeywordData, RootState } from '../../types';
import CardActionBar from '../../components/CardActionBar';
import { toggleCardSelection } from '../comparison/comparisonSlice';

// Helper function to safely render metric values that might be objects or arrays.
const formatMetricValue = (metric: unknown): string | number => {
    if (typeof metric === 'string' || typeof metric === 'number') {
        return metric;
    }
    if (Array.isArray(metric)) {
        return metric.join(' - ');
    }
    if (typeof metric === 'object' && metric !== null) {
        if ('primary' in metric && (metric as any).primary) return String((metric as any).primary);
        if ('value' in metric && (metric as any).value) return String((metric as any).value);
        if ('min' in metric && 'max' in metric) return `${(metric as any).min} - ${(metric as any).max}`;
        return JSON.stringify(metric); // Fallback
    }
    return 'N/A';
};


interface KeywordCardProps {
  card: KeywordData;
  onSelect: () => void;
}

const Metric: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-center">
        <div className="font-bold text-lg text-yellow-500">{value}</div>
        <div className="text-xs text-stone-400">{label}</div>
    </div>
);

const KeywordCard: React.FC<KeywordCardProps> = ({ card, onSelect }) => {
  const dispatch = useDispatch();
  const { selectedCards } = useSelector((state: RootState) => state.comparison);
  const isSelected = selectedCards.some(c => c.id === card.id);

  const handleToggleSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleCardSelection(card));
  };

  // Safely handle potentially missing metrics
  const intent = card.metrics?.keywordIntent || 'N/A';

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
          <h3 className="text-md font-bold text-amber-400 mb-2 truncate">{card.title}</h3>
          <p className="text-sm text-stone-400 mb-3 line-clamp-2">{card.description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-stone-300">Intent:</span>
            <span className="text-xs font-medium bg-sky-900 text-sky-300 px-2 py-1 rounded-full">{intent}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-stone-700/50 p-2 rounded-md mb-3">
              <Metric label="Volume" value={formatMetricValue(card.metrics?.volume)} />
              <Metric label="Difficulty" value={formatMetricValue(card.metrics?.difficulty)} />
              <Metric label="CPC" value={formatMetricValue(card.metrics?.cpc)} />
          </div>

          {card.serpAnalysis && (
             <div className="text-xs bg-stone-900/50 p-2 rounded border-l-2 border-purple-500">
                <span className="font-bold text-purple-400 block mb-1">SERP Insight:</span>
                <p className="text-stone-400 line-clamp-2">{card.serpAnalysis}</p>
             </div>
          )}
        </div>
      </div>
      <CardActionBar card={card} />
    </div>
  );
};

export default KeywordCard;
