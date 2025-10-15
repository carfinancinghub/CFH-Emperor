// ----------------------------------------------------------------------
// File: WebSocketService.ts
// Path: backend/src/services/WebSocketService.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 08:28 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A singleton service that manages the application's real-time WebSocket
// server, including connection handling, room management, and broadcasting.
//
// @usage
// This service is initialized once in `server.ts` and attached to the HTTP
// server. Other services (like Notifications or Chat) then import the
// singleton instance to emit events.
// `import WebSocketService from '@/services/WebSocketService';`
// `WebSocketService.emitToUser(userId, event, data);`
//
// @architectural_notes
// - **Singleton Pattern**: The service exports a single, globally accessible
//   instance. This is our standard for managing global, stateful connections
//   like a WebSocket server.
// - **Scalability (Redis Adapter)**: The service is architected to use a Redis
//   adapter. This is a non-negotiable standard for a production application that
//   will run on multiple servers (clustering). It ensures that a message
//   emitted from one server is correctly broadcast to clients connected to
//   any other server in the cluster.
//
// @todos
// - @free:
//   - [ ] Implement a 'user is typing' feature for the chat module.
// - @premium:
//   - [ ] ✨ Add a real-time "presence" system that shows which users are currently online.
// - @wow:
//   - [ ] 🚀 Develop a "live-sync" feature that allows multiple users to collaboratively edit a document (like a dispute claim) in real time.
//
// ----------------------------------------------------------------------

import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server as HttpServer } from 'http';
import logger from '@/utils/logger';

class WebSocketService {
  private static instance: WebSocketService;
  public io: Server;

  private constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: { origin: process.env.FRONTEND_URL },
    });
    
    // ARCHITECTURAL UPGRADE: Use Redis for multi-server scalability
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();
    this.io.adapter(createAdapter(pubClient, subClient));

    logger.info('[WebSocketService] Initialized with Redis adapter.');
    
    this.handleConnections();
  }

  /**
   * Implements the Singleton pattern.
   */
  public static getInstance(httpServer?: HttpServer): WebSocketService {
    if (!WebSocketService.instance) {
      if (!httpServer) {
        throw new Error('HttpServer instance is required to initialize WebSocketService.');
      }
      WebSocketService.instance = new WebSocketService(httpServer);
    }
    return WebSocketService.instance;
  }

  private handleConnections(): void {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`[WebSocketService] User connected: ${socket.id}`);
      
      // Join a room specific to the user's ID for targeted notifications
      const userId = socket.handshake.query.userId as string;
      if (userId) {
        socket.join(userId);
        logger.info(`[WebSocketService] Socket ${socket.id} joined user room: ${userId}`);
      }

      socket.on('disconnect', () => {
        logger.info(`[WebSocketService] User disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Emits an event to a specific user via their user ID room.
   */
  public emitToUser(userId: string, event: string, data: any): void {
    this.io.to(userId).emit(event, data);
  }
}

export default WebSocketService;