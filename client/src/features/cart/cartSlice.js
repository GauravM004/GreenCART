import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: {},
    isCartOpen: false,
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload;
      const cartData = { ...state.cartItems };

      if (cartData[itemId]) {
        cartData[itemId] += 1;
      } else {
        cartData[itemId] = 1;
      }

      state.cartItems = cartData;
      state.isCartOpen = true;
      toast.success('Added to cart');
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const cartData = { ...state.cartItems };

      if (cartData[itemId]) {
        cartData[itemId] -= 1;
        if (cartData[itemId] === 0) {
          delete cartData[itemId];
        }
      }

      state.cartItems = cartData;
      toast.success('Removed from cart');
    },
    updateCartItem: (state, action) => {
      const { itemId, quantity } = action.payload;
      const cartData = { ...state.cartItems };
      cartData[itemId] = quantity;
      state.cartItems = cartData;
      toast.success('Cart updated');
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    setIsCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem, setCartItems, setIsCartOpen } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.cartItems;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;
export const selectCartCount = (state) => {
  let count = 0;
  for (const item in state.cart.cartItems) {
    count += state.cart.cartItems[item];
  }
  return count;
};
export const selectCartAmount = (state) => {
  let total = 0;
  for (const itemId in state.cart.cartItems) {
    const product = state.products.products.find((p) => p._id === itemId);
    if (product) {
      total += product.offerPrice * state.cart.cartItems[itemId];
    }
  }
  return Math.round(total * 100) / 100;
};
export default cartSlice.reducer;
