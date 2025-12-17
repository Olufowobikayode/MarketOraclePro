
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KeywordCard from '../features/keywords/KeywordCard';
import KeywordDisplay from '../features/keywords/KeywordIntelligenceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, KeywordData } from '../types';
import { fetchKeywordsStart } from '../features/keywords/keywordsSlice';

const CosmicKeywordsPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<KeywordData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.keywords);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);

  useEffect(() => {
    if (isInitiated && data.length === 0) {
      dispatch(fetchKeywordsStart());
    }
  }, [isInitiated, data.length, dispatch]);

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Cosmic Keywords</h1>
          <p className="text-stone-400 text-sm">Mapping the SEO constellations for "{niche}"</p>
        </div>

         <div className="mt-6">
          {loading && <LoadingSpinner message="Analyzing keywords..." />}
          {error && <ErrorDisplay message={error} />}

          <div className="space-y-4">
            {data.map((cardData) => (
              <KeywordCard key={cardData.id} card={cardData} onSelect={() => setSelectedCard(cardData)} />
            ))}
          </div>
        </div>
      </div>

      <FullscreenModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || ''}
      >
        {selectedCard && <KeywordDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default CosmicKeywordsPage;