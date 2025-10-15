// File: server.ts
// Path: backend/src/server.ts
// Purpose: The main entry point for the backend application.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — Secure, Scalable, and Resilient by design.

// TODO:
// @free:
//   - [ ] For even cleaner organization, move all route registrations into a dedicated file (e.g., `src/routes/index.ts`) that this file can import and use.
// @premium:
//   - [ ] ✨ Integrate a dedicated health check endpoint (e.g., GET /health) that monitoring services can use to verify application and database status.
// @wow:
//   - [ ] 🚀 Architect a migration path from this monolithic server to a microservices architecture. This would involve breaking down routes and services (e.g., 'auth-service', 'auction-service', 'messaging-service') into independently deployable applications for ultimate scalability and resilience.

import express, { Application } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cluster from 'cluster';
import os from 'os';
import 'dotenv/config';

import allRoutes from './routes'; // Assuming a central route file
import errorHandler from './middleware/errorHandler';

const numCPUs = os.cpus().length;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

if (cluster.isPrimary) {
  console.log(`🚀 Master process ${process.pid} is running`);

  // Fork workers for each CPU core for maximum performance
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });

} else {
  // This is a worker process, it will run the server
  const app: Application = express();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // --- ARCHITECTURAL UPGRADE: Global Security Middleware ---
  app.use(helmet());
  app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
  
  // Standard Middleware
  app.use(express.json());

  // Make io accessible in routes
  app.set('socketio', io);

  // Register All API Routes
  app.use('/api', allRoutes);

  // Global Error Handling Middleware (must be last)
  app.use(errorHandler);

  // --- Database Connection ---
  mongoose.connect(process.env.MONGO_URI || '')
    .then(() => console.log(`Worker ${process.pid}: MongoDB connected`))
    .catch(err => console.error(`Worker ${process.pid}: MongoDB connection error:`, err));

  // --- Start Server ---
  server.listen(PORT, () => {
    console.log(`✅ Worker ${process.pid} started. Server running on port ${PORT}`);
  });
  
  // --- WebSocket Connection Logic ---
  io.on('connection', (socket) => {
    console.log(`🧩 Worker ${process.pid}: User connected ${socket.id}`);
    // ... your socket event listeners here ...
  });

  // --- ARCHITECTURAL UPGRADE: Graceful Shutdown ---
  const gracefulShutdown = () => {
    console.log(`Worker ${process.pid} is shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', gracefulShutdown); // For production (e.g., Docker, Kubernetes)
  process.on('SIGINT', gracefulShutdown);  // For development (Ctrl+C)
}