import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

function EbookCard({ ebook }) {
  const navigate = useNavigate();
  const maxStars = 5;
  const filledStars = Math.round(ebook.bookRate || 0);

  const handleCardClick = () => {
    navigate(`/ebook/${ebook.ebookId}`);  // Navigate to eBook details page
  };

  return (
    <div
      className="block p-px bg-gradient-to-br from-blueGray-800 via-blueGray-800 to-blueGray-800 hover:bg-gray-100 cursor-pointer rounded-lg"
      onClick={handleCardClick}
    >
      <div className="p-5 rounded-lg shadow-md">
        {/* Ebook Image */}
        <img
          src={
            ebook.images && ebook.images.length > 0
              ? ebook.images[0].imageUrl
              : "https://via.placeholder.com/150?text=No+Image" // URL ảnh mặc định
          }
          alt={ebook.ebookName}
          className="block w-full h-60 mb-4 object-cover object-center rounded-lg"
        />

        {/* Ebook Title */}
        <h3 className="font-bold text-black text-lg text-center mb-2">
          {ebook.ebookName}
        </h3>

        {/* Ebook Price */}
        <div className="text-center text-gray-300 text-lg font-semibold mb-4">
          <span className="text-black">{ebook.price.toLocaleString()} đ</span>
        </div>

        {/* Ebook Rating */}
        <div className="flex justify-center items-center mb-3">
          {[...Array(maxStars)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < filledStars ? faStar : faStarOutline}
              className={`${
                index < filledStars ? "text-yellow-500" : "text-gray-500"
              } text-lg`}
            />
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ebook/${ebook.ebookId}`);  // Navigate to eBook details page
            }}
            className="text-white bg-gradient-to-br from-yellow-500 via-green-300 to-blue-500 px-6 py-2 rounded font-semibold hover:scale-105 transform transition shadow-lg"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

EbookCard.propTypes = {
  ebook: PropTypes.shape({
    ebookId: PropTypes.number.isRequired,  
    ebookName: PropTypes.string.isRequired,  
    price: PropTypes.number.isRequired,
    bookRate: PropTypes.number,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imageUrl: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default EbookCard;
