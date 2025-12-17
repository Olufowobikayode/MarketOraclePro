
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MarketplaceCard from '../features/marketplaces/MarketplaceCard';
import MarketplaceDisplay from '../features/marketplaces/MarketplaceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, MarketplaceData } from '../types';
import { fetchMarketplacesStart } from '../features/marketplaces/marketplacesSlice';

const CelestialBazaarsPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<MarketplaceData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.marketplaces);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);

  useEffect(() => {
    if (isInitiated && data.length === 0) {
      dispatch(fetchMarketplacesStart());
    }
  }, [isInitiated, data.length, dispatch]);

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
         <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Celestial Bazaars</h1>
          <p className="text-stone-400 text-sm">Finding the most promising marketplaces for "{niche}"</p>
        </div>

        <div className="mt-6">
          {loading && <LoadingSpinner message="Finding Marketplaces..." />}
          {error && <ErrorDisplay message={error} />}

          <div className="space-y-4">
            {data.map((cardData) => (
              <MarketplaceCard key={cardData.id} card={cardData} onSelect={() => setSelectedCard(cardData)} />
            ))}
          </div>
        </div>
      </div>
      
      <FullscreenModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || ''}
      >
        {selectedCard && <MarketplaceDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default CelestialBazaarsPage;