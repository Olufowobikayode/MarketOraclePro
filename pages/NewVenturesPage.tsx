
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectVision, fetchBlueprintStart, clearBlueprint, fetchVisionsStart } from '../features/ventures/venturesSlice';
import VisionCard from '../features/ventures/VisionCard';
import BlueprintDisplay from '../features/ventures/BlueprintDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, VentureVision } from '../types';

const FatesOfFortunePage: React.FC = () => {
  const dispatch = useDispatch();
  const { 
      visions, 
      blueprint, 
      visionsLoading, 
      blueprintLoading, 
      visionsError, 
      blueprintError,
      progress 
  } = useSelector((state: RootState) => state.ventures);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);

  useEffect(() => {
    if (isInitiated && visions.length === 0) {
      dispatch(fetchVisionsStart());
    }
  }, [isInitiated, visions.length, dispatch]);

  const handleSelectVision = (vision: VentureVision) => {
      dispatch(selectVision(vision));
      dispatch(fetchBlueprintStart({ vision }));
  }
  
  const handleCloseModal = () => {
      dispatch(clearBlueprint());
  }

  const isLoading = visionsLoading || blueprintLoading;

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-amber-300">Fates of Fortune</h1>
            <p className="text-stone-400 text-sm">Weaving new venture destinies from "{niche}"</p>
        </div>

        <div className="mt-6">
          {isLoading && <LoadingSpinner message={progress?.message || 'The Oracle is divining...'} />}
          {visionsError && <ErrorDisplay message={visionsError} />}
          {blueprintError && <ErrorDisplay message={blueprintError} />}
          
          <div className="space-y-4">
            {visions.map((vision) => (
              <VisionCard key={vision.id} vision={vision} onSelect={() => handleSelectVision(vision)} />
            ))}
          </div>
        </div>
      </div>
      
      <FullscreenModal
        isOpen={!!blueprint}
        onClose={handleCloseModal}
        title={blueprint?.prophecyTitle || ''}
      >
        {blueprint && <BlueprintDisplay data={blueprint} />}
      </FullscreenModal>
    </>
  );
};

export default FatesOfFortunePage;