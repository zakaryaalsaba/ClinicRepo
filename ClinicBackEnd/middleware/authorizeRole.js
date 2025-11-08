// middleware/authorizeRole.js
export const authorizeRole = (allowedRoles = []) => {
    return (req, res, next) => {
      try {
        const userRole = req.user?.role;
  
        if (!userRole)
          return res.status(401).json({ message: 'Unauthorized - No user role found' });
  
        if (!allowedRoles.includes(userRole))
          return res.status(403).json({ message: 'Access denied - insufficient permissions' });
  
        next();
      } catch (error) {
        console.error('Error in authorizeRole:', error);
        res.status(500).json({ message: 'Server error' });
      }
    };
  };  