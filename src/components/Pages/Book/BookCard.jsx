import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

function BookCard({ book }) {
  const navigate = useNavigate();
  const maxStars = 5;
  const filledStars = Math.round(book.bookRate || 0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setIsAddedToCart(true);
  };

  const handleRemoveFromCart = () => {
    setIsAddedToCart(false);
  };

  const handleCardClick = () => {
    navigate(`/book/${book.bookId}`);
  };

  return (
    <div className="book">
      <div className="book-container">
        {/* Book Cover */}
        <div
          className="top"
          style={{
            backgroundImage: `url(${
              book.images && book.images.length > 0
                ? book.images[0].imageUrl
                : "https://via.placeholder.com/150?text=No+Image"
            })`,
          }}
          onClick={handleCardClick}
        ></div>

        {/* Book Info */}
        <div className={`bottom ${isAddedToCart ? "clicked" : ""}`}>
          <div className="left">
            <div className="details">
              <h1>{book.bookName}</h1>
              <p>{book.price.toLocaleString()} đ</p>
            </div>
            <div className="buy cursor-pointer" onClick={handleAddToCart}>
              <i className="material-icons">add_shopping_cart</i>
            </div>
          </div>
          <div className="right">
            <div className="done">
              <i className="material-icons">done</i>
            </div>
            <div className="details">
              <h1>{book.bookName}</h1>
              <p>Đã thêm vào giỏ hàng</p>
            </div>
            <div className="remove cursor-pointer" onClick={handleRemoveFromCart}>
              <i className="material-icons">clear</i>
            </div>
          </div>
        </div>
      </div>

      {/* Inside Details */}
      <div className="inside">
        <div className="icon">
          <i className="material-icons">info_outline</i>
        </div>
        <div className="contents">
          <h1 className="pb-2">{book.description || "Không rõ" }</h1>
          <h1>Tác giả  {book.author || "Không rõ"}</h1>
          <table>
            <tbody>
              <tr>
                <th>Xếp hạng</th>
                <td>
                  {[...Array(maxStars)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={index < filledStars ? faStar : faStarOutline}
                      className={`${
                        index < filledStars ? "text-yellow-500" : "text-gray-500"
                      }`}
                    />
                  ))}
                </td>
              </tr>
              <tr>
                <th>Giá</th>
                <td>{book.price.toLocaleString()} đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    bookId: PropTypes.number.isRequired,
    bookName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    bookRate: PropTypes.number,
    author: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imageUrl: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default BookCard;
