import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';


function RecipeCard({ recipe }) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/recipe/${recipe.recipeId}`);
    };
    return (
        <div
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
            onClick={handleCardClick}
        >
            <img
                src={recipe.images && recipe.images.length > 0 ? recipe.images[0].imageUrl : ''}
                alt={recipe.recipeName}
                className="w-full h-40 object-cover object-center rounded-lg mb-2"
            />
            <h3 className="font-semibold text-sm">{recipe.recipeName}</h3>
            <div className="text-gray-700 mb-2">
                <span className="text-red-500 font-bold">{recipe.price.toLocaleString()} đ</span>
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