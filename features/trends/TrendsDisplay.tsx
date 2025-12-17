
import React from 'react';
import type { TrendData } from '../../types';
import TextToSpeechButton from '../../components/TextToSpeechButton';


const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
    {children}
  </div>
);

// Helper to safely render any content
const safeRenderText = (content: unknown): React.ReactNode => {
    if (content === null || content === undefined) return '';
    if (typeof content === 'string') return content;
    if (typeof content === 'number') return String(content);
    if (Array.isArray(content)) return content.map(item => safeRenderText(item)).join(', ');
    if (typeof content === 'object') return JSON.stringify(content); // Simple fallback for trends
    return String(content);
};

const TrendDisplay: React.FC<{ data: TrendData }> = ({ data }) => {
  // Helper to ensure we always have an array to map over.
  const ensureArray = (value: string | string[] | undefined | null): string[] => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      return [value];
    }
    return [];
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-start">
          <div className="text-stone-300 pb-2">{safeRenderText(data.description)}</div>
          <TextToSpeechButton text={typeof data.description === 'string' ? data.description : ''} />
      </div>
      
      {/* Broader Sentiment Analysis */}
      {data.sentimentAnalysis && (
          <DetailSection title="Broader Social Sentiment">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center bg-stone-900/50 p-4 rounded border border-stone-700">
                      <div className={`text-4xl font-bold ${data.sentimentAnalysis.overallScore > 70 ? 'text-green-400' : data.sentimentAnalysis.overallScore < 40 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {data.sentimentAnalysis.overallScore}%
                      </div>
                      <div className="text-xs uppercase tracking-widest text-stone-400 mt-1">{data.sentimentAnalysis.label} Sentiment</div>
                  </div>
                  <div>
                      <h4 className="font-semibold text-stone-200 mb-1 text-xs">Dominant Emotions:</h4>
                      <div className="flex flex-wrap gap-1 mb-2">
                          {(data.sentimentAnalysis.dominantEmotions || []).map((emo, i) => (
                              <span key={i} className="bg-stone-700 text-stone-200 px-2 py-0.5 rounded text-xs">{emo}</span>
                          ))}
                      </div>
                      <h4 className="font-semibold text-stone-200 mb-1 text-xs">Key Drivers:</h4>
                      <ul className="list-disc list-inside text-stone-400 text-xs">
                          {(data.sentimentAnalysis.keyDrivers || []).map((driver, i) => (
                              <li key={i}>{driver}</li>
                          ))}
                      </ul>
                  </div>
              </div>
              
              <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-amber-400 text-xs border-b border-stone-700 pb-1">Platform Breakdown</h4>
                  {(data.sentimentAnalysis.platformBreakdown || []).map((platform, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-stone-900/30 p-2 rounded">
                          <span className="font-bold text-white w-1/4">{platform.platform}</span>
                          <span className="text-stone-300 italic flex-1 mx-2 text-center line-clamp-1">"{platform.sampleQuote}"</span>
                          <span className={`w-1/6 text-right font-semibold ${platform.sentiment.toLowerCase().includes('positive') ? 'text-green-400' : platform.sentiment.toLowerCase().includes('negative') ? 'text-red-400' : 'text-yellow-400'}`}>
                              {platform.sentiment}
                          </span>
                      </div>
                  ))}
              </div>
          </DetailSection>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailSection title="Target Audience">
          <div>
            <h4 className="font-semibold text-stone-200 mb-1">Demographics:</h4>
            <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs">
              {(data.audience?.targetDemographics || []).map((item, index) => <li key={index}>{safeRenderText(item)}</li>)}
            </ul>
            <h4 className="font-semibold text-stone-200 mt-2 mb-1">Interests:</h4>
            <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs">
              {(data.audience?.keyInterests || []).map((item, index) => <li key={index}>{safeRenderText(item)}</li>)}
            </ul>
          </div>
        </DetailSection>

        <DetailSection title="SEO Keywords">
          <div className="flex flex-wrap gap-1">
            {(data.seoKeywords || []).map((keyword, index) => (
              <span key={index} className="bg-stone-700 text-amber-300 text-xs font-medium px-2 py-1 rounded-full">
                {safeRenderText(keyword)}
              </span>
            ))}
          </div>
        </DetailSection>
      </div>
      
      <DetailSection title="Monetization Strategies">
        <div className="space-y-4">
          {(data.monetizationStrategies || []).map((strategy, index) => (
            strategy && (
              <div key={index} className="border-b border-stone-700 pb-3 last:border-0 last:pb-0">
                <h4 className="font-bold text-yellow-500 text-sm">{safeRenderText(strategy.strategy)}</h4>
                <div className="text-stone-300 text-xs mt-1">{safeRenderText(strategy.description)}</div>
                {strategy.implementationExample && (
                    <div className="mt-2 bg-stone-700/30 p-2 rounded border-l-2 border-amber-600">
                        <div className="text-xs text-stone-400 italic">
                            <span className="font-semibold text-amber-500">Example:</span> {safeRenderText(strategy.implementationExample)}
                        </div>
                    </div>
                )}
              </div>
            )
          ))}
        </div>
      </DetailSection>
      
      <DetailSection title="Competitor Analysis">
        <div className="space-y-4">
          {(data.competitorAnalysis || []).map((competitor, index) => (
            competitor && (
              <div key={index} className="p-3 bg-stone-900/50 rounded-lg border border-stone-700">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-md text-amber-400">
                    <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        {safeRenderText(competitor.name)}
                        <svg className="w-3 h-3 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                    </h4>
                    {competitor.marketShare && (
                        <span className="bg-stone-700 text-xs text-stone-300 px-2 py-1 rounded">Share: {safeRenderText(competitor.marketShare)}</span>
                    )}
                </div>
                
                {competitor.keyDifferentiators && competitor.keyDifferentiators.length > 0 && (
                    <div className="mb-2">
                        <h5 className="font-semibold text-purple-400 text-xs mb-1">Key Differentiators</h5>
                        <ul className="list-disc list-inside text-stone-300 space-y-1 text-xs pl-2">
                            {ensureArray(competitor.keyDifferentiators).map((diff, i) => <li key={i}>{safeRenderText(diff)}</li>)}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div>
                    <h5 className="font-semibold text-green-400 text-xs mb-1">Strengths</h5>
                    <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs pl-2">
                      {ensureArray(competitor.strengths).map((s, i) => <li key={i}>{safeRenderText(s)}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-400 text-xs mb-1">Weaknesses</h5>
                    <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs pl-2">
                      {ensureArray(competitor.weaknesses).map((w, i) => <li key={i}>{safeRenderText(w)}</li>)}
                    </ul>
                  </div>
                </div>

                {competitor.recentNews && competitor.recentNews.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-stone-800">
                        <h5 className="font-semibold text-sky-400 text-xs mb-1">Recent News</h5>
                        <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs pl-2">
                            {ensureArray(competitor.recentNews).map((news, i) => <li key={i}>{safeRenderText(news)}</li>)}
                        </ul>
                    </div>
                )}
              </div>
            )
          ))}
        </div>
      </DetailSection>

      {data.sources && data.sources.length > 0 && (
        <DetailSection title="Analysis Sources">
            <ul className="space-y-2">
                {data.sources.map((source, index) => (
                    source && (
                      <li key={index} className="text-xs bg-stone-900/50 p-2 rounded border border-stone-700/50">
                          <a 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-2"
                          >
                             <span className="truncate">{safeRenderText(source.title)}</span>
                             <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </a>
                      </li>
                    )
                ))}
            </ul>
        </DetailSection>
      )}
    </div>
  );
};

export default TrendDisplay;
