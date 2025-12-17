
import { useState, useCallback } from 'react';

type GeminiStatus = 'idle' | 'loading' | 'success' | 'error';

interface GeminiResult {
  status: GeminiStatus;
  response: string;
  error: string | null;
  generate: (apiKey: string, prompt: string) => Promise<string>;
}

export function useGemini(): GeminiResult {
  const [status, setStatus] = useState<GeminiStatus>('idle');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (apiKey: string, prompt: string): Promise<string> => {
    // Reset state
    setStatus('loading');
    setResponse('');
    setError(null);

    // Validate inputs locally first
    if (!apiKey || !prompt) {
      const msg = "API Key and Prompt are required";
      setError(msg);
      setStatus('error');
      throw new Error(msg);
    }

    try {
      // --- STRATEGY 1: Attempt Backend Proxy ---
      try {
        const backendRes = await fetch('/api/gemini-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey, prompt }),
        });

        // If backend explicitly succeeds
        if (backendRes.ok) {
          const data = await backendRes.json();
          if (data.output) {
            setResponse(data.output);
            setStatus('success');
            return data.output;
          }
        }
        
        // If we reach here, backend returned non-200 or malformed data.
        // Throw to trigger catch block and fallback.
        throw new Error(`Backend unavailable or returned error: ${backendRes.status}`);
      } catch (backendErr) {
        console.warn('Backend proxy failed, attempting frontend fallback...', backendErr);
        // Continue to Strategy 2 below...
      }

      // --- STRATEGY 2: Frontend Direct Fallback ---
      // This runs if the try-block above throws an error (network or status)
      
      const frontendRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await frontendRes.json();

      // Handle Gemini API specific errors
      if (!frontendRes.ok || data.error) {
        const errorMessage = data.error?.message || `Gemini API Error: ${frontendRes.statusText}`;
        throw new Error(errorMessage);
      }

      // Extract content safely
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error("Gemini response format was unexpected (no text found).");
      }

      setResponse(generatedText);
      setStatus('success');
      return generatedText;

    } catch (err: any) {
      console.error("Gemini Generation Failed:", err);
      setError(err.message || "Unknown error occurred");
      setStatus('error');
      throw err;
    }
  }, []);

  return { status, response, error, generate };
}
