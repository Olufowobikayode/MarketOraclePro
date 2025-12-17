import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Feature: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700/50">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-xl font-bold text-amber-400 mb-2">{title}</h3>
    <p className="text-stone-400 text-sm">{children}</p>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <Logo className="h-24 w-24 mx-auto mb-4" />
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
          Market Oracle
        </h1>
        <p className="mt-4 text-lg md:text-xl text-stone-300 max-w-2xl mx-auto">
          Your AI-powered assistant for market intelligence and strategic foresight. Uncover trends, master keywords, and validate new ventures.
        </p>
        <Link
          to="/app/initiate"
          className="mt-8 inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:from-amber-600 hover:to-yellow-600 transition duration-300 shadow-lg"
        >
          Start Analysis
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-stone-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Actionable AI-Powered Insights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Feature icon="🔍" title="Market Analysis">
              Dive deep into any market to discover actionable sub-trends, audience demographics, and monetization strategies.
            </Feature>
            <Feature icon="🔑" title="Keyword Research">
              Unlock SEO secrets with AI-powered analysis of keywords, search volume, difficulty, and long-tail opportunities.
            </Feature>
            <Feature icon="🛒" title="Platform Finder">
              Identify the perfect platforms to sell your products, complete with opportunity scores, pros, and cons.
            </Feature>
            <Feature icon="🚀" title="Venture Ideas">
              From a single idea, generate multiple business concepts and detailed, actionable blueprints for your next big thing.
            </Feature>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;