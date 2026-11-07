import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import printify from '../config/printify.js';

// @desc    Calculate Printify shipping costs
// @route   POST /api/orders/shipping
// @access  Private
export const calculateShipping = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items to calculate shipping for');
  }

  try {
    // Map your frontend cart items to Printify's expected line_items format
    const line_items = orderItems.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
    }));

    // Map your frontend shipping address to Printify's address_to format
    const address_to = {
      first_name: shippingAddress.firstName,
      last_name: shippingAddress.lastName,
      address1: shippingAddress.address,
      address2: shippingAddress.apartment || '',
      city: shippingAddress.city,
      region: shippingAddress.state,
      country: shippingAddress.country || 'US',
      zip: shippingAddress.zipCode,
    };

    const response = await printify.post(
      `/shops/${process.env.PRINTIFY_SHOP_ID}/orders/shipping.json`,
      { line_items, address_to }
    );

    // Printify returns shipping costs in cents (e.g., 850 for $8.50)
    // We convert it to standard dollars for the frontend and database
    const shippingCostInDollars = response.data.standard / 100;

    res.status(200).json({ shippingCost: shippingCostInDollars });
  } catch (error) {
    console.error('Printify Shipping Calculation Error:', error.response?.data || error.message);
    res.status(502);
    throw new Error('Failed to calculate shipping rates with Printify. Please verify the shipping address.');
  }
});

// @desc    Create new order (Status: Pending Payment)
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      // req.user is appended by the protect middleware
      user: req.user._id, 
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false, // Ensures order is not sent to Printify yet
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});
