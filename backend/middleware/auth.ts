/**
 * Auth Middleware (TypeScript)
 * ----------------------------
 * - Path: backend/middleware/auth.ts
 * This middleware authenticates requests using JWT tokens.
 * - Reads the token from the Authorization header.
 * - Verifies the token using the JWT secret.
 * - Attaches the decoded user info to req.user.
 * - Responds with 401 if authentication fails.
 * - Checks user tier for access control (TODO).
 * - Restricts or allows access to certain routes/features based on tier.
 * - Logs access attempts for auditing (TODO).
 * - Provides a structured way to handle authentication in Express applications.
 * - Ensures that only authenticated users can access protected routes.
 * Usage:
 * - Protect routes that require authentication by adding this middleware.
 * 
 * TODO (Tier-based access):
 * - Integrate user tiers (free, premium, Wow ++).
 * - Check user's tier from decoded token or database.
 * - Restrict or allow access to certain routes/features based on tier.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
interface DecodedUser {
    id: string;
    email: string;
    tier?: 'free' | 'premium' | 'Wow ++';
    // Add other properties from your JWT payload as needed
    [key: string]: any;
}

interface AuthenticatedRequest extends Request {
    user?: DecodedUser;
}

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).send({ error: 'Authentication required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedUser;
        req.user = decoded;

        // TODO: Check user tier here (free, premium, Wow ++)
        // Example: if (req.user.tier !== 'premium') { ... }

        next();
    } catch (err) {
        res.status(401).send({ error: 'Invalid or expired token' });
    }
};

export default auth;