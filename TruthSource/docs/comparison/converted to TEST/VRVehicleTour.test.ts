/*
 * File: VRVehicleTour.test.ts
 * Path: C:\CFH\backend\tests\services\premium\VRVehicleTour.test.ts
 * Created: 2025-07-25 16:30 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the VRVehicleTour service.
 * Artifact ID: test-svc-vr-vehicle-tour
 * Version ID: test-svc-vr-vehicle-tour-v1.0.0
 */

import { VRVehicleTour } from '@services/premium/VRVehicleTour';
import { VRService } from '@services/vr/VRService';

// Mock dependencies
jest.mock('@utils/logger');
jest.mock('@services/vr/VRService');
jest.mock('@services/db', () => ({
    getUser: jest.fn(),
    getVehicle: jest.fn(),
}));

describe('VRVehicleTour Service', () => {
  const db = require('@services/db');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createVRTour', () => {
    it('should throw an error if user is not premium', async () => {
      db.getUser.mockResolvedValue({ isPremium: false });
      await expect(VRVehicleTour.createVRTour('freeUser', 'vehicle123')).rejects.toThrow('Premium access required');
    });

    it('should throw an error if vehicle is not found', async () => {
      db.getUser.mockResolvedValue({ isPremium: true });
      db.getVehicle.mockResolvedValue(null);
      await expect(VRVehicleTour.createVRTour('premiumUser', 'badVehicleId')).rejects.toThrow('Vehicle not found');
    });

    it('should create a VR tour for a premium user', async () => {
      db.getUser.mockResolvedValue({ isPremium: true });
      db.getVehicle.mockResolvedValue({ model: 'Sedan', interiorImages: [] });
      (VRService.createVehicleTour as jest.Mock).mockResolvedValue({ id: 'tour123', url: 'http://vr.url' });

      const result = await VRVehicleTour.createVRTour('premiumUser', 'vehicle123');
      
      expect(result).toEqual({ tourId: 'tour123', vrTourUrl: 'http://vr.url' });
      expect(VRService.createVehicleTour).toHaveBeenCalled();
    });
  });
});
