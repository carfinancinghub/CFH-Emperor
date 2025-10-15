// @ai-generated via ai-orchestrator
This conversion utilizes modern ES module imports for dependencies and standard TypeScript interfaces for defining the data structures, ensuring strong typing while minimizing explicit annotations on local variables where inference is sufficient.

Since the original code used `require` and `module.exports`, we transition to standard ES `import`/`export` syntax, which is the idiomatic standard in TypeScript and is easily transpiled back to CommonJS if necessary.

### `socket-manager.ts`

```typescript
import { Server, Socket } from 'socket.io';
// We import the standard Node.js HTTP Server type for the 'init' function parameter.
import { Server as HttpServer } from 'http'; 

/**
 * Defines the structure for task data transmitted over the socket.
 */
interface Task {
  taskId: string;
  type: string;
  vehicle: string;
  status: 'assigned' | 'completed' | string;
}

// Type the global instance of the Socket.IO server.
let ioInstance: Server | null = null;

/**
 * Sets up listeners for new client connections and handles task assignments.
 */
const setupTaskSocket = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log('Mechanic connected:', socket.id);
    
    const assignedTask: Task = {
      taskId: 'task_001',
      type: 'inspection',
      vehicle: 'Toyota Camry 2020',
      status: 'assigned'
    };
    
    // Explicitly emit the task data
    socket.emit('task-assigned', assignedTask);
    
    setTimeout(() => {
      // Create a completed task object by spreading the original and updating status
      const completedTask: Task = { ...assignedTask, status: 'completed' };
      socket.emit('task-completed', completedTask);
    }, 5000);
  });
};

/**
 * Initializes the Socket.IO server bound to a specific HTTP server instance.
 * @param server The underlying Node.js HTTP server.
 */
function init(server: HttpServer): void {
  // Use imported Server class instead of runtime require
  ioInstance = new Server(server, { cors: { origin: '*' } });
  setupTaskSocket(ioInstance);
}

/**
 * Emits a general broadcast message to all connected clients.
 * @param message The message content.
 */
function emitToAllClients(message: string): void {
  if (ioInstance) {
    ioInstance.emit('broadcast', message);
  }
}

/**
 * Closes the Socket.IO server connection.
 */
function closeSocketServer(): void {
  if (ioInstance) {
    ioInstance.close();
  }
}

// Preserve the export shape using standard TypeScript module exports.
export {
  init,
  emitToAllClients,
  closeSocketServer
};
```