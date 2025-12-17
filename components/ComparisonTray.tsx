import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generateComparisonStart, clearSelection } from '../features/comparison/comparisonSlice';
import type { RootState } from '../types';

const ComparisonTray: React.FC = () => {
    const dispatch = useDispatch();
    const { selectedCards, loading } = useSelector((state: RootState) => state.comparison);
    const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

    if (selectedCards.length === 0) {
        return null;
    }

    const handleCompare = () => {
        dispatch(generateComparisonStart());
    };

    const handleClear = () => {
        dispatch(clearSelection());
    };

    const canCompare = selectedCards.length >= 2;

    return (
        <div className="fixed bottom-16 left-0 right-0 z-30 p-2 animate-fade-in-up">
            <div className="max-w-md mx-auto bg-stone-800/90 backdrop-blur-sm border border-amber-800 rounded-lg shadow-2xl flex items-center justify-between p-3">
                <div className="text-sm">
                    <span className="font-bold text-white">{selectedCards.length}</span>
                    <span className="text-stone-300"> item{selectedCards.length > 1 ? 's' : ''} selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleClear} 
                        className="text-xs text-stone-400 hover:text-white transition-colors px-3 py-1.5"
                        disabled={loading}
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleCompare}
                        disabled={!canCompare || loading || !isAvailable}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-1.5 px-4 rounded-md text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Comparing...' : `Compare (${selectedCards.length})`}
                    </button>
                </div>
            </div>
            {!canCompare && <p className="text-center text-xs text-amber-400 mt-1">Select at least 2 items to compare.</p>}
        </div>
    );
};

export default ComparisonTray;
