
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setApiKey } from '../features/auth/authSlice';
import Logo from '../components/Logo';
import { RootState } from '../types';
import ErrorDisplay from '../components/ErrorDisplay';
import { validateApiKey } from '../services/geminiService';

const ApiKeySetupPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { apiKey } = useSelector((state: RootState) => state.auth);
    const [inputKey, setInputKey] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    // If key exists and we aren't showing the welcome animation, redirect
    React.useEffect(() => {
        if (apiKey && !showWelcome) {
            navigate('/app/dashboard');
        }
    }, [apiKey, navigate, showWelcome]);

    const handleSave = async () => {
        const cleanedKey = inputKey.trim();

        if (!cleanedKey) {
            setError("Please enter an API Key.");
            return;
        }

        if (!cleanedKey.startsWith("AIza")) {
            setError("Invalid API Key format. Google API Keys typically start with 'AIza'.");
            return;
        }

        // Google API keys are usually 39 characters.
        if (cleanedKey.length < 35) {
            setError("This API Key seems too short. Please check that you copied the entire key.");
            return;
        }

        setIsValidating(true);
        setError(null);

        try {
            // Strictly validate the key via a live network call
            const isValid = await validateApiKey(cleanedKey);
            
            if (isValid) {
                // If we get here, the key is valid.
                // Save it to Redux/LocalStorage
                dispatch(setApiKey(cleanedKey));
                
                // Trigger the welcome sequence
                setShowWelcome(true);
                
                // Navigate after animation
                setTimeout(() => {
                    navigate('/app/dashboard');
                }, 4000);
            } else {
                throw new Error("Validation returned false.");
            }

        } catch (err: any) {
            console.error("Setup validation error:", err);
            setError(err.message || "Sorry, API Key Invalid.");
            setIsValidating(false);
        }
    };

    if (showWelcome) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in duration-1000">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black animate-pulse"></div>
                <div className="z-10 text-center space-y-8">
                    <div className="mb-8 animate-[bounce_2s_infinite]">
                        <Logo className="h-32 w-32 mx-auto drop-shadow-[0_0_50px_rgba(245,158,11,0.8)]" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 animate-[pulse_3s_infinite]">
                            Neural Link Established
                        </h1>
                        <p className="text-stone-400 text-lg md:text-xl font-light tracking-[0.3em] uppercase animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            Access Granted
                        </p>
                    </div>
                    <div className="w-64 h-1 bg-stone-800 rounded-full mx-auto mt-8 overflow-hidden">
                        <div className="h-full bg-amber-500 animate-[width_2s_ease-out_forwards]" style={{width: '100%'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>

                <div className="text-center mb-6 relative z-10">
                    <Logo className="h-16 w-16 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Connect Your Oracle</h1>
                    <p className="text-stone-400">
                        To activate the Market Oracle's forecasting engine, you must connect your own Google Gemini API key.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 text-center animate-shake">
                        <p className="font-bold">⚠️ Connection Failed</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="space-y-6 relative z-10">
                    <div className="bg-stone-800/50 p-4 rounded-lg border border-amber-900/30">
                        <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                            <span className="bg-amber-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                            Get Your Key
                        </h3>
                        <p className="text-sm text-stone-300 mb-4">
                            You can get a free API key from Google AI Studio. It takes 10 seconds.
                        </p>
                        <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noreferrer"
                            className="block w-full text-center bg-stone-100 hover:bg-white text-stone-900 font-bold py-2 px-4 rounded transition-colors"
                        >
                            Open Google AI Studio &rarr;
                        </a>
                    </div>

                    <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700">
                         <h3 className="text-stone-200 font-bold mb-2 flex items-center gap-2">
                            <span className="bg-stone-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                            Paste Key Here
                        </h3>
                        <input 
                            type="password"
                            value={inputKey}
                            onChange={(e) => { setInputKey(e.target.value); setError(null); }}
                            placeholder="Paste your API key here..."
                            className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-white font-mono text-sm focus:border-amber-500 focus:outline-none mb-3 placeholder-stone-600"
                            disabled={isValidating}
                        />
                        <button 
                            onClick={handleSave}
                            disabled={!inputKey.trim() || isValidating}
                            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isValidating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Verifying Connection...
                                </>
                            ) : (
                                "Connect & Activate"
                            )}
                        </button>
                    </div>
                    
                    <p className="text-xs text-center text-stone-500">
                        Your API key is stored locally on your device. It is never sent to our servers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ApiKeySetupPage;
