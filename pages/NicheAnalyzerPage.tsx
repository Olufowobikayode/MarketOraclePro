
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrendCard from '../features/trends/TrendCard';
import TrendDisplay from '../features/trends/TrendsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, TrendData } from '../types';
import { fetchTrendsStart } from '../features/trends/trendsSlice';

const GrandStrategyPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<TrendData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.trends);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);

  useEffect(() => {
    // Fetch data only if the session is initiated and there's no data yet.
    if (isInitiated && data.length === 0) {
      dispatch(fetchTrendsStart());
    }
  }, [isInitiated, data.length, dispatch]);

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Grand Strategy Prophecy</h1>
          <p className="text-stone-400 text-sm">Paths of potential for your niche: "{niche}"</p>
        </div>

        <div className="mt-6">
          {loading && <LoadingSpinner message="Divining strategic paths..." />}
          {error && <ErrorDisplay message={error} />}
          
          <div className="space-y-4">
            {data.map((cardData) => (
              <TrendCard key={cardData.id} card={cardData} onSelect={() => setSelectedCard(cardData)} />
            ))}
          </div>
        </div>
      </div>
      
      <FullscreenModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || ''}
      >
        {selectedCard && <TrendDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default GrandStrategyPage;