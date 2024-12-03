import React, { useState } from "react";
import ImageFilter from "../Filter/ImageFilter";
import Hero from "./Hero";
import About from './About';
const HomePage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  const handleAddToFavorites = (recipe) => {
    setCurrentRecipe(recipe);
    setShowModal(true);
  };

  const handleSaveRecipe = () => {
    setSavedRecipes([...savedRecipes, currentRecipe]);
    setShowModal(false);
  };

  return (
    <div className="w-full min-h-screen">
      <Hero />
      <About />
      <div className="flex flex-col items-center">
        <ImageFilter />
        <div className="container mx-auto px-4 lg:px-8">
          {/* Recipe Grid */}
          <h3 className="text-2xl font-semibold mb-5 text-gray-100 text-center">
            Favorite Recipes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-2 transition-transform transform hover:scale-110"
              >
                <img
                  src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"
                  alt="Recipe"
                  className="w-full h-72 object-cover rounded-md mb-2"
                />
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  The Secret to the Best Banana Cake Ever
                </h4>
                <button
                  className="mt-2 bg-custom-orange hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
                  onClick={() =>
                    handleAddToFavorites({
                      /* recipe details */
                    })
                  }
                >
                  ❤️ Add to Favorites
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add to Saved Recipes</h2>
            <p>Would you like to add this recipe to your saved recipes?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-custom-orange hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
                onClick={handleSaveRecipe}
              >
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
