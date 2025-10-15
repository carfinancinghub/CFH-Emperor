// ----------------------------------------------------------------------
// File: NotificationService.ts
// Path: backend/services/NotificationService.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:31 PDT
// Version: 1.0.1 (Added Initialization Note)
// ----------------------------------------------------------------------
// @description Service for sending push notifications via FCM.
// @dependencies firebase-admin node-cron @models/User @models/Auction @services/HistoryService
// ----------------------------------------------------------------------
import { getMessaging } from 'firebase-admin/messaging';
import cron from 'node-cron';
import User from '@models/User';
import Auction from '@models/Auction';
import HistoryService from '@services/HistoryService';

// NOTE: Initialize firebase-admin in app entry (e.g., server.ts)
// import admin from 'firebase-admin';
// admin.initializeApp({ credential: admin.credential.cert(require('./serviceAccount.json')) });

const NotificationService = {
  async sendNotification(tokens: string[], title: string, body: string, url: string) {
    if (tokens.length === 0) return;

    const message = {
      notification: { title, body },
      webpush: { fcmOptions: { link: url } },
      tokens,
    };

    try {
      const response = await getMessaging().sendMulticast(message);
      await HistoryService.logAction('system', 'SEND_NOTIFICATION', { successCount: response.successCount, failureCount: response.failureCount });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  scheduleAuctionEndReminders() {
    cron.schedule('*/15 * * * *', async () => {
      const now = new Date();
      const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

      const endingAuctions = await Auction.find({
        endTime: { $gte: now, $lte: inOneHour },
        status: 'ACTIVE'
      }).populate('listing', 'make model year');

      for (const auction of endingAuctions) {
        const watchers = await User.find({ watchlist: auction._id }).select('fcmTokens');
        const tokens = watchers.flatMap(user => user.fcmTokens);
        
        const listingInfo = auction.listing as any;
        const title = 'Auction Ending Soon!';
        const body = `The auction for the ${listingInfo.year} ${listingInfo.make} ${listingInfo.model} is ending in less than an hour!`;
        const url = `/auctions/${auction._id}`;
        
        await this.sendNotification(tokens, title, body, url);
        await HistoryService.logAction('system', 'SCHEDULE_NOTIFICATION', { auctionId: auction._id, type: 'ENDING_SOON' });
      }
    });
  },

  async notifyWatchersOfNewBid(auctionId: string, bidAmount: number) {
    const auction = await Auction.findById(auctionId).populate('listing', 'make model year');
    if (!auction) return;
    
    const watchers = await User.find({ watchlist: auction._id }).select('fcmTokens');
    const tokens = watchers.flatMap(user => user.fcmTokens);

    const listingInfo = auction.listing as any;
    const title = 'New Bid Placed!';
    const body = `A new bid of $${bidAmount.toLocaleString()} was placed on the ${listingInfo.year} ${listingInfo.make} ${listingInfo.model}.`;
    const url = `/auctions/${auction._id}`;
    
    await this.sendNotification(tokens, title, body, url);
  },
};

export default NotificationService;