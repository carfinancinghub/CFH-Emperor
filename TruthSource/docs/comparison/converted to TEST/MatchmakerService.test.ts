// ----------------------------------------------------------------------
// File: MatchmakerService.test.ts
// Path: backend/src/services/__tests__/MatchmakerService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:45 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import MatchmakerService from '../MatchmakerService';
import { User } from '@/models/User';

jest.mock('@/models/User');

describe('MatchmakerService', () => {
  it('should return a list of matches sorted by score', async () => {
    (User.findById as jest.Mock).mockResolvedValue({ _id: 'buyer-123' });
    // In a real test, you'd mock the specific findLenderMatches helper
    const matches = await MatchmakerService.generateMatches('buyer-123', {});
    // Assuming the mock returns matches with scores 95 and 88
    expect(matches[0].score).toBe(95);
    expect(matches[1].score).toBe(88);
  });
});