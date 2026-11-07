import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../redux/slices/cartSlice';

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // Calculate Subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Prevent background scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handlers for Redux actions
  const handleQuantityChange = (variantId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      dispatch(updateQuantity({ variantId, quantity: newQty }));
    }
  };

  const handleRemove = (variantId) => {
    dispatch(removeFromCart(variantId));
  };

  return (
    <>
      {/* 1. Dark Background Overlay */}
      <div 
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* 2. Slide-out Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col font-sans ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 tracking-wide uppercase">Your Cart</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Body (Scrollable Cart Items) */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-500 space-y-4">
              <svg className="w-12 h-12 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>Your cart is currently empty.</p>
              <button 
                onClick={onClose}
                className="mt-4 text-sm font-medium text-stone-900 underline underline-offset-4"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li key={item.variantId} className="flex gap-4">
                  {/* Item Image */}
                  <div className="h-24 w-20 bg-stone-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-stone-900 leading-snug">{item.name}</h3>
                        <p className="text-sm font-medium text-stone-900 ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    
                    {/* Quantity & Remove Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 w-24">
                        <button 
                          onClick={() => handleQuantityChange(item.variantId, item.quantity, -1)}
                          className="px-3 py-1 text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.variantId, item.quantity, 1)}
                          className="px-3 py-1 text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.variantId)}
                        className="text-xs text-stone-400 hover:text-red-600 underline underline-offset-2 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer (Subtotal & Checkout) */}
        {cartItems.length > 0 && (
          <div className="border-t border-stone-200 p-6 bg-stone-50">
            <div className="flex justify-between text-base font-medium text-stone-900 mb-4">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <Link 
              to="/checkout" 
              onClick={onClose}
              className="w-full bg-stone-900 text-white px-6 py-4 flex justify-center text-sm font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
