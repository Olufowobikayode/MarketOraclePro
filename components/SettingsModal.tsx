
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setApiKey, clearApiKey } from '../features/auth/authSlice';
import { closeSettings } from '../features/ui/uiSlice';
import { updateLocalization } from '../features/oracleSession/oracleSessionSlice';
import { validateApiKey } from '../services/geminiService';
import type { RootState } from '../types';
import { useToast } from '../hooks/useToast';

const SettingsModal: React.FC = () => {
  const dispatch = useDispatch();
  const showToast = useToast();
  
  const { apiKey } = useSelector((state: RootState) => (state.auth as any));
  const { user } = useSelector((state: RootState) => state.auth);
  const { isSettingsOpen } = useSelector((state: RootState) => state.ui);
  const { language: currentLang, country: currentCountry } = useSelector((state: RootState) => state.oracleSession);
  
  const [inputKey, setInputKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  // Localization State
  const [language, setLanguage] = useState(currentLang || 'English');
  const [customLanguage, setCustomLanguage] = useState('');
  const [country, setCountry] = useState(currentCountry || 'Global');
  const [customCountry, setCustomCountry] = useState('');

  const languageOptions = [
      'English', 'Spanish', 'French', 'German', 'Portuguese', 'Chinese (Simplified)', 'Chinese (Traditional)', 
      'Japanese', 'Hindi', 'Arabic', 'Russian', 'Korean', 'Italian', 'Dutch', 'Turkish', 'Polish', 
      'Indonesian', 'Vietnamese', 'Thai', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Greek', 'Czech', 
      'Romanian', 'Hungarian', 'Hebrew', 'Malay', 'Tagalog', 'Bengali', 'Urdu', 'Persian', 'Swahili'
  ].sort();

  const countryOptions = [
      'Global', 'United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Brazil', 'Germany', 
      'France', 'Japan', 'China', 'Mexico', 'Spain', 'Italy', 'Russia', 'South Korea', 'Indonesia', 
      'Turkey', 'Saudi Arabia', 'Netherlands', 'Switzerland', 'Sweden', 'Poland', 'Belgium', 'Argentina', 
      'Austria', 'Thailand', 'UAE', 'Nigeria', 'South Africa', 'Egypt', 'Vietnam', 'Philippines', 'Malaysia', 
      'Singapore', 'Pakistan', 'Bangladesh', 'Colombia', 'Chile', 'Peru', 'New Zealand', 'Ireland', 'Norway', 
      'Israel', 'Portugal', 'Greece', 'Czech Republic', 'Hungary', 'Romania', 'Ukraine'
  ].sort();

  useEffect(() => {
      if(isSettingsOpen) {
          setInputKey(''); // Clear input on open
          setIsValidating(false);

          // Smart initialization for Language
          if (languageOptions.includes(currentLang)) {
              setLanguage(currentLang);
              setCustomLanguage('');
          } else {
              setLanguage('Other');
              setCustomLanguage(currentLang);
          }

          // Smart initialization for Country
          if (countryOptions.includes(currentCountry)) {
              setCountry(currentCountry);
              setCustomCountry('');
          } else {
              setCountry('Other');
              setCustomCountry(currentCountry);
          }
      }
  }, [isSettingsOpen, currentLang, currentCountry]);

  if (!isSettingsOpen) return null;

  const onClose = () => dispatch(closeSettings());

  const handleSaveKey = async () => {
    const cleanedKey = inputKey.trim();
    if (cleanedKey.length < 10) {
        showToast('Invalid API Key format.', 'error');
        return;
    }

    setIsValidating(true);
    try {
        await validateApiKey(cleanedKey);
        dispatch(setApiKey(cleanedKey));
        showToast('API Key verified and saved!');
        setInputKey('');
    } catch (error: any) {
        console.error("Key validation failed:", error);
        showToast(error.message || 'Validation failed. Check key.', 'error');
    } finally {
        setIsValidating(false);
    }
  };

  const handleClearKey = () => {
      dispatch(clearApiKey());
      showToast('API Key removed.');
  };

  const handleUpdateLocalization = () => {
      const finalLang = language === 'Other' ? customLanguage : language;
      const finalCountry = country === 'Other' ? customCountry : country;

      if (!finalLang.trim() || !finalCountry.trim()) {
          showToast('Please specify valid language and country.', 'error');
          return;
      }

      dispatch(updateLocalization({ language: finalLang, country: finalCountry }));
      showToast('Localization settings updated.');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-amber-900/50 rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-8">
            {/* User Profile */}
            <div className="flex items-center gap-4">
                {user?.photoUrl && <img src={user.photoUrl} alt="User" className="w-12 h-12 rounded-full border border-stone-700" />}
                <div>
                    <p className="text-white font-bold">{user?.firstName || user?.username || 'User'}</p>
                    <p className="text-stone-400 text-xs">@{user?.username}</p>
                    <span className="text-[10px] uppercase tracking-wider bg-amber-900 text-amber-100 px-2 py-0.5 rounded mt-1 inline-block border border-amber-600">
                        {user?.plan} Plan (Unlocked)
                    </span>
                </div>
            </div>

            {/* Localization Settings */}
            <div>
                <h3 className="text-md font-semibold text-amber-400 mb-4 border-b border-stone-700 pb-2">Localization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">Output Language</label>
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)} 
                            className="w-full bg-stone-800 text-white border border-stone-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                        >
                            {languageOptions.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                            <option value="Other">Other (Specify)</option>
                        </select>
                        {language === 'Other' && (
                            <input 
                                type="text" 
                                value={customLanguage}
                                onChange={(e) => setCustomLanguage(e.target.value)}
                                placeholder="Enter language..."
                                className="w-full mt-2 bg-stone-700 text-white border border-stone-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 animate-fade-in"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">Target Market Region</label>
                        <select 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)} 
                            className="w-full bg-stone-800 text-white border border-stone-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                        >
                            {countryOptions.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                            <option value="Other">Other (Specify)</option>
                        </select>
                        {country === 'Other' && (
                            <input 
                                type="text" 
                                value={customCountry}
                                onChange={(e) => setCustomCountry(e.target.value)}
                                placeholder="Enter country..."
                                className="w-full mt-2 bg-stone-700 text-white border border-stone-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 animate-fade-in"
                            />
                        )}
                    </div>
                </div>
                <button 
                    onClick={handleUpdateLocalization}
                    className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                    Update Language & Region
                </button>
            </div>

            {/* API Key Settings */}
            <div>
                <h3 className="text-md font-semibold text-amber-400 mb-2 border-b border-stone-700 pb-2">Google Gemini API Key</h3>
                
                <div className="text-xs text-stone-400 mb-4 bg-stone-800 p-2 rounded border border-stone-700">
                    <p className="mb-1"><strong className="text-amber-500">Token Usage & Quota:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Free keys have limits (~15 requests/min).</li>
                        <li>If you get "Quota Exceeded", you need to wait or enable billing in Google AI Studio.</li>
                        <li>Your key is stored locally on this device.</li>
                    </ul>
                </div>

                <p className="text-xs text-stone-400 mb-4">
                    To power the Oracle, you must provide your own Google Gemini API key. 
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline ml-1">Get one here</a>.
                </p>
                
                {apiKey ? (
                    <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-green-400 text-sm font-mono">••••••••••••••••{apiKey.slice(-4)}</span>
                        <button onClick={handleClearKey} className="text-xs text-red-400 hover:text-red-300 underline">Remove</button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            type="password" 
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="Paste your API Key here..."
                            className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                            disabled={isValidating}
                        />
                        <button 
                            onClick={handleSaveKey}
                            disabled={isValidating || inputKey.length < 10}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isValidating ? (
                                <>
                                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Validating...
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        <div className="text-center pt-4 border-t border-stone-800 mt-6">
            <p className="text-xs text-stone-500">Market Oracle v2.1 - Global Edition</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
