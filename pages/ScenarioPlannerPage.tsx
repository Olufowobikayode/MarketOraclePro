import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, ScenarioData } from '../types';
import { fetchScenariosStart } from '../features/scenarios/scenariosSlice';
import ScenarioCard from '../features/scenarios/ScenarioCard';
import ScenarioDisplay from '../features/scenarios/ScenarioDisplay';

const ScenarioPlannerPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<ScenarioData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error, goalQuery } = useSelector((state: RootState) => state.scenarios);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      dispatch(fetchScenariosStart({ goalQuery: query }));
    }
  };

  const loadingMessages = [
    `Simulating futures for "${query}"...`,
    "Consulting with virtual strategists...",
    "War-gaming potential outcomes...",
    "Mapping strategic pathways..."
  ];

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Scenario Planner</h1>
          <p className="text-stone-400 text-sm">Simulate and visualize paths to your strategic goals.</p>
        </div>

        <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700/50 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a strategic goal..."
              className="flex-grow bg-stone-700 text-white border-2 border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={loading || !isAvailable}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading || !query.trim() || !isAvailable}
            >
              {loading ? 'Simulating...' : 'Simulate'}
            </button>
          </form>
        </div>

        <div className="mt-6">
          {loading && <LoadingSpinner message={loadingMessages} />}
          {error && <ErrorDisplay message={error} />}
          
          {data.length > 0 && (
             <h2 className="text-lg font-semibold text-white mb-4">Strategic Scenarios for: <span className="text-amber-400">{goalQuery}</span></h2>
          )}
          <div className="space-y-4">
            {data.map((cardData, index) => (
              <div key={cardData.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                <ScenarioCard card={cardData} onSelect={() => setSelectedCard(cardData)} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <FullscreenModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || ''}
      >
        {selectedCard && <ScenarioDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default ScenarioPlannerPage;
