/*
 * File: UnreadNotificationBadge.test.tsx
 * Path: C:\CFH\frontend\src\tests\components\common\UnreadNotificationBadge.test.tsx
 * Created: 2025-07-25 17:30 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the UnreadNotificationBadge component.
 * Artifact ID: test-comp-unread-badge
 * Version ID: test-comp-unread-badge-v1.0.0
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UnreadNotificationBadge } from '@components/common/UnreadNotificationBadge';

// Mock API call
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ count: 5, summary: 'New bid!' }),
});

describe('UnreadNotificationBadge Component', () => {
  it('should render a simple dot for the Free tier', async () => {
    render(<UnreadNotificationBadge userTier="Free" />);
    await waitFor(() => {
      const badge = screen.getByTitle('You have new notifications');
      expect(badge).toBeInTheDocument();
      expect(badge).not.toHaveTextContent('5'); // Should not show count
    });
  });

  it('should render the count for the Standard tier', async () => {
    render(<UnreadNotificationBadge userTier="Standard" />);
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('should have a pulsing animation for the Premium tier', async () => {
    render(<UnreadNotificationBadge userTier="Premium" />);
    await waitFor(() => {
      const badge = screen.getByText('5');
      // In a real setup with Tailwind, we would check for the 'animate-pulse' class
      expect(badge).toHaveClass('animate-pulse');
    });
  });

  it('should display a detailed tooltip for the Wow++ tier', async () => {
    render(<UnreadNotificationBadge userTier="Wow++" />);
    await waitFor(() => {
      const badge = screen.getByText('5');
      expect(badge).toHaveAttribute('title', 'New bid on your watched item!');
    });
  });

  it('should render null if the count is 0', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ count: 0 }),
    });
    const { container } = render(<UnreadNotificationBadge userTier="Standard" />);
    await waitFor(() => {
        expect(container.firstChild).toBeNull();
    });
  });
});
