import React, { useEffect, useState } from 'react';
import Sidebar from '../Book/Sidebar.jsx';
import Banner from '../Book/Banner.jsx';
import RecipeCard from './RecipeCard.jsx';
import { getRecipes, getImagesByRecipeId } from '../../services/RecipeService.js';
function Recipe() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // Lấy danh sách sách
                const recipesData = await getRecipes();

                // Dùng Promise.all để lấy ảnh của từng sách song song
                const recipesWithImages = await Promise.all(
                    recipesData.map(async (recipe) => {
                        const imageUrl = await getImagesByRecipeId(recipe.recipeId);
                        return { ...recipe, imageUrl }; // Kết hợp `imageUrl` vào đối tượng `book`
                    })
                );

                setRecipes(recipesWithImages); // Đặt danh sách sách với URL ảnh vào state
            } catch (error) {
                console.error("Failed to fetch books or images", error);
            }
        };
        fetchRecipes();
    }, []);

    return (
        <div className="flex justify-center p-4">
            {/* Giới hạn độ rộng tối đa và căn giữa nội dung */}
            <div className="max-w-screen-lg w-full flex flex-col lg:flex-row">
                {/* Sidebar */}
                <div className="w-full lg:w-1/4 p-4">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className="w-full lg:w-3/4 p-4">
                    <Banner />

                    {/* Danh sách sách nấu ăn */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.recipeId} recipe={recipe} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recipe;

