// ----------------------------------------------------------------------
// File: SocialShare.test.tsx
// Path: frontend/src/features/social/__tests__/SocialShare.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSocialShare } from '../SocialShare';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({ toast: { success: jest.fn() } }));

const TestComponent = () => {
  const { share } = useSocialShare();
  const data = { type: 'badge', badgeName: 'Top Seller', url: 'http://example.com' };
  return <button onClick={() => share({ platform: 'twitter', data })}>Share</button>;
};

describe('useSocialShare Hook', () => {
  it('should open a new window with the correct Twitter URL', () => {
    const mockOpen = jest.spyOn(window, 'open').mockImplementation(() => null);
    render(<TestComponent />);
    
    fireEvent.click(screen.getByRole('button', { name: /Share/i }));
    
    expect(mockOpen).toHaveBeenCalledTimes(1);
    const shareUrl = mockOpen.mock.calls[0][0];
    expect(shareUrl).toContain('https://twitter.com/intent/tweet');
    expect(decodeURIComponent(shareUrl!)).toContain('I earned the Top Seller badge');
    expect(toast.success).toHaveBeenCalled();
  });
});