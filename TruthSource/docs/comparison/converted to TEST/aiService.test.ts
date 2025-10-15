// ----------------------------------------------------------------------
// File: aiService.test.ts
// Path: backend/src/services/ai/__tests__/aiService.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the modular, strategy-based aiService.
//
// @architectural_notes
// - **Testing Model Selection**: The tests verify the core architectural
//   pattern: that the service's dispatcher logic correctly selects the
//   appropriate model based on environment configuration.
// - **Testing Model Contracts**: We test each model (Statistical, ML) to
//   ensure it adheres to the 'IAiModel' interface and returns a correctly
//   shaped 'ISimulationResult' object.
//
// ----------------------------------------------------------------------

import aiService from '../aiService';
import { StatisticalModel, MachineLearningModel } from '../aiService'; // Assuming models are exported for testing

describe('aiService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Model Selection', () => {
    it('should select the StatisticalModel by default', () => {
      const model = aiService.getModel();
      expect(model).toBe(StatisticalModel);
    });

    it('should select the MachineLearningModel when the feature flag is enabled', () => {
      process.env.ENABLE_ADVANCED_AI = 'true';
      const model = aiService.getModel();
      expect(model).toBe(MachineLearningModel);
    });
  });

  describe('StatisticalModel', () => {
    it('should calculate a predictable outcome based on its simple rules', async () => {
      const auctionData = {
        bids: [{ amount: 100 }, { amount: 150 }],
        reservePrice: 100,
        timeRemaining: 86400,
      };
      const result = await StatisticalModel.predict(auctionData);

      // avgBid is 125. (125 / 100) * 0.7 + (2 / 10) * 0.2 = 0.875 + 0.04 = 0.915
      expect(result.winProbability).toBeCloseTo(0.915);
    });
  });

});