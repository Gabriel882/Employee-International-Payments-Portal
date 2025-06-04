const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Expect Authorization: Bearer <token>
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token part

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token payload to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
