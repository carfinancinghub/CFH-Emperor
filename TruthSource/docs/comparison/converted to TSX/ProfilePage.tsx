// ----------------------------------------------------------------------
// File: ProfilePage.tsx
// Path: frontend/src/pages/ProfilePage.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 10:57 PDT
// Version: 1.0.2 (Added Ratings Tab)
// ----------------------------------------------------------------------
// @description
// Page for viewing and editing user profiles, activity, and ratings.
//
// @architectural_notes
// - **Tab-Based**: Uses tabs to switch between profile details and ratings.
// - **Dynamic**: Integrates `useProfile` and `useRatings` for real-time data.
// - **Responsive**: Grid layout for listings and ratings display.
//
// @dependencies react @hooks/useProfile @hooks/useRatings zod
//
// @todos
// - @free:
//   - [x] Implement profile editing and activity display.
//   - [x] Add ratings tab with pending/received ratings.
// - @premium:
//   - [ ] ✨ Add profile analytics dashboard.
// - @wow:
//   - [ ] 🚀 Support profile customization with themes.
// ----------------------------------------------------------------------
import React, { useState } from 'react';
import { useProfile } from '@hooks/useProfile';
import { useRatings } from '@hooks/useRatings';
import { z } from 'zod';

const ProfileUpdateSchema = z.object({
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  location: z.string().max(100).optional(),
});

const ProfileForm = ({ profile, onSave }: { profile: any, onSave: Function }) => {
  const [formData, setFormData] = useState({
    bio: profile.bio || '',
    avatar: profile.avatar || '',
    location: profile.location || '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      ProfileUpdateSchema.parse(formData);
      onSave(formData);
      setError(null);
    } catch (err: any) {
      setError('Invalid input: Please check bio, avatar URL, or location.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Your Bio" className="p-2 border rounded w-full" />
      <input name="avatar" value={formData.avatar} onChange={handleChange} placeholder="Avatar URL" className="p-2 border rounded w-full" />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="p-2 border rounded w-full" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save Profile</button>
    </form>
  );
};

const RatingsTab = ({ userId }: { userId: string }) => {
  const { pendingRatings, receivedRatings, submitRating, isLoading, error } = useRatings(userId);
  const [formData, setFormData] = useState<{ [key: string]: { rating: number; review: string } }>({});

  const handleChange = (pendingId: string, field: string, value: string | number) => {
    setFormData({ ...formData, [pendingId]: { ...formData[pendingId], [field]: value } });
  };

  const handleSubmit = (pendingId: string) => {
    submitRating({ pendingRatingId: pendingId, ...formData[pendingId] });
  };

  if (isLoading) return <div>Loading ratings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pending Ratings</h2>
        {pendingRatings.length === 0 ? (
          <p className="text-gray-600">No pending ratings.</p>
        ) : (
          pendingRatings.map((pending: any) => (
            <form key={pending._id} onSubmit={() => handleSubmit(pending._id)} className="p-4 bg-gray-50 rounded-lg">
              <p>Rate {pending.toUser.name}</p>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={formData[pending._id]?.rating || 1}
                onChange={(e) => handleChange(pending._id, 'rating', Number(e.target.value))}
                className="p-2 border rounded"
              />
              <textarea
                name="review"
                value={formData[pending._id]?.review || ''}
                onChange={(e) => handleChange(pending._id, 'review', e.target.value)}
                placeholder="Your review"
                className="p-2 border rounded w-full mt-2"
              />
              <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">Submit Rating</button>
            </form>
          ))
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold">Received Ratings</h2>
        {receivedRatings.length === 0 ? (
          <p className="text-gray-600">No ratings received yet.</p>
        ) : (
          <ul className="space-y-2">
            {receivedRatings.map((rating: any) => (
              <li key={rating._id} className="p-3 bg-gray-50 rounded">
                <p>{rating.rating} ★ from {rating.fromUser.name}</p>
                <p>{rating.review}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { profileData, isLoading, error, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('details');

  if (isLoading) return <div className="p-4 text-gray-600">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{profileData.profile.name}</h1>
        <p className="text-gray-500">{profileData.profile.email} ({profileData.profile.reputationScore.toFixed(1)} ★)</p>
      </div>
      <div className="tabs flex space-x-4">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 ${activeTab === 'details' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('ratings')}
          className={`px-4 py-2 ${activeTab === 'ratings' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Ratings
        </button>
      </div>
      {activeTab === 'details' && (
        <>
          <ProfileForm profile={profileData.profile} onSave={updateProfile} />
          <div>
            <h2 className="text-2xl font-bold">My Active Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {profileData.listings.map((listing: any) => (
                <div key={listing._id} className="p-4 border rounded">{listing.year} {listing.make} {listing.model}</div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">My Bid History</h2>
            <ul className="mt-4 space-y-2">
              {profileData.bids.map((auction: any) => (
                <li key={auction._id} className="p-3 bg-gray-50 rounded">Bid on {auction.listing.make}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      {activeTab === 'ratings' && <RatingsTab userId={profileData.profile._id} />}
    </div>
  );
};

export default ProfilePage;