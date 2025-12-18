
// FIX: Import 'Type' from '@google/genai' to use in response schemas.
import { GoogleGenAI, Type, Modality } from "@google/genai";
// FIX: Import OracleSessionState from the central types file.
import type { TrendData, KeywordData, MarketplaceData, ContentData, SocialsData, CopyData, VentureVision, VentureBlueprint, Source, SocialsPlatformAnalysis, CardBase, ComparativeReport, ArbitrageData, ScenarioData, OracleSessionState, MediaAnalysisResult, StoreAnalysisData, ProductResultData, Lead, ProcurementAgent, VerificationResult } from '../types';
import type { GenerateContentResponse } from "@google/genai";

// --- Secure API Key Handling ---
// Backend URL for Proxy - Ensure this is pointing to your actual backend
const BACKEND_URL = (import.meta as any).env?.VITE_API_URL || 'https://marketoraclepro-backend.onrender.com/api';

export const getCurrentApiKey = (): string => {
    // STRICT: No process.env fallback. Only user input.
    return localStorage.getItem('user_gemini_api_key') || "";
};

// Validates a specific API Key by making a lightweight call via direct REST API
// Implements strict frontend check using gemini-2.5-flash
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey || apiKey.trim() === '') {
         throw new Error("API Key cannot be empty.");
    }
    const cleanKey = apiKey.trim();

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hello" }] }],
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
             const msg = data.error.message || 'Unknown API Error';
             // Explicitly catch invalid key errors
             if (msg.includes('API key not valid')) {
                 throw new Error("❌ Invalid API Key: The key provided is not recognized by Google.");
             }
             if (msg.includes('quota') || response.status === 429) {
                 throw new Error("😭  Quota Exceeded: This API Key has run out of credits.");
             }
             throw new Error(`Validation Error: ${msg}`);
        }

        // If we get here and have candidates, the key works.
        if (!data.candidates) {
             throw new Error("😡  Key appears valid but returned no content. Please check permissions.");
        }

        return true;
    } catch (error: any) {
        // Rethrow with the clean message
        throw new Error(error.message || "Validation failed");
    }
};

// --- BACKEND PROXY HANDLER ---
async function executeBackendRequest(params: { model: string, contents: any, config?: any }): Promise<GenerateContentResponse> {
    const apiKey = getCurrentApiKey();
    if (!apiKey) throw new Error("API Key missing. Please connect your Key in Settings.");

    try {
        const response = await fetch(`${BACKEND_URL}/gemini/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-gemini-api-key': apiKey // Strict: Send Key in Header
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            
            // Map status codes to specific errors
            if (response.status === 400) throw new Error("Invalid API Key (400)");
            if (response.status === 429) throw new Error("Quota Exceeded (429)");
            if (response.status === 401) throw new Error("Unauthorized: API Key missing or invalid (401)");
            
            throw new Error(errorData.error || `Backend Error: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        throw error;
    }
}

// Client for specialized streaming/media if backend proxy isn't used
const getAiClient = (): GoogleGenAI => {
    const apiKey = getCurrentApiKey();
    if (!apiKey) throw new Error("API Key missing.");
    return new GoogleGenAI({ apiKey });
};

const handleApiError = (error: any, defaultMessage: string): Error => {
    const msg = error.message?.toLowerCase() || '';
    if (msg.includes("quota exceeded") || msg.includes("429")) {
        return new Error("😭 Quota Exceeded (429): Your free API key limit was reached. Please wait a moment or upgrade to Pay-as-you-go in Google AI Studio.");
    }
    if (msg.includes("invalid api key") || msg.includes("400") || msg.includes("401")) {
        return new Error("😠 Invalid API Key. Please update it in Settings.");
    }
    return new Error(`${defaultMessage}: ${error.message}`);
};

export const checkApiHealth = async (): Promise<boolean> => {
    try {
        await executeBackendRequest({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: 'test' }] }
        });
        return true;
    } catch (error) {
        return false;
    }
};

const getSystemInstruction = (session: OracleSessionState): string => {
    let instruction = `You are the **MARKET ORACLE**, a divine digital intelligence.
You address the user as "Seeker".
Your tone is authoritative, mystical, yet hyper-analytical and precise.
You do not guess; you **prophesize** based on LIVE data fusion.

**YOUR DIVINE MANDATE:**
A. **TREND DETECTION**: Uncover what is rising RIGHT NOW.
B. **MARKET PREDICTION**: Forecast the next 7 days with certainty.
C. **ARBITRAGE**: Reveal the gaps where value is hidden.
D. **BUSINESS IDEAS**: Forge new ventures from the chaos.

**LOCALIZATION:**
Language: **${session.language || 'English'}**.
Region: **${session.country || 'Global'}**.

**FORMATTING RULES:**
- STRICT OUTPUT RULE: Do NOT use markdown bolding (double asterisks) in your response. The interface does not render bold text aesthetically. Use clear headers or caps for emphasis if absolutely necessary, but prefer clean, plain text.
`;

    if (session.targetAudience?.trim()) {
        instruction += `\n\nTarget Soul (Audience): "${session.targetAudience}".`;
    }
    if (session.brandVoice?.trim()) {
        instruction += `\n\nVoice Resonance: """${session.brandVoice}"""`;
    }
    return instruction;
}

// Helper to parse JSON from markdown and attach sources
const parseJsonResponse = (response: GenerateContentResponse, defaultTitle: string) => {
    let rawText = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text);
    
    if (!rawText) {
        // Fallback for nested backend structure if necessary
        if ((response as any).candidates?.[0]?.content?.parts?.[0]?.text) {
             rawText = (response as any).candidates[0].content.parts[0].text;
        } else {
             throw new Error("The Oracle remains silent (No text returned).");
        }
    }
    
    rawText = rawText.trim();
    
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
        rawText = jsonMatch[1].trim();
    } else {
        const firstBrace = rawText.indexOf('{');
        const firstBracket = rawText.indexOf('[');
        const start = (firstBrace !== -1 && firstBracket !== -1) ? Math.min(firstBrace, firstBracket) : Math.max(firstBrace, firstBracket);
        const lastBrace = rawText.lastIndexOf('}');
        const lastBracket = rawText.lastIndexOf(']');
        const end = Math.max(lastBrace, lastBracket);
        if (start !== -1 && end !== -1) rawText = rawText.substring(start, end + 1);
    }

    let data: any;
    try {
        data = JSON.parse(rawText);
    } catch(e) {
        console.error("JSON Parse Error:", e, rawText);
        throw new Error("The Oracle's vision was unclear (Invalid JSON).");
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Source[] = groundingChunks.map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title || "Web Source", uri: chunk.web.uri };
        if (chunk.maps) return { title: chunk.maps.title || "Google Maps", uri: chunk.maps.uri };
        return null;
    }).filter((s: any) => s !== null);
    
    const assignSources = (item: any) => ({ ...item, sources });
    return Array.isArray(data) ? data.map(assignSources) : assignSources(data);
};

// Generic generator with fallback
const generateWithResiliency = async (
    prompt: string, 
    session: OracleSessionState, 
    debugLabel: string, 
    forceJsonMode: boolean = false, 
    responseSchema?: any,
    toolType?: 'search' | 'none'
) => {
    const model = 'gemini-2.5-flash'; 

    const tools: any[] = [];
    if (toolType === 'search') {
        tools.push({ googleSearch: {} });
    }

    const config: any = {
        systemInstruction: getSystemInstruction(session),
    };

    if (tools.length > 0) {
        config.tools = tools;
    }

    // Rules: If using search, cannot set responseMimeType to application/json in most cases for the SDK
    if (toolType !== 'search') {
        if (responseSchema) {
            config.responseMimeType = 'application/json';
            config.responseSchema = responseSchema;
        } else if (forceJsonMode) {
            config.responseMimeType = 'application/json';
        }
    }

    try {
        const response = await executeBackendRequest({
            model,
            contents: { parts: [{ text: prompt }] },
            config
        });

        return parseJsonResponse(response, debugLabel);

    } catch (error) {
        throw handleApiError(error, `Failed to generate ${debugLabel}.`);
    }
};

// --- FEATURE FUNCTIONS ---

export const findCheapestProducts = async (query: string, imageBase64: string | null, session: OracleSessionState, exclude: string[] = []): Promise<ProductResultData[]> => {
    const parts: any[] = [];
    if (imageBase64) {
        parts.push({ inlineData: { data: imageBase64, mimeType: 'image/jpeg' } });
        parts.push({ text: `Identify this product and find the cheapest online listings. ` });
    } else {
        parts.push({ text: `Find the cheapest listings for: "${query}". ` });
    }
    
    if (exclude.length > 0) {
        parts.push({ text: `Exclude these: ${exclude.join(', ')}. ` });
    }
    
    parts.push({ text: `
    **ROLE:** E-commerce Search Engine.
    **GOAL:** Find the absolute lowest prices on Alibaba, 1688, AliExpress, eBay, and Amazon.
    
    **CRITICAL INSTRUCTIONS:**
    1.  **REAL LINKS ONLY:** You MUST extract the ACTUAL URL from the Google Search results. Do not invent links. If you cannot find a direct link, leave productUrl as "N/A".
    2.  **SHIPPING:** Estimate shipping to "${session.country}".
    3.  **REVIEWS:** Find 2 real user reviews from the page snippet.
    4.  **IMAGE:** If an image URL is found in the search result metadata, use it. Otherwise leave blank.
    
    **OUTPUT JSON:**
    [
      {
        "id": "prod-...",
        "title": "Exact Product Name",
        "description": "20 words max",
        "storeName": "Store/Seller Name",
        "price": "Price (e.g. $5.50)",
        "productUrl": "ACTUAL_URL_FROM_SEARCH_RESULT",
        "inStock": true,
        "imageUrl": "IMAGE_URL_OR_BLANK",
        "shipping": {
            "cost": "Shipping Cost",
            "days": "Delivery Time",
            "method": "Carrier"
        },
        "reviews": ["Review 1", "Review 2"],
        "sellerInfo": {
            "name": "Seller Name",
            "platform": "Platform Name",
            "url": "Seller Profile URL",
            "initialRating": "4.5/5",
            "initialYears": "2 Yrs"
        }
      }
    ]
    Sort by price ascending.` });

    try {
        const response = await executeBackendRequest({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: getSystemInstruction(session)
            }
        });
        
        let data = parseJsonResponse(response, "Product Search");
        const results = Array.isArray(data) ? data : [data];

        // ENHANCEMENT: Post-process to attach Grounding URIs if JSON has placeholders
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        // Naive mapping: Try to match title words or just assign sequentially if the model failed to output real links
        results.forEach((item: any, index: number) => {
            if (!item.productUrl || item.productUrl === 'N/A' || item.productUrl.includes('ACTUAL_URL')) {
                // Try to find a relevant chunk
                const chunk = groundingChunks.find((c: any) => c.web?.title?.toLowerCase().includes(item.storeName.toLowerCase()));
                if (chunk && chunk.web?.uri) {
                    item.productUrl = chunk.web.uri;
                } else if (groundingChunks[index]?.web?.uri) {
                    // Fallback to sequential index
                    item.productUrl = groundingChunks[index].web.uri;
                }
            }
            item.stackType = 'product-result';
        });

        return results;
    } catch (error) {
        throw handleApiError(error, "Product search failed.");
    }
};

export const verifyEntityDeepDive = async (name: string, url: string, platform: string, session: OracleSessionState): Promise<VerificationResult> => {
    const prompt = `
    **ROLE:** Forensic E-commerce Investigator.
    **TARGET:** "${name}" on "${platform}". URL: "${url}".
    
    **MISSION:**
    1.  **Google Search** for this entity. Verify official site/registration.
    2.  **Scam Check**: Search for "${name} scam/fraud/reviews".
    3.  **Socials**: Find LinkedIn, Instagram, Facebook profiles. **RETURN ACTUAL PROFILE LINKS**.
    4.  **Physical**: Verify address if possible.
    
    **OUTPUT JSON:**
    {
        "score": 8.5,
        "verdict": "Legit/Suspicious/Scam",
        "googleBusinessFound": true,
        "socialsFound": true,
        "details": ["Detail 1", "Detail 2"],
        "address": "Address found",
        "phone": "Phone found",
        "email": "Email found",
        "socialProfiles": [
            { "platform": "LinkedIn", "url": "https://linkedin.com/..." },
            { "platform": "Instagram", "url": "https://instagram.com/..." }
        ]
    }
    `;

    try {
        const data = await generateWithResiliency(prompt, session, "Entity Verification", true, undefined, 'search');
        return data as VerificationResult;
    } catch (error) {
        throw handleApiError(error, "Verification failed.");
    }
};

export const generateLeads = async (site: string, parameters: string[], strategy: string, session: OracleSessionState, excludeEmails: string[] = []): Promise<Lead[]> => {
    const queryParts = [`site:${site}`];
    const searchDepth = `("Contact" OR "About Us" OR "Team" OR "Staff" OR "Management" OR "Profile")`;
    queryParts.push(searchDepth);
    parameters.forEach(param => { if(param.trim()) queryParts.push(`"${param.trim()}"`); });

    const strategies: {[key: string]: string} = {
        'decision-makers': '("CEO" OR "Founder" OR "Director" OR "President" OR "Owner")',
        'technical': '("CTO" OR "Developer" OR "Engineer")',
        'hr-hiring': '("HR" OR "Recruiter" OR "Talent")',
        'marketing': '("Marketing" OR "CMO" OR "Growth")',
        'sales': '("Sales" OR "Business Development")'
    };

    if (strategy !== 'standard' && strategies[strategy]) {
        queryParts.push(strategies[strategy]);
    }
    queryParts.push(`("email" OR "@" OR "[at]" OR "contact")`);
    
    const googleQuery = queryParts.join(' ');
    
    const prompt = `
    TARGET DOMAIN: ${site}
    SEARCH QUERY: ${googleQuery}
    
    ACT AS A WEB SCRAPER.
    1. Perform Google Search on ${site}.
    2. EXTRACT emails. Decode obfuscated ones (e.g. name[at]domain).
    3. Infer Name and Role from context.
    4. **EXTRACT SOURCE URL**: Where did you find this email?
    
    OUTPUT JSON:
    [
      {
        "email": "email@domain.com",
        "name": "Name",
        "role": "Role",
        "source": "URL_WHERE_FOUND"
      }
    ]
    Find 10 leads.
    `;

    try {
        const response = await executeBackendRequest({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: getSystemInstruction(session)
            }
        });
        
        let data = parseJsonResponse(response, "Leads Search");
        const results = Array.isArray(data) ? data : [data];
        
        // Post-process to ensure Source URL is valid using grounding if model missed it
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        results.forEach((item: any, index: number) => {
             if (!item.source || item.source === 'URL_WHERE_FOUND') {
                 if (groundingChunks[index]?.web?.uri) {
                     item.source = groundingChunks[index].web.uri;
                 }
             }
        });

        return results;
    } catch (error) {
        throw handleApiError(error, "Lead generation failed.");
    }
};

// ... Re-export other functions with updated backend proxy calls ...

export const analyzeKeywords = async (session: OracleSessionState, exclude: string[] = []): Promise<KeywordData[]> => {
    const prompt = `Seeker demands LIVE KEYWORD INTELLIGENCE for "${session.niche}".
Use Google Search.
**METRICS:**
1. Volume: SPECIFIC NUMBER (e.g. "5,400").
2. CPC: SPECIFIC PRICE (e.g. "$1.20").
3. Difficulty: 0-100.
Return JSON array matching KeywordData schema.`;
    const data = await generateWithResiliency(prompt, session, "Keyword Analysis", true, undefined, 'search');
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'keywords' }));
};

export const analyzeNicheTrends = async (session: OracleSessionState, exclude: string[] = []): Promise<TrendData[]> => {
    const prompt = `Seeker asks for LIVE TRENDS in niche: "${session.niche}".
Execute DEEP LIVE SCAN via Google Search.
Identify 6 trends. Analyze Sentiment.
Return JSON array matching TrendData schema.`;
    const data = await generateWithResiliency(prompt, session, "Market Trend", false, undefined, 'search');
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'trends' }));
};

export const analyzeMarketplaces = async (session: OracleSessionState, exclude: string[] = []): Promise<MarketplaceData[]> => {
    const prompt = `Find BAZAARS (Marketplaces) for "${session.niche}".
Identify 6 platforms. Analyze sentiment.
Return JSON array matching MarketplaceData schema.`;
    const data = await generateWithResiliency(prompt, session, "Platform Analysis", false, undefined, 'search');
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'marketplaces' }));
};

export const generateContentIdeas = async (topic: string, session: OracleSessionState, exclude: string[] = []): Promise<ContentData[]> => {
    const prompt = `Design viral CONTENT for "${topic}".
Search trending formats.
Return JSON array matching ContentData schema.`;
    const data = await generateWithResiliency(prompt, session, "Content Idea", false, undefined, 'search');
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'content' }));
};

export const analyzeSocials = async (session: OracleSessionState): Promise<SocialsData[]> => {
    const prompt = `Construct SOCIAL STRATEGY for "${session.niche}".
Search top posts. Create 6 posts.
Return JSON matching SocialsData schema.`;
    const data = await generateWithResiliency(prompt, session, "Social Media Strategy", false, undefined, 'search');
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'socials' }));
};

export const regenerateSocialPost = async (session: OracleSessionState, originalPost: SocialsPlatformAnalysis, newPostType: string): Promise<SocialsPlatformAnalysis> => {
    const prompt = `Reshape this thought: "${originalPost.content}" into "${newPostType}". Return JSON.`;
    const data = await generateWithResiliency(prompt, session, "Regenerated Post");
    data.id = originalPost.id;
    return data;
};

export const getMoreHashtags = async (session: OracleSessionState, platform: string, content: string, existingHashtags: string[]): Promise<string[]> => {
    const prompt = `Find viral hashtags for ${platform}: "${content}". Exclude: ${existingHashtags.join(', ')}. Return JSON string array.`;
    const data = await generateWithResiliency(prompt, session, "Hashtags", false, undefined, 'search');
    return data;
};

export const generateMarketingCopy = async (session: OracleSessionState, exclude: string[] = []): Promise<CopyData[]> => {
    const prompt = `Write MARKETING COPY for "${session.niche}".
Create 6 variations. Return JSON array matching CopyData schema.`;
    const data = await generateWithResiliency(prompt, session, "Marketing Copy", true);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'copy' }));
};

export const generateInitialVisions = async (session: OracleSessionState, exclude: string[] = []): Promise<VentureVision[]> => {
    const prompt = `Prophesize VENTURE CONCEPTS for "${session.niche}".
Search problems on Reddit.
Return JSON array matching VentureVision schema.`;
    const data = await generateWithResiliency(prompt, session, "Venture Idea", true, undefined, 'search');
    return Array.isArray(data) ? data : [data];
};

export const generateDetailedBlueprint = async (vision: VentureVision, session: OracleSessionState): Promise<VentureBlueprint> => {
    const prompt = `Draft BLUEPRINT for: "${vision.title}".
Return JSON object matching VentureBlueprint schema.`;
    const data = await generateWithResiliency(prompt, session, vision.title, true);
    return data;
};

export const analyzeProductArbitrage = async (productQuery: string, session: OracleSessionState, exclude: string[] = []): Promise<ArbitrageData[]> => {
    const prompt = `Arbitrage Analysis for "${productQuery}".
Find Low Price (Alibaba) and High Price (Amazon).
Return JSON array matching ArbitrageData schema.`;
    const data = await generateWithResiliency(prompt, session, "Arbitrage Plan", true, undefined, 'search');
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'arbitrage' }));
};

export const runStrategicSimulation = async (goalQuery: string, session: OracleSessionState, exclude: string[] = []): Promise<ScenarioData[]> => {
    const prompt = `Simulate SCENARIOS for "${goalQuery}".
Return JSON array matching ScenarioData schema.`;
    const data = await generateWithResiliency(prompt, session, "Scenario", true);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'scenarios' }));
};

export const generateComparativeAnalysis = async (cards: CardBase[], session: OracleSessionState): Promise<ComparativeReport> => {
    const prompt = `COMPARE these items: ${JSON.stringify(cards.map(c => c.title))}.
Return JSON matching ComparativeReport schema.`;
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            similarities: { type: Type.ARRAY, items: { type: Type.STRING } },
            differences: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicImplications: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "summary", "similarities", "differences", "strategicImplications"]
    };
    const data = await generateWithResiliency(prompt, session, "Comparative Analysis", true, responseSchema);
    return data;
};

export const analyzeStoreCompetitor = async (myUrl: string, competitorUrl: string, session: OracleSessionState): Promise<StoreAnalysisData> => {
    const prompt = `COMPARE URLs: ${myUrl} vs ${competitorUrl}.
Return JSON matching StoreAnalysisData schema.`;
    const data = await generateWithResiliency(prompt, session, "Competitor Analysis", true, undefined, 'search');
    return { ...data, stackType: 'store-analysis' };
};

export const findProcurementAgents = async (userCountry: string, session: OracleSessionState): Promise<ProcurementAgent[]> => {
    const prompt = `Find PROCUREMENT AGENTS for shipping to "${userCountry}".
Return JSON array matching ProcurementAgent schema.`;
    const data = await generateWithResiliency(prompt, session, "Procurement Agents", true, undefined, 'search');
    return Array.isArray(data) ? data : [data];
};

// Client-side only for streaming/media ops that need complex handling
export async function* answerQuestionStream(session: OracleSessionState, context: string, question: string) {
    const client = getAiClient();
    const prompt = `Context: ${context}. Question: ${question}`;
    const response = await client.models.generateContentStream({
        model: 'gemini-2.5-flash', 
        contents: { parts: [{ text: prompt }] },
        config: { systemInstruction: getSystemInstruction(session), tools: [{ googleSearch: {} }] },
    });
    for await (const chunk of response) {
        if (chunk.text) yield chunk.text;
    }
}

export const generateVideoFromPrompt = async (prompt: string, aspectRatio: string, imageBase64?: string): Promise<any> => {
    try {
        const client = getAiClient(); 
        const params: any = { 
            model: 'veo-3.1-fast-generate-preview', 
            prompt, 
            config: { numberOfVideos: 1, resolution: '720p', aspectRatio } 
        };
        if (imageBase64) params.image = { imageBytes: imageBase64, mimeType: 'image/png' };
        return await client.models.generateVideos(params);
    } catch (error) {
        throw handleApiError(error, "Video gen start failed.");
    }
};

export const checkVideoOperationStatus = async (operation: any): Promise<any> => {
    try {
        const client = getAiClient();
        return await client.operations.getVideosOperation({ operation });
    } catch (error) {
        throw handleApiError(error, "Video status check failed.");
    }
};

export const transcribeAudio = async (base64Audio: string): Promise<string> => {
    try {
        const response = await executeBackendRequest({
             model: 'gemini-2.5-flash',
             contents: { parts: [{ inlineData: { mimeType: 'audio/wav', data: base64Audio } }, { text: "Transcribe." }] }
        });
        return (response as any).candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
         throw handleApiError(error, "Transcription failed.");
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        const response = await executeBackendRequest({
            model: 'gemini-2.5-flash-preview-tts',
            contents: { parts: [{ text }] },
            config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } },
        });
        return (response as any).candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
    } catch (error) {
        throw handleApiError(error, "Speech generation failed.");
    }
};

export const generateImageFromPrompt = async (prompt: string, aspectRatio: string, usePro: boolean = false, size: string = '1K'): Promise<string> => {
    try {
        const model = usePro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
        const config: any = { imageConfig: { aspectRatio: aspectRatio as any } };
        if (usePro) config.imageConfig.imageSize = size as any;
        
        const response = await executeBackendRequest({
            model,
            contents: { parts: [{ text: prompt }] },
            config
        });
        
        for (const part of (response as any).candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("No image returned.");
    } catch (error) {
        throw handleApiError(error, "Image generation failed.");
    }
};

export const editImageStart = async (prompt: string, imageBase64: string): Promise<string> => {
    // Placeholder - editImageStart in slice triggers saga which calls editImageWithPrompt
    return editImageWithPrompt(imageBase64, prompt);
};

export const editImageWithPrompt = async (base64Image: string, prompt: string): Promise<string> => {
    try {
        const response = await executeBackendRequest({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/png' } }, { text: prompt }] },
        });
        for (const part of (response as any).candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("No edited image returned.");
    } catch (error) {
        throw handleApiError(error, "Edit failed.");
    }
};

export const analyzeMediaContent = async (base64Data: string, mimeType: string, prompt: string): Promise<MediaAnalysisResult> => {
     try {
        const response = await executeBackendRequest({
            model: 'gemini-2.5-flash', 
            contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
            config: { responseMimeType: 'application/json' } // Schema omitted for brevity, implied loosely structured JSON
        });
        const text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text;
        return JSON.parse(text?.trim() || "{}") as MediaAnalysisResult;
     } catch(e) {
         throw handleApiError(e, "Media analysis failed.");
     }
};
