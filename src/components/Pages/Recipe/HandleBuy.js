// src/components/HandleBuy.js
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const HandleBuy = async (
  recipe,
  accountId,
  coin,
  purchasedRecipes,
  getAccountInfo,
  getPurchasedRecipes,
  setCoin,
  dataAccount,
  navigate // Thêm navigate như một tham số
) => {
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
    Swal.fire({
      title: "Thông báo",
      text: "Đây là công thức mà bạn đã tạo, bạn muốn xem chứ?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Xem công thức",
      cancelButtonText: "Ở lại trang",
    }).then((result) => {
      if (result.isConfirmed) {
        // Điều hướng tới trang chi tiết công thức
        navigate(`/recipe-customer-detail/${recipe.recipeId}`);
      }
      // Nếu nhấn "Hủy", không làm gì cả, ở lại trang
    });
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

  // Show "Transaction in Progress" message
  const loadingToast = Swal.fire({
    title: "Đang giao dịch...",
    html: "Vui lòng đợi trong khi chúng tôi xử lý giao dịch của bạn.",
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false, // Prevent closing while loading
  });

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
      loadingToast.close(); // Close the loading toast
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

    Swal.fire(
      "Thành công",
      "Giao dịch mua công thức đã được thực hiện thành công!",
      "success"
    );
    getPurchasedRecipes();
    Cookies.set("Coin", newCoin);
  } catch (error) {
    Swal.fire(
      "Lỗi",
      "Đã xảy ra lỗi trong quá trình giao dịch. Vui lòng thử lại sau.",
      "error"
    );
    console.error("Error during purchase process:", error);
  } finally {
    loadingToast.close(); // Close the loading toast when the process is done
  }
};

export default HandleBuy;
