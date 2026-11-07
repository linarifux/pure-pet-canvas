import express from 'express';
import { addOrderItems, calculateShipping } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Both routes require the user to be authenticated
router.route('/').post(protect, addOrderItems);
router.route('/shipping').post(protect, calculateShipping);

export default router;
