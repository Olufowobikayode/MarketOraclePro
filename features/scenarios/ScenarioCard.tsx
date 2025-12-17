
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ScenarioData, RootState } from '../../types';
import CardActionBar from '../../components/CardActionBar';
import { toggleCardSelection } from '../comparison/comparisonSlice';

interface ScenarioCardProps {
  card: ScenarioData;
  onSelect: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ card, onSelect }) => {
  const dispatch = useDispatch();
  const { selectedCards } = useSelector((state: RootState) => state.comparison);
  const isSelected = selectedCards.some(c => c.id === card.id);

  const handleToggleSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleCardSelection(card));
  };
  
  return (
    <div className={`bg-stone-800 border rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-200 ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-stone-700'}`}>
      <div className="p-4 cursor-pointer hover:bg-stone-700/50 flex-grow relative" onClick={onSelect}>
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
        <div className="flex justify-between items-start">
            <h3 className="text-md font-bold text-amber-400 mb-2 pr-10">{card.title}</h3>
        </div>
        <p className="text-sm text-stone-400 line-clamp-2">{card.description}</p>
      </div>
      <CardActionBar card={card} />
    </div>
  );
};

export default ScenarioCard;
