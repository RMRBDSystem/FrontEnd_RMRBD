import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
//import { getFirstImageByBookId} from '../../services/BookService';

function BookCard({ book }) {
    //const [imageUrl, setImageUrl] = useState([]);
    const navigate = useNavigate();
    const maxStars = 5;
    const filledStars = Math.round(book.bookRate || 0);
  
    // useEffect(() => {
    //   const fetchImage = async () => {
    //     try {
    //       const url = await getFirstImageByBookId(book.bookId);
    //       if (url) {
    //         setImageUrl(url);
    //       } else {
    //         console.log(`No image found for book ID ${book.bookId}`);
    //         console.warn(`No image found for book ID ${book.bookId}`);
    //       }
    //     } catch (error) {
    //       console.error(`Error fetching image for book ID ${book.bookId}:`, error);
    //     }
    //   };
  
    //   fetchImage();
    // }, [book.bookId, getFirstImageByBookId, setImageUrl]);
  const handleCardClick = async () => {
    navigate(`/book/${book.bookId}`);
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={book.images && book.images.length > 0 ? book.images[0].imageUrl : ''}
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
};

BookCard.propTypes = {
  book: PropTypes.shape({
    images: PropTypes.string.isRequired,
    bookId: PropTypes.number.isRequired,
    bookName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    bookRate: PropTypes.number,
  }).isRequired,
};

export default BookCard;