// ----------------------------------------------------------------------
// File: WebSocketService.test.ts
// Path: backend/src/services/__tests__/WebSocketService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 08:28 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the singleton WebSocketService.
//
// @architectural_notes
// - **Testing a Singleton**: The tests verify that no matter how many times
//   the service is "initialized," only one instance is ever created.
// - **Mocking the Server**: We use a mock 'socket.io' server to test that our
//   service's methods (like 'emitToUser') correctly call the underlying
//   library's functions with the right parameters.
//
// ----------------------------------------------------------------------

import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import WebSocketService from '../WebSocketService';

// --- Mocks ---
jest.mock('socket.io');
jest.mock('redis', () => ({ createClient: jest.fn() }));
jest.mock('@socket.io/redis-adapter', () => ({ createAdapter: jest.fn() }));

describe('WebSocketService', () => {
  const mockHttpServer = {} as HttpServer;

  // We need to reset the singleton instance between tests
  beforeEach(() => {
    (WebSocketService as any).instance = null;
    (Server as jest.mock).mockClear();
  });

  it('should be a singleton, creating only one instance', () => {
    const instance1 = WebSocketService.getInstance(mockHttpServer);
    const instance2 = WebSocketService.getInstance(mockHttpServer);

    expect(instance1).toBe(instance2);
    // The Server constructor should only have been called once
    expect(Server).toHaveBeenCalledTimes(1);
  });
  
  it('should have an "io" property which is an instance of the Socket.IO Server', () => {
    const service = WebSocketService.getInstance(mockHttpServer);
    expect(service.io).toBeInstanceOf(Server);
  });
  
  it('should call the io.to().emit() method for emitToUser', () => {
    const service = WebSocketService.getInstance(mockHttpServer);
    const mockEmit = jest.fn();
    const mockTo = jest.fn(() => ({ emit: mockEmit }));
    (service.io.to as jest.Mock) = mockTo; // Attach mock to the instance

    service.emitToUser('user-123', 'new_message', { content: 'hello' });
    
    expect(mockTo).toHaveBeenCalledWith('user-123');
    expect(mockEmit).toHaveBeenCalledWith('new_message', { content: 'hello' });
  });
});