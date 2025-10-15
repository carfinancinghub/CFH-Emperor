/*
 * File: UserReviewList.tsx
 * Path: C:\CFH\frontend\src\components\reviews\UserReviewList.tsx
 * Created: 2025-07-25 17:15 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: A React component to display a list of user reviews.
 * Artifact ID: comp-user-review-list
 * Version ID: comp-user-review-list-v1.0.0
 */

import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Or use fetch

// --- Type Definitions ---
interface Reviewer {
    email?: string;
    role?: string;
}

interface Review {
    _id: string;
    reviewer?: Reviewer;
    rating: number;
    comment: string;
    createdAt: string;
}

interface UserReviewListProps {
    userId: string;
}

export const UserReviewList: React.FC<UserReviewListProps> = ({ userId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with a more robust method of getting the auth token
        const token = localStorage.getItem('token');
        // const res = await axios.get(`/api/users/${userId}/reviews`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setReviews(res.data);
        
        // Mock API call
        await new Promise(res => setTimeout(res, 500));
        setReviews([
            { _id: '1', reviewer: { email: 'test@cfh.com', role: 'Buyer' }, rating: 5, comment: 'Great experience!', createdAt: new Date().toISOString() }
        ]);

      } catch (err) {
        const msg = (err as any).response?.data?.error || '❌ Failed to fetch reviews';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchReviews();
  }, [userId]);

  return (
    <div className="user-review-list bg-white p-4 rounded shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-3">User Reviews</h3>

      {loading && <p className="text-gray-600">Loading reviews...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet.</p>
      )}

      <ul className="space-y-3">
        {reviews.map((review) => (
          <li key={review._id} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium text-gray-800">
                {review.reviewer?.email || 'Anonymous'} ({review.reviewer?.role || 'User'})
              </div>
              <div className="text-yellow-500 font-bold text-sm">⭐ {review.rating}</div>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
