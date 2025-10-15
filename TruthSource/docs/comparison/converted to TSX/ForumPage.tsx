// ----------------------------------------------------------------------
// File: ForumPage.tsx
// Path: frontend/src/pages/forum/ForumPage.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:40 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The main page for the community forum, displaying a paginated list of posts.
//
// @architectural_notes
// - **Decoupled Data Logic**: All API calls and state management are encapsulated
//   in the `usePosts` hook, keeping the component clean and presentational.
//
// @todos
// - @free:
//   - [ ] Implement pagination controls (Next/Previous buttons) to allow users to navigate through pages.
// - @premium:
//   - [ ] ✨ Add tabs to filter posts by popular tags.
// - @wow:
//   - [ ] 🚀 Implement an "infinite scroll" feature for a seamless Browse experience.
//
// ----------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- Types & Hook ---
interface IPost { _id: string; title: string; authorId: { username: string }; }

const usePosts = (page: number) => {
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    axios.get(`/api/posts?page=${page}&limit=10`)
      .then(res => setPosts(res.data))
      .catch(() => toast.error('Failed to load forum posts.'))
      .finally(() => setLoading(false));
  }, [page]);
  
  return { posts, loading };
};

// --- Main Component ---
const ForumPage: React.FC = () => {
  const { posts, loading } = usePosts(1);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Community Forum</h1>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post._id} className="p-4 border rounded shadow-sm">
            <Link to={`/forum/posts/${post._id}`} className="text-xl font-semibold hover:underline">{post.title}</Link>
            <p className="text-sm text-gray-500">by {post.authorId.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;