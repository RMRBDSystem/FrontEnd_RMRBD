import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function RecipeCard({ recipe }) {
  const [coin, setCoin] = useState("");
  const [purchasedRecipes, setPurchasedRecipes] = useState(new Set());
  const [dataAccount, setDataAccount] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const navigate = useNavigate();

  const maxStars = 5;
  const filledStars = Math.round(recipe.recipeRate || 0);
  const defaultImage = "https://via.placeholder.com/150?text=No+Image"; // Default image URL

  useEffect(() => {
    const asyncEffect = async () => {
      const storedUserId = Cookies.get("UserId");
      if (storedUserId) {
        setAccountId(storedUserId);
      }
      const storedCoin = Cookies.get("Coin");
      if (storedCoin) {
        setCoin(storedCoin);
      }
      await getAccountInfo();
      await getPurchasedRecipes();
    };
    asyncEffect();
  }, [accountId]);

  const handleCardClick = () => {
    if (purchasedRecipes.has(recipe.recipeId)) {
      navigate(`/recipe/${recipe.recipeId}`);
    } else {
        Swal.fire("Thông báo", "Bạn cần mua công thức này để xem chi tiết.", "info");
    }
  };

  const getAccountInfo = async () => {
    const accountId = Cookies.get("UserId");
    try {
      const result = await axios.get(
        `https://rmrbdapi.somee.com/odata/Account/${accountId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      await setDataAccount(result.data);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const getPurchasedRecipes = async () => {
    const storedUserId = Cookies.get("UserId");
    try {
      const result = await axios.get(
        `https://rmrbdapi.somee.com/odata/PersonalRecipe/${storedUserId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      const purchasedIds = new Set(result.data.map((item) => item.recipeId));
      await setPurchasedRecipes(purchasedIds);
    } catch (error) {
      console.error("Error fetching purchased recipes:", error);
    }
  };

  const handleBuy = async () => {
    if (!accountId) {
      Swal.fire({
        title: "Bạn chưa đăng nhập",
        text: "Hãy đăng nhập để thực hiện thao tác này!!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
  
    if (purchasedRecipes.has(recipe.recipeId)) {
      Swal.fire("Thông báo", "Bạn đã mua công thức này rồi.", "info");
      return;
    }
    if (Number(accountId) === Number(recipe.createById)) {
      Swal.fire(
        "Thông báo",
        "Bạn không thể mua công thức của chính mình.",
        "warning"
      );
      return;
    }
  
    const confirmResult = await Swal.fire({
      title: "Xác nhận mua công thức",
      text: `Bạn có muốn mua công thức: ${recipe.recipeName} với giá ${recipe.price} đ không?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });
  
    if (!confirmResult.isConfirmed) {
      return;
    }
  
    try {
      // Fetch seller information
      const sellerResponse = await axios.get(
        `https://rmrbdapi.somee.com/odata/Account/${recipe.createById}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      const sellerData = sellerResponse.data;
  
      const newCoin = coin - recipe.price;
      if (newCoin < 0) {
        Swal.fire(
          "Thông báo",
          "Bạn không đủ tiền để thực hiện giao dịch này.",
          "error"
        );
        return;
      }
  
      const data = {
        coin: newCoin,
        email: dataAccount.email,
        userName: dataAccount.userName,
        googleId: dataAccount.googleId,
        roleId: dataAccount.roleId,
        accountStatus: dataAccount.accountStatus,
      };
      const dataSL = {
        coin: sellerData.coin + recipe.price,
        email: sellerData.email,
        userName: sellerData.userName,
        googleId: sellerData.googleId,
        roleId: sellerData.roleId,
        accountStatus: sellerData.accountStatus,
      };
  
      const dataPR = {
        recipeId: recipe.recipeId,
        customerId: accountId,
        numberOfServices: recipe.numberOfService,
        nutrition: recipe.nutrition,
        tutorial: recipe.tutorial,
        ingredient: recipe.ingredient,
        purchasePrice: recipe.price,
        status: -1,
      };
  
      // Recipe transaction logs
      const dataRT = {
        recipeId: recipe.recipeId,
        customerId: accountId,
        coinFluctuations: parseFloat(-recipe.price),
        date: new Date().toISOString().slice(0, 10),
        status: 1,
        detail: "Buy recipe",
      };
      const dataRTSeller = {
        recipeId: recipe.recipeId,
        customerId: sellerData.accountId,
        coinFluctuations: parseFloat(recipe.price),
        date: new Date().toISOString().slice(0, 10),
        status: 1,
        detail: "Sell recipe",
      };
  
      await axios.put(
        `https://rmrbdapi.somee.com/odata/Account/Info/${accountId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      await axios.put(
        `https://rmrbdapi.somee.com/odata/Account/Info/${recipe.createById}`,
        dataSL,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      await axios.post(
        "https://rmrbdapi.somee.com/odata/PersonalRecipe",
        dataPR,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      await axios.post(
        "https://rmrbdapi.somee.com/odata/RecipeTransaction",
        dataRT,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      await axios.post(
        "https://rmrbdapi.somee.com/odata/RecipeTransaction",
        dataRTSeller,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
  
      Swal.fire({
        title: "Thành công",
        text: "Giao dịch mua công thức đã được thực hiện thành công!",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Tiếp tục mua hàng",
        cancelButtonText: "Công thức đã lưu",
      }).then((result) => {
        if (result.isConfirmed) {
          // Continue shopping
          navigate("/recipe"); // Adjust the route accordingly for continue shopping
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Navigate to saved recipes page
          navigate("/list-saved-recipe"); // Adjust the route for saved recipes
        }
      });
  
      getPurchasedRecipes();
      Cookies.set("Coin", newCoin);
    } catch (error) {
      Swal.fire(
        "Lỗi",
        "Đã xảy ra lỗi trong quá trình giao dịch. Vui lòng thử lại sau.",
        "error"
      );
      console.error("Error during purchase process:", error);
    }
  };
  

  return (
    <div
      className="block p-px bg-gradient-to-br from-blueGray-800 via-blueGray-800 to-blueGray-800 hover:from-yellow-500 hover:via-green-400 hover:to-blue-500 cursor-pointer rounded-lg"
      onClick={handleCardClick}
    >
      <div className="p-5 rounded-lg shadow-md">
        {/* Recipe Image */}
        <img
          src={
            recipe.images && recipe.images.length > 0
              ? recipe.images[0].imageUrl
              : defaultImage
          }
          alt={recipe.recipeName}
          className="block w-full h-60 mb-4 object-cover object-center rounded-lg"
        />

        {/* Recipe Name */}
        <h3 className="font-bold text-white text-lg text-center mb-2">
          {recipe.recipeName}
        </h3>

        {/* Recipe Price */}
        <div className="text-center text-gray-300 text-lg font-semibold mb-4">
          <span className="text-yellow-400">
            {recipe.price.toLocaleString()} đ
          </span>
        </div>

        {/* Recipe Rating */}
        <div className="flex justify-center items-center mb-3">
          {[...Array(maxStars)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < filledStars ? faStar : faStarOutline}
              className={`${
                index < filledStars ? "text-yellow-500" : "text-gray-500"
              } text-lg`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center">
          {purchasedRecipes.has(recipe.recipeId) ? (
            <button
              disabled
              className="text-gray-400 bg-gray-200 px-6 py-2 rounded font-semibold cursor-not-allowed"
            >
              Đã mua
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click from firing
                handleBuy(); // Handle buying recipe
              }}
              className="text-white bg-gradient-to-br from-yellow-500 via-green-300 to-blue-500 px-6 py-2 rounded font-semibold hover:scale-105 transform transition shadow-lg"
            >
              Mua
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export default RecipeCard;
