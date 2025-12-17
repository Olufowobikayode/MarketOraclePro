
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const PlanSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  // Automatically redirect everyone to the dashboard/initiate because plans are no longer required.
  useEffect(() => {
      const timer = setTimeout(() => {
          navigate('/app/dashboard');
      }, 1500);
      return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
      <LoadingSpinner message="Unlocking Premium Access..." />
      <p className="text-amber-400 mt-4 text-sm font-bold animate-pulse">Initializing Ad-Supported Oracle...</p>
    </div>
  );
};

export default PlanSelectionPage;
