import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Protect routes (Requires a valid JWT)
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      // Decode the token using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database, excluding the password field
      req.user = await User.findById(decoded.userId).select('-password');

      // Move to the next middleware or controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin routes (Requires a valid JWT AND isAdmin to be true)
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
};

export { protect, admin };
