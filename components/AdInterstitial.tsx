
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAd } from '../features/ads/adSlice';
import { RootState } from '../types';

// Reduced to 2 seconds to balance speed and ad viewability
const MIN_AD_DURATION = 2000; 

const AdInterstitial: React.FC = () => {
  const dispatch = useDispatch();
  const { isAdOpen, isContentReady } = useSelector((state: RootState) => (state as any).ads);
  const [progress, setProgress] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const adInitialized = useRef(false);

  useEffect(() => {
    let interval: any;
    let timeout: any;

    if (isAdOpen) {
      setProgress(0);
      setMinTimeElapsed(false);
      adInitialized.current = false;

      // Progress Bar Animation - Faster animation for 2s duration
      interval = setInterval(() => {
        setProgress(old => {
          if (old >= 100) return 100;
          const increment = Math.max(1, (100 - old) / 10);
          return old + increment;
        });
      }, 50);

      // Minimum timer enforcement
      timeout = setTimeout(() => {
        setMinTimeElapsed(true);
      }, MIN_AD_DURATION);

      // --- ADSENSE TRIGGER ---
      try {
          if(typeof window !== 'undefined') {
             setTimeout(() => {
                 if (!adInitialized.current) {
                     ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                     adInitialized.current = true;
                 }
             }, 100);
          }
      } catch (e) {
          console.error("AdSense failed to load:", e);
      }

    } else {
        setProgress(0);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAdOpen]);

  const handleContinue = () => {
      dispatch(closeAd());
  };

  if (!isAdOpen) return null;

  const isReady = isContentReady && minTimeElapsed;

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950 flex flex-col items-center justify-center p-4">
      {/* Top Bar Status */}
      <div className="absolute top-4 w-full flex justify-between px-6 z-10">
        <div className="bg-white/10 text-stone-400 text-[10px] font-bold px-2 py-1 rounded border border-white/10">
          Advertisement
        </div>
        <div className="bg-black/50 text-stone-300 rounded-full px-4 py-1 text-xs font-mono border border-stone-800">
            {isReady ? 'Analysis Complete' : isContentReady ? 'Finalizing...' : 'Consulting Oracle...'}
        </div>
      </div>

      {/* Ad Content Container */}
      <div className="w-full max-w-lg aspect-[4/3] bg-stone-900 rounded-xl overflow-hidden shadow-2xl relative border border-stone-800 flex items-center justify-center">
        
        {/* Placeholder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-stone-700">
            <span className="text-4xl opacity-20">Ads Support This App</span>
        </div>

        {/* --- GOOGLE ADSENSE SLOT --- */}
        <div className="z-10 bg-black">
             <ins className="adsbygoogle"
                 style={{ display: 'block', width: '300px', height: '250px' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
                 data-ad-slot="XXXXXXXXXX"
                 data-ad-format="auto"
                 data-full-width-responsive="true">
             </ins>
        </div>
        
        {/* Loading Overlay / Progress Bar / Continue Button */}
        <div className="absolute bottom-0 left-0 w-full z-20">
            {isReady ? (
                <button 
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold py-4 text-center transition-all animate-fade-in-up flex items-center justify-center gap-2"
                >
                    <span>Tap to Continue</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </button>
            ) : (
                <>
                    <div className="absolute bottom-3 left-4 text-xs font-bold text-white/80 drop-shadow-md">
                        {isContentReady ? 'Waiting for Ad...' : `Processing... ${Math.round(progress)}%`}
                    </div>
                    <div className="h-1.5 bg-stone-800 w-full">
                        <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </>
            )}
        </div>
      </div>

      <p className="mt-6 text-stone-500 text-xs text-center max-w-xs animate-pulse">
        {isReady ? "Your results are ready below." : "Results incoming..."}
      </p>
    </div>
  );
};

export default AdInterstitial;
