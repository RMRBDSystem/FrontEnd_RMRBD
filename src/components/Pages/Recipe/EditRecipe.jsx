import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const EditRecipe = () => {
  const { recipeId } = useParams();
  const [recipeData, setRecipeData] = useState(null); // Dữ liệu recipe từ API
  const [editFields, setEditFields] = useState({}); // Trạng thái dữ liệu cần chỉnh sửa
  const [isEditing, setIsEditing] = useState(false); // Kiểm soát chế độ chỉnh sửa
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipeData(recipeId);
  }, [recipeId]);

  // Lấy dữ liệu recipe từ API
  const fetchRecipeData = async (recipeId) => {
    try {
      const userId = Cookies.get("UserId");
      const url = `https://localhost:7220/odata/PersonalRecipe/${userId}/${recipeId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });

      const data = response.data;

      // Đặt dữ liệu cho hiển thị và chỉnh sửa
      setRecipeData(data);
      setEditFields({
        ingredient: data.ingredient || "",
        numberOfService: data.numberOfService || 0,
        nutrition: data.nutrition || "",
        tutorial: data.tutorial || "",
        purchasePrice: data.purchasePrice || 0,
      });
    } catch (error) {
      console.error("Error fetching recipe data:", error);
    }
  };

  // Xử lý thay đổi giá trị input
  const handleFieldChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  // Khôi phục dữ liệu về trạng thái ban đầu
  const restoreFields = () => {
    if (recipeData) {
      setEditFields({
        ingredient: recipeData.recipe?.ingredient || "",
        numberOfService: recipeData.recipe?.numberOfService || 0,
        nutrition: recipeData.recipe?.nutrition || "",
        tutorial: recipeData.recipe?.tutorial || "",
        purchasePrice: recipeData.recipe?.purchasePrice || 0,
      });
      setIsEditing(false);
    }
  };

  // Lưu thay đổi dữ liệu
  const saveChanges = async () => {
    try {
      const userId = Cookies.get("UserId");
      const updatedData = {
        recipeId,
        customerId: userId,
        ...editFields,
        status: -1, // Trạng thái cập nhật
      };

      await axios.put(
        `https://localhost:7220/odata/PersonalRecipe/${userId}/${recipeId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );

      alert("Changes saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    }
  };

  if (!recipeData) return <p>Loading...</p>;

  const recipeName = recipeData.recipe?.recipeName || "Recipe Name";

  return (
    <div>
      <h1>Edit Recipe</h1>
      <button onClick={() => navigate(-1)}>Back</button>

      <h3>{recipeName}</h3>
      <p>Description: {recipeData.recipe?.description || "No description"}</p>

      <div>
        <h3>Ingredients:</h3>
        {isEditing ? (
          <textarea
            value={editFields.ingredient}
            onChange={(e) => handleFieldChange("ingredient", e.target.value)}
            rows={4}
            cols={50}
          />
        ) : (
          <p>{editFields.ingredient || "No ingredients"}</p>
        )}

        <h3>Number of Services:</h3>
        {isEditing ? (
          <input
            type="number"
            value={editFields.numberOfService}
            onChange={(e) => handleFieldChange("numberOfService", e.target.value)}
          />
        ) : (
          <p>{editFields.numberOfService || "N/A"}</p>
        )}

        <h3>Nutrition:</h3>
        {isEditing ? (
          <textarea
            value={editFields.nutrition}
            onChange={(e) => handleFieldChange("nutrition", e.target.value)}
            rows={4}
            cols={50}
          />
        ) : (
          <p>{editFields.nutrition || "No nutrition information"}</p>
        )}

        <h3>Tutorial:</h3>
        {isEditing ? (
          <textarea
            value={editFields.tutorial}
            onChange={(e) => handleFieldChange("tutorial", e.target.value)}
            rows={4}
            cols={50}
          />
        ) : (
          <p>{editFields.tutorial || "No tutorial available"}</p>
        )}

        <h3>Purchase Price:</h3>
        {isEditing ? (
          <input
            type="number"
            value={editFields.purchasePrice}
            onChange={(e) => handleFieldChange("purchasePrice", e.target.value)}
          />
        ) : (
          <p>{editFields.purchasePrice || "No price specified"}</p>
        )}
      </div>

      <div>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <>
            <button onClick={saveChanges}>Save</button>
            <button onClick={restoreFields}>Restore</button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditRecipe;
