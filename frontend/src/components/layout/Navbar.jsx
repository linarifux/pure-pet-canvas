import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CartDrawer from '../product/CartDrawer';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pull global state
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-stone-200 transition-all font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LEFT: Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button className="text-stone-900 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* CENTER/LEFT: Brand Logo */}
            <div className="flex-shrink-0 flex items-center justify-center sm:justify-start w-full sm:w-auto">
              <Link to="/" className="text-xl font-bold tracking-tighter text-stone-900 uppercase">
                Pure Pet Canvas
              </Link>
            </div>

            {/* CENTER: Desktop Navigation Links */}
            <div className="hidden sm:flex space-x-8 items-center justify-center flex-1">
              <Link to="/shop" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                Shop All
              </Link>
              <Link to="/shop?category=dogs" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                Dogs
              </Link>
              <Link to="/shop?category=cats" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                Cats
              </Link>
            </div>

            {/* RIGHT: User & Cart Icons */}
            <div className="flex items-center space-x-6 justify-end">
              
              {/* Dynamic Auth UI */}
              {userInfo ? (
                <div className="hidden sm:flex items-center space-x-4">
                  <span className="text-sm font-medium text-stone-900">
                    Hi, {userInfo.name.split(' ')[0]}
                  </span>
                  <button 
                    onClick={logoutHandler}
                    className="text-sm text-stone-500 hover:text-stone-900 underline underline-offset-4 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block text-stone-900 hover:text-stone-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              {/* Cart Icon */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-stone-900 hover:text-stone-600 transition-colors flex items-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                
                {cartQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartQuantity}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
