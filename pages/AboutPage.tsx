
import React from 'react';
import Logo from '../components/Logo';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Logo className="h-20 w-20 mx-auto" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mt-4">About Market Oracle</h1>
        <p className="text-lg text-stone-400 mt-2">The Neural Interface for Telegram</p>
      </div>
      
      <div className="space-y-8 text-stone-300 text-sm md:text-base leading-relaxed">
        <p>
          Market Oracle is a next-generation market intelligence tool built natively for the Telegram ecosystem. In an economy defined by speed and information density, we provide a streamlined, AI-powered bridge between raw data and actionable strategy.
        </p>
        
        <h2 className="text-2xl font-bold text-amber-400 pt-4 border-t border-stone-700">The Vision</h2>
        <p>
          Developed by <strong>Kayode Olufowobi</strong>, this application was built on the belief that high-level strategic consulting should be accessible instantly, right from your pocket. We aim to empower entrepreneurs, creators, and traders with the foresight needed to navigate volatile markets without ever leaving their preferred messaging platform.
        </p>

        <h2 className="text-2xl font-bold text-yellow-400 pt-4 border-t border-stone-700">The Technology</h2>
        <p>
          Market Oracle leverages advanced Large Language Models (LLMs) and real-time data synthesis to analyze complex market signals. Our proprietary orchestration layer translates abstract user queries into comprehensive business blueprints, trend reports, and content strategies. We handle the complexity of deep research so you can focus on execution.
        </p>

        <h2 className="text-2xl font-bold text-stone-200 pt-4 border-t border-stone-700">The Developer</h2>
        <p>
          <strong>Kayode Olufowobi</strong> is a forward-thinking engineer and strategist dedicated to building tools that amplify human potential. Market Oracle is the culmination of research into AI-human collaboration and mobile-first user experiences.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
