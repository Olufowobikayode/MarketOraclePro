
import React from 'react';
import Header from './Header';
import Toast from './Toast';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../types';
import BottomNav from './BottomNav';
import ComparisonTray from './ComparisonTray';
import FullscreenModal from './FullscreenModal';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import ComparisonReportDisplay from '../features/comparison/ComparisonReportDisplay';
import { clearComparisonReport } from '../features/comparison/comparisonSlice';
import ApiOutageBanner from './ApiOutageBanner';
import SettingsModal from './SettingsModal';
import AdInterstitial from './AdInterstitial';


const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const isInitiated = useSelector((state: RootState) => state.oracleSession.isInitiated);
  const { report, loading: comparisonLoading, error: comparisonError } = useSelector((state: RootState) => state.comparison);

  // If the user tries to access an app page without setting a niche first,
  // redirect them to the gateway page.
  if (!isInitiated) {
    return <Navigate to="/app/initiate" replace />;
  }

  const handleCloseComparison = () => {
    dispatch(clearComparisonReport());
  };
  
  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-stone-950 text-stone-200 relative">
      <Header />
      <ApiOutageBanner />
      <main className="flex-1 overflow-y-auto pb-20">
          {children}
      </main>
      <ComparisonTray />
      <BottomNav />
      <Toast />
      <SettingsModal />
      <AdInterstitial />
      <FullscreenModal
        isOpen={!!report || comparisonLoading || !!comparisonError}
        onClose={handleCloseComparison}
        title={report?.title || 'Comparative Analysis'}
      >
        {comparisonLoading && <LoadingSpinner message="Generating comparison..." />}
        {comparisonError && <ErrorDisplay message={comparisonError} />}
        {report && <ComparisonReportDisplay report={report} />}
      </FullscreenModal>
    </div>
  );
};

export default AppShell;
