import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom"

function RecipeCard({ recipe }) {
    const navigate = useNavigate();
    const maxStars = 5;
    const filledStars = Math.round(recipe.recipeRate || 0);
    const handleCardClick = () => {
        navigate(`/recipe/${recipe.recipeId}`);
    };
    return (
        <div
            className="block p-px bg-gradient-to-br from-blueGray-800 via-blueGray-800 to-blueGray-800 hover:from-yellow-500 hover:via-green-400 hover:to-blue-500 cursor-pointer rounded-lg"
            onClick={handleCardClick}
        >

            <div className="p-5 rounded-lg shadow-md">
                {/* Book Image */}
                <img
                    src={
                        recipe.images && recipe.images.length > 0
                            ? recipe.images[0].imageUrl
                            : "https://via.placeholder.com/150?text=No+Image" // URL ảnh mặc định
                    }
                    alt={recipe.recipeName}
                    className="block w-full h-60 mb-4 object-cover object-center rounded-lg"
                />

                {/* Book Title */}
                <h3 className="font-bold text-white text-lg text-center mb-2">
                    {recipe.recipeName}
                </h3>

                {/* Book Price */}
                <div className="text-center text-gray-300 text-lg font-semibold mb-4">
                    <span className="text-yellow-400">{recipe.price.toLocaleString()} đ</span>
                </div>

                {/* Book Rating */}
                <div className="flex justify-center items-center mb-3">
                    {[...Array(maxStars)].map((_, index) => (
                        <FontAwesomeIcon
                            key={index}
                            icon={index < filledStars ? faStar : faStarOutline}
                            className={`${index < filledStars ? "text-yellow-500" : "text-gray-500"
                                } text-lg`}
                        />
                    ))}
                </div>

                {/* Button */}
                <div className="flex justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/recipe/${recipe.recipeId}`);
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

// Cấu hình PropTypes
RecipeCard.propTypes = {
    recipe: PropTypes.shape({
        recipeId: PropTypes.number.isRequired,
        recipeName: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        recipeRate: PropTypes.number,
    }).isRequired,
};

export default RecipeCard;