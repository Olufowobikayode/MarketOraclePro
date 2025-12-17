
import React from 'react';
import type { ScenarioData } from '../../types';

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

const ScenarioDisplay: React.FC<{ data: ScenarioData }> = ({ data }) => {
  return (
    <div className="space-y-4 text-sm">
        <p className="text-stone-300 pb-2">{safeRenderText(data.description)}</p>
        
        <DetailSection title="Action Plan">
          <div className="space-y-4">
            {(data.actionPlan || []).map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-amber-800 text-amber-300 font-bold rounded-full border-2 border-amber-600">
                  {step.step}
                </div>
                <div>
                  <h4 className="font-bold text-stone-100">{safeRenderText(step.title)}</h4>
                  <p className="text-xs text-stone-400 mt-1">{safeRenderText(step.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </DetailSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailSection title="Potential Risks">
                <ul className="list-disc list-inside text-red-400 space-y-2 text-xs">
                    {(data.potentialRisks || []).map((risk, index) => <li key={index}><span className="text-stone-300">{safeRenderText(risk)}</span></li>)}
                </ul>
            </DetailSection>
            <DetailSection title="Opportunities">
                <ul className="list-disc list-inside text-green-400 space-y-2 text-xs">
                    {(data.opportunities || []).map((opp, index) => <li key={index}><span className="text-stone-300">{safeRenderText(opp)}</span></li>)}
                </ul>
            </DetailSection>
        </div>

        <DetailSection title="Key Performance Indicators (KPIs)">
            <div className="flex flex-wrap gap-2">
                {(data.kpis || []).map((kpi, index) => (
                    <span key={index} className="bg-stone-700 text-amber-300 text-xs font-medium px-2 py-1 rounded-full">
                        {safeRenderText(kpi)}
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

export default ScenarioDisplay;
