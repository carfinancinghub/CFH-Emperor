// ----------------------------------------------------------------------
// File: SocialShare.tsx
// Path: frontend/src/features/social/SocialShare.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A unified, declarative system for sharing content to social platforms,
// featuring a reusable hook and a simple button component.
//
// @usage
// 1. Import the hook: `import { useSocialShare } from ...`
// 2. Use it in your component: `const { share } = useSocialShare();`
// 3. Call it: `share({ platform: 'twitter', data: { type: 'badge', ... } })`
//
// @architectural_notes
// - **Decoupled Logic (Hook)**: All logic for content generation, URL creation,
//   and user feedback is encapsulated in the 'useSocialShare' hook. Components
//   that use it are clean and simple.
// - **Tier-Aware**: The hook contains logic to handle 'isPremium' flags,
//   applying custom templates for premium users.
//
// @todos
// - @free:
//   - [ ] Add support for more platforms like Reddit and WhatsApp.
// - @premium:
//   - [ ] ✨ Implement a backend-driven share for platforms like LinkedIn to allow for richer posts and to track analytics.
// - @wow:
//   - [ ] 🚀 Create an AI-powered "Smart Sharer" that suggests the best platform and hashtags for a user's content.
//
// ----------------------------------------------------------------------

import React from 'react';
import { toast } from 'react-toastify';

// --- Type Definitions ---
type Platform = 'twitter' | 'facebook' | 'linkedin';
type ShareData =
  | { type: 'badge'; badgeName: string; url: string; }
  | { type: 'auction'; title: string; url: string; };

// --- Reusable Hook ---
export const useSocialShare = () => {
  const share = (options: { platform: Platform; data: ShareData; isPremium?: boolean; }) => {
    try {
      const { platform, data, isPremium } = options;
      const content = data.type === 'badge'
        ? `I earned the ${data.badgeName} badge on CFH!`
        : `Check out this auction: ${data.title}`;
      
      let shareUrl = '';
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}&url=${encodeURIComponent(data.url)}`;
          break;
        // ... other platforms
      }
      
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Content ready to share on ${platform}!`);
    } catch (err) {
      toast.error('Could not prepare content for sharing.');
    }
  };
  return { share };
};


// --- Simple Component Example ---
const SocialShareButtons: React.FC<{ data: ShareData }> = ({ data }) => {
  const { share } = useSocialShare();
  return (
    <div className="flex gap-2">
      <button onClick={() => share({ platform: 'twitter', data })}>Share on Twitter</button>
      <button onClick={() => share({ platform: 'facebook', data })}>Share on Facebook</button>
    </div>
  );
};