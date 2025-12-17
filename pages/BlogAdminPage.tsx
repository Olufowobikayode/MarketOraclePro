import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentStart } from '../features/content/contentSlice';
import { createPostStart } from '../features/blog/blogSlice';
import ContentCard from '../features/content/ContentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import ContentDisplay from '../features/content/ContentDisplay';
import { useToast } from '../hooks/useToast';
import type { RootState, ContentData } from '../types';

const BlogAdminPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<ContentData | null>(null);
  const dispatch = useDispatch();
  const showToast = useToast();
  const { data: contentIdeas, loading, error } = useSelector((state: RootState) => state.content);
  const { posts: blogPosts } = useSelector((state: RootState) => state.blog);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

  const handleGenerateIdeas = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(fetchContentStart({ topic: query }));
    }
  };

  const handlePublish = (card: ContentData) => {
    const isAlreadyPublished = blogPosts.some(post => post.id === card.id);
    if(isAlreadyPublished) {
        showToast('This post has already been published.', 'error');
        return;
    }
    dispatch(createPostStart({ postData: card }));
    showToast('Post published successfully!', 'success');
  };

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Blog Admin</h1>
            <p className="text-gray-400">Create new blog posts using the Content Oracle.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-xl font-bold mb-2 text-white">1. Generate Content Ideas</h2>
          <p className="text-gray-400 mb-4 text-sm">
            Enter a topic to generate a list of potential blog posts.
          </p>
          <form onSubmit={handleGenerateIdeas}>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'The future of e-commerce'"
                className="flex-grow bg-gray-700 text-white border-2 border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading || !isAvailable}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-300 disabled:opacity-50"
                disabled={loading || !query.trim() || !isAvailable}
              >
                {loading ? 'Generating...' : 'Get Ideas'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-white">2. Review and Publish</h2>
          {loading && <LoadingSpinner message="Generating Ideas..." />}
          {error && <ErrorDisplay message={error} />}
          {contentIdeas.length > 0 && (
             <div className="space-y-4">
                {contentIdeas.map((cardData) => (
                <ContentCard 
                    key={cardData.id} 
                    card={cardData} 
                    onSelect={() => setSelectedCard(cardData)} 
                    onPublish={handlePublish}
                />
                ))}
             </div>
          )}
        </div>
      </div>
      
      <FullscreenModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || ''}
      >
        {selectedCard && <ContentDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default BlogAdminPage;
