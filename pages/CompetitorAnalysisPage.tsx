
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { fetchStoreAnalysisStart } from '../features/storeAnalysis/storeAnalysisSlice';
import type { RootState, StoreAnalysisData } from '../types';

const CompetitorAnalysisPage: React.FC = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state: RootState) => state.storeAnalysis);
    const { isAvailable } = useSelector((state: RootState) => state.apiStatus);
    const [myUrl, setMyUrl] = useState('');
    const [competitorUrl, setCompetitorUrl] = useState('');

    const handleAnalyze = () => {
        if (!myUrl || !competitorUrl) return;
        dispatch(fetchStoreAnalysisStart({ myUrl, competitorUrl }));
    };

    const ResultCard: React.FC<{ analysis: StoreAnalysisData }> = ({ analysis }) => (
        <div className="bg-stone-800 border border-stone-700 rounded-lg p-6 shadow-xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-amber-400 mb-2">{analysis.title}</h3>
            <p className="text-stone-300 text-sm mb-4 italic">{analysis.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-stone-900/50 p-4 rounded-lg">
                    <h4 className="font-bold text-red-400 mb-2 border-b border-stone-700 pb-1">Where You Lag (Gaps)</h4>
                    <ul className="list-disc list-inside text-stone-400 text-xs space-y-2">
                        {(analysis.gapAnalysis || []).map((gap, i) => <li key={i}>{gap}</li>)}
                    </ul>
                </div>
                <div className="bg-stone-900/50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-400 mb-2 border-b border-stone-700 pb-1">How To Win (Action Plan)</h4>
                    <ul className="list-disc list-inside text-stone-400 text-xs space-y-2">
                        {(analysis.improvements || []).map((imp, i) => <li key={i}>{imp}</li>)}
                    </ul>
                </div>
            </div>

            <div className="space-y-2 text-sm bg-stone-700/30 p-4 rounded-lg">
                <p><span className="font-bold text-yellow-500">Pricing Verdict:</span> <span className="text-stone-300">{analysis.pricingVerdict}</span></p>
                <p><span className="font-bold text-yellow-500">UX/Design Verdict:</span> <span className="text-stone-300">{analysis.uxVerdict}</span></p>
            </div>
        </div>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto pb-20">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-amber-300">Competitor Intel</h1>
                <p className="text-stone-400 text-sm">Directly compare your storefront against a rival.</p>
            </div>

            <div className="bg-stone-800/80 p-6 rounded-xl border border-stone-700 mb-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-300 mb-1">Your Store/Product URL</label>
                        <input 
                            type="text" 
                            value={myUrl}
                            onChange={(e) => setMyUrl(e.target.value)}
                            placeholder="https://mystore.com/product"
                            className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-300 mb-1">Competitor URL</label>
                        <input 
                            type="text" 
                            value={competitorUrl}
                            onChange={(e) => setCompetitorUrl(e.target.value)}
                            placeholder="https://rivalstore.com/product"
                            className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                    </div>
                    <button 
                        onClick={handleAnalyze}
                        disabled={loading || !isAvailable || !myUrl || !competitorUrl}
                        className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold py-3 rounded-lg hover:from-amber-500 hover:to-yellow-500 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Analyzing Strategy...' : 'Analyze & Compare'}
                    </button>
                </div>
            </div>

            {error && <ErrorDisplay message={error} />}
            {loading && <LoadingSpinner message="Crawling sites... Analyzing visual hierarchy... Comparing pricing models..." />}

            <div className="space-y-6">
                {data.map(item => <ResultCard key={item.id} analysis={item} />)}
            </div>
        </div>
    );
};

export default CompetitorAnalysisPage;
