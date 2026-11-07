import express from 'express';
import { 
  authUser, 
  registerUser, 
  logoutUser, 
  getUserProfile 
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

// Inject the protect middleware before the controller
router.get('/profile', protect, getUserProfile);

export default router;
