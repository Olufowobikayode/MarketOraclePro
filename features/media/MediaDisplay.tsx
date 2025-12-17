
import React from 'react';
import type { MediaAsset } from '../../types';
import { useToast } from '../../hooks/useToast';

interface MediaDisplayProps {
  asset: MediaAsset;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ asset }) => {
  const showToast = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(asset.url).then(() => {
      showToast('Asset URL copied!');
    });
  };

  return (
    <div className="bg-stone-900/50 rounded-lg p-4 border border-stone-700">
      {asset.type === 'image' ? (
        <img src={asset.url} alt={asset.prompt} className="rounded-md w-full object-contain" />
      ) : (
        <div className="aspect-video bg-black rounded-md flex items-center justify-center">
            <p className="text-stone-400 text-center text-sm p-4">
                Video generated. <br />
                <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Click here to view/download.</a>
            </p>
        </div>
      )}
      <p className="text-xs text-stone-400 mt-3 italic">
        <strong>Prompt:</strong> "{asset.prompt}"
      </p>
      <div className="flex gap-2 mt-3">
          <a
            href={asset.url}
            download={`goddess-saga-asset-${asset.id}.${asset.type === 'image' ? 'jpg' : 'mp4'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-amber-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-amber-700 transition-colors"
          >
           Download
          </a>
          <button
            onClick={handleCopyLink}
            className="flex-1 text-center bg-stone-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-stone-700 transition-colors"
           >
            Copy Link
          </button>
      </div>
    </div>
  );
};

export default MediaDisplay;