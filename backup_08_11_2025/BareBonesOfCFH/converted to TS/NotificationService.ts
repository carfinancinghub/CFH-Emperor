// ========== PART 1: BACKEND - NotificationService.ts ==========
// Path: backend/src/services/NotificationService.ts

import { eventEmitter } from '@/events'; // A standard Node.js event emitter
import WebSocketService from '@/services/WebSocketService';
import Notification from '@/models/Notification';
import logger from '@/utils/logger';

class NotificationService {
  constructor() {
    this.listenForEvents();
  }

  // Listen for business events from other parts of the application
  private listenForEvents() {
    eventEmitter.on('dispute.resolved', this.handleDisputeResolved);
    // ... other event listeners like 'bid.placed', 'auction.won'
  }

  // Event handler for when a dispute is resolved
  private async handleDisputeResolved(payload: { disputeId: string; winningPartyId: string; }) {
    const { disputeId, winningPartyId } = payload;
    const notification = new Notification({
      user: winningPartyId,
      title: 'Dispute Resolved',
      message: `Congratulations! The dispute #${disputeId} has been resolved in your favor.`,
      link: `/disputes/${disputeId}`,
      type: 'dispute_win',
    });
    await this.sendNotification(notification);
  }

  // Central function to save and dispatch a notification
  private async sendNotification(notification: any) {
    try {
      await notification.save();
      // Dispatch via WebSocket for real-time update
      WebSocketService.emitToUser(notification.user.toString(), 'notification:new', notification);
      logger.info(`Notification sent to user ${notification.user}`);
    } catch (err) {
      logger.error('Failed to send notification:', err);
    }
  }
}
// Initialize the service so it starts listening for events
export default new NotificationService();
