import React, { useEffect, useState } from "react";
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary";

const apiUrl = "https://rmrbdapi.somee.com/odata/Recipe";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState({
    recipeName: "",
    description: "",
    numberOfService: "",
    nutrition: "",
    tutorial: "",
    video: "",
    price: "",
    ingredient: "",
    status: "",
    totalTime: ""
  });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log('API Response:', response.data);

        setRecipes(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      recipeName: recipe.recipeName || "",
      description: recipe.description || "",
      numberOfService: parseInt(recipe.numberOfService) || 0,
      nutrition: recipe.nutrition || "",
      tutorial: recipe.tutorial || "",
      video: recipe.video || "",
      price: parseFloat(recipe.price) || 0,
      ingredient: recipe.ingredient || "",
      status: parseInt(recipe.status), // Defaulting to uncensored
      totalTime: parseInt(recipe.totalTime) || 0,
    };

    setSubmitting(true);

    try {
      if (editing) {
        await axios.put(`${apiUrl}/${currentId}`, payload); // PUT request for update
      } else {
        await axios.post(apiUrl, payload); // POST request for create
      }
      resetForm();
      fetchRecipes(); // Refetch after submission
    } catch (err) {
      setError(
        err.response
          ? err.response.data
          : "An error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rcp) => {
    setRecipe({
      recipeName: rcp.recipeName,
      description: rcp.description,
      numberOfService: rcp.numberOfService,
      nutrition: rcp.nutrition,
      tutorial: rcp.tutorial,
      video: rcp.video,
      price: rcp.price,
      ingredient: rcp.ingredient,
      status: rcp.status,
      totalTime: rcp.totalTime,
    });
    setEditing(true);
    setCurrentId(rcp.recipeId);
  };

  const resetForm = () => {
    setRecipe({
      recipeName: "",
      description: "",
      numberOfService: "",
      nutrition: "",
      tutorial: "",
      video: "",
      price: "",
      ingredient: "",
      status: "-1",
      totalTime: ""
    });
    setEditing(false);
    setCurrentId(null);
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log('Fetched Recipes:', response.data);
      setRecipes(Array.isArray(response.data) ? response.data : []); // OData f ormat
    } catch (err) {
      setError("Failed to fetch recipes. Please try again later.");
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Blocked';
      case 1:
        return 'Censored';
      case -1:
        return 'Uncensored';
      default:
        return 'Unknown';
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        {/* Input fields similar to EbookList */}
        <input
          type="text"
          name="recipeName"
          value={recipe.recipeName}
          onChange={handleInputChange}
          placeholder="Recipe Name"
          className="border rounded p-2 mr-2"
          required
        />
        <input
          type="text"
          name="description"
          value={recipe.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border rounded p-2 mr-2"
          required
        />
        <input
          type="number"
          name="numberOfService"
          value={recipe.numberOfService}
          onChange={handleInputChange}
          placeholder="Number of Service"
          className="border rounded p-2 mr-2"
          required
        />
        <input
          type="number"
          name="price"
          value={recipe.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="border rounded p-2 mr-2"
          required
        />
        <input
          type="text"
          name="ingredient"
          value={recipe.ingredient}
          onChange={handleInputChange}
          placeholder="Ingredient"
          className="border rounded p-2 mr-2"
          required
        />
        <input
          type="text"
          name="nutrition"
          value={recipe.nutrition}
          onChange={handleInputChange}
          placeholder="Nutrition"
          className="border rounded p-2 mr-2"
        />
        <input
          type="text"
          name="tutorial"
          value={recipe.tutorial}
          onChange={handleInputChange}
          placeholder="Tutorial"
          className="border rounded p-2 mr-2"
        />
        <input
          type="text"
          name="video"
          value={recipe.video}
          onChange={handleInputChange}
          placeholder="Video URL"
          className="border rounded p-2 mr-2"
        />
        <input
          type="number"
          name="totalTime"
          value={recipe.totalTime}
          onChange={handleInputChange}
          placeholder="Total Time"
          className="border rounded p-2 mr-2"
        />
        <select
          name="status"
          value={recipe.status}
          onChange={handleInputChange}
          className="border rounded p-2 mr-2"
          required
        >
          <option value="-1">Uncensored</option>
          <option value="1">Censored</option>
          <option value="0">Blocked</option>
        </select>
        <button
          type="submit"
          className={`bg-blue-500 text-white rounded p-2 ${
            submitting ? "opacity-50 cursor-not-allowed" : ''
          }`}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : (editing ? 'Update' : 'Add')}
        </button>
      </form>

      <ul className="space-y-2">
        {recipes.length > 0 ? (
          recipes.map(rcp => (
            <li key={rcp.recipeId} className="p-4 border rounded-lg shadow">
              <h2 className="font-semibold">ID: {rcp.recipeId}</h2>
              <h3 className="font-semibold">{rcp.recipeName}</h3>
              <p>Description: {rcp.description}</p>
              <p>Number of Services: {rcp.numberOfService}</p>
              <p>Nutrition: {rcp.nutrition}</p>
              <p>Tutorial: {rcp.tutorial}</p>
              <p>Video: {rcp.video}</p>
              <p>Price: {rcp.price} ₫</p>
              <p>Ingredient: {rcp.ingredient}</p>
              <p>Total Time: {rcp.totalTime} mins</p>
              <p>Status: {getStatusText(rcp.status)}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleEdit(rcp)}
                  className="bg-yellow-500 text-white rounded p-1 mr-1"
                >
                  Edit
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No recipes available</li>
        )}
      </ul>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <RecipeList />
  </ErrorBoundary>
);

export default App;
