import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.cart);

  // Form State for Shipping
  const [shippingDetails, setShippingDetails] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US', // Defaulting to US for Printify, can be dynamic
  });

  // Financial Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Note: In a production build, shipping and taxes must be calculated via API based on the zip code
  const estimatedShipping = cartItems.length > 0 ? 8.50 : 0; 
  const total = subtotal + estimatedShipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    console.log("Proceeding to Stripe with:", shippingDetails);
    // Future Stripe integration goes here
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Your cart is empty</h2>
        <Link to="/shop" className="text-stone-500 hover:text-stone-900 underline underline-offset-4">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* LEFT COLUMN: Shipping & Payment Form */}
        <div className="flex-1">
          {/* Breadcrumbs */}
          <nav className="flex text-sm text-stone-500 mb-8 space-x-2">
            <Link to="/shop" className="hover:text-stone-900 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">Checkout</span>
          </nav>

          <form onSubmit={handleSimulateSubmit} className="space-y-10">
            
            {/* 1. Contact Info */}
            <section>
              <h2 className="text-lg font-medium text-stone-900 mb-4">Contact Information</h2>
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                value={shippingDetails.email}
                onChange={handleInputChange}
                className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white text-stone-900 placeholder:text-stone-400"
              />
            </section>

            {/* 2. Shipping Address */}
            <section>
              <h2 className="text-lg font-medium text-stone-900 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="First Name"
                  value={shippingDetails.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white text-stone-900 placeholder:text-stone-400"
                />
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Last Name"
                  value={shippingDetails.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white text-stone-900 placeholder:text-stone-400"
                />
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Street Address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  className="w-full sm:col-span-2 border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white text-stone-900 placeholder:text-stone-400"
                />
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={shippingDetails.apartment}
                  onChange={handleInputChange}
                  className="w-full sm:col-span-2 border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white text-stone-900 placeholder:text-stone-400"
                />
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="City"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white text-stone-900 placeholder:text-stone-400"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="State"
                    value={shippingDetails.state}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white text-stone-900 placeholder:text-stone-400"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    required
                    placeholder="ZIP Code"
                    value={shippingDetails.zipCode}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>
            </section>

            {/* 3. Payment Section (Stripe Placeholder) */}
            <section>
              <h2 className="text-lg font-medium text-stone-900 mb-4">Payment</h2>
              <div className="w-full border border-stone-200 bg-stone-50 p-6 flex flex-col items-center justify-center min-h-[150px] text-stone-500">
                <svg className="w-8 h-8 mb-2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="text-sm">Stripe Elements UI will mount here.</p>
                <p className="text-xs mt-1">Requires PaymentIntent from backend.</p>
              </div>
            </section>

            <button
              type="submit"
              className="w-full bg-stone-900 text-white px-6 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex justify-center items-center"
            >
              Pay ${total.toFixed(2)}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="w-full lg:w-[450px] lg:border-l lg:border-stone-200 lg:pl-12 mt-12 lg:mt-0">
          <div className="sticky top-24">
            <h2 className="text-lg font-medium text-stone-900 mb-6">Order Summary</h2>
            
            {/* Itemized List */}
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.variantId} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 bg-stone-100 border border-stone-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-stone-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-stone-900 line-clamp-1">{item.name}</p>
                    <p className="text-stone-500">{item.color} / {item.size}</p>
                  </div>
                  <p className="text-sm font-medium text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="border-t border-stone-200 pt-6 space-y-3 text-sm text-stone-600">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="font-medium text-stone-900">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p className="font-medium text-stone-900">${estimatedShipping.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t border-stone-200 mt-6 pt-6 flex justify-between items-end">
              <p className="text-base font-medium text-stone-900">Total</p>
              <p className="text-2xl font-bold text-stone-900">${total.toFixed(2)}</p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
