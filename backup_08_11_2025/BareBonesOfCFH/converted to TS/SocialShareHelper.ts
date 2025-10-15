// File: SocialShareHelper.ts
// Path: frontend/src/utils/SocialShareHelper.ts
// Purpose: A comprehensive, type-safe utility for sharing content to social platforms.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — The definitive, architect-approved social sharing module.

// COMMAND:
// @command: generate-test-suite
// @description: "Generates a full test suite for this utility file."
// @parameters: { "utility": "SocialShareHelper" }

// TODO:
// @free:
//   - [ ] Implement a real URL shortening service by replacing the mock with an API call to a service like Bitly or TinyURL.
//   - [ ] Expand the list of supported platforms to include Reddit, Pinterest, and WhatsApp.
//   - [ ] Create a reusable React hook (e.g., `useSocialShare`) that wraps this utility for even easier use in components.
// @premium:
//   - [ ] ✨ Fully implement the backend sharing functionality for platforms like LinkedIn that have richer API integrations, allowing for more detailed posts and tracking analytics.
//   - [ ] ✨ Develop a "Share Preview" component that shows the user what their post will look like on the selected platform before they share it.
// @wow:
//   - [ ] 🚀 Create an AI-powered "Smart Sharer" that suggests the best platform and post time for a user based on their historical engagement data.

import { toast } from 'react-toastify'; // For user feedback

// --- Type Definitions ---
type Platform = 'twitter' | 'facebook' | 'linkedin';

// A discriminated union allows us to have different data shapes for different share types
type ShareData =
  | { type: 'auction'; title: string; url: string; }
  | { type: 'badge'; badgeName: string; url: string; }
  | { type: 'summary'; transports: number; totalValue: number; url: string; };

interface ShareOptions {
  platform: Platform;
  data: ShareData;
  isPremium?: boolean;
  /** A custom message template, e.g., "I just won {title}! View it here: {url}" */
  template?: string;
}

interface ShareResult {
  success: boolean;
  platform: Platform;
  shareUrl: string;
}

// --- Private Helper Functions ---

/**
 * Validates the core data needed for any share.
 * @private
 */
const _validateData = (data: ShareData): boolean => {
  if (!data.url || !/^https?:\/\//.test(data.url)) {
    throw new Error('A valid URL is required for sharing.');
  }
  return true;
};

/**
 * Generates the shareable text based on the data type.
 * @private
 */
const _generateContent = (data: ShareData): string => {
  switch (data.type) {
    case 'auction':
      return `Check out this auction: ${data.title}`;
    case 'badge':
      return `I just earned the "${data.badgeName}" badge on Rivers Auction! #HaulerPride`;
    case 'summary':
      return `Just completed ${data.transports} transports worth over $${data.totalValue.toLocaleString()} on Rivers Auction! #Logistics`;
    default:
      throw new Error('Invalid share data type.');
  }
};

/**
 * Mocks a URL shortening service. Replace with a real API call.
 * @private
 */
const _shortenUrl = async (url: string): Promise<string> => {
  // In a real app, this would be an API call, e.g.:
  // const response = await axios.post('https://api.short.io/links', { originalURL: url }, ...);
  // return response.data.shortURL;
  return `https://short.link/${Math.random().toString(36).substring(2, 8)}`;
};

// --- Main Public Function ---

/**
 * The main entry point for sharing content. Handles validation, content generation,
 * and dispatching to the correct platform.
 * @param options The configuration object for the share action.
 * @returns A promise that resolves with the result of the share action.
 */
export const share = async (options: ShareOptions): Promise<ShareResult | { success: false }> => {
  try {
    const { platform, data, isPremium = false, template } = options;
    _validateData(data);

    const shortUrl = await _shortenUrl(data.url);
    const baseContent = _generateContent(data);
    
    // Use the premium template if available, otherwise use the generated content.
    const text = isPremium && template
      ? template.replace(/\{title\}|\{badgeName\}/g, baseContent).replace('{url}', shortUrl)
      : `${baseContent} ${shortUrl}`;
      
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        // Facebook prefers to use its own crawlers, so we just provide the URL.
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`;
        break;
      case 'linkedin':
        // LinkedIn has a more detailed share intent URL.
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shortUrl)}&title=${encodeURIComponent(baseContent)}`;
        break;
      default:
        toast.error(`Sharing to ${platform} is not supported.`);
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Open the share window and provide user feedback.
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    toast.success(`Content ready to share on ${platform}!`);

    return { success: true, platform, shareUrl };

  } catch (err) {
    const error = err as Error;
    console.error('Social share failed:', error.message);
    toast.error('Could not prepare content for sharing.');
    return { success: false };
  }
};