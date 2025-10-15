// ----------------------------------------------------------------------
// File: RecommendationEngine.test.ts
// Path: backend/services/ai/__tests__/RecommendationEngine.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A test suite for the modular, strategy-based RecommendationEngine.
//
// @architectural_notes
// - **Testing a Strategy Pattern**: The tests focus on the engine's primary
//   responsibility: dispatching to the correct provider. We mock the providers
//   themselves to test this orchestration logic in isolation.
// - **Configuration-Driven Tests**: The tests control the environment variable
//   `ENABLE_AI_RECOMMENDATIONS` to verify that the engine's behavior can be
//   changed via configuration, a key feature of our design.
//
// ----------------------------------------------------------------------

import RecommendationEngine from '../RecommendationEngine';
import db from '@/services/db';

// --- Mocks ---
// Mock the entire module to spy on the internal providers
jest.mock('../RecommendationEngine', () => {
  const originalModule = jest.requireActual('../RecommendationEngine');
  return {
    ...originalModule,
    DefaultRulesProvider: {
      generate: jest.fn(),
    },
    MachineLearningProvider: {
      generate: jest.fn(),
    },
  };
});
// Need to import the mocked providers after the mock is defined
import { DefaultRulesProvider, MachineLearningProvider } from '../RecommendationEngine';

jest.mock('@/services/db');

describe('RecommendationEngine Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv }; // Reset environment variables
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original environment
  });

  it('should use the DefaultRulesProvider when the AI feature flag is off', async () => {
    process.env.ENABLE_AI_RECOMMENDATIONS = 'false';
    (db.getSellerAuctions as jest.Mock).mockResolvedValue([{ status: 'sold' }]);
    (DefaultRulesProvider.generate as jest.Mock).mockResolvedValue([{ advice: 'Rule-based advice' }]);
    
    const recommendations = await RecommendationEngine.generate('seller-123');

    expect(DefaultRulesProvider.generate).toHaveBeenCalledTimes(1);
    expect(MachineLearningProvider.generate).not.toHaveBeenCalled();
    expect(recommendations[0].advice).toBe('Rule-based advice');
  });

  it('should use the MachineLearningProvider (Wow++) when the AI feature flag is on', async () => {
    process.env.ENABLE_AI_RECOMMENDATIONS = 'true';
    (db.getSellerAuctions as jest.Mock).mockResolvedValue([{ status: 'sold' }]);
    (MachineLearningProvider.generate as jest.Mock).mockResolvedValue([{ advice: 'AI-powered advice' }]);

    const recommendations = await RecommendationEngine.generate('seller-123');

    expect(MachineLearningProvider.generate).toHaveBeenCalledTimes(1);
    expect(DefaultRulesProvider.generate).not.toHaveBeenCalled();
    expect(recommendations[0].advice).toBe('AI-powered advice');
  });

  it('should return a default message if a seller has no auction history', async () => {
    (db.getSellerAuctions as jest.Mock).mockResolvedValue([]);
    
    const recommendations = await RecommendationEngine.generate('seller-new');

    expect(recommendations[0].advice).toContain('Not enough auction data');
  });
});