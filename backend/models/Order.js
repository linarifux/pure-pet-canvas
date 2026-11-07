import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Links the order to the registered user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    
    // The exact items sent to Printify
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        // CRITICAL FOR PRINTIFY: You must pass these exact IDs to trigger fulfillment
        productId: { type: String, required: true },
        variantId: { type: String, required: true },
      },
    ],
    
    // Destination for Printify fulfillment
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      email: { type: String, required: true },
    },

    // Stripe Payment Data
    paymentMethod: { type: String, default: 'Stripe' },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    
    // Financial Breakdown
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 }, // Calculated dynamically via Printify API
    totalPrice: { type: Number, required: true, default: 0.0 },
    
    // Internal Fulfillment Status
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },

    // Printify Synchronization Data
    printifyOrderId: { type: String }, // The ID returned by Printify when order is created
    printifyStatus: { 
      type: String, 
      default: 'pending',
      enum: ['pending', 'sent_to_printify', 'in_production', 'shipped', 'canceled'] 
    },
    trackingNumber: { type: String },
    trackingUrl: { type: String }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
