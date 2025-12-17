
import React from 'react';
import type { VentureVision } from '../../types';

interface VisionCardProps {
  vision: VentureVision;
  onSelect: () => void;
}

const VisionCard: React.FC<VisionCardProps> = ({ vision, onSelect }) => {
  return (
    <div 
        className="bg-stone-800 border border-stone-700 rounded-lg shadow-lg overflow-hidden p-4 cursor-pointer hover:bg-stone-700/50 hover:border-amber-500 transition-all duration-200"
        onClick={onSelect}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-md font-bold text-amber-400">{vision.title}</h3>
        <span className="text-xs font-medium bg-amber-900 text-amber-300 px-2 py-1 rounded-full flex-shrink-0 ml-2">{vision.businessModel}</span>
      </div>
      <p className="text-sm text-stone-400 mt-2">{vision.oneLinePitch}</p>
      <div className="text-right mt-3">
        <span className="text-xs text-stone-500 italic">Inspired by: {vision.evidenceTag}</span>
      </div>
    </div>
  );
};

export default VisionCard;