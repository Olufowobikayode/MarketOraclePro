import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';

const ApiOutageBanner: React.FC = () => {
    const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

    if (isAvailable) {
        return null;
    }

    const outageMessage = "The AI service is temporarily unavailable due to high demand. The app will attempt to reconnect automatically.";

    return (
        <div className="bg-red-900/80 backdrop-blur-sm text-red-200 text-xs text-center p-2 border-b border-red-500/50 animate-fade-in" role="alert">
            <p>
                <strong className="font-bold">API Service Interruption:</strong> {outageMessage}
            </p>
        </div>
    );
};

export default ApiOutageBanner;
