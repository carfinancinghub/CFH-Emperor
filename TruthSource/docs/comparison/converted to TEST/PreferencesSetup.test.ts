// ----------------------------------------------------------------------
// File: PreferencesSetup.test.ts
// Path: backend/src/services/onboarding/__tests__/PreferencesSetup.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the robust, schema-driven user preferences service.
//
// @architectural_notes
// - **Testing Declarative Validation (Zod)**: The core of this test suite
//   is to validate our Zod schema. We test that it correctly allows valid
//   data structures while strictly rejecting any data that is malformed or
//   contains unapproved fields. This proves our data integrity layer is working.
//
// ----------------------------------------------------------------------

import PreferencesSetup from '../PreferencesSetup';
import db from '@/services/db';
import { ZodError } from 'zod';

// --- Mocks ---
jest.mock('@/services/db');
jest.mock('@utils/logger');


describe('PreferencesSetup Service', () => {
  
  const mockUser = { _id: 'user-123' };

  beforeEach(() => {
    jest.clearAllMocks();
    (db.getUser as jest.Mock).mockResolvedValue(mockUser);
  });

  describe('setPreferences', () => {
    it('should successfully update preferences with valid data', async () => {
      const validPrefs = {
        currency: 'CAD',
        priceRange: { min: 10000, max: 50000 },
      };

      const result = await PreferencesSetup.setPreferences('user-123', validPrefs);

      expect(result.status).toBe('preferences_set');
      expect(db.updateUser).toHaveBeenCalledWith('user-123', { preferences: validPrefs });
    });

    it('should throw a validation error if an extra, unallowed field is provided', async () => {
      const invalidPrefs = {
        currency: 'USD',
        theme: 'dark', // This field is not in the schema
      };

      await expect(PreferencesSetup.setPreferences('user-123', invalidPrefs)).rejects.toThrow('Invalid preference data provided.');
    });

    it('should throw a validation error if a field has the wrong data type', async () => {
      const invalidPrefs = {
        priceRange: 'cheap', // Should be an object
      };

      await expect(PreferencesSetup.setPreferences('user-1c23', invalidPrefs)).rejects.toThrow('Invalid preference data provided.');
    });

    it('should throw an error if the user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValue(null);
      await expect(PreferencesSetup.setPreferences('user-not-found', {})).rejects.toThrow('User not found');
    });
  });

  describe('getDefaultPreferences', () => {
    it('should return the correct default preference object', async () => {
      const defaults = await PreferencesSetup.getDefaultPreferences();
      expect(defaults.currency).toBe('USD');
      expect(defaults.priceRange?.max).toBe(100000);
    });
  });
});