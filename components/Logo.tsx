import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = 'h-16 w-16' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Niche Oracle Engine Logo"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" /> 
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <path
        d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z"
        stroke="url(#logo-grad)"
        strokeWidth="4"
      />
      <path
        d="M32 44C38.6274 44 44 38.6274 44 32C44 25.3726 38.6274 20 32 20C25.3726 20 20 25.3726 20 32C20 38.6274 25.3726 44 32 44Z"
        fill="url(#logo-grad)"
      />
      <path d="M24 32H16" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 32H40" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 24V16" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 48V40" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;