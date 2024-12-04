import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const userId = Cookies.get('UserId');

  const updateCartItems = (items) => {
    setCartItems(items);
  };

  // Create the value object with all the context data
  const value = {
    cartItems,
    updateCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
