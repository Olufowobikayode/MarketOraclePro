
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, SocialsData } from '../types';
import { fetchSocialsStart } from '../features/socials/socialsSlice';
import SocialsDisplay from '../features/socials/SocialsDisplay';
import TrendCard from '../features/trends/TrendCard';

const EchoesInEtherPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<SocialsData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.socials);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);

  useEffect(() => {
    if (isInitiated && data.length === 0) {
      dispatch(fetchSocialsStart());
    }
  }, [isInitiated, data.length, dispatch]);

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Echoes in the Ether</h1>
          <p className="text-stone-400 text-sm">Divining social media strategy for "{niche}"</p>
        </div>

        <div className="mt-6">
          {loading && <LoadingSpinner message="Listening to the ether..." />}
          {error && <ErrorDisplay message={error} />}
          
          <div className="space-y-4">
            {data.map((cardData) => (
               <div key={cardData.id} className="bg-stone-800 border border-stone-700 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-stone-700/50" onClick={() => setSelectedCard(cardData)}>
                  <h3 className="text-md font-bold text-amber-400 mb-2">{cardData.title}</h3>
                  <p className="text-sm text-stone-400 line-clamp-2">{cardData.description}</p>
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
        {selectedCard && <SocialsDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default EchoesInEtherPage;
