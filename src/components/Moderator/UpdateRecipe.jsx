import axios from "axios";
import { useState, useEffect } from "react";
import { FaBan, FaCheckCircle, FaRegClock } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [censorID, setCensorID] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setCensorID(Cookies.get("UserId"));
  }, []);

  const fetchRecipes = async () => {
    try {
      //https://localhost:7220/odata/Recipe
      //https://rmrbdapi.somee.com/odata/Recipe
      const response = await axios.get("https://localhost:7220/odata/Recipe", {
        headers: { "Content-Type": "application/json", token: "123-abc" },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetails = (recipeId) => {
    navigate(`/update-recipe/${recipeId}`);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Simple loading message, or you can use a spinner
  }

  return (
    <div className="flex-1 ml-0 md:ml-64 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>Recipe Name</th>
              <th>Number of Servings</th>
              <th>Ingredient</th>
              <th>Images</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes && recipes.length > 0 ? (
              recipes.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.recipeName || "Unknown"}</td>
                  <td>{item.numberOfService || "Unknown"}</td>
                  <td>{item.ingredient || "Unknown"}</td>
                  <td>
                    {item.images?.length > 0 && (
                      <img
                        src={item.images[0].imageUrl}
                        alt="Recipe preview"
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    )}
                  </td>
                  <td>
                    {item.status === 0 && (
                      <FaBan
                        style={{
                          color: "red",
                          cursor: "pointer",
                          fontSize: "24px",
                        }}
                        title="Bị khóa"
                      />
                    )}
                    {item.status === 1 && (
                      <FaCheckCircle
                        style={{
                          color: "green",
                          cursor: "pointer",
                          fontSize: "24px",
                        }}
                        title="Đã xác nhận"
                      />
                    )}
                    {item.status === -1 && (
                      <FaRegClock
                        style={{
                          color: "orange",
                          cursor: "pointer",
                          fontSize: "24px",
                        }}
                        title="Chờ được xác nhận"
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDetails(item.recipeId)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeList;
