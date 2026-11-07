import { createSlice } from '@reduxjs/toolkit';

// Utility to load the initial cart state from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('cartItems');
  return storedCart ? JSON.parse(storedCart) : [];
};

const initialState = {
  cartItems: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      
      // Check if this exact variant (e.g., Large, Black) is already in the cart
      const existingItem = state.cartItems.find(
        (x) => x.variantId === item.variantId
      );

      if (existingItem) {
        // If it exists, just increase the quantity
        existingItem.quantity += item.quantity || 1;
      } else {
        // Otherwise, add the new item
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }
      
      // Persist to local storage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    removeFromCart: (state, action) => {
      // action.payload should be the variantId
      state.cartItems = state.cartItems.filter(
        (x) => x.variantId !== action.payload
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    updateQuantity: (state, action) => {
      const { variantId, quantity } = action.payload;
      const existingItem = state.cartItems.find((x) => x.variantId === variantId);
      
      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
