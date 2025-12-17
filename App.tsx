
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PublicLayout from './components/PublicLayout';
import OracleGatewayPage from './pages/OracleGatewayPage';
import DashboardPage from './pages/DashboardPage';
import MarketAnalysisPage from './pages/MarketAnalysisPage';
import KeywordResearchPage from './pages/KeywordResearchPage';
import PlatformFinderPage from './pages/PlatformFinderPage';
import ContentStrategyPage from './pages/ContentStrategyPage';
import VentureIdeasPage from './pages/VentureIdeasPage';
import QnaPage from './pages/QnaPage';
import SocialMediaPage from './pages/SocialMediaPage';
import CopywritingPage from './pages/CopywritingPage';
import SalesArbitragePage from './pages/SalesArbitragePage';
import ScenarioPlannerPage from './pages/ScenarioPlannerPage';
import MediaStudioPage from './pages/MediaStudioPage';
import LiveOraclePage from './pages/LiveOraclePage';
import CompetitorAnalysisPage from './pages/CompetitorAnalysisPage';
import ProductFinderPage from './pages/ProductFinderPage';
import LeadsFinderPage from './pages/LeadsFinderPage';
import PlanSelectionPage from './pages/PlanSelectionPage';
import ApiKeySetupPage from './pages/ApiKeySetupPage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import CopyrightPage from './pages/CopyrightPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { checkTelegramAuth } from './features/auth/authSlice';

const AppRoutes: React.FC = () => {
    return (
        <AppShell>
            <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="live" element={<LiveOraclePage />} />
                <Route path="analysis" element={<MarketAnalysisPage />} />
                <Route path="keywords" element={<KeywordResearchPage />} />
                <Route path="platforms" element={<PlatformFinderPage />} />
                <Route path="content" element={<ContentStrategyPage />} />
                <Route path="ventures" element={<VentureIdeasPage />} />
                <Route path="qna" element={<QnaPage />} />
                <Route path="socials" element={<SocialMediaPage />} />
                <Route path="copy" element={<CopywritingPage />} />
                <Route path="arbitrage" element={<SalesArbitragePage />} />
                <Route path="scenarios" element={<ScenarioPlannerPage />} />
                <Route path="media" element={<MediaStudioPage />} />
                <Route path="competitor" element={<CompetitorAnalysisPage />} />
                <Route path="finder" element={<ProductFinderPage />} />
                <Route path="leads" element={<LeadsFinderPage />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
        </AppShell>
    );
};

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
      // Trigger Telegram Auth Check
      dispatch(checkTelegramAuth());
      
      // Adapt CSS Variables
      const tg = window.Telegram?.WebApp;
      if (tg) {
          tg.ready();
          if (tg.themeParams.bg_color) {
              document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
              document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
              document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
              document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
          }
      }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/plan-selection" element={
          <ProtectedRoute>
              <PlanSelectionPage />
          </ProtectedRoute>
      } />
      <Route path="/api-setup" element={
          <ProtectedRoute>
              <ApiKeySetupPage />
          </ProtectedRoute>
      } />
      <Route path="/app/initiate" element={
          <ProtectedRoute>
              <OracleGatewayPage />
          </ProtectedRoute>
      } />
      
      {/* Note: Nested routes in AppRoutes will be relative to /app */}
      <Route path="/app/*" element={
          <ProtectedRoute>
              <AppRoutes />
          </ProtectedRoute>
      } />
      
      <Route path="*" element={
        <PublicLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/copyright" element={<CopyrightPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PublicLayout>
      } />
    </Routes>
  );
};

export default App;
