
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { findProductsStart, fetchMoreProductsStart, fetchAgentsStart, verifySellerStart, verifyAgentStart } from '../features/productFinder/productFinderSlice';
import type { RootState, ProductResultData, ProcurementAgent } from '../types';
import { toggleCardSelection } from '../features/comparison/comparisonSlice';
import FullscreenModal from '../components/FullscreenModal';

const ProductFinderPage: React.FC = () => {
    const dispatch = useDispatch();
    const { results, agents, loading, agentsLoading, error } = useSelector((state: RootState) => state.productFinder);
    const { selectedCards } = useSelector((state: RootState) => state.comparison);
    const { isAvailable } = useSelector((state: RootState) => state.apiStatus);
    const { country } = useSelector((state: RootState) => state.oracleSession);
    
    const [query, setQuery] = useState('');
    const [lastSearchedQuery, setLastSearchedQuery] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [viewProduct, setViewProduct] = useState<ProductResultData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync viewProduct with Redux store to show verification updates in real-time
    useEffect(() => {
        if (viewProduct) {
            const updatedProduct = results.find(p => p.id === viewProduct.id);
            if (updatedProduct && JSON.stringify(updatedProduct) !== JSON.stringify(viewProduct)) {
                setViewProduct(updatedProduct);
            }
        }
    }, [results, viewProduct]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setImageBase64(result.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSearch = () => {
        if ((!query && !imageBase64) || !isAvailable) return;
        setLastSearchedQuery(query || 'Image Search');
        dispatch(findProductsStart({ query, imageBase64 }));
    };

    const handleLoadMore = () => {
        if (!lastSearchedQuery || !isAvailable) return;
        dispatch(fetchMoreProductsStart({ query: lastSearchedQuery }));
    };

    const handleFetchAgents = () => {
        if (!country) return;
        dispatch(fetchAgentsStart({ userCountry: country }));
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-400 border-green-500 bg-green-900/20';
        if (score >= 5) return 'text-yellow-400 border-yellow-500 bg-yellow-900/20';
        return 'text-red-400 border-red-500 bg-red-900/20';
    };

    const ProductCard: React.FC<{ product: ProductResultData }> = ({ product }) => {
        const isSelected = selectedCards.some(c => c.id === product.id);
        
        const handleSelect = (e: React.MouseEvent) => {
            e.stopPropagation();
            dispatch(toggleCardSelection(product));
        };

        const score = product.sellerInfo?.verification?.score;

        return (
            <div 
                className={`bg-stone-800 border rounded-lg overflow-hidden shadow-lg hover:bg-stone-700/50 transition-all cursor-pointer relative flex flex-col ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-stone-700'}`}
                onClick={() => setViewProduct(product)}
            >
                <div className="absolute top-2 right-2 z-10">
                    <button 
                        onClick={handleSelect}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md ${isSelected ? 'bg-amber-500 text-white' : 'bg-stone-900/80 text-stone-300 hover:bg-stone-700'}`}
                    >
                        {isSelected ? '✓' : '+'}
                    </button>
                </div>
                
                {product.imageUrl ? (
                    <div className="h-40 bg-white flex items-center justify-center p-2 relative overflow-hidden">
                        <img src={product.imageUrl} alt={product.title} className="max-h-full max-w-full object-contain transition-transform hover:scale-105" />
                        {score !== undefined && (
                            <div className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded border ${getScoreColor(score)} shadow-sm`}>
                                Trust: {score}/10
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-40 bg-stone-700 flex items-center justify-center text-stone-500 text-xs">
                        No Image
                    </div>
                )}
                
                <div className="p-3 flex-grow flex flex-col">
                    <h4 className="font-bold text-stone-200 text-sm leading-tight mb-1 line-clamp-2">{product.title}</h4>
                    
                    <div className="flex flex-col mt-auto pt-2 border-t border-stone-700/50">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-amber-400 font-bold text-lg">{product.price}</p>
                            <button className="text-xs bg-stone-700 hover:bg-stone-600 text-white px-2 py-1 rounded transition-colors">Details</button>
                        </div>
                        {product.shipping && (
                            <div className="text-[10px] text-stone-400 flex items-center gap-1">
                                <span>🚢 {product.shipping.cost}</span>
                                <span className="text-stone-600">•</span>
                                <span>{product.shipping.days}</span>
                            </div>
                        )}
                        <p className="text-[10px] text-stone-500 truncate mt-1">{product.storeName}</p>
                    </div>
                </div>
            </div>
        );
    };

    const AgentCard: React.FC<{ agent: ProcurementAgent }> = ({ agent }) => {
        const dispatch = useDispatch();
        const score = agent.verification?.score;

        const handleVerify = () => {
            dispatch(verifyAgentStart({ agentId: agent.id, name: agent.name, url: agent.website }));
        };

        return (
            <div className="bg-stone-800 border border-stone-600 p-4 rounded-lg mb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-amber-400">{agent.name}</h4>
                        {score !== undefined ? (
                             <span className={`text-[10px] px-2 py-0.5 rounded border ml-2 ${getScoreColor(score)}`}>Verified: {score}/10</span>
                        ) : (
                             <span className="text-xs text-stone-500 ml-2 italic">Unverified</span>
                        )}
                    </div>
                    <button 
                        onClick={handleVerify}
                        disabled={!!agent.isVerifying || !!agent.verification}
                        className="text-[10px] bg-stone-700 hover:bg-stone-600 border border-stone-500 text-white px-2 py-1 rounded disabled:opacity-50 flex items-center gap-1"
                    >
                        {agent.isVerifying ? (
                            <>
                                <span className="w-2 h-2 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                Checking...
                            </>
                        ) : agent.verification ? 'Re-Verify' : 'Verify Agent'}
                    </button>
                </div>
                <p className="text-xs text-stone-400 mt-1">{agent.country} • {agent.contactInfo}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                    {agent.services.map((svc, i) => (
                        <span key={i} className="text-[10px] border border-stone-600 px-2 py-0.5 rounded text-stone-300">{svc}</span>
                    ))}
                </div>
                
                {agent.verification && (
                    <div className="mt-2 bg-stone-900 p-2 rounded text-xs">
                        <p className={`font-bold ${agent.verification.verdict.includes('Legit') ? 'text-green-400' : 'text-red-400'}`}>Verdict: {agent.verification.verdict}</p>
                        
                        {agent.verification.socialProfiles && agent.verification.socialProfiles.length > 0 && (
                            <div className="flex gap-2 my-1">
                                {agent.verification.socialProfiles.map((p, idx) => (
                                    <a key={idx} href={p.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">{p.platform}</a>
                                ))}
                            </div>
                        )}

                        <ul className="list-disc list-inside text-stone-400 mt-1">
                            {agent.verification.details.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </div>
                )}

                <div className="flex gap-2 mt-3">
                    <a href={agent.website} target="_blank" rel="noreferrer" className="flex-1 text-center bg-amber-700 hover:bg-amber-600 text-white py-1.5 rounded text-xs font-bold transition-colors">
                        Visit Website
                    </a>
                    {agent.mapLocationUri && (
                        <a href={agent.mapLocationUri} target="_blank" rel="noreferrer" className="flex-1 text-center bg-stone-700 hover:bg-stone-600 text-white py-1.5 rounded text-xs font-bold transition-colors">
                            View Map
                        </a>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 max-w-4xl mx-auto pb-24">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-amber-300">Product Price Finder</h1>
                <p className="text-stone-400 text-sm">Locate cheapest prices & verify sellers.</p>
            </div>

            {/* Input Area */}
            <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 mb-6 shadow-lg">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter product name (e.g. Sony WH-1000XM5)"
                            className="flex-grow bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-stone-700 hover:bg-stone-600 text-white px-3 rounded-lg border border-stone-600"
                            title="Upload Image Search"
                        >
                            📸
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                    </div>

                    {imagePreview && (
                        <div className="relative w-24 h-24 mx-auto">
                            <img src={imagePreview} className="w-full h-full object-cover rounded-lg border border-stone-500" />
                            <button 
                                onClick={() => { setImagePreview(null); setImageBase64(null); }}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <button 
                        onClick={handleSearch}
                        disabled={loading || !isAvailable || (!query && !imageBase64)}
                        className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold py-3 rounded-lg hover:from-amber-500 hover:to-yellow-500 transition-all disabled:opacity-50"
                    >
                        {loading && results.length === 0 ? 'Scanning Sellers...' : 'Find Best Prices'}
                    </button>
                </div>
            </div>

            {error && <ErrorDisplay message={error} />}
            {loading && results.length === 0 && <LoadingSpinner message={["Scanning global marketplaces...", "Translating product details...", "Comparing shipping to your country...", "Checking delivery times..."]} />}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((product, i) => (
                    <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {results.length > 0 && !loading && (
                <div className="mt-8 text-center">
                    <button 
                        onClick={handleLoadMore}
                        className="bg-stone-800 border-2 border-amber-600 text-amber-400 font-bold py-3 px-8 rounded-lg hover:bg-stone-700 hover:text-white transition-all transform hover:scale-105 shadow-lg"
                    >
                        Load More Results
                    </button>
                </div>
            )}
            
            {loading && results.length > 0 && (
                <div className="mt-8 flex justify-center">
                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-amber-400"></div>
                </div>
            )}

            {/* Product Details Modal */}
            <FullscreenModal 
                isOpen={!!viewProduct}
                onClose={() => setViewProduct(null)}
                title={viewProduct?.title || 'Product Details'}
            >
                {viewProduct && (
                    <div className="space-y-6">
                        {viewProduct.imageUrl && (
                            <div className="w-full bg-white rounded-lg p-4 flex justify-center">
                                <img src={viewProduct.imageUrl} className="max-h-64 object-contain" alt={viewProduct.title} />
                            </div>
                        )}
                        
                        <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700">
                            <h3 className="text-xl font-bold text-white mb-1">{viewProduct.price}</h3>
                            <p className="text-stone-400 text-sm mb-4">Sold by: <span className="text-amber-400">{viewProduct.storeName}</span></p>
                            
                            {/* Shipping Details Section */}
                            {viewProduct.shipping && (
                                <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-600 mb-4 text-sm">
                                    <h4 className="font-bold text-stone-200 mb-2 border-b border-stone-700 pb-1">Shipping to {country}</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="text-stone-500 text-xs block">Cost</span>
                                            <span className="text-green-400 font-semibold">{viewProduct.shipping.cost}</span>
                                        </div>
                                        <div>
                                            <span className="text-stone-500 text-xs block">Estimated Time</span>
                                            <span className="text-white font-semibold">{viewProduct.shipping.days}</span>
                                        </div>
                                        {viewProduct.shipping.method && (
                                            <div className="col-span-2 mt-1">
                                                <span className="text-stone-500 text-xs block">Method</span>
                                                <span className="text-stone-300">{viewProduct.shipping.method}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <a 
                                href={viewProduct.productUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg text-center shadow-lg transition-all"
                            >
                                Buy Now (View Product)
                            </a>
                        </div>

                        {/* Reviews Section */}
                        {viewProduct.reviews && viewProduct.reviews.length > 0 && (
                            <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700">
                                <h4 className="text-md font-bold text-stone-200 mb-2">Review Highlights</h4>
                                <ul className="list-disc list-inside text-stone-400 text-xs space-y-2">
                                    {viewProduct.reviews.map((rev, i) => <li key={i}>{rev}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* Seller Deep Dive */}
                        {viewProduct.sellerInfo && (
                            <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700">
                                <div className="flex justify-between items-center mb-3 border-b border-stone-700 pb-2">
                                    <h4 className="text-lg font-bold text-amber-400">Seller Profile</h4>
                                    <button
                                        onClick={() => dispatch(verifySellerStart({ productId: viewProduct.id, sellerName: viewProduct.sellerInfo!.name, url: viewProduct.sellerInfo!.url || viewProduct.productUrl, platform: viewProduct.sellerInfo!.platform }))}
                                        disabled={!!viewProduct.sellerInfo.isVerifying}
                                        className="text-xs bg-stone-700 hover:bg-stone-600 border border-stone-500 text-white px-3 py-1.5 rounded disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {viewProduct.sellerInfo.isVerifying ? (
                                            <>
                                                <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                                Verifying...
                                            </>
                                        ) : viewProduct.sellerInfo.verification ? 'Re-Verify' : 'Verify Seller'}
                                    </button>
                                </div>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-stone-400">Name:</span>
                                        <span className="text-white text-right">{viewProduct.sellerInfo.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-400">Initial Rating:</span>
                                        <span className="text-yellow-400 font-bold">{viewProduct.sellerInfo.initialRating || 'N/A'}</span>
                                    </div>
                                    
                                    {/* Verification Results */}
                                    {viewProduct.sellerInfo.verification && (
                                        <div className="bg-stone-900 p-3 rounded border border-stone-700 mt-2 animate-fade-in">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-stone-200">Trust Score:</span>
                                                <span className={`font-bold ${getScoreColor(viewProduct.sellerInfo.verification.score)} px-2 py-0.5 rounded border`}>
                                                    {viewProduct.sellerInfo.verification.score}/10
                                                </span>
                                            </div>
                                            <p className={`text-xs font-bold mb-2 ${viewProduct.sellerInfo.verification.verdict.includes('Legit') ? 'text-green-400' : 'text-red-400'}`}>
                                                Verdict: {viewProduct.sellerInfo.verification.verdict}
                                            </p>
                                            
                                            {/* Social Links */}
                                            {viewProduct.sellerInfo.verification.socialProfiles && viewProduct.sellerInfo.verification.socialProfiles.length > 0 && (
                                                <div className="mb-2 pb-2 border-b border-stone-700">
                                                    <p className="text-xs font-semibold text-stone-300 mb-1">Social Presence:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {viewProduct.sellerInfo.verification.socialProfiles.map((p, i) => (
                                                            <a key={i} href={p.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 bg-stone-800 px-2 py-0.5 rounded border border-stone-600">
                                                                {p.platform}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1 text-xs text-stone-400">
                                                <p>📍 Address: {viewProduct.sellerInfo.address || 'Unverified'}</p>
                                                <p>📞 Phone: {viewProduct.sellerInfo.phone || 'Unverified'}</p>
                                                <div className="mt-2">
                                                    <p className="font-semibold text-stone-300">Key Findings:</p>
                                                    <ul className="list-disc list-inside">
                                                        {viewProduct.sellerInfo.verification.details.map((d, i) => <li key={i}>{d}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Procurement Agent Section */}
                        <div className="border-t border-stone-700 pt-6 mt-6">
                            <h4 className="text-lg font-bold text-white mb-2">Can't Buy Directly?</h4>
                            <p className="text-stone-400 text-sm mb-4">
                                Use a vetted procurement agent to buy, pay, and ship to <strong>{country}</strong> on your behalf.
                            </p>
                            
                            {!agentsLoading && agents.length === 0 && (
                                <button 
                                    onClick={handleFetchAgents}
                                    className="w-full bg-stone-700 hover:bg-stone-600 text-white font-bold py-3 rounded-lg border border-stone-500 transition-colors"
                                >
                                    Find Agents for {country}
                                </button>
                            )}

                            {agentsLoading && <LoadingSpinner message="Vetting shipping agents..." />}

                            {agents.length > 0 && (
                                <div className="space-y-3 mt-4">
                                    {agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
                                    <button 
                                        onClick={handleFetchAgents}
                                        className="w-full text-center text-xs text-stone-400 hover:text-white mt-4 border border-stone-700 rounded py-2 hover:bg-stone-800 transition-colors"
                                    >
                                        Find More Agents
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </FullscreenModal>
        </div>
    );
};

export default ProductFinderPage;
