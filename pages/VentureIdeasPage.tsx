
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectVision, fetchBlueprintStart, clearBlueprint, fetchVisionsStart, fetchMoreVisionsStart } from '../features/ventures/venturesSlice';
import VisionCard from '../features/ventures/VisionCard';
import BlueprintDisplay from '../features/ventures/BlueprintDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, VentureVision } from '../types';

const VentureIdeasPage: React.FC = () => {
  const dispatch = useDispatch();
  // FIX: Destructure `selectedVision` from the state to make it available in the component scope.
  const { 
      visions, 
      selectedVision,
      blueprint, 
      visionsLoading, 
      blueprintLoading, 
      visionsError, 
      blueprintError,
      progress 
  } = useSelector((state: RootState) => state.ventures);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

  useEffect(() => {
    if (isAvailable && isInitiated && visions.length === 0) {
      dispatch(fetchVisionsStart());
    }
  }, [isAvailable, isInitiated, visions.length, dispatch]);

  const handleSelectVision = (vision: VentureVision) => {
      if (!isAvailable) return;
      dispatch(selectVision(vision));
      dispatch(fetchBlueprintStart({ vision }));
  }
  
  const handleCloseModal = () => {
      dispatch(clearBlueprint());
  }

  const handleMoreOptions = () => {
      dispatch(fetchMoreVisionsStart());
  }

  const isLoading = visionsLoading || blueprintLoading;
  const loadingMessages = ["Divining new ventures...", "Analyzing market gaps...", "Forging business blueprints..."];

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-amber-300">Venture Ideas</h1>
            <p className="text-stone-400 text-sm">Generating new business concepts from "{niche}"</p>
        </div>

        <div className="mt-6">
          {visionsError && <ErrorDisplay message={visionsError} />}
          {blueprintError && <ErrorDisplay message={blueprintError} />}
          
          <div className="space-y-4">
            {visions.map((vision, index) => (
              <div key={vision.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <VisionCard vision={vision} onSelect={() => handleSelectVision(vision)} />
              </div>
            ))}
          </div>

          {isLoading && <LoadingSpinner message={progress?.message ? [progress.message] : loadingMessages} />}

          {!isLoading && visions.length > 0 && isAvailable && (
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
        isOpen={!!blueprint || blueprintLoading}
        onClose={handleCloseModal}
        title={blueprint?.prophecyTitle || selectedVision?.title || ''}
      >
        {blueprintLoading && <LoadingSpinner message="Generating blueprint..." />}
        {blueprintError && <ErrorDisplay message={blueprintError} />}
        {blueprint && <BlueprintDisplay data={blueprint} />}
      </FullscreenModal>
    </>
  );
};

export default VentureIdeasPage;