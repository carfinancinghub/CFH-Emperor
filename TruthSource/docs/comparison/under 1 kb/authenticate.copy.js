// File: server/middleware/authorize.js

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    const role = req.user.role;
    console.log(`🔐 authorize(): Role = ${role}, Allowed = ${allowedRoles}`);

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: `Forbidden: ${role} not allowed` });
    }

    next();
  };
};

module.exports = authorize;
