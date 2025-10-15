// File: theme.test.ts
// Path: frontend/src/styles/__tests__/theme.test.ts
// Purpose: Ensures the integrity of the centralized theme object.

import { theme, Theme } from '../theme';

describe('Design System Theme Object', () => {

  // Test 1: Ensure the theme object is defined and is not empty.
  it('should be a defined object', () => {
    expect(theme).toBeDefined();
    expect(theme).not.toBeNull();
    expect(typeof theme).toBe('object');
  });

  // Test 2: Check for the existence and correct type of key properties.
  it('should contain key styling properties as strings', () => {
    // Check a few representative keys from each category
    expect(typeof theme.errorText).toBe('string');
    expect(typeof theme.primaryButton).toBe('string');
    expect(typeof theme.cardShadow).toBe('string');
    expect(typeof theme.focusRing).toBe('string');
  });

  // Test 3: Ensure there are no undefined properties, which could indicate a typo.
  it('should not have any undefined values', () => {
    for (const key in theme) {
      expect(theme[key as keyof Theme]).toBeDefined();
    }
  });

});