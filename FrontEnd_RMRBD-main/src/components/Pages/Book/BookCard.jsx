import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

function BookCard({ book }) {
    const navigate = useNavigate();
    const maxStars = 5;
    const filledStars = Math.round(book.bookRate || 0);

    const handleCardClick = () => {
        navigate(`/book/${book.bookId}`);
    };

    return (
        <div 
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer" 
            onClick={handleCardClick}
        >
            <img
                src={book.imageUrl || 'https://via.placeholder.com/150'}
                alt={book.bookName}
                className="w-full h-40 object-cover object-center rounded-lg mb-2"
            />
            <h3 className="font-semibold text-sm">{book.bookName}</h3>
            <div className="text-gray-700 mb-2">
                <span className="text-red-500 font-bold">{book.price.toLocaleString()} đ</span>
            </div>
            <div className="flex items-center mt-2">
                {[...Array(maxStars)].map((_, index) => (
                    <FontAwesomeIcon
                        key={index}
                        icon={index < filledStars ? faStar : faStarOutline}
                        className={index < filledStars ? 'text-yellow-500' : 'text-gray-400'}
                    />
                ))}
            </div>
        </div>
    );
}

// Cấu hình PropTypes
BookCard.propTypes = {
    book: PropTypes.shape({
        bookId: PropTypes.number.isRequired,
        bookName: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        bookRate: PropTypes.number,
        imageUrl: PropTypes.string, // Đảm bảo imageUrl có trong PropTypes
    }).isRequired,
};

export default BookCard;
