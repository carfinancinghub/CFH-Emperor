// File: SocialShareHelper.test.ts
// Path: frontend/src/utils/__tests__/SocialShareHelper.test.ts
// Purpose: Comprehensive test suite for the SocialShareHelper utility.

import { share } from '../SocialShareHelper';
import { toast } from 'react-toastify';

// --- Mocks ---
// Mock the toast notifications to prevent them from firing and to spy on their calls.
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('SocialShareHelper Utility', () => {

  // Mock window.open before each test to track its calls and prevent real popups.
  const mockWindowOpen = jest.spyOn(window, 'open').mockImplementation(jest.fn());

  beforeEach(() => {
    // Clear all mock history before each test run
    jest.clearAllMocks();
  });

  // Test Case 1: Sharing an 'auction' to Twitter
  it('should correctly format and open a Twitter share URL for an auction', async () => {
    await share({
      platform: 'twitter',
      data: { type: 'auction', title: 'Vintage Car Auction', url: 'https://example.com/auction1' },
    });

    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
    const shareUrl = mockWindowOpen.mock.calls[0][0];
    expect(shareUrl).toContain('https://twitter.com/intent/tweet');
    expect(decodeURIComponent(shareUrl!)).toContain('Check out this auction: Vintage Car Auction');
    expect(decodeURIComponent(shareUrl!)).toContain('https://short.link/');
    expect(toast.success).toHaveBeenCalledWith('Content ready to share on twitter!');
  });

  // Test Case 2: Sharing a 'badge' to LinkedIn
  it('should correctly format and open a LinkedIn share URL for a badge', async () => {
    await share({
      platform: 'linkedin',
      data: { type: 'badge', badgeName: 'Top Hauler', url: 'https://example.com/profile1' },
    });

    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
    const shareUrl = mockWindowOpen.mock.calls[0][0];
    expect(shareUrl).toContain('https://www.linkedin.com/shareArticle');
    expect(decodeURIComponent(shareUrl!)).toContain('title=I just earned the "Top Hauler" badge');
    expect(decodeURIComponent(shareUrl!)).toContain('url=https://short.link/');
    expect(toast.success).toHaveBeenCalledWith('Content ready to share on linkedin!');
  });

  // Test Case 3: Sharing a 'summary' to Facebook
  it('should correctly format and open a Facebook share URL for a summary', async () => {
    await share({
      platform: 'facebook',
      data: { type: 'summary', transports: 50, totalValue: 250000, url: 'https://example.com/summary1' },
    });

    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
    const shareUrl = mockWindowOpen.mock.calls[0][0];
    expect(shareUrl).toContain('https://www.facebook.com/sharer/sharer.php');
    expect(decodeURIComponent(shareUrl!)).toContain('u=https://short.link/');
    // Note: Facebook share intent doesn't reliably use a 'text' or 'quote' parameter, so we just test the URL.
  });

  // Test Case 4: Using a premium template
  it('should use the provided template for premium shares', async () => {
    await share({
      platform: 'twitter',
      data: { type: 'auction', title: 'Rare Ferrari', url: 'https://example.com/ferrari' },
      isPremium: true,
      template: 'A special auction is now live: {title} only at {url}!',
    });

    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
    const shareUrl = mockWindowOpen.mock.calls[0][0];
    expect(decodeURIComponent(shareUrl!)).toContain('A special auction is now live: Check out this auction: Rare Ferrari only at https://short.link/');
  });

  // Test Case 5: Handling invalid data
  it('should return success:false and show an error toast for invalid data', async () => {
    // @ts-ignore - Intentionally passing bad data to test validation
    const result = await share({
      platform: 'twitter',
      data: { type: 'auction', title: 'A bad share' }, // Missing URL
    });

    expect(result.success).toBe(false);
    expect(mockWindowOpen).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Could not prepare content for sharing.');
  });
  
  // Test Case 6: Handling an unsupported platform
  it('should throw an error and show an error toast for an unsupported platform', async () => {
    const result = await share({
      // @ts-ignore - Intentionally passing unsupported platform
      platform: 'instagram',
      data: { type: 'auction', title: 'Valid title', url: 'https://example.com' },
    });

    expect(result.success).toBe(false);
    expect(mockWindowOpen).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Sharing to instagram is not supported.');
  });
});