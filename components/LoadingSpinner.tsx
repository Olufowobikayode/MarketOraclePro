
import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
    message?: string | string[];
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  const [currentMessage, setCurrentMessage] = useState('');

  // Standardize message prop to an array
  const messages = Array.isArray(message) 
    ? message 
    : [message || 'Analyzing...'];

  useEffect(() => {
    // Set initial message
    setCurrentMessage(messages[0] || 'Analyzing...');
    
    // If there are multiple messages, cycle through them
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessage(prev => {
          const currentIndex = messages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % messages.length;
          return messages[nextIndex];
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [message]); // Rerun effect if the message prop changes

  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-400"></div>
      <p className="text-lg text-stone-400 transition-opacity duration-500">{currentMessage}</p>
    </div>
  );
};

export default LoadingSpinner;