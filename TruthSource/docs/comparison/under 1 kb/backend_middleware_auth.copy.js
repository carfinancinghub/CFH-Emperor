// File: backend/middleware/auth.js

const jwt = require('jsonwebtoken'); // Ensure you have this installed: npm install jsonwebtoken

const auth = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: 'Authentication required' });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Your JWT secret should be in .env
    req.user = decoded;  // Attach the decoded user data to the request object
    next();  // Call the next middleware/route handler
  } catch (err) {
    res.status(401).send({ error: 'Invalid or expired token' });
  }
};

module.exports = auth;
