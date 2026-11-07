import asyncHandler from 'express-async-handler';
import printify from '../config/printify.js';

// @desc    Fetch all products from Printify store
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  try {
    const response = await printify.get(`/shops/${process.env.PRINTIFY_SHOP_ID}/products.json?limit=50`);
    res.status(200).json(response.data.data);
  } catch (error) {
    console.error('Printify catalog error:', error.response?.data || error.message);
    res.status(502);
    throw new Error('Failed to fetch product catalog from Printify');
  }
});

// @desc    Fetch single product by Printify ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  try {
    const response = await printify.get(`/shops/${process.env.PRINTIFY_SHOP_ID}/products/${req.params.id}.json`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    1. Retrieve personalization fields configured for a product
// @route   GET /api/products/:id/personalization-options
// @access  Public
export const getPersonalizationOptions = asyncHandler(async (req, res) => {
  try {
    const response = await printify.get(
      `/shops/${process.env.PRINTIFY_SHOP_ID}/products/${req.params.id}/personalization_options.json`
    );
    res.status(200).json(response.data);
  } catch (error) {
    // If a product does not have personalization enabled, return an empty array gracefully
    res.status(200).json([]);
  }
});

// @desc    2. Request rendered mockup previews for a personalization input
// @route   POST /api/products/:id/personalization-previews
// @access  Public
export const createPersonalizationPreview = asyncHandler(async (req, res) => {
  const { variant_id, items, require_all_personalization_fields = false } = req.body;

  try {
    const response = await printify.post(
      `/shops/${process.env.PRINTIFY_SHOP_ID}/products/${req.params.id}/personalization_previews.json`,
      { variant_id, items, require_all_personalization_fields }
    );
    // Returns { task_id, status }
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Preview Request Error:', error.response?.data || error.message);
    res.status(400);
    throw new Error(error.response?.data?.message || 'Failed to initiate mockup preview task');
  }
});

// @desc    3. Check the status of a personalization preview task
// @route   GET /api/products/:id/personalization-previews/tasks/:taskId
// @access  Public
export const getPersonalizationPreviewTask = asyncHandler(async (req, res) => {
  const { id, taskId } = req.params;

  try {
    const response = await printify.get(
      `/shops/${process.env.PRINTIFY_SHOP_ID}/products/${id}/personalization_previews/tasks/${taskId}.json`
    );
    // Returns { task_id, status, mockups: [...] }
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Preview Task Status Error:', error.response?.data || error.message);
    res.status(502);
    throw new Error('Failed to check personalization preview status');
  }
});

// @desc    4. Create a personalization configuration for a product variant (Used on Add to Cart)
// @route   POST /api/products/:id/personalization
// @access  Public
export const createPersonalizationConfig = asyncHandler(async (req, res) => {
  const { variant_id, items, require_all_personalization_fields = false } = req.body;

  try {
    const response = await printify.post(
      `/shops/${process.env.PRINTIFY_SHOP_ID}/products/${req.params.id}/personalization.json`,
      { variant_id, items, require_all_personalization_fields }
    );
    // Returns { personalisation_strategy, personalisation_instructions }
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Personalization Config Error:', error.response?.data || error.message);
    res.status(400);
    throw new Error(error.response?.data?.message || 'Failed to save personalization configuration');
  }
});
