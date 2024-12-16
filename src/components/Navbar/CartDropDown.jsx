// src/components/Navbar/CartDropdown.jsx

import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../Cart/components/CartContext';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 }); // Retry failed requests up to 3 times

const CartDropdown = () => {
  const { cartItems } = useCart();
  const [books, setBooks] = useState({});
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch book details for each cart item
        const bookPromises = cartItems.map(item =>
          axios.get(`https://rmrbdapi.somee.com/odata/book/${item.bookId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Token': '123-abc',
            },
          })
        );

        const bookResponses = await Promise.all(bookPromises);
        const booksData = bookResponses.reduce((acc, response) => {
          const book = response.data;
          acc[book.bookId] = {
            ...book,
            imageUrl: book.images?.[0]?.imageUrl || '/placeholder.jpg'
          };
          return acc;
        }, {});

        setBooks(booksData);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    if (cartItems.length > 0) {
      fetchBooks();
    }
  }, [cartItems]);

  // Watch for changes in cartItems to trigger animation
  useEffect(() => {
    if (cartItems.length > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300); // Reset after animation
    }
  }, [cartItems.length]);

  const isCartPage = location.pathname === '/cart';

  return (
    <div className="group relative">
      <div className="relative">
        <Link to="/cart">
          <FaShoppingCart
            className={`w-6 h-6 text-white hover:text-green-500 transition-all duration-300 cursor-pointer
              ${isAnimating ? 'animate-cart-pop' : ''}`}
          />
          {cartItems.length > 0 && (
            <span className={`absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full 
              flex items-center justify-center text-xs font-bold
              ${isAnimating ? 'animate-cart-pop' : ''}`}
            >
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>

      {!isCartPage && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 shadow-lg overflow-hidden transition-all duration-300 transform scale-y-0 group-hover:scale-y-100 z-50 origin-top">
          {cartItems.length === 0 ? (
            // Hiển thị giao diện khi giỏ hàng trống
            <div className="flex flex-col items-center justify-center p-4">
              <img
                src="/images/empty-cart.png"
                alt="Empty Cart"
                className="w-16 h-16 object-contain"
              />
              <p className="text-gray-700 mt-2 text-sm font-medium">Chưa Có Sản Phẩm</p>
            </div>
          ) : (
            // Hiển thị danh sách sản phẩm nếu có
            cartItems.map((item) => (
              <div key={item.orderDetailId} className="p-2 border-b border-gray-100 flex items-center gap-2">
                <img
                  src={books[item.bookId]?.imageUrl || '/placeholder.jpg'}
                  alt={books[item.bookId]?.bookName || 'Book'}
                  className="w-10 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-800 line-clamp-2">
                    {books[item.bookId]?.bookName || 'Loading...'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(item.price)} x {item.quantity}
                  </p>
                </div>
              </div>
            ))
          )}

          <div className="relative h-7">
            <Link
              to="/cart"
              className="absolute right-2 bottom-1 bg-orange-500 text-white px-2 py-0.5 text-xs hover:bg-orange-600 transition-colors"
            >
              Giỏ Hàng ({cartItems.length})
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;