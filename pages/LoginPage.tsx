
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../types';
import ErrorDisplay from '../components/ErrorDisplay';
import Logo from '../components/Logo';
import { loginSuccess } from '../features/auth/authSlice';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error, apiKey } = useSelector((state: RootState) => state.auth);
  
  const handleEnter = () => {
      // Scenario A: Authenticated (Telegram User)
      if (isAuthenticated && user) {
          if (user.isNewUser || !apiKey) {
              navigate('/api-setup');
          } else {
              navigate('/app/dashboard');
          }
      } 
      // Scenario B: Not Authenticated (Browser/Guest User)
      // Treat this as a "Sign Up" where they need to provide API Key
      else {
          // Create a local guest user session
          dispatch(loginSuccess({
              id: `guest-${Date.now()}`,
              username: 'Guest',
              firstName: 'Seeker',
              plan: 'free',
              isNewUser: true
          }));
          // Redirect to API Setup
          navigate('/api-setup');
      }
  };

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambient Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center space-y-12">
        
        {/* Header / Logo */}
        <div className="text-center">
            <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
                <Logo className="h-28 w-28 mx-auto drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            </div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 tracking-tight">
                Market Oracle
            </h1>
            <p className="mt-3 text-lg text-stone-400 font-light tracking-widest uppercase">
                Login / Sign Up
            </p>
        </div>

        {/* Action Area */}
        <div className="w-full space-y-4">
            {loading ? (
                <div className="flex flex-col items-center justify-center space-y-3 py-8">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-stone-500 uppercase tracking-widest animate-pulse">Authenticating...</p>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in-up">
                    {/* Only show error if it's NOT the standard "No Telegram data" warning, or show it discreetly */}
                    {error && !error.includes("No Telegram data") && <ErrorDisplay message={error} />}
                    
                    <button 
                        onClick={handleEnter}
                        className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 border border-amber-500/30"
                    >
                        Enter
                    </button>
                </div>
            )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-stone-600 max-w-xs">
            <p>By entering, you agree to our Terms of Service.</p>
            <p className="mt-1">v2.1.0 • Neural Link Active</p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
