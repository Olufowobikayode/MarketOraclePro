
import React from 'react';
import type { VentureBlueprint } from '../../types';
import TextToSpeechButton from '../../components/TextToSpeechButton';

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
    {children}
  </div>
);

// Helper to safely render any content (string, number, or object)
const safeRenderText = (content: unknown): React.ReactNode => {
    if (content === null || content === undefined) return '';
    if (typeof content === 'string') return content;
    if (typeof content === 'number') return String(content);
    
    // If it's an array, render as a comma-separated list
    if (Array.isArray(content)) {
        return content.map(item => safeRenderText(item)).join(', ');
    }

    // If it's an object, try to render it nicely or fallback to JSON string
    if (typeof content === 'object') {
        return (
            <div className="pl-2 border-l-2 border-stone-600 space-y-1">
                {Object.entries(content as Record<string, unknown>).map(([key, value]) => (
                    <div key={key}>
                        <span className="font-semibold text-stone-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                        <span className="text-stone-400">{safeRenderText(value)}</span>
                    </div>
                ))}
            </div>
        );
    }
    
    return String(content);
};

const BlueprintDisplay: React.FC<{ data: VentureBlueprint }> = ({ data }) => {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-start">
          <div className="text-stone-300 pb-2 italic">{safeRenderText(data.summary)}</div>
          <TextToSpeechButton text={typeof data.summary === 'string' ? data.summary : 'Summary available.'} />
      </div>
      
      <DetailSection title="Target Audience">
        <div className="text-stone-400 text-xs">{safeRenderText(data.targetAudience)}</div>
      </DetailSection>

      {data.marketingPlan && (
        <DetailSection title="Marketing Plan">
          <div className="space-y-3">
              {data.marketingPlan.uniqueSellingProposition && (
                <div>
                  <h4 className="font-bold text-yellow-500">Unique Selling Proposition</h4>
                  <div className="text-stone-400 text-xs mt-1">{safeRenderText(data.marketingPlan.uniqueSellingProposition)}</div>
                </div>
              )}
              {(data.marketingPlan.contentPillars || []).length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-500">Content Pillars</h4>
                  <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs mt-1">
                    {data.marketingPlan.contentPillars.map((item, index) => <li key={index}>{safeRenderText(item)}</li>)}
                  </ul>
                </div>
              )}
              {(data.marketingPlan.promotionChannels || []).length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-500">Promotion Channels</h4>
                  <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs mt-1">
                    {data.marketingPlan.promotionChannels.map((item, index) => <li key={index}>{safeRenderText(item)}</li>)}
                  </ul>
                </div>
              )}
          </div>
        </DetailSection>
      )}

      <DetailSection title="Sourcing & Operations">
        <div className="text-stone-400 text-xs whitespace-pre-wrap">{safeRenderText(data.sourcingAndOperations)}</div>
      </DetailSection>

      {(data.firstThreeSteps || []).length > 0 && (
        <DetailSection title="First Three Steps">
          <ol className="list-decimal list-inside text-stone-200 space-y-2 text-xs font-semibold">
            {data.firstThreeSteps.map((step, index) => <li key={index}>{safeRenderText(step)}</li>)}
          </ol>
        </DetailSection>
      )}
    </div>
  );
};

export default BlueprintDisplay;
