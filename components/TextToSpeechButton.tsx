
import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { useToast } from '../hooks/useToast';

interface TextToSpeechButtonProps {
  text: string;
}

const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();
  
  // Ref for keeping track of the current source to stop it if needed
  const [currentSource, setCurrentSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const handlePlay = async () => {
    if (isPlaying && currentSource) {
      currentSource.stop();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoading(true);
      // Truncate text if too long to prevent timeouts for this demo
      const textToSpeak = text.length > 500 ? text.substring(0, 500) + "..." : text;
      
      const base64Audio = await generateSpeech(textToSpeak);
      if (!base64Audio) {
          throw new Error("No audio data returned");
      }

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      setAudioContext(ctx);

      // Decode Base64
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert PCM 16-bit to Float32
      const float32Data = new Float32Array(bytes.length / 2);
      const dataView = new DataView(bytes.buffer);
      
      for (let i = 0; i < bytes.length / 2; i++) {
          const int16 = dataView.getInt16(i * 2, true); // Little endian
          float32Data[i] = int16 / 32768.0;
      }

      const buffer = ctx.createBuffer(1, float32Data.length, 24000);
      buffer.copyToChannel(float32Data, 0);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
          setIsPlaying(false);
          ctx.close();
      };

      source.start();
      setCurrentSource(source);
      setIsPlaying(true);

    } catch (error) {
      console.error(error);
      showToast("Failed to generate speech.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePlay} 
      disabled={isLoading}
      className="text-stone-400 hover:text-amber-400 transition-colors"
      title="Read Aloud"
    >
      {isLoading ? (
        <span className="animate-pulse">⏳</span>
      ) : isPlaying ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
      )}
    </button>
  );
};

export default TextToSpeechButton;
