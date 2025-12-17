
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, SavedSession } from '../types';
import { initiateSession } from '../features/oracleSession/oracleSessionSlice';
import { fetchTrendsSuccess } from '../features/trends/trendsSlice';
import { fetchKeywordsSuccess } from '../features/keywords/keywordsSlice';
import { fetchMarketplacesSuccess } from '../features/marketplaces/marketplacesSlice';
import { fetchContentSuccess } from '../features/content/contentSlice';
import { fetchSocialsSuccess } from '../features/socials/socialsSlice';
import { fetchCopySuccess } from '../features/copy/copySlice';
import { fetchArbitrageSuccess } from '../features/arbitrage/arbitrageSlice';
import { fetchScenariosSuccess } from '../features/scenarios/scenariosSlice';
import { fetchVisionsSuccess, fetchBlueprintSuccess } from '../features/ventures/venturesSlice';
import { setStoreAnalysisData } from '../features/storeAnalysis/storeAnalysisSlice';
import { setProductResults } from '../features/productFinder/productFinderSlice';
import { setLeadsData } from '../features/leads/leadsSlice';
import { deleteSession } from '../features/history/historySlice';
import { useToast } from '../hooks/useToast';

const modules = {
    discovery: [
        { to: '/app/analysis', title: 'Market Analysis', desc: 'Scan trends', icon: '👁️' },
        { to: '/app/keywords', title: 'Keyword Research', desc: 'Map search', icon: '🧠' },
        { to: '/app/platforms', title: 'Platform Finder', desc: 'Sales channels', icon: '📡' },
        { to: '/app/finder', title: 'Product Finder', desc: 'Price check', icon: '🔍' },
        { to: '/app/leads', title: 'Leads Hunter', desc: 'Find emails', icon: '🎯' }, 
    ],
    strategy: [
        { to: '/app/competitor', title: 'Store Enhancer', desc: 'Compare & Improve', icon: '⚔️' },
        { to: '/app/arbitrage', title: 'Sales Arbitrage', desc: 'Price gaps', icon: '⚖️' },
        { to: '/app/scenarios', title: 'Scenario Planner', desc: 'Simulate', icon: '♟️' },
        { to: '/app/ventures', title: 'Venture Ideas', desc: 'New business', icon: '🚀' },
    ],
    creation: [
        { to: '/app/content', title: 'Content Strategy', desc: 'Plan viral', icon: '📝' },
        { to: '/app/socials', title: 'Social Media', desc: 'Amplify reach', icon: '📢' },
        { to: '/app/copy', title: 'Copywriting', desc: 'Persuade', icon: '✍️' },
        { to: '/app/media', title: 'Media Studio', desc: 'Create visuals', icon: '🎨' },
        { to: '/app/qna', title: 'AI Q&A', desc: 'Consult Oracle', icon: '🔮' },
        { to: '/app/live', title: 'Live Oracle', desc: 'Voice comms', icon: '🎙️' },
    ]
};

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch();
    const showToast = useToast();
    const { user } = useSelector((state: RootState) => state.auth);
    const { niche, purpose } = useSelector((state: RootState) => state.oracleSession);
    const { sessions } = useSelector((state: RootState) => state.history);
    
    const [activeTab, setActiveTab] = useState<'modules' | 'memory'>('modules');

    const handleLoadSession = (session: SavedSession) => {
        dispatch(initiateSession(session.oracleSession));
        dispatch(fetchTrendsSuccess(session.data.trends));
        dispatch(fetchKeywordsSuccess(session.data.keywords));
        dispatch(fetchMarketplacesSuccess(session.data.marketplaces));
        dispatch(fetchContentSuccess(session.data.content));
        dispatch(fetchSocialsSuccess(session.data.socials));
        dispatch(fetchCopySuccess(session.data.copy));
        dispatch(fetchArbitrageSuccess(session.data.arbitrage));
        dispatch(fetchScenariosSuccess(session.data.scenarios));
        dispatch(fetchVisionsSuccess(session.data.ventures.visions));
        if(session.data.ventures.blueprint) {
            dispatch(fetchBlueprintSuccess(session.data.ventures.blueprint));
        }
        if(session.data.storeAnalysis) {
            dispatch(setStoreAnalysisData(session.data.storeAnalysis));
        }
        if(session.data.productFinder) {
            dispatch(setProductResults(session.data.productFinder));
        }
        if(session.data.leads) {
            dispatch(setLeadsData(session.data.leads));
        }

        showToast(`Memory Loaded: ${session.oracleSession.niche}`);
        setActiveTab('modules');
        window.scrollTo(0, 0);
    };

    const ModuleCard: React.FC<{ to: string; title: string; desc: string; icon: string }> = ({ to, title, desc, icon }) => (
        <Link 
            to={to} 
            className="flex items-center gap-4 p-3 rounded-xl bg-[var(--tg-theme-secondary-bg-color,#292524)] border border-stone-800 hover:border-[var(--tg-theme-button-color)] transition-all duration-300"
        >
            <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center text-xl">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-[var(--tg-theme-text-color)] text-sm">{title}</h3>
                <p className="text-xs text-stone-500">{desc}</p>
            </div>
        </Link>
    );

    return (
        <div className="min-h-full pb-20 p-4 max-w-7xl mx-auto animate-fade-in space-y-6">
            
            {/* 1. HEADER */}
            <div className="flex justify-between items-center bg-gradient-to-r from-amber-900/40 to-stone-900 rounded-xl p-4 border border-amber-900/50">
                <div className="flex items-center gap-3">
                    {user?.photoUrl ? (
                        <img src={user.photoUrl} className="w-12 h-12 rounded-full border-2 border-amber-500" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-amber-700 flex items-center justify-center text-xl">👤</div>
                    )}
                    <div>
                        <h2 className="text-white font-bold">{user?.firstName || 'Oracle User'}</h2>
                        <p className="text-xs text-amber-400 font-mono">Welcome Back</p>
                    </div>
                </div>
            </div>

            {/* 2. THE NEURAL CORE (Active Goal) */}
            <div className="relative bg-[var(--tg-theme-bg-color)] border border-stone-800 rounded-2xl p-6 shadow-lg">
                <h1 className="text-xl font-bold text-[var(--tg-theme-text-color)]">
                    Neural Core
                </h1>
                {niche ? (
                    <p className="text-stone-400 mt-2 text-sm">
                        Focus: <span className="text-[var(--tg-theme-button-color)] font-semibold">{niche}</span> <br/>
                        <span className="text-xs text-stone-500">{purpose}</span>
                    </p>
                ) : (
                    <p className="text-stone-400 mt-2 text-sm">No active focus. The brain is idle.</p>
                )}

                <div className="mt-4 flex gap-2">
                    <Link 
                        to="/app/initiate" 
                        className="flex-1 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] text-center py-2 rounded-lg text-sm font-bold shadow-lg"
                    >
                        {niche ? 'New Sequence' : 'Initialize'}
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-800 overflow-x-auto">
                {['modules', 'memory'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-color)]' : 'border-transparent text-stone-500'}`}
                    >
                        {tab === 'modules' ? 'Pathways' : 'History'}
                    </button>
                ))}
            </div>

            {/* 3. NEURAL PATHWAYS */}
            {activeTab === 'modules' && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-2 gap-3">
                        {modules.discovery.map(m => <ModuleCard key={m.to} {...m} />)}
                        {modules.strategy.map(m => <ModuleCard key={m.to} {...m} />)}
                        {modules.creation.map(m => <ModuleCard key={m.to} {...m} />)}
                    </div>
                </div>
            )}

            {/* 4. MEMORY ARCHIVES */}
            {activeTab === 'memory' && (
                <div className="animate-fade-in-up space-y-3">
                    {sessions.length === 0 && <p className="text-center text-stone-500 text-sm py-4">No saved memories yet.</p>}
                    {sessions.map(session => (
                        <div 
                            key={session.id} 
                            onClick={() => handleLoadSession(session)}
                            className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-stone-800"
                        >
                            <div>
                                <h3 className="font-bold text-stone-200">{session.oracleSession.niche}</h3>
                                <p className="text-xs text-stone-500">{new Date(session.lastModified).toLocaleDateString()}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); dispatch(deleteSession(session.id)); }} className="text-red-500">🗑️</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
