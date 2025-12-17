
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { fetchLeadsStart, fetchMoreLeadsStart, validateLeadsStart } from '../features/leads/leadsSlice';
import type { RootState, Lead } from '../types';
import { useToast } from '../hooks/useToast';

const LeadsFinderPage: React.FC = () => {
    const dispatch = useDispatch();
    const showToast = useToast();
    const { emails, loading, validating, error } = useSelector((state: RootState) => state.leads);
    const { isAvailable } = useSelector((state: RootState) => state.apiStatus);
    const { niche, targetAudience } = useSelector((state: RootState) => state.oracleSession);
    
    const [useContext, setUseContext] = useState(false);
    const [site, setSite] = useState('');
    const [strategy, setStrategy] = useState('standard');
    // Use an array of objects to manage dynamic inputs easily, then flatten to strings
    const [params, setParams] = useState<{id: number, value: string}[]>([{ id: 1, value: '' }]);

    const handleAddParam = () => {
        setParams([...params, { id: Date.now(), value: '' }]);
    };

    const handleRemoveParam = (id: number) => {
        setParams(params.filter(p => p.id !== id));
    };

    const handleParamChange = (id: number, value: string) => {
        setParams(params.map(p => p.id === id ? { ...p, value } : p));
    };

    const handleSearch = () => {
        if (!site || !isAvailable) return;
        
        let finalParams = params.map(p => p.value).filter(v => v.trim() !== '');
        
        if (useContext && niche) {
            // Auto-inject niche keywords if context mode is on
            finalParams = [niche, ...finalParams];
            if (targetAudience) {
                // Simplistic extraction of first few words of audience to avoid too long query
                const audienceKeywords = targetAudience.split(' ').slice(0, 3).join(' ');
                finalParams.push(audienceKeywords);
            }
        }

        dispatch(fetchLeadsStart({ site, parameters: finalParams, strategy }));
    };

    const handleLoadMore = () => {
        dispatch(fetchMoreLeadsStart());
    };

    const handleValidate = () => {
        dispatch(validateLeadsStart());
        showToast('Validation started. This may take a moment.');
    };

    const handleCopyList = () => {
        if (emails.length === 0) return;
        const text = emails.map(l => `${l.email}, ${l.name || 'Unknown'}, ${l.role || 'Unknown'}`).join('\n');
        navigator.clipboard.writeText(text).then(() => {
            showToast('Lead list copied to clipboard!');
        });
    };

    const ValidationBadge: React.FC<{ lead: Lead }> = ({ lead }) => {
        if (!lead.validationStatus || lead.validationStatus === 'pending') {
            return <span className="text-stone-500 text-[10px] border border-stone-700 px-1 rounded">?</span>;
        }
        if (lead.validationStatus === 'valid') {
            return <span className="text-green-400 text-[10px] border border-green-800 bg-green-900/30 px-1 rounded">✓ Valid</span>;
        }
        if (lead.validationStatus === 'invalid') {
            return <span className="text-red-400 text-[10px] border border-red-800 bg-red-900/30 px-1 rounded">✕ Invalid</span>;
        }
        if (lead.validationStatus === 'risky') {
            return <span className="text-orange-400 text-[10px] border border-orange-800 bg-orange-900/30 px-1 rounded">⚠ Risky</span>;
        }
        return <span className="text-stone-400 text-[10px] border border-stone-700 px-1 rounded">Unknown</span>;
    };

    return (
        <div className="p-4 max-w-4xl mx-auto pb-24">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-amber-300">Leads Hunter</h1>
                <p className="text-stone-400 text-sm">Deep scan sites for targeted contacts.</p>
            </div>

            {/* Input Section */}
            <div className="bg-stone-800/80 p-5 rounded-xl border border-stone-700 mb-6 space-y-4">
                
                {/* Context Switch */}
                <div className="flex items-center justify-end mb-2">
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-2 text-xs font-bold text-stone-400">
                            {useContext ? "Using Project Context" : "Manual Mode"}
                        </span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={useContext} onChange={() => setUseContext(!useContext)} />
                            <div className={`block w-10 h-6 rounded-full ${useContext ? 'bg-amber-600' : 'bg-stone-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${useContext ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-300 mb-1">Target Domain</label>
                        <input 
                            type="text" 
                            value={site}
                            onChange={(e) => setSite(e.target.value)}
                            placeholder="e.g., tesla.com, ycombinator.com"
                            className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-300 mb-1">Lead Filter Strategy</label>
                        <select 
                            value={strategy}
                            onChange={(e) => setStrategy(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        >
                            <option value="standard">No Filter (Standard)</option>
                            <optgroup label="Roles">
                                <option value="decision-makers">CEO / Founders / Executives</option>
                                <option value="technical">CTO / Engineers / Developers</option>
                                <option value="hr-hiring">HR / Recruiters</option>
                                <option value="marketing">Marketing / Growth</option>
                                <option value="sales">Sales / Business Dev</option>
                                <option value="finance">Finance / Investors</option>
                            </optgroup>
                            <optgroup label="Industries">
                                <option value="ecommerce">E-commerce / DTC</option>
                                <option value="saas">SaaS / B2B Tech</option>
                                <option value="crypto">Crypto / Web3 / NFT</option>
                                <option value="real-estate">Real Estate</option>
                                <option value="medical">Medical / Healthcare</option>
                                <option value="legal">Legal / Law Firms</option>
                                <option value="construction">Construction / Trades</option>
                                <option value="education">Education / Academia</option>
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">
                        {useContext ? `Extra Keywords (Niche: "${niche}" included)` : 'Keywords'}
                    </label>
                    <div className="space-y-2">
                        {params.map((p, index) => (
                            <div key={p.id} className="flex gap-2">
                                <input 
                                    type="text"
                                    value={p.value}
                                    onChange={(e) => handleParamChange(p.id, e.target.value)}
                                    placeholder={index === 0 ? "e.g., 'San Francisco', 'Python', 'Remote'" : "Additional keyword..."}
                                    className="flex-grow bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                                />
                                {params.length > 1 && (
                                    <button 
                                        onClick={() => handleRemoveParam(p.id)}
                                        className="text-red-500 hover:text-red-400 px-2"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={handleAddParam}
                        className="mt-2 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 border border-amber-900/50 px-2 py-1 rounded bg-amber-900/20"
                    >
                        + Add Parameter
                    </button>
                </div>

                <button 
                    onClick={handleSearch}
                    disabled={loading || !isAvailable || !site}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold py-3 rounded-lg hover:from-amber-500 hover:to-yellow-500 transition-all disabled:opacity-50 mt-2"
                >
                    {loading ? 'Deep Scanning...' : 'Start Extraction'}
                </button>
            </div>

            {error && <ErrorDisplay message={error} />}
            {loading && <LoadingSpinner message={["Simulating deep web scan...", "Extracting contacts from 'About' pages...", "Deciphering obfuscated emails...", "Verifying roles..."]} />}

            {/* Results Section */}
            {emails.length > 0 && (
                <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg animate-fade-in-up">
                    <div className="p-4 border-b border-stone-800 flex justify-between items-center bg-stone-800/50">
                        <h3 className="font-bold text-white">Extracted Leads ({emails.length})</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleValidate}
                                disabled={validating}
                                className="text-xs bg-stone-700 hover:bg-green-700 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-2 border border-stone-600 disabled:opacity-50"
                            >
                                {validating ? (
                                    <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <span>✓</span>
                                )}
                                Validate
                            </button>
                            <button 
                                onClick={handleCopyList}
                                className="text-xs bg-stone-700 hover:bg-stone-600 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-2 border border-stone-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                Copy All
                            </button>
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-left text-sm text-stone-400">
                            <thead className="text-xs text-stone-500 uppercase bg-stone-950 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Contact</th>
                                    <th scope="col" className="px-4 py-3">Role</th>
                                    <th scope="col" className="px-4 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emails.map((lead, index) => (
                                    <tr key={index} className="border-b border-stone-800 hover:bg-stone-800/30">
                                        <td className="px-4 py-3">
                                            <div className="font-mono text-amber-100 select-all">{lead.email}</div>
                                            {lead.name && <div className="text-xs text-stone-500">{lead.name}</div>}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {lead.role ? (
                                                <span className="bg-stone-800 px-2 py-1 rounded border border-stone-700">{lead.role}</span>
                                            ) : (
                                                <span className="text-stone-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <ValidationBadge lead={lead} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-stone-800 text-center bg-stone-800/30">
                        <button 
                            onClick={handleLoadMore}
                            disabled={loading || !isAvailable}
                            className="text-amber-400 hover:text-amber-300 text-sm font-semibold disabled:opacity-50"
                        >
                            {loading ? 'Scanning...' : 'Scan Deeper'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadsFinderPage;
