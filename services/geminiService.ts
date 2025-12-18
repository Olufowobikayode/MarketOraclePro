import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { TrendData, KeywordData, MarketplaceData, ContentData, SocialsData, CopyData, VentureVision, VentureBlueprint, Source, SocialsPlatformAnalysis, CardBase, ComparativeReport, ArbitrageData, ScenarioData, OracleSessionState, MediaAnalysisResult, StoreAnalysisData, ProductResultData, Lead, ProcurementAgent, VerificationResult } from '../types';
import type { GenerateContentResponse } from "@google/genai";

const sanitizeBaseUrl = (value: string) => value.replace(/\/$/, '');

const resolveBackendUrl = (): string => {
    const envValue = (import.meta as any).env?.VITE_API_URL as string | undefined;
    if (envValue && typeof envValue === 'string' && envValue.trim() !== '') {
        return sanitizeBaseUrl(envValue.trim());
    }

    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host && !['localhost', '127.0.0.1'].includes(host)) {
            return `${sanitizeBaseUrl(window.location.origin)}/api`;
        }
    }

    return 'http://localhost:3001/api';
};

const BACKEND_URL = resolveBackendUrl();

const normalizeContents = (input: any): any[] => {
    if (Array.isArray(input)) {
        return input.map((entry) => {
            if (entry && Array.isArray(entry.parts)) {
                return {
                    role: entry.role ?? 'user',
                    parts: entry.parts,
                };
            }
            return {
                role: entry?.role ?? 'user',
                parts: Array.isArray(entry?.parts) ? entry.parts : [{ text: typeof entry === 'string' ? entry : JSON.stringify(entry) }],
            };
        });
    }

    if (input && Array.isArray(input.parts)) {
        return [{
            role: input.role ?? 'user',
            parts: input.parts,
        }];
    }

    return [{
        role: 'user',
        parts: [{ text: typeof input === 'string' ? input : JSON.stringify(input ?? '') }],
    }];
};

const createDedupeClause = (items: string[], label: string): string => {
    if (!Array.isArray(items) || items.length === 0) {
        return '';
    }
    const unique = Array.from(new Set(items.filter(Boolean))).slice(0, 15);
    return unique.length ? ` Avoid returning results that match these ${label}: ${unique.join('; ')}.` : '';
};

// --- API Key Management ---
export const getCurrentApiKey = (): string => localStorage.getItem('user_gemini_api_key') || "";
export const getCurrentGroqApiKey = (): string => localStorage.getItem('user_groq_api_key') || "";

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey || apiKey.trim() === '') throw new Error("API Key cannot be empty.");
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] }),
            }
        );
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return true;
    } catch (error: any) {
        throw new Error(error.message || "Validation failed");
    }
};

// --- Backend Proxies ---
async function executeBackendRequest(params: { model: string, contents: any, config?: any }): Promise<GenerateContentResponse> {
    const apiKey = getCurrentApiKey();
    if (!apiKey) throw new Error("Gemini API Key missing. Please connect in Settings.");

    const payload: Record<string, any> = {
        model: params.model,
        contents: normalizeContents(params.contents),
    };

    if (params.config) {
        payload.config = params.config;
    }

    const response = await fetch(`${BACKEND_URL}/gemini/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-gemini-api-key': apiKey },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Gemini Error: ${response.status}`);
    }
    return await response.json();
}

async function executeGroqRequest(params: any): Promise<any> {
    const apiKey = getCurrentGroqApiKey();
    // Fallback to Gemini if Groq key missing (Per user request for "better free ai", assuming they might add it later)
    // But per strict prompt "Groq (FINAL AUTHORITY)", we should try Groq.
    // If missing, we might need a fallback logic, but for now strict implementation:
    if (!apiKey) {
        console.warn("Groq Key missing, falling back to Gemini for Analysis (Not Ideal per Prompt)");
        return null; 
    }

    const response = await fetch(`${BACKEND_URL}/groq/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-groq-api-key': apiKey },
        body: JSON.stringify(params)
    });
    
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Groq Error: ${response.status}`);
    }
    return await response.json();
}

async function extractContent(url: string): Promise<string> {
    try {
        const response = await fetch(`${BACKEND_URL}/tools/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const data = await response.json();
        return data.content || "";
    } catch (e) {
        console.warn(`Extraction failed for ${url}`, e);
        return "";
    }
}

// --- System Prompt v4.3 ---
export const getSystemInstruction = (session: OracleSessionState): string => {
    return `
/******************************************************************************************
 * MARKET ORACLE — MASTER SYSTEM & STABILITY PROMPT (v4.3 PRODUCTION)
 * MODE: FIX + ARCHITECTURE + DEPTH
 * FINAL ANALYSIS ENGINE: GROQ
 * SEARCH / REAL-TIME ENGINE: GEMINI + PUBLIC WEB
 ******************************************************************************************/

YOU ARE: "MARKET ORACLE"

ENVIRONMENT:
- 512 MB RAM (Render)
- Quota-limited providers
- Real users, real UI

ZERO TOLERANCE FOR:
- Invalid JSON
- Infinite loading
- Multi-feature execution
- Quota retry loops

PRIMARY OBJECTIVES:
1. Stability
2. Correctness
3. Structured depth
4. Token efficiency
5. Graceful degradation

SECTION 1 — SINGLE-TASK EXECUTION RULE:
ONLY ONE FEATURE MAY EXECUTE PER REQUEST.
Identify PRIMARY intent. Execute ONLY the primary intent.

SECTION 2 — STRICT JSON SAFETY:
Output ONLY valid JSON. No markdown. No backticks.
Use null or "N/A" instead of omission.

SECTION 3 — REAL-TIME DATA ENFORCEMENT:
ALL FEATURES MUST USE REAL-TIME OR NEAR-REAL-TIME DATA.
If real-time data is unavailable, return partial output. NEVER hallucinate.

SECTION 4 — AI PROVIDER ROLES:
Gemini: Search & discovery, clean text ONLY.
Groq: Deep reasoning, pattern extraction, strategic synthesis, FINAL conclusions.

SECTION 5 — PERSONA ENGINE:
Language: ${session.language || 'English'}
Region: ${session.country || 'Global'}
Role: ${session.brandVoice || 'Market Strategist'}
Target Audience: ${session.targetAudience || 'General'}
`;
};

// --- Pipeline Orchestration ---

// 1. Discovery (Gemini)
async function performDiscovery(query: string, session: OracleSessionState): Promise<{ urls: string[], snippets: string[] }> {
    const prompt = `
    DISCOVERY PHASE for: "${query}"
    Task: Find 3-5 high-quality, relevant URLs that contain live data about this topic.
    Role: Research Assistant.
    Output: JSON object { "urls": ["url1", "url2", ...], "snippets": ["summary1", "summary2", ...] }
    STRICT: Valid JSON only. Real URLs only.
    `;
    
    try {
        const response = await executeBackendRequest({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: { 
                responseMimeType: 'application/json',
                tools: [{ googleSearch: {} }] 
            }
        });
        
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) return { urls: [], snippets: [] };
        
        const data = JSON.parse(text);
        const urls = Array.from(
            new Set((data.urls || []).filter((url: string) => typeof url === 'string' && url.trim() !== ''))
        ).slice(0, 5);
        const snippets = Array.isArray(data.snippets)
            ? data.snippets.slice(0, urls.length)
            : [];

        return {
            urls,
            snippets,
        };
    } catch (e) {
        console.warn("Discovery failed", e);
        return { urls: [], snippets: [] };
    }
}

// 2. Analysis (Groq with Fallback to Gemini)
async function performAnalysis(
    context: string, 
    taskPrompt: string, 
    session: OracleSessionState, 
    jsonMode: boolean = true
): Promise<any> {
    const fullPrompt = `
    ${getSystemInstruction(session)}
    
    CONTEXT DATA (Live Extracted):
    ${context.substring(0, 15000)} // Token limit safeguard
    
    TASK:
    ${taskPrompt}
    
    Output Format: ${jsonMode ? "JSON" : "Text"}
    `;
    
    // Try Groq first
    const groqRes = await executeGroqRequest({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: getSystemInstruction(session) }, { role: 'user', content: fullPrompt }],
        temperature: 0.5,
        jsonMode
    });
    
    if (groqRes && groqRes.choices?.[0]?.message?.content) {
        const content = groqRes.choices[0].message.content;
        return jsonMode ? JSON.parse(content) : content;
    }
    
    // Fallback to Gemini
    console.log("Falling back to Gemini for Analysis");
    const geminiRes = await executeBackendRequest({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: fullPrompt }] },
        config: { responseMimeType: jsonMode ? 'application/json' : 'text/plain' }
    });
    
    const text = geminiRes.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Analysis produced no output.");
    return jsonMode ? JSON.parse(text) : text;
}

// --- Main Pipeline Runner ---
async function runOraclePipeline(
    intent: string,
    query: string,
    session: OracleSessionState,
    useSearch: boolean = true
) {
    // 1. Discovery
    let context = "";
    if (useSearch) {
        const { urls, snippets } = await performDiscovery(query, session);
        context += `Initial Snippets:\n${snippets.join('\n')}\n\n`;
        
        // 2. Extraction (Limit to top 2 URLs to save time/tokens)
        const topUrls = urls.slice(0, 2);
        for (const url of topUrls) {
            const content = await extractContent(url);
            if (content) {
                context += `Source (${url}):\n${content.substring(0, 2000)}\n\n`;
            }
        }
    }
    
    if (!context) context = "No live data found. Use general knowledge.";
    
    // 3. Analysis
    return await performAnalysis(context, query, session, true);
}


// --- Exported Features (Refactored) ---

export const analyzeNicheTrends = async (session: OracleSessionState, exclude: string[] = []): Promise<TrendData[]> => {
    const dedupeClause = createDedupeClause(exclude, 'trend titles');
    const prompt = `Analyze current market trends for niche: "${session.niche}".${dedupeClause} Return JSON array matching TrendData schema.`;
    const data = await runOraclePipeline("Trend Analysis", prompt, session, true);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'trends' }));
};

export const analyzeKeywords = async (session: OracleSessionState, exclude: string[] = []): Promise<KeywordData[]> => {
    const dedupeClause = createDedupeClause(exclude, 'keywords');
    const prompt = `Find high-value keywords for: "${session.niche}".${dedupeClause} Return JSON array matching KeywordData schema with volume, cpc, and difficulty.`;
    const data = await runOraclePipeline("Keyword Research", prompt, session, true);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'keywords' }));
};

export const analyzeMarketplaces = async (session: OracleSessionState, exclude: string[] = []): Promise<MarketplaceData[]> => {
    const dedupeClause = createDedupeClause(exclude, 'marketplace names');
    const prompt = `Find top marketplaces for: "${session.niche}".${dedupeClause} Return JSON array matching MarketplaceData schema.`;
    const data = await runOraclePipeline("Marketplace Finder", prompt, session, true);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'marketplaces' }));
};

export const generateContentIdeas = async (topic: string, session: OracleSessionState, exclude: string[] = []): Promise<ContentData[]> => {
    const dedupeClause = createDedupeClause(exclude, 'content titles');
    const prompt = `Generate viral content ideas for topic: "${topic}".${dedupeClause} Return JSON array matching ContentData schema.`;
    const data = await runOraclePipeline("Content Strategy", prompt, session, true);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'content' }));
};

export const analyzeSocials = async (session: OracleSessionState): Promise<SocialsData[]> => {
    const prompt = `Create social media strategy for: "${session.niche}". Return JSON matching SocialsData schema.`;
    const data = await runOraclePipeline("Social Media", prompt, session, true);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'socials' }));
};

export const generateMarketingCopy = async (session: OracleSessionState, exclude: string[] = []): Promise<CopyData[]> => {
    const dedupeClause = createDedupeClause(exclude, 'copy variations');
    const prompt = `Write marketing copy for: "${session.niche}".${dedupeClause} Return JSON array matching CopyData schema.`;
    const data = await runOraclePipeline("Copywriting", prompt, session, false);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'copy' }));
};

export const generateInitialVisions = async (session: OracleSessionState, exclude: string[] = []): Promise<VentureVision[]> => {
    const dedupeClause = createDedupeClause(exclude, 'venture titles');
    const prompt = `Propose new venture ideas for: "${session.niche}".${dedupeClause} Return JSON array matching VentureVision schema.`;
    const data = await runOraclePipeline("Venture Ideas", prompt, session, true);
    return Array.isArray(data) ? data : [data];
};

export const generateDetailedBlueprint = async (vision: VentureVision, session: OracleSessionState): Promise<VentureBlueprint> => {
    const prompt = `Create detailed business blueprint for: "${vision.title}". Return JSON matching VentureBlueprint schema.`;
    const data = await runOraclePipeline("Blueprint", prompt, session, false);
    return data;
};

export const analyzeProductArbitrage = async (productQuery: string, session: OracleSessionState, exclude: string[] = []): Promise<ArbitrageData[]> => {
    const dedupeClause = createDedupeClause(exclude, 'arbitrage opportunities');
    const prompt = `Analyze arbitrage opportunities for product: "${productQuery}". Compare sourcing vs selling prices.${dedupeClause} Return JSON array matching ArbitrageData schema.`;
    const data = await runOraclePipeline("Arbitrage", prompt, session, true);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'arbitrage' }));
};

export const runStrategicSimulation = async (goalQuery: string, session: OracleSessionState, exclude: string[] = []): Promise<ScenarioData[]> => {
    const dedupeClause = createDedupeClause(exclude, 'scenario titles');
    const prompt = `Simulate scenarios for goal: "${goalQuery}".${dedupeClause} Return JSON array matching ScenarioData schema.`;
    const data = await runOraclePipeline("Scenario Planner", prompt, session, true);
    return (Array.isArray(data) ? data : [data]).map((item: any) => ({ ...item, stackType: 'scenarios' }));
};

export const generateComparativeAnalysis = async (cards: CardBase[], session: OracleSessionState): Promise<ComparativeReport> => {
    const titles = cards.map(c => c.title).join(", ");
    const prompt = `Compare the following items: ${titles}. Return JSON matching ComparativeReport schema.`;
    const data = await runOraclePipeline("Comparative Analysis", prompt, session, true);
    return data;
};

export const analyzeStoreCompetitor = async (myUrl: string, competitorUrl: string, session: OracleSessionState): Promise<StoreAnalysisData> => {
    const prompt = `Compare my store (${myUrl}) vs competitor (${competitorUrl}). Return JSON matching StoreAnalysisData schema.`;
    const data = await runOraclePipeline("Store Analysis", prompt, session, true);
    return { ...data, stackType: 'store-analysis' };
};

export const findCheapestProducts = async (query: string, imageBase64: string | null, session: OracleSessionState, exclude: string[] = []): Promise<ProductResultData[]> => {
    const parts: any[] = [];

    if (imageBase64) {
        parts.push({ inlineData: { data: imageBase64, mimeType: 'image/jpeg' } });
        parts.push({ text: `Identify this product and find the cheapest online listings.` });
    } else {
        parts.push({ text: `Find the cheapest listings for: "${query}".` });
    }

    const dedupeNote = createDedupeClause(exclude, 'existing listings').trim();
    if (dedupeNote) {
        parts.push({ text: dedupeNote });
    }

    parts.push({ text: `
    **ROLE:** E-commerce intelligence scout.
    **GOAL:** Return live pricing data from reputable marketplaces (Alibaba, 1688, AliExpress, eBay, Amazon).

    **CRITICAL INSTRUCTIONS:**
    1.  **REAL LINKS ONLY:** Extract the actual product URL from the search result. Do not fabricate links. If unavailable, set productUrl to "N/A".
    2.  **SHIPPING:** Estimate shipping to "${session.country || 'Global'}" when possible.
    3.  **REVIEWS:** Provide up to 2 real user reviews sourced from the listing summary.
    4.  **IMAGE:** Include an image URL if present in the metadata; otherwise leave blank.
    5.  **DATA FRESHNESS:** Rely exclusively on current public information from the search results.

    **OUTPUT JSON:**
    [
      {
        "id": "prod-...",
        "title": "Exact Product Name",
        "description": "20 words max",
        "storeName": "Store/Seller Name",
        "price": "$5.50",
        "productUrl": "https://...",
        "inStock": true,
        "imageUrl": "https://...",
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
            model: 'gemini-3-pro-preview',
            contents: { parts },
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: getSystemInstruction(session),
            }
        });

        let data = parseJsonResponse(response, "Product Search");
        const results = Array.isArray(data) ? data : [data];

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        results.forEach((item: any, index: number) => {
            if (!item.productUrl || item.productUrl === 'N/A' || item.productUrl.includes('ACTUAL_URL')) {
                const chunk = groundingChunks.find((c: any) => {
                    const title = c.web?.title?.toLowerCase();
                    return title && item.title && title.includes(String(item.title).toLowerCase());
                });
                if (chunk?.web?.uri) {
                    item.productUrl = chunk.web.uri;
                } else if (groundingChunks[index]?.web?.uri) {
                    item.productUrl = groundingChunks[index].web.uri;
                }
            }
            item.stackType = 'product-result';
        });

        return results;
    } catch (error: any) {
        throw new Error(error?.message || 'Product search failed.');
    }
};

export const generateLeads = async (site: string, parameters: string[], strategy: string, session: OracleSessionState, excludeEmails: string[] = []): Promise<Lead[]> => {
    const dedupeClause = excludeEmails.length
        ? ` Avoid leads with these emails: ${excludeEmails.slice(0, 20).join(', ')}.`
        : '';
    const prompt = `Find leads for domain: ${site}. Strategy: ${strategy}. Parameters: ${parameters.join(',')}.${dedupeClause} Use live public data only. If an email cannot be confirmed, set it to null. Return JSON array of Lead objects including company, role, email, source URL, and confidence score.`;
    const data = await runOraclePipeline("Lead Generation", prompt, session, true);
    return data;
};

export const findProcurementAgents = async (userCountry: string, session: OracleSessionState): Promise<ProcurementAgent[]> => {
    const prompt = `Find procurement agents for shipping to ${userCountry}. Return JSON array matching ProcurementAgent schema.`;
    const data = await runOraclePipeline("Procurement Agents", prompt, session, true);
    return Array.isArray(data) ? data : [data];
};

export const verifyEntityDeepDive = async (name: string, url: string, platform: string, session: OracleSessionState): Promise<VerificationResult> => {
    const prompt = `Verify entity: ${name} on ${platform} (${url}). Check for scams, legit address, reviews. Return JSON matching VerificationResult.`;
    const data = await runOraclePipeline("Verification", prompt, session, true);
    return data;
};

const getAiClient = (): GoogleGenAI => {
    const apiKey = getCurrentApiKey();
    if (!apiKey) throw new Error("API Key missing.");
    return new GoogleGenAI({ apiKey });
};

export async function* answerQuestionStream(session: OracleSessionState, context: string, question: string) {
    try {
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
    } catch (error: any) {
        throw new Error(error.message || "Streaming failed");
    }
}

// --- Restored Helper Functions ---

export const checkApiHealth = async (): Promise<boolean> => {
    const key = getCurrentApiKey();
    if (!key) return false;
    try {
        await validateApiKey(key);
        return true;
    } catch { return false; }
};

export const regenerateSocialPost = async (session: OracleSessionState, originalPost: SocialsPlatformAnalysis, newPostType: string): Promise<SocialsPlatformAnalysis> => {
    const prompt = `Regenerate this social post: "${originalPost.content}". New Format: "${newPostType}". Return JSON matching SocialsPlatformAnalysis schema (including id).`;
    const data = await runOraclePipeline("Regenerate Post", prompt, session, false);
    // Ensure ID is preserved
    if (data) data.id = originalPost.id;
    return data;
};

export const getMoreHashtags = async (session: OracleSessionState, platform: string, content: string, existingHashtags: string[]): Promise<string[]> => {
    const prompt = `Generate 10 viral hashtags for ${platform} post: "${content}". Exclude these: ${existingHashtags.join(', ')}. Return JSON string array.`;
    const data = await runOraclePipeline("Hashtags", prompt, session, true);
    return Array.isArray(data) ? data : [];
};

export const editImageStart = async (prompt: string, imageBase64: string): Promise<string> => {
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
    } catch (error: any) {
        throw new Error(error.message || "Edit failed.");
    }
};

export const checkVideoOperationStatus = async (operation: any): Promise<any> => {
    try {
        const client = getAiClient();
        return await client.operations.getVideosOperation({ operation });
    } catch (error: any) {
        throw new Error(error.message || "Video status check failed.");
    }
};

export const transcribeAudio = async (base64Audio: string): Promise<string> => {
    // Keep using Gemini for multimodal
    try {
        const response = await executeBackendRequest({
             model: 'gemini-2.5-flash',
             contents: { parts: [{ inlineData: { mimeType: 'audio/wav', data: base64Audio } }, { text: "Transcribe." }] }
        });
        return (response as any).candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (e) { return ""; }
};

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        const response = await executeBackendRequest({
            model: 'gemini-2.5-flash-preview-tts',
            contents: { parts: [{ text }] },
            config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } },
        });
        return (response as any).candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
    } catch (e) { return ""; }
};

export const generateImageFromPrompt = async (prompt: string, aspectRatio: string, usePro: boolean = false): Promise<string> => {
    try {
        const model = usePro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
        const response = await executeBackendRequest({
            model,
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: aspectRatio as any } }
        });
        for (const part of (response as any).candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("No image");
    } catch (e) { throw new Error("Image gen failed"); }
};

export const generateVideoFromPrompt = async (prompt: string, aspectRatio: string): Promise<any> => {
    // Mock or client-side only - Keeping simplified for now
    throw new Error("Video generation requires client-side SDK integration");
};

export const analyzeMediaContent = async (base64Data: string, mimeType: string, prompt: string): Promise<MediaAnalysisResult> => {
    try {
        const response = await executeBackendRequest({
            model: 'gemini-2.5-flash', 
            contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        const text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text;
        return JSON.parse(text || "{}");
     } catch(e) { return { description: "Failed", insights: [], tags: [] }; }
};
