
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrendCard from '../features/trends/TrendCard';
import TrendDisplay from '../features/trends/TrendsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import CreateAlertModal from '../components/CreateAlertModal';
import type { RootState, TrendData } from '../types';
import { fetchTrendsStart, fetchMoreTrendsStart } from '../features/trends/trendsSlice';

const MarketAnalysisPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<TrendData | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.trends);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

  useEffect(() => {
    // Fetch data only if API is available, the session is initiated, and there's no data yet.
    if (isAvailable && isInitiated && data.length === 0) {
      dispatch(fetchTrendsStart());
    }
  }, [isAvailable, isInitiated, data.length, dispatch]);

  const handleMoreOptions = () => {
      dispatch(fetchMoreTrendsStart());
  };

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto animate-fade-in relative">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Market Analysis Report</h1>
          <p className="text-stone-400 text-sm">Analysis of opportunities for your niche: "{niche}"</p>
        </div>

        {/* Alerts Button */}
        <div className="absolute top-4 right-4">
            <button 
                onClick={() => setIsAlertModalOpen(true)}
                className="bg-stone-800 p-2 rounded-full border border-stone-600 hover:border-amber-500 text-stone-400 hover:text-amber-400 transition-colors shadow-lg"
                title="Set Trend Alerts"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </button>
        </div>

        <div className="mt-6">
          {error && <ErrorDisplay message={error} />}
          
          <div className="space-y-4">
            {data.map((cardData, index) => (
              <div key={cardData.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`}}>
                <TrendCard card={cardData} onSelect={() => setSelectedCard(cardData)} />
              </div>
            ))}
          </div>

          {loading && <LoadingSpinner message={["Analyzing market signals...", "Identifying key trends...", "Assessing competitors..."]} />}

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
        {selectedCard && <TrendDisplay data={selectedCard} />}
      </FullscreenModal>

      <CreateAlertModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} />
    </>
  );
};

export default MarketAnalysisPage;
