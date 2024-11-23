import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecipeDetail = () => {
  const { recipeId } = useParams(); // Lấy ID từ URL
  const [recipe, setRecipe] = useState(null);
  const [accountID, setAccountID] = useState(null);
  const [images, setImages] = useState([]); // Thay đổi thành mảng hình ảnh
  const [tagMap, setTagMap] = useState({}); // Lưu tên tag theo tagId

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy chi tiết công thức
        const recipeResult = await axios.get(
          `https://localhost:7220/odata/Recipe/${recipeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc", // Nếu bạn có Token cần dùng
            },
          }
        );
        const recipeData = recipeResult.data;
        console.log("Recipe data:", recipeData);
        setRecipe(recipeData);

        // Lấy thông tin tài khoản
        if (recipeData.createById) {
          const accountResult = await axios.get(
            `https://localhost:7220/odata/Account/${recipeData.createById}`,
            {
              headers: {
                "Content-Type": "application/json",
                Token: "123-abc",
              },
            }
          );
          setAccountID(accountResult.data);
        }

        // Lấy mảng hình ảnh của công thức
        const imageResult = await axios.get(
          `https://localhost:7220/odata/Image/Recipe/${recipeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          }
        );
        setImages(imageResult.data);

        // Lấy tên tag từ API cho từng tagId
        const tagResult = await axios.get(
          `https://localhost:7220/odata/Tag`, // API để lấy tất cả tag
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          }
        );
        const tags = tagResult.data;

        // Chuyển danh sách tag thành map { tagId: tagName }
        const tagMapData = tags.reduce((acc, tag) => {
          acc[tag.tagId] = tag.tagName;
          return acc;
        }, {});
        setTagMap(tagMapData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [recipeId]); // Chỉ phụ thuộc vào recipeId

  if (!recipe || !accountID || images.length === 0) {
    return <div>Loading...</div>; // Chờ recipe, accountID, và images được tải đầy đủ
  }

  return (
    <div className="container mt-4">
      <h2>Recipe Detail</h2>
      <p>
        <strong>Name:</strong> {recipe?.recipeName || "null"}
      </p>
      <p>
        <strong>Description:</strong> {recipe?.description || "null"}
      </p>
      <p>
        <strong>Nutrition:</strong> {recipe?.nutrition || "null"}
      </p>
      <p>
        <strong>Tutorial:</strong> {recipe?.tutorial || "null"}
      </p>
      <p>
        <strong>Ingredient:</strong> {recipe?.ingredient || "null"}
      </p>
      <p>
        <strong>Created Date:</strong> {recipe?.createDate || "null"}
      </p>
      <p>
        <strong>Video:</strong> {recipe?.video || "null"}
      </p>
      <p>
        <strong>Price:</strong> ${recipe?.price || "null"}
      </p>
      <p>
        <strong>Number of Services:</strong> {recipe?.numberOfService || "null"}
      </p>
      <p>
        <strong>Total time:</strong> {recipe?.totalTime || "null"}
      </p>
      <p>
        <strong>Created By:</strong> {accountID?.userName || "null"}
      </p>
      <div>
        <strong>Recipe Tags:</strong>
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
      <p>
        <strong>Status:</strong>
        {recipe?.status === 1
          ? "Censored"
          : recipe?.status === -1
          ? "Uncensored"
          : recipe?.status === 0
          ? "Blocked"
          : "null"}
      </p>
      <div>
        <strong>Recipe Images:</strong>
        <div className="image-gallery">
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={image?.imageUrl || ""}
                alt={`Recipe image ${index + 1}`}
                style={{ maxWidth: "200px", marginRight: "10px" }}
              />
            ))
          ) : (
            <p>null</p>
          )}
        </div>
      </div>
      <button
        className="btn btn-secondary"
        onClick={() => window.history.back()}
      >
        Back
      </button>
    </div>
  );
};

export default RecipeDetail;
