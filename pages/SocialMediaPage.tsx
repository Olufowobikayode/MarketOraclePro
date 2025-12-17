
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, SocialsData } from '../types';
import { fetchSocialsStart } from '../features/socials/socialsSlice';
import SocialsDisplay from '../features/socials/SocialsDisplay';
import { toggleCardSelection } from '../features/comparison/comparisonSlice';

const SocialMediaPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<SocialsData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.socials);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);
  const { selectedCards } = useSelector((state: RootState) => state.comparison);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

  useEffect(() => {
    if (isAvailable && isInitiated && data.length === 0) {
      dispatch(fetchSocialsStart());
    }
  }, [isAvailable, isInitiated, data.length, dispatch]);

  // FIX: Synchronize local state with Redux store.
  // When the master 'data' in Redux is updated (e.g., after a post regeneration),
  // this effect finds the corresponding updated card and updates the local 'selectedCard'
  // state. This ensures the modal always displays the freshest data.
  useEffect(() => {
    if (selectedCard) {
      const updatedCardFromStore = data.find(card => card.id === selectedCard.id);
      if (updatedCardFromStore && JSON.stringify(updatedCardFromStore) !== JSON.stringify(selectedCard)) {
        setSelectedCard(updatedCardFromStore);
      }
    }
  }, [data, selectedCard]);

  const handleToggleSelection = (e: React.MouseEvent, card: SocialsData) => {
    e.stopPropagation();
    dispatch(toggleCardSelection(card));
  };

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Social Media Strategy</h1>
          <p className="text-stone-400 text-sm">Social media analysis for "{niche}"</p>
          <div className="mt-4">
            <button
              onClick={() => dispatch(fetchSocialsStart())}
              disabled={loading || !isAvailable}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-2 px-5 rounded-lg text-sm transition-colors disabled:opacity-50 shadow-lg"
              aria-label="Regenerate social media strategy"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Regenerate Strategy
            </button>
          </div>
        </div>

        <div className="mt-6">
          {loading && <LoadingSpinner message={["Listening to social chatter...", "Crafting viral content...", "Analyzing platform trends..."]} />}
          {error && <ErrorDisplay message={error} />}
          
          <div className="space-y-4">
            {data.map((cardData, index) => {
              const isSelected = selectedCards.some(c => c.id === cardData.id);
              return (
                <div 
                  key={cardData.id} 
                  className={`relative bg-stone-800 border rounded-lg shadow-lg p-4 cursor-pointer hover:bg-stone-700/50 transition-all animate-fade-in-up ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-stone-700'}`} 
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedCard(cardData)}
                >
                  <button 
                    onClick={(e) => handleToggleSelection(e, cardData)}
                    aria-label={isSelected ? 'Deselect for comparison' : 'Select for comparison'}
                    className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-amber-500 text-white' : 'bg-stone-900/50 text-stone-300 hover:bg-stone-700'}`}
                  >
                    {isSelected ? 
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> :
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    }
                  </button>
                  <h3 className="text-md font-bold text-amber-400 mb-2 pr-10">{cardData.title}</h3>
                  <p className="text-sm text-stone-400 line-clamp-2">{cardData.description}</p>
                </div>
              )
            })}
          </div>

          {!loading && data.length > 0 && isAvailable && (
              <div className="mt-8 text-center pb-20">
                  <button 
                    onClick={() => dispatch(fetchSocialsStart())}
                    className="bg-stone-800 border-2 border-amber-600 text-amber-400 font-bold py-3 px-8 rounded-lg hover:bg-stone-700 hover:text-white transition-all transform hover:scale-105 shadow-lg"
                  >
                      Regenerate Strategy
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
        {selectedCard && <SocialsDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default SocialMediaPage;
