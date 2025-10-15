// File: server/middleware/authorize.js
// ✅ Enhanced logging and clarity for debugging admin access

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.warn('⚠️ authorize(): No user attached to request');
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    const userRole = req.user.role;
    console.log(`🔐 authorize(): Role = ${userRole}, Allowed = ${allowedRoles.join(', ')}`);

    if (!allowedRoles.includes(userRole)) {
      console.warn(`❌ Forbidden: Role '${userRole}' not in allowed roles: [${allowedRoles.join(', ')}]`);
      return res.status(403).json({ message: `Forbidden: ${userRole} not allowed` });
    }

    next();
  };
};

module.exports = authorize;
