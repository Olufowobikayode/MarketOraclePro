
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BlogState, BlogPost, ContentData } from '../../types';

// Dummy initial posts for demonstration
const initialPosts: BlogPost[] = [
    {
        id: 'blog-post-1',
        title: 'The Rise of Hyper-Personalized E-commerce',
        description: 'Discover how AI and data analytics are creating bespoke shopping experiences, and what it means for the future of online retail.',
        format: 'Blog Post',
        talkingPoints: ['AI-driven product recommendations', 'Customizable product interfaces', 'The role of user data'],
        seoKeywords: ['personalized e-commerce', 'AI in retail', 'custom shopping'],
        stackType: 'content',
        publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    },
    {
        id: 'blog-post-2',
        title: 'Sustainable Packaging: A Trend That Is Here to Stay',
        description: 'An in-depth look at consumer demand for eco-friendly packaging and how businesses can adapt to meet this growing expectation.',
        format: 'Market Analysis',
        talkingPoints: ['Consumer sentiment data', 'Innovations in material science', 'Cost-benefit analysis for SMEs'],
        seoKeywords: ['sustainable packaging', 'eco-friendly business', 'green consumerism'],
        stackType: 'content',
        publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    }
];

const initialState: BlogState = {
  posts: initialPosts,
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    createPostStart(state, action: PayloadAction<{ postData: ContentData }>) {
      state.loading = true;
      state.error = null;
    },
    createPostSuccess(state, action: PayloadAction<BlogPost>) {
      state.loading = false;
      // Add the new post to the beginning of the array
      state.posts.unshift(action.payload);
    },
    createPostFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createPostStart,
  createPostSuccess,
  createPostFailure,
} = blogSlice.actions;

export default blogSlice.reducer;
