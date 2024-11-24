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
          `https://rmrbdapi.somee.com/odata/Recipe/${recipeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc", // Nếu bạn có Token cần dùng
            },
          }
        );
        const recipeData = recipeResult.data;
        setRecipe(recipeData);

        // Lấy thông tin tài khoản
        if (recipeData.createById) {
          const accountResult = await axios.get(
            `https://rmrbdapi.somee.com/odata/Account/${recipeData.createById}`,
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
          `https://rmrbdapi.somee.com/odata/Image/Recipe/${recipeId}`,
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
          `https://rmrbdapi.somee.com/odata/Tag`, // API để lấy tất cả tag
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
    return <div className="text-center text-xl">Loading...</div>; // Chờ recipe, accountID, và images được tải đầy đủ
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Recipe Detail</h2>

      <div className="space-y-4">
        <p className="text-lg">
          <strong>Name:</strong> {recipe?.recipeName || "N/A"}
        </p>
        <p className="text-lg">
          <strong>Description:</strong> {recipe?.description || "N/A"}
        </p>
        <p className="text-lg">
          <strong>Nutrition:</strong> {recipe?.nutrition || "N/A"}
        </p>
        <p className="text-lg">
          <strong>Tutorial:</strong> {recipe?.tutorial || "N/A"} kcal
        </p>
        <p className="text-lg">
          <strong>Ingredient:</strong> {recipe?.ingredient || "N/A"}
        </p>
        <p className="text-lg">
          <strong>Created Date:</strong> {recipe?.createDate || "N/A"}
        </p>
        <p className="text-lg">
          <strong>Video:</strong>{" "}
          {recipe?.video ? (
            <a
              href={recipe.video}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Watch Video
            </a>
          ) : (
            "N/A"
          )}
        </p>
        <p className="text-lg">
          <strong>Price:</strong> ${recipe?.price || "N/A"}
        </p>
        <p className="text-lg">
          <strong>Number of Servings:</strong>{" "}
          {recipe?.numberOfService || "N/A"}
        </p>
        <p className="text-lg">
          <strong>Total time:</strong> {recipe?.totalTime || "N/A"}
        </p>
        <p className="text-lg">
          <strong>Created By:</strong> {accountID?.userName || "N/A"}
        </p>

        <div>
          <strong className="block text-lg mb-2">Recipe Tags:</strong>
          <ul className="list-disc pl-5">
            {recipe?.recipeTags?.length > 0 ? (
              recipe.recipeTags.map((tag, index) => (
                <li key={index} className="text-lg">
                  {tagMap[tag.tagId] || "Unknown"}
                </li>
              ))
            ) : (
              <li className="text-lg">N/A</li>
            )}
          </ul>
        </div>

        <p className="text-lg">
          <strong>Status:</strong>
          {recipe?.status === 1
            ? "Censored"
            : recipe?.status === -1
            ? "Uncensored"
            : recipe?.status === 0
            ? "Blocked"
            : "N/A"}
        </p>

        <div>
          <strong className="block text-lg mb-2">Recipe Images:</strong>
          <div className="flex space-x-4 overflow-x-auto">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <img
                  key={index}
                  src={image?.imageUrl || ""}
                  alt={`Recipe image ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              ))
            ) : (
              <p className="text-lg">N/A</p>
            )}
          </div>
        </div>

        <button
          className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
