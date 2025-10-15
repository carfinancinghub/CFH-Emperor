// ----------------------------------------------------------------------
// File: Notification.test.ts
// Path: This file represents tests for two separate modules:
//       - backend/src/services/__tests__/NotificationService.test.ts
//       - frontend/src/features/notifications/__tests__/NotificationCenter.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:40 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { EventEmitter } from 'events';
import NotificationService from '@/services/NotificationService';
import NotificationCenter from '@/features/notifications/NotificationCenter';
import WebSocketService from '@/services/WebSocketService';
import Notification from '@/models/Notification';

// ========== PART 1: BACKEND - NotificationService.test.ts ==========
jest.mock('@/events', () => ({ eventEmitter: new EventEmitter() }));
jest.mock('@/services/WebSocketService', () => ({ emitToUser: jest.fn() }));
jest.mock('@/models/Notification', () => jest.fn().mockImplementation(() => ({ save: jest.fn() })));
import { eventEmitter } from '@/events';


describe('Backend: NotificationService', () => {
  it('should listen for a "dispute.resolved" event and send a notification', async () => {
    const serviceInstance = new NotificationService();
    eventEmitter.emit('dispute.resolved', { disputeId: 'disp-123', winningPartyId: 'user-abc' });
    await new Promise(process.nextTick); // Allow event handler to run
    expect(Notification).toHaveBeenCalledWith(expect.objectContaining({ user: 'user-abc', title: 'Dispute Resolved' }));
    expect(WebSocketService.emitToUser).toHaveBeenCalledWith('user-abc', 'notification:new', expect.any(Object));
  });
});


// ========== PART 2: FRONTEND - NotificationCenter.test.tsx ==========
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('socket.io-client', () => ({ io: jest.fn(() => ({ on: jest.fn(), disconnect: jest.fn() })) }));

describe('Frontend: NotificationCenter Component', () => {
  it('should fetch and display initial notifications', async () => {
    const mockNotifications = [{ _id: '1', title: 'First', message: 'Hello', read: true }];
    mockedAxios.get.mockResolvedValue({ data: mockNotifications });
    render(<NotificationCenter />);
    expect(await screen.findByText('First')).toBeInTheDocument();
    expect(screen.getByText('First').closest('li')).toHaveClass('opacity-60');
  });
});