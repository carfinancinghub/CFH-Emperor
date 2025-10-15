// ----------------------------------------------------------------------
// File: titleService.test.ts
// Path: backend/src/services/__tests__/titleService.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import titleService from '../titleService';
import Title from '@/models/Title';
import SecurityLogger from '@/services/security/SecurityLogger';

jest.mock('@/models/Title');
jest.mock('@/services/security/SecurityLogger', () => ({ logSecurityEvent: jest.fn() }));

describe('titleService', () => {
  it('should throw an error if a non-authorized user tries to complete a transfer', async () => {
    const mockUser = { id: 'user-123', permissions: [] }; // No permission
    await expect(titleService.completeTransfer(mockUser as any, 'title-123'))
      .rejects.toThrow('Forbidden: Not authorized to complete transfers.');
  });
  
  it('should complete a transfer and create an audit log for an authorized user', async () => {
    const mockUser = { id: 'agent-456', permissions: ['can_complete_transfers'] };
    const mockTitle = { _id: 'title-123', status: 'pending', save: jest.fn() };
    (Title.findById as jest.Mock).mockResolvedValue(mockTitle);
    
    await titleService.completeTransfer(mockUser as any, 'title-123');
    
    expect(mockTitle.status).toBe('clear');
    expect(mockTitle.save).toHaveBeenCalled();
    expect(SecurityLogger.logSecurityEvent).toHaveBeenCalledWith(
      'ADMIN_COMPLETED_TRANSFER', 'INFO', { adminId: 'agent-456', targetTitleId: 'title-123' }
    );
  });
});