
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, BlogPost } from '../types';

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const navigate = useNavigate();
  // In a real app, clicking this would navigate to a detailed post page
  // For this demo, we'll just log it.
  const handleClick = () => {
      console.log("Navigating to post:", post.id);
      alert(`This would navigate to a full page for "${post.title}". For now, you can view the details by using the main app's content feature.`);
  }

  return (
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:border-purple-500 transition-colors"
        onClick={handleClick}
      >
          <div className="p-6">
              <p className="text-sm text-gray-400 mb-1">{new Date(post.publishedAt).toLocaleDateString()}</p>
              <h3 className="text-xl font-bold text-purple-400 mb-2">{post.title}</h3>
              <p className="text-sm text-gray-300 line-clamp-3">{post.description}</p>
              <div className="mt-4">
                  <span className="text-xs font-medium bg-purple-900 text-purple-300 px-2 py-1 rounded-full">{post.format}</span>
              </div>
          </div>
      </div>
  );
}

const BlogPage: React.FC = () => {
  const { posts, loading, error } = useSelector((state: RootState) => state.blog);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">The Oracle's Insights</h1>
        <p className="text-lg text-gray-400 mt-2">Strategic analysis and market foresights from the Goddess Saga.</p>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}
      
      {posts.length === 0 && !loading && (
        <p className="text-center text-gray-500">No blog posts have been published yet.</p>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
