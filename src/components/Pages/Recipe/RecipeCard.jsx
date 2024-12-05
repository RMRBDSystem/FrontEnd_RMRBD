import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe-detail/${recipe.recipeId}`);
  };

  return (
    <div
      className="block p-px bg-gradient-to-br from-blueGray-800 via-blueGray-800 to-blueGray-800 hover:from-yellow-500 hover:via-green-400 hover:to-blue-500 cursor-pointer rounded-lg"
      onClick={handleCardClick}
    >
      <div className="p-5 rounded-lg shadow-md">
        {/* Recipe Image */}
        <img
          src={recipe.images && recipe.images.length > 0 ? recipe.images[0].imageUrl : "https://via.placeholder.com/150?text=No+Image"}
          alt={recipe.recipeName}
          className="block w-full h-60 mb-4 object-cover object-center rounded-lg"
        />

        {/* Recipe Name */}
        <h3 className="font-bold text-white text-lg text-center mb-2">
          {recipe.recipeName}
        </h3>

        {/* Recipe Price */}
        <div className="text-center text-gray-300 text-lg font-semibold mb-4">
          <span className="text-yellow-400">
            {recipe.price.toLocaleString()} đ
          </span>
        </div>

        {/* Button to view recipe details */}
        <div className="flex justify-center">
          <button
            className="text-white bg-gradient-to-br from-yellow-500 via-green-300 to-blue-500 px-6 py-2 rounded font-semibold hover:scale-105 transform transition shadow-lg"
            onClick={handleCardClick}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export default RecipeCard;
