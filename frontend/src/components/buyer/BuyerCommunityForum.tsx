// @ai-generated via ai-orchestrator (provider=grok)
// @auto: added by validate-fix
export interface __AIOrchestratorMarkerProps { /* TODO: fill with real props later */ }To convert this JavaScript file to idiomatic TypeScript, we'll add minimal explicit types while preserving the existing structure and functionality. Here's the TypeScript version:

```typescript
/**
 * File: BuyerCommunityForum.test.tsx
 * Path: frontend/src/tests/BuyerCommunityForum.test.tsx
 * Author: Cod4 (05050043)
 * Purpose: Unit tests for BuyerCommunityForum.tsx covering free and premium tier functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BuyerCommunityForum from '@components/buyer/BuyerCommunityForum';
import * as MultiLanguageSupport from '@components/common/MultiLanguageSupport';
import * as PremiumFeatureModule from '@components/common/PremiumFeature';

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

    it('validates poll creation form - missing title or options', async () => {
        jest.spyOn(PremiumFeatureModule, 'PremiumFeature').mockImplementation(({ children }) => <>{children}</>);
        render(<BuyerCommunityForum />);

        fireEvent.click(screen.getByText('forum.createPoll'));
        await screen.findByLabelText('Create Poll');

        fireEvent.click(screen.getByText('forum.postPoll'));

        expect(await screen.findByText('forum.error.formInvalid')).toBeInTheDocument();
    });

    it('limits poll options to max 10', async () => {
        jest.spyOn(PremiumFeatureModule, 'PremiumFeature').mockImplementation(({ children }) => <>{children}</>);
        render(<BuyerCommunityForum />);

        fireEvent.click(screen.getByText('forum.createPoll'));
        await screen.findByLabelText('Create Poll');

        for (let i = 0; i < 8; i++) {
            fireEvent.click(screen.getByText('forum.addPollOption'));
        }

        expect(screen.getAllByPlaceholderText(/forum.pollOptionPlaceholder/i)).toHaveLength(10);
    });

    it('validates thread creation form - empty title triggers error', async () => {
        render(<BuyerCommunityForum />);

        fireEvent.click(screen.getByText('forum.createThread'));
        await screen.findByLabelText('Create New Thread');

        fireEvent.change(screen.getByPlaceholderText('forum.threadContentPlaceholder'), {
            target: { value: 'Content with no title' }
        });
        fireEvent.click(screen.getByText('forum.postThread'));

        expect(await screen.findByText('forum.error.formInvalid')).toBeInTheDocument();
    });

    it('supports language switching (mocked)', () => {
        jest.mocked(MultiLanguageSupport.useLanguage).mockReturnValue({
            getTranslation: (key: string) => `ES_${key}`,
            currentLanguage: 'es'
        });
        render(<BuyerCommunityForum />);
        expect(screen.getByText('ES_forum.title')).toBeInTheDocument();
    });
});
```

Key changes and considerations:

1. File extension changed from `.jsx` to `.tsx` to reflect TypeScript usage with JSX.

2. Added type annotations to the `getTranslation` function in the mock for `MultiLanguageSupport.useLanguage`. The `key` parameter is typed as `string`.

3. No other explicit type annotations were added as the existing code doesn't require them for type safety. The TypeScript compiler can infer most types from the existing usage.

4. The structure, imports, and exports remain unchanged to preserve the ESM shape and functionality.

5. No runtime changes were made; the behavior of the tests should remain identical to the original JavaScript version.

This conversion maintains the original functionality while adding minimal TypeScript typing where necessary. The code remains idiomatic TypeScript and should compile without errors or warnings, assuming the referenced components and modules are properly typed.
