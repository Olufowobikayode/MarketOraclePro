import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, CopyData } from '../types';
import { fetchCopyStart } from '../features/copy/copySlice';
import CopyDisplay from '../features/copy/CopyDisplay';
import { toggleCardSelection } from '../features/comparison/comparisonSlice';

const CopywritingPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CopyData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.copy);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);
  const { selectedCards } = useSelector((state: RootState) => state.comparison);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);


  useEffect(() => {
    if (isAvailable && isInitiated && data.length === 0) {
      dispatch(fetchCopyStart());
    }
  }, [isAvailable, isInitiated, data.length, dispatch]);

  const Card: React.FC<{card: CopyData, onSelect: () => void}> = ({card, onSelect}) => {
    const isSelected = selectedCards.some(c => c.id === card.id);

    const handleToggleSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(toggleCardSelection(card));
    };

    return (
      <div 
        className={`relative bg-stone-800 border rounded-lg shadow-lg p-4 cursor-pointer hover:bg-stone-700/50 transition-all ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-stone-700'}`} 
        onClick={onSelect}
      >
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
              <span className="text-xs font-medium bg-amber-900 text-amber-300 px-2 py-1 rounded-full flex-shrink-0 ml-2">{card.copyType}</span>
          </div>
          <p className="text-sm text-stone-400 line-clamp-2">{card.description}</p>
      </div>
    )
  }

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Copywriting Assistant</h1>
          <p className="text-stone-400 text-sm">Generating marketing copy for "{niche}"</p>
        </div>

        <div className="mt-6">
          {loading && <LoadingSpinner message={["Forging potent copy...", "Crafting compelling headlines...", "Writing conversion-focused text..."]} />}
          {error && <ErrorDisplay message={error} />}
          
          <div className="space-y-4">
            {data.map((cardData, index) => (
              <div key={cardData.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                <Card card={cardData} onSelect={() => setSelectedCard(cardData)} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <FullscreenModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || ''}
      >
        {selectedCard && <CopyDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default CopywritingPage;
