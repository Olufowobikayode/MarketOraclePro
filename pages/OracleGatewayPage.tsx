
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initiateSession } from '../features/oracleSession/oracleSessionSlice';
import Logo from '../components/Logo';
import { RootState } from '../types';

const OracleGatewayPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { isInitiated } = useSelector((state: RootState) => state.oracleSession);
  
  // Localization State
  const [language, setLanguage] = useState('English');
  const [customLanguage, setCustomLanguage] = useState('');
  const [country, setCountry] = useState('Global');
  const [customCountry, setCustomCountry] = useState('');

  // Session State
  const [niche, setNiche] = useState('');
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [voiceSample, setVoiceSample] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNextStep = () => setStep(s => s + 1);
  const handleCancel = () => navigate('/app/dashboard');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBrandVoice = brandVoice === 'custom' ? voiceSample : brandVoice;
    const finalLanguage = language === 'Other' ? customLanguage : language;
    const finalCountry = country === 'Other' ? customCountry : country;
    const finalPurpose = purpose === 'Other' ? customPurpose : purpose;

    if (niche && finalPurpose && targetAudience && campaignGoal && finalBrandVoice && finalLanguage && finalCountry) {
      dispatch(initiateSession({ 
          niche, 
          purpose: finalPurpose, 
          targetAudience, 
          campaignGoal, 
          brandVoice: finalBrandVoice,
          language: finalLanguage,
          country: finalCountry
      }));
      navigate('/app/dashboard');
    }
  };

  const purposeOptions = [
      'Dropshipping Product Research',
      'Digital Product or Course Creation',
      'Affiliate Marketing Campaign',
      'Content Creator / Influencer Strategy',
      'SaaS / Software Startup',
      'Local Service Business',
      'E-commerce Brand Building',
      'Investment / Trading Research',
      'General Market Curiosity'
  ];
  
  const voiceOptions = ['Professional & Analytical', 'Witty & Humorous', 'Inspirational & Uplifting', 'Casual & Friendly', 'Authoritative & Expert'];
  
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

  // Progress bar calculation
  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        const isLangValid = language !== 'Other' || customLanguage.trim().length > 0;
        const isCountryValid = country !== 'Other' || customCountry.trim().length > 0;

        return (
          <div className="animate-fade-in-up">
            <p className="text-amber-400 font-mono text-xs mb-2">SEQUENCE 1/6</p>
            <h2 className="text-2xl font-bold text-white mb-2">Set Localization.</h2>
            <p className="text-stone-400 mb-6">Select your preferred output language and the target region for research.</p>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-stone-300 mb-2">Output Language</label>
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)} 
                        className="w-full bg-stone-950 text-white border border-stone-700 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-amber-500"
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
                            className="w-full mt-2 bg-stone-900 text-white border border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500 animate-fade-in"
                        />
                    )}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-stone-300 mb-2">Target Market Region</label>
                    <select 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)} 
                        className="w-full bg-stone-950 text-white border border-stone-700 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-amber-500"
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
                            className="w-full mt-2 bg-stone-900 text-white border border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500 animate-fade-in"
                        />
                    )}
                </div>
                <button 
                    onClick={handleNextStep}
                    disabled={!isLangValid || !isCountryValid}
                    className="w-full mt-4 bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 rounded-lg border border-stone-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next &rarr;
                </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in-up">
            <p className="text-amber-400 font-mono text-xs mb-2">SEQUENCE 2/6</p>
            <h2 className="text-2xl font-bold text-white mb-2">Identify the Niche.</h2>
            <p className="text-stone-400 mb-6">What is the specific market, topic, or industry you wish to analyze?</p>
            <input 
              type="text" 
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Sustainable Coffee, AI Productivity Tools, Retro Sneakers"
              className="w-full bg-stone-950 text-white border-b-2 border-stone-700 px-4 py-3 text-lg focus:outline-none focus:border-amber-500 placeholder-stone-600 transition-colors"
              autoFocus
            />
            <button 
                onClick={handleNextStep}
                disabled={!niche}
                className="w-full mt-8 bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 rounded-lg border border-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next &rarr;
            </button>
          </div>
        );
      case 3:
        const isPurposeValid = purpose !== 'Other' || customPurpose.trim().length > 0;
        return (
          <div className="animate-fade-in-up">
            <p className="text-amber-400 font-mono text-xs mb-2">SEQUENCE 3/6</p>
            <h2 className="text-2xl font-bold text-white mb-2">Define the Purpose.</h2>
            <p className="text-stone-400 mb-6">What is the nature of the project you are building?</p>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {purposeOptions.map(option => (
                <button
                  key={option}
                  onClick={() => { setPurpose(option); if(option !== 'Other') handleNextStep(); }}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm font-medium ${purpose === option ? 'bg-amber-900/30 border-amber-500 text-white' : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-stone-500'}`}
                >
                  {option}
                </button>
              ))}
              <button
                  onClick={() => setPurpose('Other')}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm font-medium ${purpose === 'Other' ? 'bg-amber-900/30 border-amber-500 text-white' : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-stone-500'}`}
                >
                  Other (Custom)...
              </button>
            </div>
            
            {purpose === 'Other' && (
                <div className="mt-4 animate-fade-in">
                    <input 
                        type="text" 
                        value={customPurpose}
                        onChange={(e) => setCustomPurpose(e.target.value)}
                        placeholder="Describe your purpose..."
                        className="w-full bg-stone-900 text-white border border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
                        autoFocus
                    />
                    <button 
                        onClick={handleNextStep}
                        disabled={!isPurposeValid}
                        className="w-full mt-4 bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 rounded-lg border border-stone-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in-up">
            <p className="text-amber-400 font-mono text-xs mb-2">SEQUENCE 4/6</p>
            <h2 className="text-2xl font-bold text-white mb-2">Target Audience.</h2>
            <p className="text-stone-400 mb-6">Who are you trying to reach? Be specific.</p>
            <textarea 
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Remote workers aged 25-40 who love hiking."
              className="w-full bg-stone-950 text-white border-2 border-stone-700 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-amber-500 placeholder-stone-600 h-32 resize-none"
              autoFocus
            />
            <button 
                onClick={handleNextStep}
                disabled={!targetAudience}
                className="w-full mt-6 bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 rounded-lg border border-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next &rarr;
            </button>
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in-up">
            <p className="text-amber-400 font-mono text-xs mb-2">SEQUENCE 5/6</p>
            <h2 className="text-2xl font-bold text-white mb-2">Campaign Goal.</h2>
            <p className="text-stone-400 mb-6">What is the primary objective of this analysis?</p>
            <input 
              type="text" 
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              placeholder="e.g., Increase sales by 20%, Launch a new product line"
              className="w-full bg-stone-950 text-white border-b-2 border-stone-700 px-4 py-3 text-lg focus:outline-none focus:border-amber-500 placeholder-stone-600 transition-colors"
              autoFocus
            />
            <button 
                onClick={handleNextStep}
                disabled={!campaignGoal}
                className="w-full mt-8 bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 rounded-lg border border-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next &rarr;
            </button>
          </div>
        );
      case 6:
        return (
          <div className="animate-fade-in-up">
            <p className="text-amber-400 font-mono text-xs mb-2">SEQUENCE 6/6</p>
            <h2 className="text-2xl font-bold text-white mb-2">Brand Voice.</h2>
            <p className="text-stone-400 mb-6">How should the Oracle speak in the generated content?</p>
            <div className="space-y-3 mb-6">
              {voiceOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setBrandVoice(option)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${brandVoice === option ? 'bg-amber-900/30 border-amber-500 text-white' : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-stone-500'}`}
                >
                  {option}
                </button>
              ))}
              <button
                  onClick={() => setBrandVoice('custom')}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${brandVoice === 'custom' ? 'bg-amber-900/30 border-amber-500 text-white' : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-stone-500'}`}
                >
                  Custom...
              </button>
            </div>
            
            {brandVoice === 'custom' && (
                <textarea 
                    value={voiceSample}
                    onChange={(e) => setVoiceSample(e.target.value)}
                    placeholder="Describe the voice or paste a sample..."
                    className="w-full bg-stone-950 text-white border-2 border-stone-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 placeholder-stone-600 h-24 resize-none mb-4 animate-fade-in"
                />
            )}

            <button 
                onClick={handleSubmit}
                disabled={!brandVoice || (brandVoice === 'custom' && !voiceSample)}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold py-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
            >
                Initialize Oracle &rarr;
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col relative">
      {/* Cancel Button - Only show if session was already initiated or if desired */}
      {isInitiated && (
          <button 
            onClick={handleCancel}
            className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors z-50 text-sm font-bold bg-stone-900/50 px-3 py-1 rounded-full border border-stone-700"
          >
            ✕ Cancel
          </button>
      )}

      <div className="flex-grow flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
        <div className="mb-8 transform scale-75 md:scale-100">
            <Logo className="h-24 w-24" />
        </div>
        
        <div className="w-full">
            {renderStep()}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-stone-900 w-full fixed top-0 left-0">
        <div 
            className="h-full bg-amber-500 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OracleGatewayPage;
