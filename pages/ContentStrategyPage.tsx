
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ContentCard from '../features/content/ContentCard';
import ContentDisplay from '../features/content/ContentDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, ContentData } from '../types';
import { fetchContentStart, fetchMoreContentStart } from '../features/content/contentSlice';

const ContentStrategyPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<ContentData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.content);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

  useEffect(() => {
    if (isAvailable && isInitiated && data.length === 0) {
      dispatch(fetchContentStart());
    }
  }, [isAvailable, isInitiated, data.length, dispatch]);

  const handleMoreOptions = () => {
      dispatch(fetchMoreContentStart());
  }

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-amber-300">Content Strategy</h1>
            <p className="text-stone-400 text-sm">Generating content ideas for "{niche}"</p>
        </div>
        <div className="mt-6">
          {error && <ErrorDisplay message={error} />}

          <div className="space-y-4">
            {data.map((cardData) => (
              <ContentCard key={cardData.id} card={cardData} onSelect={() => setSelectedCard(cardData)} />
            ))}
          </div>

          {loading && <LoadingSpinner message="Generating Ideas..." />}

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
        {selectedCard && <ContentDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default ContentStrategyPage;