// File: RiskAssessmentEngine.test.ts
// Path: backend/utils/RiskAssessmentEngine.test.ts
// Author: Cod5 (07212245, July 21, 2025, 22:45 PDT)
// Purpose: Unit tests and snapshot tests for RiskAssessmentEngine.ts to ensure reliable vehicle risk prediction, dispute integration, and output consistency

import { analyzeVehicleRisk, integrateDisputeHistory, fetchDisputeOutcome, subscribeToRealTimeUpdates } from '@utils/RiskAssessmentEngine';
import axios from '@utils/axios';
import { fetchVehicleHistory } from '@utils/vehicleUtils';
import { fetchDisputeHistory } from '@utils/disputeUtils';
import { subscribeToWebSocket } from '@lib/websocket';
import { logError } from '@utils/logger';

// Mock dependencies
jest.mock('@utils/axios', () => ({ get: jest.fn() }));
jest.mock('@utils/vehicleUtils', () => ({ fetchVehicleHistory: jest.fn() }));
jest.mock('@utils/disputeUtils', () => ({ fetchDisputeHistory: jest.fn() }));
jest.mock('@lib/websocket', () => ({ subscribeToWebSocket: jest.fn() }));
jest.mock('@utils/logger', () => ({ logError: jest.fn() }));

describe('RiskAssessmentEngine', () => {
  const mockVehicleData = {
    vehicleId: 'VIN123',
    mileage: 50000,
    age: 5,
    accidentCount: 0,
  };
  const mockDisputeData = {
    vehicleId: 'VIN123',
    disputeCount: 1,
    severity: 'Medium',
  };
  const mockDisputeOutcome = {
    disputeId: 'DISPUTE1',
    outcome: 'resolved-for',
    voteCounts: { for: 2, against: 1 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchVehicleHistory as jest.Mock).mockResolvedValue(mockVehicleData);
    (fetchDisputeHistory as jest.Mock).mockResolvedValue(mockDisputeData);
    (axios.get as jest.Mock).mockResolvedValue({ data: mockDisputeOutcome });
    (subscribeToWebSocket as jest.Mock).mockReturnValue(jest.fn());
  });

  it('predicts low risk for new vehicle with no accidents', async () => {
    const result = await analyzeVehicleRisk(mockVehicleData, false);
    expect(result).toEqual({
      vehicleId: 'VIN123',
      riskScore: 'Low',
      riskFactors: [],
    });
  });

  it('predicts high risk for old vehicle with accidents', async () => {
    const highRiskData = { ...mockVehicleData, mileage: 150000, age: 10, accidentCount: 2 };
    const result = await analyzeVehicleRisk(highRiskData, false);
    expect(result).toEqual({
      vehicleId: 'VIN123',
      riskScore: 'High',
      riskFactors: ['High mileage', 'Old vehicle', '2 accident(s)'],
    });
  });

  it('integrates dispute history and outcome for Enterprise users', async () => {
    const result = await analyzeVehicleRisk(mockVehicleData, true);
    expect(fetchDisputeHistory).toHaveBeenCalledWith('VIN123');
    expect(axios.get).toHaveBeenCalledWith('/api/disputes/VIN123/outcome');
    expect(result).toEqual({
      vehicleId: 'VIN123',
      riskScore: 'Medium',
      riskFactors: ['1 dispute(s) with Medium severity', 'Dispute outcome: resolved-for'],
    });
  });

  it('subscribes to real-time updates for Enterprise users', () => {
    const callback = jest.fn();
    const unsubscribe = subscribeToRealTimeUpdates('VIN123', callback);
    expect(subscribeToWebSocket).toHaveBeenCalledWith('risk-updates/VIN123', expect.any(Function));
    expect(unsubscribe).toBeInstanceOf(Function);
  });

  it('handles errors in risk analysis', async () => {
    (fetchVehicleHistory as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    await expect(analyzeVehicleRisk(mockVehicleData, false)).rejects.toThrow('Failed to analyze vehicle risk.');
    expect(logError).toHaveBeenCalled();
  });

  it('handles errors in dispute outcome fetch', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    await expect(fetchDisputeOutcome('VIN123')).rejects.toThrow('Failed to fetch dispute outcome.');
    expect(logError).toHaveBeenCalled();
  });

  it('matches snapshot for free risk prediction', async () => {
    const result = await analyzeVehicleRisk(mockVehicleData, false);
    expect(result).toMatchSnapshot();
  });

  it('matches snapshot for Enterprise risk prediction with dispute data', async () => {
    const result = await analyzeVehicleRisk(mockVehicleData, true);
    expect(result).toMatchSnapshot();
  });

  // === TODOs and Suggestions ===
  // - Add tests for dispute outcome edge cases (e.g., undecided outcomes).
  // - Mock WebSocket events for real-time update testing.
  // - Integrate with a risk analytics dashboard for visualization.
});