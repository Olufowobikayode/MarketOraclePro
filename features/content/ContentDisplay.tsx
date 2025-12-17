
import React from 'react';
import type { ContentData } from '../../types';

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
    {children}
  </div>
);

// Safe render for text fields that might accidentally be objects
const safeRenderText = (text: unknown): string => {
    if (text === null || text === undefined) return '';
    if (typeof text === 'string') return text;
    if (typeof text === 'number') return String(text);
    return JSON.stringify(text);
}

const ContentDisplay: React.FC<{ data: ContentData }> = ({ data }) => {
  return (
    <div className="space-y-4 text-sm">
        <p className="text-stone-300 pb-2">{safeRenderText(data.description)}</p>
        
        <DetailSection title="Key Talking Points">
            <ul className="list-disc list-inside text-stone-400 space-y-2 text-xs">
                {(data.talkingPoints || []).map((point, index) => <li key={index}>{safeRenderText(point)}</li>)}
            </ul>
        </DetailSection>

        <DetailSection title="Target SEO Keywords">
            <div className="flex flex-wrap gap-1">
                {(data.seoKeywords || []).map((keyword, index) => (
                    <span key={index} className="bg-stone-700 text-amber-300 text-xs font-medium px-2 py-1 rounded-full">
                        {safeRenderText(keyword)}
                    </span>
                ))}
            </div>
        </DetailSection>

        {data.sources && data.sources.length > 0 && (
            <DetailSection title="Sources">
                <ul className="space-y-2">
                    {data.sources.map((source, index) => (
                        <li key={index} className="text-xs">
                            <a 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-amber-400 hover:text-amber-300 hover:underline truncate block"
                            >
                               {safeRenderText(source.title)}
                            </a>
                        </li>
                    ))}
                </ul>
            </DetailSection>
        )}
    </div>
  );
};

export default ContentDisplay;
