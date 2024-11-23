import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const GetListSaveRecipe = () => {
  const [data, setData] = useState([]); // State lưu dữ liệu Recipe
  const [accountId, setAccountID] = useState(null); // State lưu UserId
  const navigate = useNavigate();
  useEffect(() => {
    const storedUserId = Cookies.get("UserId");
    if (storedUserId) {
      setAccountID(storedUserId); 
    }
    getData();
  }, []);


  const getData = async () => {
    try {
        const accountId = Cookies.get("UserId");
      const result = await axios.get(`https://localhost:7220/odata/Recipe?$filter=personalRecipes/any(p: p/customerId eq ${accountId})`, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      setData(result.data);
      console.log("Data", result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleEdit = (recipeId) => {
    // Điều hướng tới trang chỉnh sửa
    navigate(`/editrecipecustomer-recipe/${recipeId}`);
  };
  return (
    <div>
      <h1>Saved Recipes</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((recipe) => (
            <li key={recipe.recipeId}>
              <h3>{recipe.recipeName}</h3>
              <p>Description: {recipe.description || "No description"}</p>
              <p>Number of Services: {recipe.numberOfService}</p>
              <p>Price: ${recipe.price}</p>
              <div>
                {/* Hiển thị ảnh đầu tiên của recipe */}
                {recipe.images && recipe.images.length > 0 ? (
                  <img
                    src={recipe.images[0].imageUrl}
                    alt={`${recipe.recipeName} Image`}
                    style={{
                      width: "150px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              {/* Nút Edit */}
              <button
                onClick={() => handleEdit(recipe.recipeId)}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
};

export default GetListSaveRecipe;
