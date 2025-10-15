// @ai-generated
To convert the given JavaScript to idiomatic TypeScript, we'll add minimal explicit types while preserving the exports/ESM shape and avoiding runtime changes. Here's the TypeScript version:

```typescript
/**
 * File: BuyerLenderResults.test.ts
 * Path: frontend/src/tests/BuyerLenderResults.test.ts
 * Purpose: Unit tests for BuyerLenderResults.tsx to validate lender match display and premium features
 * Author: SG
 * Date: April 28, 2025
 */

import { render, screen, waitFor } from '@testing-library/react';
import BuyerLenderResults from '@components/buyer/BuyerLenderResults'; // Alias for component
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@utils/logger', () => ({ default: { error: vi.fn(), info: vi.fn() } }));
global.fetch = vi.fn();

describe('BuyerLenderResults', () => {
  const defaultProps: { buyerId: string; auctionId: string; isPremium: boolean } = {
    buyerId: 'buyer123',
    auctionId: 'auction123',
    isPremium: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockReset();
  });

  /**
   * Test free feature: Lender match display
   * Should render lender matches
   */
  it('should render lender match results', async () => {
    type LenderMatch = { id: string; name: string; rate: string };
    const mockMatches: LenderMatch[] = [
      { id: 'lender1', name: 'Bank A', rate: '3.5%' },
      { id: 'lender2', name: 'Bank B', rate: '4.0%' },
    ];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockMatches });

    render(<BuyerLenderResults {...defaultProps} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/buyer/lender-matches'),
        expect.any(Object)
      );
      expect(screen.getByText(/Bank A/i)).toBeInTheDocument();
      expect(screen.getByText(/Bank B/i)).toBeInTheDocument();
    });
  });

  /**
   * Test premium feature: AI negotiation simulator
   * Should display simulated negotiation outcomes
   */
  it('should display AI negotiation simulator for premium users', async () => {
    render(<BuyerLenderResults {...defaultProps} isPremium={true} />);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ outcome: 'Rate reduced to 3.2%' }),
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/buyer/negotiate'),
        expect.any(Object)
      );
      expect(screen.getByText(/Rate reduced to 3.2%/i)).toBeInTheDocument();
    });
  });

  /**
   * Test premium feature: Terms history analytics
   * Should display historical loan terms analytics
   */
  it('should display terms history analytics for premium users', async () => {
    type TermsHistory = { date: string; rate: string };
    const mockAnalytics: TermsHistory[] = [
      { date: '2025-01-01', rate: '3.8%' },
      { date: '2025-02-01', rate: '3.6%' },
    ];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockAnalytics });

    render(<BuyerLenderResults {...defaultProps} isPremium={true} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/buyer/terms-history'),
        expect.any(Object)
      );
      expect(screen.getByText(/3.8%/i)).toBeInTheDocument();
      expect(screen.getByText(/3.6%/i)).toBeInTheDocument();
    });
  });
});

// Cod2 Crown Certified: This test suite validates core lender match display and premium AI negotiation/terms analytics,
// uses Jest with @ aliases, and ensures robust error handling and modularity.
```

Key changes and explanations:

1. File extension changed from `.js` to `.ts` to indicate TypeScript.

2. Added explicit type annotations:
   - `defaultProps` now has a type annotation.
   - Introduced `LenderMatch` and `TermsHistory` types for the mock data.

3. The `BuyerLenderResults` component is assumed to be a TSX component. If it's not, you might need to adjust the import or the component itself.

4. The rest of the code remains unchanged, preserving the ESM shape and avoiding runtime changes.

5. The comments and docstrings are preserved as they were in the original JavaScript file.

6. The `Cod2 Crown Certified` comment at the end is kept as is.

This TypeScript version maintains the same functionality as the original JavaScript while adding minimal type safety. The types added (`LenderMatch` and `TermsHistory`) help catch potential errors in the mock data structure, improving the robustness of the tests.