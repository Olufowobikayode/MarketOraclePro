
// ... existing StackType, Source, CardBase ...
export type StackType = 'trends' | 'keywords' | 'marketplaces' | 'content' | 'qna' | 'socials' | 'copy' | 'arbitrage' | 'scenarios' | 'store-analysis' | 'product-result' | 'leads';

export interface Source {
    title: string;
    uri: string;
}

export interface CardBase {
    id: string;
    title: string;
    description: string;
    stackType: StackType;
    sources?: Source[];
    metadata?: Record<string, any>;
}

// ... Telegram Types (omitted for brevity) ...
export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    language_code?: string;
    is_premium?: boolean;
}

export interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        query_id: string;
        user: TelegramUser;
        auth_date: string;
        hash: string;
        start_param?: string; // For referrals
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: {
        bg_color?: string;
        text_color?: string;
        hint_color?: string;
        link_color?: string;
        button_color?: string;
        button_text_color?: string;
        secondary_bg_color?: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    ready: () => void;
    expand: () => void;
    close: () => void;
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
        setText: (text: string) => void;
        showProgress: (leaveActive: boolean) => void;
        hideProgress: () => void;
        enable: () => void;
        disable: () => void;
    };
    HapticFeedback: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
        notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        selectionChanged: () => void;
    };
    openLink: (url: string) => void;
    openTelegramLink: (url: string) => void;
}

// --- Oracle Session ---
export interface OracleSessionState {
    niche: string;
    purpose: string; 
    targetAudience: string; 
    brandVoice: string; 
    campaignGoal: string; 
    language: string; 
    country: string; 
    isInitiated: boolean;
}

// --- Trend Analysis ---
export interface Competitor {
  name: string;
  url: string;
  marketShare: string;
  keyDifferentiators: string[];
  recentNews: string[];
  strengths: string[];
  weaknesses:string[];
}

export interface SentimentAnalysis {
    overallScore: number; // 0 to 100
    label: string; // 'Positive', 'Negative', 'Neutral', 'Mixed'
    dominantEmotions: string[];
    keyDrivers: string[]; // What is driving this sentiment?
    platformBreakdown: { 
        platform: string; 
        sentiment: string; 
        sampleQuote: string; 
    }[];
}

export interface TrendData extends CardBase {
  stackType: 'trends';
  velocity: string; 
  audience: {
    targetDemographics: string[];
    keyInterests: string[];
  };
  seoKeywords: string[];
  monetizationStrategies: {
    strategy: string;
    description: string;
    implementationExample: string;
  }[];
  competitorAnalysis: Competitor[];
  sentimentAnalysis?: SentimentAnalysis; // New Field
}
export interface TrendsState {
  data: TrendData[];
  loading: boolean;
  error: string | null;
}

// --- Alerts ---
export interface TrendAlert {
    id: string;
    keyword: string;
    minVelocity: string;
    isActive: boolean;
}

export interface AlertsState {
    activeAlerts: TrendAlert[];
    triggeredAlertMessage: string | null;
}

// --- Keyword Intelligence ---
export interface KeywordMetrics {
  keyword: string;
  volume: string;
  difficulty: number;
  cpc: string;
  cpcBenchmark: string; 
  keywordIntent: string; 
}
export interface KeywordData extends CardBase {
    stackType: 'keywords';
    metrics: KeywordMetrics;
    serpAnalysis: string; 
    longTailKeywords: KeywordMetrics[];
}
export interface KeywordsState {
    data: KeywordData[];
    loading: boolean;
    error: string | null;
}

// --- Marketplace Finder ---
export interface MarketplaceData extends CardBase {
    stackType: 'marketplaces';
    opportunityScore: number;
    reasoning: string;
    pros: string[];
    cons: string[];
    sentimentScore?: number;
    sentimentSummary?: string;
}
export interface MarketplacesState {
    data: MarketplaceData[];
    loading: boolean;
    error: string | null;
}

// --- Content Strategy ---
export interface ContentData extends CardBase {
    stackType: 'content';
    format: string; 
    talkingPoints: string[];
    seoKeywords: string[];
}
export interface ContentState {
    data: ContentData[];
    loading: boolean;
    error: string | null;
}

// --- Socials Analysis ---
export interface SocialsPlatformAnalysis {
    id: string;
    platform: string;
    postType: string;
    content: string;
    hashtags: string[];
    rationale: string;
}
export interface SocialsData extends CardBase {
    stackType: 'socials';
    platformAnalysis: SocialsPlatformAnalysis[];
}
export interface SocialsState {
    data: SocialsData[];
    loading: boolean;
    error: string | null;
    regeneratingPostId: string | null;
    boostingPostId: string | null; 
}

// --- Marketing Copy ---
export interface CopyData extends CardBase {
    stackType: 'copy';
    copyType: string; 
    headlines: string[];
    body: string;
    callToAction: string;
}
export interface CopyState {
    data: CopyData[];
    loading: boolean;
    error: string | null;
}

// --- Q&A Oracle ---
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
export interface QnaState {
    messages: ChatMessage[];
    loading: boolean;
    error: string | null;
}

// --- Media Generation & Analysis ---
export type MediaJobStatus = 'queued' | 'processing' | 'completed' | 'failed';
export interface MediaAsset {
    id: string;
    type: 'image' | 'video';
    url: string;
    prompt: string;
}
export interface MediaAnalysisResult {
    description: string;
    insights: string[];
    tags: string[];
}
export interface MediaJob {
    jobId: string;
    status: MediaJobStatus;
    progress: number;
    asset?: MediaAsset;
    analysisResult?: MediaAnalysisResult; 
    error?: string;
    prompt?: string;
    originatingCardId?: string; 
    stackType?: StackType;
    jobType: 'generate-image' | 'edit-image' | 'generate-video' | 'analyze-media';
}
export interface MediaState {
    jobs: Record<string, MediaJob>;
}

// --- New Ventures ---
export interface VentureVision {
    id: string;
    title: string;
    oneLinePitch: string;
    businessModel: string;
    evidenceTag: string;
}

export interface VentureBlueprint {
    prophecyTitle: string;
    summary: string;
    targetAudience: string;
    marketingPlan: {
        contentPillars: string[];
        promotionChannels: string[];
        uniqueSellingProposition: string;
    };
    sourcingAndOperations: string;
    firstThreeSteps: string[];
}

export interface VenturesState {
    visions: VentureVision[];
    selectedVision: VentureVision | null;
    blueprint: VentureBlueprint | null;
    visionsLoading: boolean;
    blueprintLoading: boolean;
    visionsError: string | null;
    blueprintError: string | null;
    progress: {
        message: string;
        percentage: number;
    } | null;
}

// --- Sales Arbitrage ---
export interface ArbitrageData extends CardBase {
    stackType: 'arbitrage';
    platform: string;
    productStory: string;
    pricingStrategy: {
        buyLow: string;
        sellHigh: string;
        reasoning: string;
    };
    marketingAngles: {
        headline: string;
        body: string;
        platform: string;
    }[];
    tagsAndKeywords: string[];
    dueDiligence: string[];
}
export interface ArbitrageState {
    data: ArbitrageData[];
    loading: boolean;
    error: string | null;
    productQuery: string;
}

// --- Scenario Planner ---
export interface ScenarioData extends CardBase {
    stackType: 'scenarios';
    actionPlan: {
        step: number;
        title: string;
        description: string;
    }[];
    potentialRisks: string[];
    opportunities: string[];
    kpis: string[]; 
}
export interface ScenariosState {
    data: ScenarioData[];
    loading: boolean;
    error: string | null;
    goalQuery: string;
}

// --- Store Competitor Analysis (New) ---
export interface StoreAnalysisData extends CardBase {
    stackType: 'store-analysis';
    myUrl: string;
    competitorUrl: string;
    gapAnalysis: string[];
    improvements: string[];
    pricingVerdict: string;
    uxVerdict: string;
}
export interface StoreAnalysisState {
    data: StoreAnalysisData[];
    loading: boolean;
    error: string | null;
}

// --- Product Price Finder (Updated) ---
export interface VerificationResult {
    score: number; // 0-10
    verdict: string;
    googleBusinessFound: boolean;
    socialsFound: boolean;
    details: string[];
    address?: string;
    phone?: string;
    email?: string;
    socialProfiles?: { platform: string; url: string }[];
}

export interface SellerInfo {
    name: string;
    url?: string;
    platform: string; // e.g. Alibaba, 1688
    
    // Initial data from search
    initialRating?: string;
    initialYears?: string;
    
    // Deep Dive Verification Data (Populated on "Verify" click)
    verification?: VerificationResult;
    isVerifying?: boolean; // Loading state for verification
    
    // Enhanced details
    address?: string;
    phone?: string;
    email?: string;
}

export interface ProductResultData extends CardBase {
    stackType: 'product-result';
    storeName: string;
    price: string;
    productUrl: string;
    inStock: boolean;
    imageUrl?: string;
    sellerInfo?: SellerInfo; 
    // NEW: Shipment Info
    shipping?: {
        cost: string; // e.g. "Free", "$15.00"
        days: string; // e.g. "15-30 days"
        method?: string; // e.g. "AliExpress Standard"
    };
    reviews?: string[]; // New: Product Reviews
}

export interface ProcurementAgent {
    id: string;
    name: string;
    website: string;
    country: string;
    services: string[]; 
    mapLocationUri?: string;
    contactInfo?: string;
    
    // Verification
    verification?: VerificationResult;
    isVerifying?: boolean; // Loading state
}

export interface ProductFinderState {
    results: ProductResultData[];
    agents: ProcurementAgent[];
    loading: boolean;
    agentsLoading: boolean;
    error: string | null;
}

// --- Leads Finder (New) ---
export interface Lead {
    email: string;
    source: string;
    name?: string; // Enhanced scraping field
    role?: string; // Enhanced scraping field
    isValid?: boolean | null; // null = unchecked, true = valid, false = invalid
    validationStatus?: 'pending' | 'valid' | 'invalid' | 'risky' | 'unknown';
}
export interface LeadsState {
    emails: Lead[];
    loading: boolean;
    validating: boolean; // Validation in progress
    error: string | null;
    site: string;
    strategy: string;
    parameters: string[];
}

// --- Comparative Analysis ---
export interface ComparativeReport {
    title: string;
    summary: string;
    similarities: string[];
    differences: string[];
    strategicImplications: string[];
}

export interface ComparisonState {
    selectedCards: CardBase[];
    report: ComparativeReport | null;
    loading: boolean;
    error: string | null;
}

// --- Auth ---
export interface User {
    id: string | number; 
    username?: string;
    firstName?: string;
    photoUrl?: string;
    telegramId?: number; 
    plan: 'none' | 'free' | 'basic' | 'standard' | 'premium' | 'custom';
    isNewUser?: boolean; 
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  apiKey: string | null; 
}

// --- Api Status ---
export interface ApiStatusState {
  isAvailable: boolean;
  outageMessage: string | null;
}

// --- History (Research Persistence) ---
export interface SavedSession {
    id: string;
    createdAt: string;
    lastModified: string;
    oracleSession: OracleSessionState;
    data: {
        trends: TrendData[];
        keywords: KeywordData[];
        marketplaces: MarketplaceData[];
        content: ContentData[];
        socials: SocialsData[];
        copy: CopyData[];
        arbitrage: ArbitrageData[];
        scenarios: ScenarioData[];
        ventures: {
            visions: VentureVision[];
            blueprint: VentureBlueprint | null;
        };
        storeAnalysis: StoreAnalysisData[];
        productFinder: ProductResultData[];
        leads: Lead[];
    }
}

export interface HistoryState {
    sessions: SavedSession[];
    loading: boolean;
    error: string | null;
}

// --- UI State ---
export interface UiState {
  isSettingsOpen: boolean;
  telegramTheme: { 
      bgColor: string;
      textColor: string;
      buttonColor: string;
      buttonTextColor: string;
  };
}

// --- Ad State ---
export interface AdState {
    isAdOpen: boolean;
}

// --- Root State ---
export interface RootState {
  oracleSession: OracleSessionState;
  trends: TrendsState;
  keywords: KeywordsState;
  marketplaces: MarketplacesState;
  content: ContentState;
  socials: SocialsState;
  copy: CopyState;
  qna: QnaState;
  media: MediaState;
  ventures: VenturesState;
  arbitrage: ArbitrageState;
  scenarios: ScenariosState;
  storeAnalysis: StoreAnalysisState; 
  productFinder: ProductFinderState; 
  leads: LeadsState;
  comparison: ComparisonState;
  auth: AuthState;
  apiStatus: ApiStatusState;
  history: HistoryState;
  ui: UiState;
  ads: AdState;
  alerts: AlertsState; 
}
