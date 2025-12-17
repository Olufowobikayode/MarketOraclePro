
import React, { useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateImageStart, editImageStart, generateVideoStart, analyzeMediaStart } from '../features/media/mediaSlice';
import type { RootState, MediaJob } from '../types';
import MediaDisplay from '../features/media/MediaDisplay';
import { useToast } from '../hooks/useToast';

const MediaStudioPage: React.FC = () => {
    const dispatch = useDispatch();
    const showToast = useToast();
    const { jobs } = useSelector((state: RootState) => state.media);
    const { niche, targetAudience } = useSelector((state: RootState) => state.oracleSession);
    const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

    const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'video' | 'analyze'>('create');
    
    // Create State
    const [prompt, setPrompt] = useState(`A promotional image for ${niche}`);
    const [usePro, setUsePro] = useState(false);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageSize, setImageSize] = useState('1K');
    const [videoAspectRatio, setVideoAspectRatio] = useState('16:9');
    
    // Edit/Video/Analyze Inputs
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const sortedJobs = useMemo(() => {
        return (Object.values(jobs) as MediaJob[]).sort((a, b) => b.jobId.localeCompare(a.jobId));
    }, [jobs]);

    const activeJob = sortedJobs.find(job => job.status === 'queued' || job.status === 'processing');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove the data URL prefix (e.g., "data:image/png;base64,")
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleAction = async () => {
        if (!prompt.trim() && activeTab !== 'analyze') {
            showToast('Please enter a prompt.', 'error');
            return;
        }

        const finalPrompt = activeTab === 'create' ? `${prompt}. Target audience: ${targetAudience}.` : prompt;

        try {
            if (activeTab === 'create') {
                dispatch(generateImageStart({ prompt: finalPrompt, aspectRatio, usePro, size: imageSize }));
            } 
            else if (activeTab === 'edit') {
                if (!uploadedFile) { showToast('Please upload an image to edit.', 'error'); return; }
                const base64 = await convertToBase64(uploadedFile);
                dispatch(editImageStart({ prompt: finalPrompt, imageBase64: base64 }));
            } 
            else if (activeTab === 'video') {
                let base64;
                if(uploadedFile) {
                    base64 = await convertToBase64(uploadedFile);
                }
                dispatch(generateVideoStart({ prompt: finalPrompt, aspectRatio: videoAspectRatio, imageBase64: base64 }));
            }
            else if (activeTab === 'analyze') {
                if (!uploadedFile) { showToast('Please upload media to analyze.', 'error'); return; }
                const base64 = await convertToBase64(uploadedFile);
                dispatch(analyzeMediaStart({ mediaBase64: base64, mimeType: uploadedFile.type, prompt: prompt || 'Analyze this.' }));
            }
        } catch (error) {
            showToast('Failed to process file.', 'error');
        }
    };

    const TabButton: React.FC<{ tab: typeof activeTab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => { setActiveTab(tab); setUploadedFile(null); setPreviewUrl(null); }}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-amber-500 text-amber-400' : 'border-transparent text-stone-400 hover:text-white'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto animate-fade-in pb-24">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-amber-300">Media Studio</h1>
                <p className="text-stone-400 text-sm">Generate, Edit, and Analyze media with Gemini.</p>
            </div>

            <div className="bg-stone-800/50 rounded-lg border border-stone-700/50 mb-6">
                <div className="flex border-b border-stone-700/50 px-4">
                    <TabButton tab="create" label="Create" />
                    <TabButton tab="edit" label="Edit" />
                    <TabButton tab="video" label="Video" />
                    <TabButton tab="analyze" label="Eye" />
                </div>

                <div className="p-4 space-y-4">
                    {/* Prompt Input */}
                    <div>
                        <label className="text-sm font-bold text-stone-300 block mb-1">
                            {activeTab === 'edit' ? 'Edit Instructions' : activeTab === 'analyze' ? 'Question (Optional)' : 'Prompt'}
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-stone-700 text-white border border-stone-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                            rows={3}
                            placeholder={activeTab === 'edit' ? "e.g., Change background to a cyberpunk city" : "Describe what you want..."}
                            disabled={!!activeJob || !isAvailable}
                        />
                    </div>

                    {/* File Upload (Edit/Video/Analyze) */}
                    {activeTab !== 'create' && (
                        <div>
                             <label className="text-sm font-bold text-stone-300 block mb-1">Upload Media {activeTab === 'video' && "(Optional Start Image)"}</label>
                             <input 
                                type="file" 
                                accept={activeTab === 'video' ? "image/*" : activeTab === 'analyze' ? "image/*,video/*" : "image/*"} 
                                onChange={handleFileChange} 
                                ref={fileInputRef}
                                className="block w-full text-sm text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
                             />
                             {previewUrl && (
                                 <div className="mt-2 relative w-32 h-32">
                                     {uploadedFile?.type.startsWith('video') ? (
                                         <video src={previewUrl} className="w-full h-full object-cover rounded-md" />
                                     ) : (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                                     )}
                                     <button onClick={() => { setUploadedFile(null); setPreviewUrl(null); }} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                                 </div>
                             )}
                        </div>
                    )}

                    {/* Create Options */}
                    {activeTab === 'create' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-stone-300 block mb-1">Model</label>
                                <div className="flex items-center gap-2 bg-stone-700 rounded-lg p-1">
                                    <button onClick={() => setUsePro(false)} className={`flex-1 py-1 text-xs rounded-md ${!usePro ? 'bg-stone-600 text-white' : 'text-stone-400'}`}>Flash</button>
                                    <button onClick={() => setUsePro(true)} className={`flex-1 py-1 text-xs rounded-md ${usePro ? 'bg-amber-700 text-white' : 'text-stone-400'}`}>Pro</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-stone-300 block mb-1">Aspect Ratio</label>
                                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full bg-stone-700 text-white border border-stone-600 rounded-lg px-2 py-1.5 text-xs">
                                    {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                             {usePro && (
                                <div>
                                    <label className="text-sm font-bold text-stone-300 block mb-1">Resolution</label>
                                    <select value={imageSize} onChange={e => setImageSize(e.target.value)} className="w-full bg-stone-700 text-white border border-stone-600 rounded-lg px-2 py-1.5 text-xs">
                                        {['1K', '2K', '4K'].map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Video Options */}
                    {activeTab === 'video' && (
                        <div>
                            <label className="text-sm font-bold text-stone-300 block mb-1">Aspect Ratio</label>
                            <select value={videoAspectRatio} onChange={e => setVideoAspectRatio(e.target.value)} className="w-full bg-stone-700 text-white border border-stone-600 rounded-lg px-2 py-1.5 text-xs">
                                <option value="16:9">16:9 (Landscape)</option>
                                <option value="9:16">9:16 (Portrait)</option>
                            </select>
                        </div>
                    )}

                    <button
                        onClick={handleAction}
                        disabled={!!activeJob || !isAvailable || (activeTab !== 'create' && activeTab !== 'video' && !uploadedFile)}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition duration-300 disabled:opacity-50 text-lg"
                    >
                        {activeJob ? 'Processing...' : 'Run'}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {activeJob && (
                    <div className="bg-stone-700/50 p-4 rounded-lg border border-stone-600 animate-pulse">
                        <p className="text-sm font-bold text-amber-300 mb-1 capitalize">{activeJob.jobType.replace('-', ' ')} in progress...</p>
                        <div className="w-full bg-stone-600 rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full transition-all duration-500" style={{ width: `${activeJob.progress}%` }}></div>
                        </div>
                    </div>
                )}

                {sortedJobs.map(job => (
                    <div key={job.jobId} className="animate-fade-in-up">
                        {job.status === 'completed' && job.asset && <MediaDisplay asset={job.asset} />}
                        {job.status === 'completed' && job.analysisResult && (
                             <div className="bg-stone-800 p-4 rounded-lg border border-stone-700">
                                <h3 className="text-lg font-bold text-amber-400 mb-2">Analysis Result</h3>
                                <p className="text-stone-300 mb-3">{job.analysisResult.description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-stone-200 text-xs">Insights</h4>
                                        <ul className="list-disc list-inside text-stone-400 text-xs">{job.analysisResult.insights.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-stone-200 text-xs">Tags</h4>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {job.analysisResult.tags.map((tag, idx) => <span key={idx} className="px-2 py-0.5 bg-stone-700 rounded-full text-xs text-amber-300">{tag}</span>)}
                                        </div>
                                    </div>
                                </div>
                             </div>
                        )}
                        {job.status === 'failed' && (
                            <div className="bg-red-900/30 border border-red-800 p-3 rounded-lg text-red-300 text-xs">
                                Error: {job.error}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaStudioPage;
