import express from 'express';
import {
  getProducts,
  getProductById,
  getPersonalizationOptions,
  createPersonalizationPreview,
  getPersonalizationPreviewTask,
  createPersonalizationConfig,
} from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

// Printify Personalization API Routes
router.route('/:id/personalization-options').get(getPersonalizationOptions);
router.route('/:id/personalization-previews').post(createPersonalizationPreview);
router.route('/:id/personalization-previews/tasks/:taskId').get(getPersonalizationPreviewTask);
router.route('/:id/personalization').post(createPersonalizationConfig);

export default router;
