
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, ArbitrageData } from '../types';
import { fetchArbitrageStart, fetchMoreArbitrageStart } from '../features/arbitrage/arbitrageSlice';
import ArbitrageCard from '../features/arbitrage/ArbitrageCard';
import ArbitrageDisplay from '../features/arbitrage/ArbitrageDisplay';

const SalesArbitragePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<ArbitrageData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error, productQuery } = useSelector((state: RootState) => state.arbitrage);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      dispatch(fetchArbitrageStart({ productQuery: query }));
    }
  };

  const handleLoadMore = () => {
      dispatch(fetchMoreArbitrageStart());
  };

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto animate-fade-in pb-24">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Sales Arbitrage</h1>
          <p className="text-stone-400 text-sm">Find price gaps & generate complete sales packages.</p>
        </div>

        <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700/50 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a product to analyze..."
              className="flex-grow bg-stone-700 text-white border-2 border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={loading || !isAvailable}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading || !query.trim() || !isAvailable}
            >
              {loading && data.length === 0 ? 'Analyzing...' : 'Analyze Product'}
            </button>
          </form>
        </div>

        <div className="mt-6">
          {error && <ErrorDisplay message={error} />}
          
          {data.length > 0 && (
             <h2 className="text-lg font-semibold text-white mb-4">Sales Strategies for: <span className="text-amber-400">{productQuery}</span></h2>
          )}
          
          <div className="space-y-4">
            {data.map((cardData, index) => (
              <div key={cardData.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                <ArbitrageCard card={cardData} onSelect={() => setSelectedCard(cardData)} />
              </div>
            ))}
          </div>

          {loading && (
              <LoadingSpinner message={data.length === 0 ? [`Analyzing "${query}"...`, "Scanning for price data...", "Building sales strategies..."] : ["Finding more opportunities..."]} />
          )}

          {!loading && data.length > 0 && isAvailable && (
              <div className="mt-8 text-center">
                  <button 
                    onClick={handleLoadMore}
                    className="bg-stone-800 border-2 border-amber-600 text-amber-400 font-bold py-3 px-8 rounded-lg hover:bg-stone-700 hover:text-white transition-all transform hover:scale-105 shadow-lg"
                  >
                      Load More Results
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
        {selectedCard && <ArbitrageDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default SalesArbitragePage;
