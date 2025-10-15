// @ai-generated
To convert this JavaScript file to idiomatic TypeScript, we'll make the following changes:

1. Change the file extension to `.tsx` since it contains JSX.
2. Add type annotations for function parameters and return types where necessary.
3. Use TypeScript's `jest.Mocked` type for mocked modules.
4. Add type imports for React and testing library types.

Here's the converted TypeScript code:

```typescript
/**
 * File: BuyerCommunityForum.test.tsx
 * Path: frontend/src/tests/BuyerCommunityForum.test.tsx
 * Author: Cod4 (05042319)
 * Purpose: Unit tests for BuyerCommunityForum.tsx covering free and premium tier functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BuyerCommunityForum from '@components/buyer/BuyerCommunityForum';
import * as MultiLanguageSupport from '@components/common/MultiLanguageSupport';
import * as PremiumFeatureModule from '@components/common/PremiumFeature';

// Mock the MultiLanguageSupport module
jest.mock('@components/common/MultiLanguageSupport', () => ({
  useLanguage: () => ({
    getTranslation: (key: string) => key,
    currentLanguage: 'en'
  })
}));

describe('BuyerCommunityForum Component', () => {
  it('renders forum title and initial threads', async () => {
    render(<BuyerCommunityForum />);

    expect(await screen.findByText('forum.title')).toBeInTheDocument();
    expect(screen.getByText('Best Cars for First-Time Buyers')).toBeInTheDocument();
    expect(screen.getByText('Review of 2021 Honda Civic')).toBeInTheDocument();
  });

  it('opens new thread modal and creates a thread', async () => {
    render(<BuyerCommunityForum />);

    fireEvent.click(screen.getByText('forum.createThread'));
    expect(await screen.findByLabelText('Create New Thread')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('forum.threadTitlePlaceholder'), {
      target: { value: 'Test Thread Title' }
    });
    fireEvent.change(screen.getByPlaceholderText('forum.threadContentPlaceholder'), {
      target: { value: 'Test thread content goes here.' }
    });
    fireEvent.click(screen.getByText('forum.postThread'));

    await waitFor(() => {
      expect(screen.getByText('Test Thread Title')).toBeInTheDocument();
    });
  });

  it('gates poll creation behind premium feature - hidden if false', () => {
    jest.spyOn(PremiumFeatureModule, 'PremiumFeature').mockImplementation(({ children }) => null);
    render(<BuyerCommunityForum />);
    expect(screen.queryByText('forum.createPoll')).not.toBeInTheDocument();
  });

  it('shows poll creation button if PremiumFeature enabled', () => {
    jest.spyOn(PremiumFeatureModule, 'PremiumFeature').mockImplementation(({ children }) => <>{children}</>);
    render(<BuyerCommunityForum />);
    expect(screen.getByText('forum.createPoll')).toBeInTheDocument();
  });
});
```

Key changes and explanations:

1. The file extension is changed to `.tsx` to indicate it's a TypeScript file with JSX.
2. The `useLanguage` mock now includes a type annotation for the `key` parameter of `getTranslation`.
3. No additional type annotations were added to the test functions as they are already using the correct types from the testing library.
4. The `jest.mock` function and `jest.spyOn` calls are left as-is, as they are part of Jest's runtime behavior and don't need type annotations.
5. The overall structure and functionality of the tests remain unchanged, preserving the ESM shape and avoiding any runtime changes.

This conversion maintains the original functionality while adding minimal TypeScript typing to improve type safety and developer experience.