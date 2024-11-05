import React, { useState } from "react";
import BackgroundImage from "../../assets/Background.jpg";
import ImageFilter from "../Filter/ImageFilter";
import Slide from "../Filter/Slide";
import Navbar from "../Navbar/Navbar";
import Footer from '../Footer/Footer';
const HomePage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  const handleAddToFavorites = (recipe) => {
    setCurrentRecipe(recipe);
    setShowModal(true);
  };

  const handleSaveRecipe = () => {
    if (currentRecipe) {
      setSavedRecipes((prev) => [...prev, currentRecipe]);
      setShowModal(false);
      alert("Recipe saved successfully!"); // Feedback on saving
    }
  };

  return (
    <>
    <div className="w-full min-h-screen bg-gray-200">
      <Navbar />
      <div className="home-styled mt-8" >
        <Slide />
      </div>
      <div className="pt-24 flex flex-col items-center bg-gray-100">
        {/* Banner Area */}
        <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row mb-10">
          <div
            className="w-full lg:w-2/3 bg-cover bg-center relative rounded-lg shadow-lg overflow-hidden"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
          >
            <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
              <h1 className="text-white text-5xl font-extrabold tracking-wide">
                Welcome to <span className="text-custom-orange">RecipeCook</span>
              </h1>
            </div>
          </div>

          {/* News & Trending Section */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6 ml-0 lg:ml-6 mt-6 lg:mt-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              News & Trending
            </h2>
            <ul className="space-y-4">
              {/* News items */}
              {[...Array(4)].map((_, index) => (
                <li key={index} className="flex space-x-4">
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Trending"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sample Trending Title {index + 1}
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recipe Section */}
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
          16 Caramel-Apple Desserts to Indulge in This Fall
        </h2>
        <p className="text-gray-600 text-lg mb-10 text-center">
          Caramel and apple. A flavor pairing that dates back to the 1950s when
          caramel apples were invented by a Kraft Foods employee...
        </p>
        <ImageFilter />

        {/* Recipe Grid */}
        <div className="container mx-auto px-4 lg:px-8 mb-10">
          <h3 className="text-2xl font-semibold mb-5 text-gray-800 text-center">
            Favorite Recipes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-5 transition-transform transform hover:scale-105"
              >
                <img
                  src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"
                  alt="Recipe"
                  className="w-full h-48 object-cover rounded-md mb-4"
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
                  aria-label="Add this recipe to favorites"
                >
                  ❤️ Add to Favorites
                </button>
              </div>
            ))}
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
    </div>
    <Footer />
    </>
  );
};

export default HomePage;
