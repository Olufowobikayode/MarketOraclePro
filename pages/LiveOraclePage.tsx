
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { getCurrentApiKey, getSystemInstruction } from '../services/geminiService';
import Logo from '../components/Logo';
import { useToast } from '../hooks/useToast';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

// Simple Audio utils derived from prompt code
function createBlob(data: Float32Array): { data: string; mimeType: string } {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return {
        data: btoa(binary),
        mimeType: 'audio/pcm;rate=16000',
    };
}

function decodeAudio(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

const LiveOraclePage: React.FC = () => {
    const showToast = useToast();
    const oracleSession = useSelector((state: RootState) => state.oracleSession);
    const { niche } = oracleSession;
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    // Refs for session management
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null); // For future video support
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const stopSession = () => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (outputContextRef.current) {
            outputContextRef.current.close();
            outputContextRef.current = null;
        }
        setIsConnected(false);
        setIsSpeaking(false);
    };

    const startSession = async () => {
        try {
            const apiKey = getCurrentApiKey();
            if (!apiKey) throw new Error("API Key missing");
            const ai = new GoogleGenAI({ apiKey });

            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = inputCtx;
            outputContextRef.current = outputCtx;
            nextStartTimeRef.current = 0;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const outputNode = outputCtx.createGain();
            outputNode.connect(outputCtx.destination);

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log("Live Session Open");
                        setIsConnected(true);
                        
                        // Input Processing
                        const source = inputCtx.createMediaStreamSource(stream);
                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                        };
                        source.connect(processor);
                        processor.connect(inputCtx.destination);
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                         const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                         if (audioData) {
                             setIsSpeaking(true);
                             const audioBuffer = await decodeAudioData(decodeAudio(audioData), outputCtx, 24000, 1);
                             const source = outputCtx.createBufferSource();
                             source.buffer = audioBuffer;
                             source.connect(outputNode);
                             source.onended = () => {
                                 sourcesRef.current.delete(source);
                                 if (sourcesRef.current.size === 0) setIsSpeaking(false);
                             };
                             
                             nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                             source.start(nextStartTimeRef.current);
                             nextStartTimeRef.current += audioBuffer.duration;
                             sourcesRef.current.add(source);
                         }
                         if (msg.serverContent?.interrupted) {
                             sourcesRef.current.forEach(s => s.stop());
                             sourcesRef.current.clear();
                             nextStartTimeRef.current = 0;
                             setIsSpeaking(false);
                         }
                    },
                    onclose: () => {
                        console.log("Session Closed");
                        setIsConnected(false);
                    },
                    onerror: (e) => {
                        console.error("Session Error", e);
                        showToast("Live session error occurred.", "error");
                        stopSession();
                    }
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                    systemInstruction: getSystemInstruction(oracleSession),
                    tools: [{ googleSearch: {} }],
                }
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (e) {
            console.error(e);
            showToast("Failed to start Live session. Check microphone permissions.", "error");
        }
    };

    useEffect(() => {
        return () => stopSession();
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Visualizer Background Effect */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isConnected ? 'opacity-100' : 'opacity-20'}`}>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500 rounded-full blur-[100px] animate-pulse"></div>
            </div>
            
            <div className="z-10 text-center space-y-8">
                <Logo className={`h-32 w-32 mx-auto transition-transform duration-500 ${isSpeaking ? 'scale-110 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]' : 'scale-100'}`} />
                
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Live Oracle</h1>
                    <p className="text-stone-300">Speak your questions. Listen to the prophecy.</p>
                </div>

                {!isConnected ? (
                    <button 
                        onClick={startSession}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:scale-105 transition-transform"
                    >
                        Begin Session
                    </button>
                ) : (
                     <button 
                        onClick={stopSession}
                        className="bg-red-600/80 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full border border-red-500 backdrop-blur-sm"
                    >
                        End Communion
                    </button>
                )}
                
                <div className="h-8">
                    {isConnected && (
                        <span className="text-amber-400 text-sm font-mono animate-pulse">
                            {isSpeaking ? "Oracle is speaking..." : "Listening..."}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveOraclePage;
