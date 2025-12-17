
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveSession } from '../features/history/historySlice';
import { openSettings } from '../features/ui/uiSlice';
import { RootState } from '../types';
import { useToast } from '../hooks/useToast';

const Header: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const showToast = useToast();
  const fullState = useSelector((state: RootState) => state);

  // In Telegram, we often want to save vertical space.
  // We can use the Telegram MainButton for primary actions instead of a header button.
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return "Oracle Dashboard";
    if (path.includes('/analysis')) return "Market Analysis";
    if (path.includes('/competitor')) return "Store Enhancer";
    return 'Market Oracle';
  };
  
  const title = getPageTitle();

  const handleSave = () => {
      dispatch(saveSession(fullState));
      showToast('Session saved!');
  };
  
  return (
        <header className="flex-shrink-0 bg-[var(--tg-theme-bg-color)] border-b border-stone-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-grow flex items-center gap-2">
                <h1 className="text-lg font-bold text-[var(--tg-theme-text-color)] truncate">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-1 text-xs bg-stone-800 hover:bg-stone-700 text-amber-400 px-3 py-1.5 rounded-md transition-colors border border-amber-900/50"
                >
                    💾 Save
                </button>
                <button 
                    onClick={() => dispatch(openSettings())}
                    className="text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)] transition-colors"
                >
                    ⚙️
                </button>
            </div>
        </div>
        </header>
  );
};

export default Header;
