
import React from 'react';
import type { ComparativeReport } from '../../types';

const DetailSection: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, icon, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        {title}
    </h3>
    {children}
  </div>
);

const ComparisonReportDisplay: React.FC<{ report: ComparativeReport }> = ({ report }) => {
    return (
        <div className="space-y-4 text-sm">
            <p className="text-stone-300 pb-2 italic">"{report.summary}"</p>
            
            <DetailSection title="Key Similarities" icon="🔄">
                <ul className="list-disc list-inside text-stone-400 space-y-2 text-xs">
                    {(report.similarities || []).map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </DetailSection>

            <DetailSection title="Key Differences" icon="🔀">
                <ul className="list-disc list-inside text-stone-400 space-y-2 text-xs">
                    {(report.differences || []).map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </DetailSection>

            <DetailSection title="Strategic Implications" icon="💡">
                 <ul className="list-disc list-inside text-stone-300 space-y-2 text-xs">
                    {(report.strategicImplications || []).map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </DetailSection>
        </div>
    );
};

export default ComparisonReportDisplay;
