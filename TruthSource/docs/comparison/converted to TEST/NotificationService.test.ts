// ========== PART 1: BACKEND - NotificationService.test.ts ==========
// File Path: backend/src/services/__tests__/NotificationService.test.ts

// --- Mocks for Backend Test ---
jest.mock('@/events', () => ({ eventEmitter: new EventEmitter() }));
jest.mock('@/services/WebSocketService', () => ({ emitToUser: jest.fn() }));
jest.mock('@/models/Notification', () => jest.fn().mockImplementation(() => ({ save: jest.fn() })));
jest.mock('@utils/logger');
import { eventEmitter } from '@/events';


describe('Backend: NotificationService', () => {
  it('should listen for a "dispute.resolved" event and send a notification', async () => {
    // Initialize the service to start listening
    const serviceInstance = new NotificationService();
    
    // Act: Emit a domain event that the service should be listening for
    eventEmitter.emit('dispute.resolved', {
      disputeId: 'disp-123',
      winningPartyId: 'user-abc',
    });

    // Assert
    await new Promise(process.nextTick); // Allow event handler to run

    expect(Notification).toHaveBeenCalledWith(expect.objectContaining({
      user: 'user-abc',
      title: 'Dispute Resolved',
    }));
    
    expect(WebSocketService.emitToUser).toHaveBeenCalledWith(
      'user-abc',
      'notification:new',
      expect.any(Object)
    );
  });
});
