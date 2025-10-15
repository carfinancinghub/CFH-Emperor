// File: SmartDelayPredictor.test.ts
// Path: backend/utils/__tests__/SmartDelayPredictor.test.ts
// Purpose: Unit tests for the statistical and future ML delay prediction utilities.

import { predictDelay, predictDelayV2 } from '../SmartDelayPredictor';

describe('SmartDelayPredictor V1 (Statistical)', () => {

  it('should return 0 delay and 0 confidence for empty history', () => {
    const result = predictDelay('delivery-1', []);
    expect(result).toEqual({
      deliveryId: 'delivery-1',
      predictedDelay: '0 min',
      confidence: 0,
    });
  });

  it('should return 0 delay and 100 confidence for history with no delays', () => {
    const history = [{ actualDelayMinutes: 0 }, { actualDelayMinutes: 0 }];
    const result = predictDelay('delivery-2', history);
    expect(result).toEqual({
      deliveryId: 'delivery-2',
      predictedDelay: '0 min',
      confidence: 100,
    });
  });

  it('should calculate the average delay correctly', () => {
    const history = [{ actualDelayMinutes: 10 }, { actualDelayMinutes: 20 }, { actualDelayMinutes: 30 }];
    const result = predictDelay('delivery-3', history);
    expect(result.predictedDelay).toBe('20 min');
  });

  it('should have 100 confidence for consistent, non-zero delays', () => {
    const history = [{ actualDelayMinutes: 15 }, { actualDelayMinutes: 15 }, { actualDelayMinutes: 15 }];
    const result = predictDelay('delivery-4', history);
    expect(result.predictedDelay).toBe('15 min');
    expect(result.confidence).toBe(100);
  });

  it('should have lower confidence for inconsistent delays', () => {
    const history = [{ actualDelayMinutes: 5 }, { actualDelayMinutes: 15 }, { actualDelayMinutes: 25 }]; // StdDev is ~8.16
    const result = predictDelay('delivery-5', history);
    expect(result.predictedDelay).toBe('15 min');
    expect(result.confidence).toBe(92); // 100 - round(8.16) = 92
  });
});

describe('SmartDelayPredictor V2 (Machine Learning Placeholder)', () => {
    
  it('should return the placeholder prediction data', async () => {
    const mockContext = {
      route: { from: 'LAX', to: 'JFK' },
      timeOfDay: 'morning',
      weatherConditions: 'clear',
    } as const;

    const result = await predictDelayV2('delivery-6', mockContext);
    expect(result).toEqual({
      deliveryId: 'delivery-6',
      predictedDelay: '12 min',
      confidence: 95,
    });
  });
});