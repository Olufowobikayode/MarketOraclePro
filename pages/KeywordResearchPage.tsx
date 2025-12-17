
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KeywordCard from '../features/keywords/KeywordCard';
import KeywordDisplay from '../features/keywords/KeywordIntelligenceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, KeywordData } from '../types';
import { fetchKeywordsStart, fetchMoreKeywordsStart } from '../features/keywords/keywordsSlice';

const KeywordResearchPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<KeywordData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.keywords);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

  useEffect(() => {
    if (isAvailable && isInitiated && data.length === 0) {
      dispatch(fetchKeywordsStart());
    }
  }, [isAvailable, isInitiated, data.length, dispatch]);

  const handleMoreOptions = () => {
      dispatch(fetchMoreKeywordsStart());
  }

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Keyword Research</h1>
          <p className="text-stone-400 text-sm">SEO and keyword analysis for "{niche}"</p>
        </div>

         <div className="mt-6">
          {error && <ErrorDisplay message={error} />}

          <div className="space-y-4">
            {data.map((cardData, index) => (
              <div key={cardData.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <KeywordCard card={cardData} onSelect={() => setSelectedCard(cardData)} />
              </div>
            ))}
          </div>

          {loading && <LoadingSpinner message={["Mapping SEO constellations...", "Calculating keyword difficulty...", "Finding long-tail opportunities..."]} />}

          {!loading && data.length > 0 && isAvailable && (
              <div className="mt-8 text-center">
                  <button 
                    onClick={handleMoreOptions}
                    className="bg-stone-800 border-2 border-amber-600 text-amber-400 font-bold py-3 px-8 rounded-lg hover:bg-stone-700 hover:text-white transition-all transform hover:scale-105 shadow-lg"
                  >
                      More Options
                  </button>
              </div>
          )}
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

export default KeywordResearchPage;