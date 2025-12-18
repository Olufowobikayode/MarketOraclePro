
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setApiKey } from '../features/auth/authSlice';
import Logo from '../components/Logo';
import { RootState } from '../types';
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
                        <p className="text-sm text-stone-300 mb-2">
                            You can get a free API key from Google AI Studio. It takes 10 seconds.
                        </p>
                        
                        <div className="mb-4 p-3 bg-stone-900/80 rounded border border-stone-700 text-xs text-stone-400">
                            <p className="font-bold text-amber-500 mb-1 flex items-center gap-1">
                                <span>⚠️</span> Important: Free Tier Limits
                            </p>
                            <ul className="list-disc pl-4 space-y-1 mb-2">
                                <li><strong>Gemini Flash (Free):</strong> 15 requests/minute. Good for testing.</li>
                                <li><strong>Quota Exceeded:</strong> If you see "Oracle's energy is depleted", you hit this limit.</li>
                            </ul>
                            <p className="text-stone-300">
                                To fix this forever, enable <strong>"Pay-as-you-go"</strong> billing in Google AI Studio. It is extremely cheap for personal use.
                            </p>
                        </div>

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
                    
                    <div className="mt-4 text-center">
                        <p className="text-stone-500 text-xs mb-3">Need help setting up?</p>
                        <a 
                            href="https://wa.me/2349138651598"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 px-6 rounded-full transition-colors text-sm shadow-lg hover:shadow-[#25D366]/20"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            Chat on WhatsApp
                        </a>
                    </div>
                    
                    <p className="text-xs text-center text-stone-500 mt-4">
                        Your API key is stored locally on your device. It is never sent to our servers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ApiKeySetupPage;
