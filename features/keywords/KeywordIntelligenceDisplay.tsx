
import React from 'react';
import type { KeywordData, KeywordMetrics } from '../../types';

// Helper function to safely render metric values.
// The AI might return an object with a 'primary' key or other structures.
const formatMetricValue = (metric: unknown): string | number => {
    if (typeof metric === 'string' || typeof metric === 'number') {
        return metric;
    }
    if (typeof metric === 'object' && metric !== null) {
        if ('primary' in metric && (metric as any).primary) {
            return String((metric as any).primary);
        }
        if ('value' in metric && (metric as any).value) {
            return String((metric as any).value);
        }
        // As a fallback for unexpected object structures, stringify it.
        return JSON.stringify(metric);
    }
    return 'N/A';
};

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
    {children}
  </div>
);

const MetricCard: React.FC<{ label: string; value: string | number; description: string }> = ({ label, value, description }) => (
    <div className="bg-stone-700/50 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-yellow-500">{value}</div>
        <div className="text-xs font-semibold text-stone-200 mt-1">{label}</div>
        <div className="text-xs text-stone-400">{description}</div>
    </div>
);

const KeywordTable: React.FC<{ keywords: KeywordMetrics[] }> = ({ keywords }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-stone-400">
            <thead className="text-xs text-stone-200 uppercase bg-stone-700/50">
                <tr>
                    <th scope="col" className="px-2 py-2">Keyword</th>
                    <th scope="col" className="px-2 py-2 text-center">Intent</th>
                    <th scope="col" className="px-2 py-2 text-center">Volume</th>
                    <th scope="col" className="px-2 py-2 text-center">Difficulty</th>
                    <th scope="col" className="px-2 py-2 text-center">CPC</th>
                    <th scope="col" className="px-2 py-2 text-center">CPC Bench.</th>
                </tr>
            </thead>
            <tbody>
                {(keywords || []).map((kw, index) => (
                    <tr key={index} className="border-b border-stone-700 hover:bg-stone-700/30">
                        <th scope="row" className="px-2 py-2 font-medium text-stone-100 whitespace-nowrap">{kw.keyword}</th>
                        <td className="px-2 py-2 text-center">{kw.keywordIntent || '-'}</td>
                        <td className="px-2 py-2 text-center">{formatMetricValue(kw.volume)}</td>
                        <td className="px-2 py-2 text-center">{formatMetricValue(kw.difficulty)}</td>
                        <td className="px-2 py-2 text-center">{formatMetricValue(kw.cpc)}</td>
                        <td className="px-2 py-2 text-center text-green-400">{formatMetricValue(kw.cpcBenchmark)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const KeywordDisplay: React.FC<{ data: KeywordData }> = ({ data }) => {
  const { metrics, longTailKeywords } = data;

  // Safe fallback for metrics in case AI returns incomplete data
  const safeMetrics = metrics || {
      keywordIntent: 'N/A',
      volume: 'N/A',
      difficulty: 0,
      cpc: 'N/A',
      cpcBenchmark: 'N/A',
      keyword: 'Unknown'
  };

  return (
    <div className="space-y-4 text-sm">
      <p className="text-stone-300 pb-2">{data.description}</p>
      
      <DetailSection title="Main Keyword Metrics">
        <div className="mb-4 text-center">
            <div className="text-xs font-semibold text-stone-200 mt-1">Primary Intent</div>
            <div className="text-xl font-bold text-sky-400">{safeMetrics.keywordIntent || 'N/A'}</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <MetricCard label="Search Volume" value={formatMetricValue(safeMetrics.volume)} description="Est. monthly" />
            <MetricCard label="SEO Difficulty" value={formatMetricValue(safeMetrics.difficulty)} description="0-100 scale" />
            <MetricCard label="Avg. CPC" value={formatMetricValue(safeMetrics.cpc)} description="Est. cost" />
            <MetricCard label="CPC Benchmark" value={formatMetricValue(safeMetrics.cpcBenchmark)} description="Industry Avg." />
        </div>
      </DetailSection>

      {data.serpAnalysis && (
        <DetailSection title="SERP Landscape Analysis">
            <div className="p-3 bg-stone-900/50 rounded-lg border-l-4 border-purple-500">
                <p className="text-stone-300 leading-relaxed">{data.serpAnalysis}</p>
            </div>
        </DetailSection>
      )}

      <DetailSection title="Long-Tail Keywords">
        <KeywordTable keywords={longTailKeywords} />
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
                           {source.title}
                        </a>
                    </li>
                ))}
            </ul>
        </DetailSection>
      )}
    </div>
  );
};

export default KeywordDisplay;
