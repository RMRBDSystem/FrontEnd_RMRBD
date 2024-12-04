import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClockIcon from "/images/icon/iconclock.png"
import SpoonIcon from "/images/icon/iconsspoon.png"
import CheckMarkIcon from "/images/icon/iconscheckmark24.png"
import CommentRecipes from '../CommentItem/CommentRecipes'
const RecipeDetail = () => {
  const { recipeId } = useParams(); // Lấy ID từ URL
  const [recipe, setRecipe] = useState(null);
  const [accountID, setAccountID] = useState(null);
  const [images, setImages] = useState([]); // Thay đổi thành mảng hình ảnh
  const [mainImage, setMainImage] = useState(null);
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
        setMainImage(imageResult.data[0].imageUrl);

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
    <section className="section-center">
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{recipe?.recipeName || "N/A"}</h1>

        <div className="space-y-4">
          <p className="text-lg">
            {recipe?.description || "N/A"}
          </p>
          <p className="text-lg">
            <strong>Tạo bởi:</strong> {accountID?.userName || "N/A"}
          </p>
          <div className="flex flex-col md:flex-row items-start space-x-4">
            {/* Recipe Image Section */}
            <div className="md:w-2/3 relative">
              <img
                src={mainImage}
                alt="Main Recipe"
                className="w-full object-cover rounded-lg shadow-md"
              />
              {/* Thumbnail Images */}
              <div className="flex space-x-4 overflow-x-auto mt-4">
                {images && images.length > 0 ? (
                  images.map((image, index) => (
                    <img
                      key={index}
                      src={image.imageUrl || ""}
                      alt={`Recipe image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-75"
                      onClick={() => setMainImage(image.imageUrl)} // Set main image on click
                    />
                  ))
                ) : (
                  <p className="text-lg">N/A</p>
                )}
              </div>
            </div>

            {/* Recipe Details Section */}
            <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg shadow-md relative">
              {/* Clock Icon */}
              {/* <ClockIcon className="w-6 h-6 text-gray-600 absolute top-2 right-2" /> */}
              <img src={ClockIcon} alt="" className="w-6 h-6 text-gray-600 absolute top-2 right-2" />

              {/* Recipe Details */}
              <p className="text-lg mb-2">
                <strong className="text-gray-800">Khẩu phần:</strong>{" "}
                {recipe?.numberOfService || "N/A"} người
              </p>
              <p className="text-lg mb-2">
                <strong className="text-gray-800">Thời gian:</strong>{" "}
                {recipe?.totalTime || "N/A"} phút
              </p>
              <p className="text-lg">
                <strong className="text-gray-800">Giá:</strong>{" "}
                {recipe?.price || "N/A"} xu
              </p>
              <p className="text-lg">
                <strong>Sự dinh dưỡng:</strong> {recipe?.nutrition || "N/A"}
              </p>
              <p className="text-lg">
                <strong>Năng lượng:</strong> {recipe?.nutrition || "N/A"} kcal
              </p>
              <p className="text-lg mb-2">
                <strong className="text-gray-800">Ngày tạo:</strong>{" "}
                {recipe?.createDate
                  ? new Date(recipe.createDate).toLocaleDateString("vi-VN") // Định dạng ngày theo chuẩn Việt Nam
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="relative flex items-center mb-8">
            <hr className="flex-grow border-t border-black-300" />
            <img src={SpoonIcon} alt="Icon" className="mx-2 w-6 h-6" />
          </div>
          <p className="text-lg">
            <strong>Hướng dẫn</strong>
            {recipe?.tutorial ? (
              <div className="whitespace-pre-line">
                {recipe.tutorial.split('Bước ').map((step, index) => (
                  step && (
                    <div key={index} className="mb-4">
                      <div className="flex items-center mb-1">
                        <img src={CheckMarkIcon} alt="" className="w-5 h-5 mr-2" />
                        <strong>Bước {index}</strong>
                      </div>
                      <div className="ml-7">
                        {step.trim()}
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              "N/A"
            )}
          </p>
          <div className="relative flex items-center mb-8">
            <hr className="flex-grow border-t border-black-300" />
            <img src={SpoonIcon} alt="Icon" className="mx-2 w-6 h-6" />
          </div>
          <p className="text-lg">
            <strong>Thành phần</strong> <br />
            {recipe?.ingredient || "N/A"}
          </p>
          <div>
            <p className="text-lg">
              <strong className="block text-lg mb-2">Thể loại</strong>
            </p>
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

          <div className="relative flex items-center mb-8">
            <hr className="flex-grow border-t border-black-300" />
            <img src={SpoonIcon} alt="Icon" className="mx-2 w-6 h-6" />
          </div>

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
            <strong>Status: </strong>
            {recipe?.status === 1
              ? "Censored"
              : recipe?.status === -1
                ? "Uncensored"
                : recipe?.status === 0
                  ? "Blocked"
                  : "N/A"}
          </p>
          <div className="relative flex items-center mb-8">
            <hr className="flex-grow border-t border-black-300" />
            <img src={SpoonIcon} alt="Icon" className="mx-2 w-6 h-6" />
          </div>
          <CommentRecipes recipeId={recipeId} createById={accountID} />
          <div className="relative flex items-center mb-8">
            <hr className="flex-grow border-t border-black-300" />
            <img src={SpoonIcon} alt="Icon" className="mx-2 w-6 h-6" />
          </div>
          <button
            className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
            onClick={() => window.history.back()}
          >
            Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecipeDetail;
