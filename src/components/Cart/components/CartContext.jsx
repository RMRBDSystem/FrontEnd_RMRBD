import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const userId = Cookies.get('UserId');

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;

      try {
        const ordersResponse = await fetch(`https://rmrbdapi.somee.com/odata/BookOrder?$filter=customerId eq ${userId} and orderCode eq null`, {
          headers: {
            'Token': '123-abc',
            'Content-Type': 'application/json',
          },
        });

        if (ordersResponse.ok) {
          const orders = await ordersResponse.json();
          if (orders.length > 0) {
            const orderDetailsResponse = await fetch(`https://rmrbdapi.somee.com/odata/BookOrderDetail?$filter=orderId eq ${orders[0].orderId}`, {
              headers: {
                'Token': '123-abc',
                'Content-Type': 'application/json',
              },
            });

            if (orderDetailsResponse.ok) {
              const details = await orderDetailsResponse.json();
              setCartItems(details);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [userId]);

  const updateCartItems = (items) => {
    setTimeout(() => {
      setCartItems(items);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, updateCartItems }}>
      {children}
    </CartContext.Provider>
  );
};