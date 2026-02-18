const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verifies JWT token and attaches decoded user data to request
 * Assumes request headers contain 'Authorization: Bearer <token>' and JWT_SECRET is configured
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("No token provided");

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = verifyToken;