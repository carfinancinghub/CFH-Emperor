// ----------------------------------------------------------------------
// File: posts.test.ts
// Path: backend/src/routes/__tests__/posts.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:40 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import request from 'supertest';
import express from 'express';
import postRouter from '../posts';
import sanitizeHtml from '@/utils/sanitizeHtml';
import Post from '@/models/Post';

// Mocks
const mockAuth = (req: any, res: any, next: any) => {
  req.user = { id: 'user-hacker-456', role: 'user' };
  next();
};
jest.mock('@/utils/sanitizeHtml', () => jest.fn(content => content));
jest.mock('@/models/Post');

const app = express();
app.use(express.json());
app.use('/api/posts', mockAuth, postRouter);

describe('Forum Posts API Routes', () => {
  it('DELETE /:id should return 403 Forbidden if a user tries to delete another user\'s post', async () => {
    const mockPost = { authorId: 'user-original-123', remove: jest.fn() };
    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    const res = await request(app).delete('/api/posts/post-abc');
    
    expect(res.status).toBe(403);
    expect(mockPost.remove).not.toHaveBeenCalled();
  });
});