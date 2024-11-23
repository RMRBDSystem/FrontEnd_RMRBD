import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const EditRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [price, setPrice] = useState("");
  const [numberOfService, setNumberOfService] = useState("");
  const [status, setStatus] = useState(1);
  const [nutrition, setNutrition] = useState("");
  const [tutorial, setTutorial] = useState("");
  const [video, setVideo] = useState("");
  const [description, setDescription] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [createById, setCreateById] = useState("");
  const [tags, setTags] = useState([]); // Tất cả các tag đang hoạt động
  const [selectedTagIds, setSelectedTagIds] = useState([]); // Các tag được chọn
  const [selectedTagNames, setSelectedTagNames] = useState([]);
  const [tagMap, setTagMap] = useState({});
  const [updatedDate, setUpdatedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const { id } = useParams();
  const navigate = useNavigate();

  // Lấy dữ liệu Recipe từ API
  const fetchRecipeData = async () => {
    try {
      const recipeResult = await axios.get(
        `https://localhost:7220/odata/Recipe/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );

      const recipeData = recipeResult.data;
      setRecipe(recipeData);
      setRecipeName(recipeData.recipeName);
      setPrice(recipeData.price);
      setNumberOfService(recipeData.numberOfService);
      setStatus(recipeData.status);
      setNutrition(recipeData.nutrition);
      setTutorial(recipeData.tutorial);
      setVideo(recipeData.video);
      setDescription(recipeData.description);
      setIngredient(recipeData.ingredient);
      setCreateById(recipeData.createById);
      setCreateDate(recipeData.createDate?.slice(0, 10) || "");
      setTotalTime(recipeData.totalTime);

      // Cập nhật tag từ API
      setSelectedTagIds(recipeData.tags?.map((tag) => tag.tagId) || []);
      setSelectedTagNames(recipeData.tags?.map((tag) => tag.tagName) || []);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error("Failed to load recipe.");
    }
  };

  // Lấy tất cả các tag có `status = 1`
  const fetchActiveTags = async () => {
    try {
      const response = await axios.get("https://localhost:7220/odata/Tag", {
        params: {
          $filter: "status eq 1",
        },
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });

      const tags = response.data || [];
      setTags(tags);

      // Lưu map tagId -> tagName
      setTagMap(
        tags.reduce((acc, tag) => {
          acc[tag.tagId] = tag.tagName;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to load tags.");
    }
  };

  useEffect(() => {
    fetchActiveTags();
    fetchRecipeData();
  }, [id]);

  // Xử lý khi chọn tag
  const handleTagSelection = (e) => {
    const selectedOptions = [...e.target.selectedOptions];
    setSelectedTagIds(selectedOptions.map((option) => parseInt(option.value))); // Chuyển sang số
    setSelectedTagNames(selectedOptions.map((option) => option.text));
  };

  // Cập nhật công thức khi submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedRecipe = {
      ...recipe,
      recipeName,
      price,
      numberOfService,
      status,
      nutrition,
      tutorial,
      video,
      description,
      ingredient,
      createDate,
      updatedDate,
      totalTime,
      createById,
    };

    try {
      // Cập nhật recipe
      await axios.put(
        `https://localhost:7220/odata/Recipe/${id}`,
        updatedRecipe,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );

      // Lấy các tag hiện tại của recipe từ cơ sở dữ liệu
      const oldTagsResponse = await axios.get(
        `https://localhost:7220/odata/RecipeTag/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );

      const oldTagIds = oldTagsResponse.data.map((tag) => tag.tagId);

      // Xóa các tag không còn trong danh sách đã chọn
      for (const tagId of oldTagIds) {
        if (!selectedTagIds.includes(tagId)) {
          await axios.delete(
            `https://localhost:7220/odata/RecipeTag/${id}/${tagId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Token: "123-abc",
              },
            }
          );
        }
      }

      // Thêm các tag mới vào danh sách
      for (const tagId of selectedTagIds) {
        if (!oldTagIds.includes(tagId)) {
          await axios.post(
            `https://localhost:7220/odata/RecipeTag`,
            { tagId, recipeId: id },
            {
              headers: {
                "Content-Type": "application/json",
                Token: "123-abc",
              },
            }
          );
        }
      }

      // Gọi lại fetchRecipeData để làm mới danh sách tag
      await fetchRecipeData();

      toast.success("Recipe updated successfully!");
      navigate("/recipecustomer-list");
    } catch (error) {
      toast.error("Error updating recipe!");
      console.error("Error:", error);
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <ToastContainer />
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipe Name:</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number of Services:</label>
          <input
            type="number"
            value={numberOfService}
            onChange={(e) => setNumberOfService(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Nutrition:</label>
          <textarea
            value={nutrition}
            onChange={(e) => setNutrition(e.target.value)}
          />
        </div>
        <div>
          <label>Tutorial:</label>
          <textarea
            value={tutorial}
            onChange={(e) => setTutorial(e.target.value)}
          />
        </div>
        <div>
          <label>Video URL:</label>
          <input
            type="text"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Ingredient:</label>
          <textarea
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
          />
        </div>
        <div>
          <label>Create Date:</label>
          <input
            type="date"
            value={createDate}
            readOnly // Trường không thể chỉnh sửa
          />
        </div>
        <div>
          <label>Total Time (in minutes):</label>
          <input
            type="number"
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
          />
        </div>

        <div>
          <label>Updated Date:</label>
          <input type="date" value={updatedDate} readOnly />
        </div>

        <div>
          <label>Tags:</label>
          <select multiple value={selectedTagIds} onChange={handleTagSelection}>
            {tags.map((tag) => (
              <option key={tag.tagId} value={tag.tagId}>
                {tag.tagName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <strong>Old Tags:</strong>
          <ul>
            {recipe?.recipeTags?.length > 0 ? (
              recipe.recipeTags.map((tag, index) => (
                <li key={index}>{tagMap[tag.tagId] || "Unknown"}</li>
              ))
            ) : (
              <li>null</li>
            )}
          </ul>
        </div>
        <div>
          <strong>Selected Tags:</strong>
          <p>{selectedTagNames.join(", ")}</p>
        </div>

        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;
