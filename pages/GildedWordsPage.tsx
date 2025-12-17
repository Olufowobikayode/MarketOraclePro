
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, CopyData } from '../types';
import { fetchCopyStart } from '../features/copy/copySlice';
import CopyDisplay from '../features/copy/CopyDisplay';

const GildedWordsPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CopyData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.copy);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);

  useEffect(() => {
    if (isInitiated && data.length === 0) {
      dispatch(fetchCopyStart());
    }
  }, [isInitiated, data.length, dispatch]);

  const Card: React.FC<{card: CopyData, onSelect: () => void}> = ({card, onSelect}) => (
    <div className="bg-stone-800 border border-stone-700 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-stone-700/50" onClick={onSelect}>
        <div className="flex justify-between items-start">
            <h3 className="text-md font-bold text-amber-400 mb-2">{card.title}</h3>
            <span className="text-xs font-medium bg-amber-900 text-amber-300 px-2 py-1 rounded-full flex-shrink-0 ml-2">{card.copyType}</span>
        </div>
        <p className="text-sm text-stone-400 line-clamp-2">{card.description}</p>
    </div>
  )

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Gilded Words</h1>
          <p className="text-stone-400 text-sm">Forging marketing copy for "{niche}"</p>
        </div>

        <div className="mt-6">
          {loading && <LoadingSpinner message="Forging potent copy..." />}
          {error && <ErrorDisplay message={error} />}
          
          <div className="space-y-4">
            {data.map((cardData) => (
              <Card key={cardData.id} card={cardData} onSelect={() => setSelectedCard(cardData)} />
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

export default GildedWordsPage;
