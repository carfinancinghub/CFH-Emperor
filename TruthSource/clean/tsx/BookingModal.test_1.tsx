// File: BookingModal.test.tsx
// Path: frontend/src/tests/BookingModal.test.tsx
// Author: Cod3 (07212245, July 21, 2025, 22:45 PDT)
// Purpose: Unit tests for BookingModal.tsx to ensure reliable rendering and booking confirmation

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingModal from '@hauler/BookingModal';
import { toast } from '@utils/react-toastify';
import { logError } from '@utils/logger';
import { awardLoyaltyBadge } from '@utils/gamificationUtils';
import { generateShareContent, shareToPlatform } from '@utils/SocialShareHelper';

// Mock dependencies
jest.mock('@utils/react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('@utils/logger', () => ({ logError: jest.fn() }));
jest.mock('@utils/gamificationUtils', () => ({ awardLoyaltyBadge: jest.fn() }));
jest.mock('@utils/SocialShareHelper', () => ({
  generateShareContent: jest.fn(),
  shareToPlatform: jest.fn(),
}));

describe('BookingModal', () => {
  const mockTransport = { id: '1', type: 'Flatbed', price: 1000 };
  const mockHistory = [{ id: '2', type: 'Enclosed', price: 2000 }];
  const mockOnConfirm = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (awardLoyaltyBadge as jest.Mock).mockReturnValue(null);
    (generateShareContent as jest.Mock).mockReturnValue({ text: 'Mock badge share' });
    (shareToPlatform as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders modal when open with transport data', () => {
    render(
      <BookingModal
        transport={mockTransport}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        transportHistory={mockHistory}
        isPremium={false}
      />
    );
    expect(screen.getByText('Confirm Booking')).toBeInTheDocument();
    expect(screen.getByText('Type: Flatbed')).toBeInTheDocument();
    expect(screen.getByText('Price: $1000.00')).toBeInTheDocument();
    expect(screen.getByText('ID: 1')).toBeInTheDocument();
  });

  it('does not render when closed or no transport', () => {
    const { container } = render(
      <BookingModal
        transport={null}
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        transportHistory={mockHistory}
        isPremium={false}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('confirms booking and updates history', async () => {
    render(
      <BookingModal
        transport={mockTransport}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        transportHistory={mockHistory}
        isPremium={false}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith([...mockHistory, mockTransport], null);
      expect(toast.success).toHaveBeenCalledWith('Booking confirmed! Transport ID: 1');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('shares badge for Enterprise users', async () => {
    (awardLoyaltyBadge as jest.Mock).mockReturnValue('Bronze Hauler Badge');
    render(
      <BookingModal
        transport={mockTransport}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        transportHistory={mockHistory}
        isPremium={true}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => {
      expect(generateShareContent).toHaveBeenCalledWith('badge', { badge: 'Bronze Hauler Badge' });
      expect(shareToPlatform).toHaveBeenCalledWith('twitter', { text: 'Mock badge share' });
    });
  });

  it('handles booking errors', async () => {
    (awardLoyaltyBadge as jest.Mock).mockImplementation(() => { throw new Error('Badge error'); });
    render(
      <BookingModal
        transport={mockTransport}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        transportHistory={mockHistory}
        isPremium={false}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to confirm booking.');
      expect(logError).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // === TODOs and Suggestions ===
  // - Test keyboard navigation for accessibility compliance.
  // - Mock a backend API for booking confirmation persistence.
  // - Add snapshot tests for modal rendering states.
});