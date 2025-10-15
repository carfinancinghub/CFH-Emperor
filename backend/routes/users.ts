// @ai-generated via ai-orchestrator
This conversion targets Node.js Express environment using CommonJS module resolution for the export structure (`export = router`), while leveraging standard TypeScript imports and custom type definitions for `express.Request`.

### File: `backend/routes/users.ts`

```typescript
import express, { Router, Request, Response } from 'express';
// Assuming module resolution handles '@/...'
import { authenticateUser } from '@/middleware/authMiddleware';
// Assuming '@/models/User' exports the Mongoose Model
// We don't need to define the full Mongoose interface here, 
// but we rely on its functionality (like .findById(), .save(), .select()).
import User from '@/models/User'; 

// --- Custom Request Typing ---
// Define the payload structure added to the request object by authenticateUser
interface AuthPayload {
  id: string; // Assuming ID is a string (e.g., Mongoose ObjectId converted to string)
}

// Extend the Express Request object to include the 'user' payload
interface AuthenticatedRequest extends Request {
  user: AuthPayload;
}
// -----------------------------

const router: Router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // req.user.id is guaranteed by the authenticateUser middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    // Use 500 status for unexpected server issues
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // We expect the body to potentially contain username and/or email
    interface UpdateBody {
        username?: string;
        email?: string;
    }

    const { username, email } = req.body as UpdateBody;
    
    // Find the user document
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Apply updates only if the values are present in the request body
    if (username) {
        user.username = username;
    }
    if (email) {
        user.email = email;
    }

    // Save the updated Mongoose document
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Preserves the original `module.exports = router;` CJS structure
export = router;
```