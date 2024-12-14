import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { decryptData } from "../../Encrypt/encryptionUtils";
const RecipeComponent = () => {
  const [data, setData] = useState([]);
  const [dataAccount, setDataAccount] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [coin, setCoin] = useState("");
  const [purchasedRecipes, setPurchasedRecipes] = useState(new Set());
  useEffect(() => {
    const storedUserId = decryptData(Cookies.get("UserId"));
    if (storedUserId) {
      setAccountId(storedUserId);
    }
    const storedCoin = Cookies.get("Coin");
    if (storedCoin) {
      setCoin(storedCoin);
    }
    getData();
    getAccountInfo();
    getPurchasedRecipes();
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get("https://localhost:7220/odata/Recipe", {
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
  
  const getAccountInfo = async () => {
    const accountId = decryptData(Cookies.get("UserId"));
    try {
      const result = await axios.get(
        `https://localhost:7220/odata/Account/${accountId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      setDataAccount(result.data);
      console.log("Data account", result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getPurchasedRecipes = async () => {
    try {
      const result = await axios.get(
        `https://localhost:7220/odata/PersonalRecipe?customerId=${accountId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      // Chuyển đổi danh sách ID công thức đã mua thành `Set` để tra cứu nhanh
      const purchasedIds = new Set(result.data.map((item) => item.recipeId));
      setPurchasedRecipes(purchasedIds);
    } catch (error) {
      console.error("Error fetching purchased recipes:", error);
    }
  };
  const handleSave = async (recipe) => {
    if (purchasedRecipes.has(recipe.recipeId)) {
      alert("You have already purchased this recipe.");
      return;
    }
    console.log("Recipe received:", recipe);
    console.log("AccountId", accountId);
    if (!window.confirm("Are you sure you want to save this recipe?")) return;
    const data = {
      recipeId: recipe.recipeId,
      customerId: accountId,
      numberOfServices: recipe.numberOfService,
      nutrition: recipe.nutrition,
      tutorial: recipe.tutorial,
      ingredient: recipe.ingredient,
      purchasePrice: recipe.price,
      status: -1,
    };
    console.log("Data", data);
    try {
      await axios.post("https://localhost:7220/odata/PersonalRecipe", data, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      alert("Recipe saved successfully.");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleBuy = async (recipe) => {
    if (purchasedRecipes.has(recipe.recipeId)) {
      alert("You have already purchased this recipe.");
      return;
    }
    if (accountId == recipe.createById) {
      alert("You cannot buy your own recipe.");
      return;
    }
    if (
      !window.confirm(
        `Buying recipe: ${recipe.recipeName} for $${recipe.price}. Confirm?`
      )
    ) {
      return;
    }
  
    try {
      // Gọi API để lấy thông tin người bán
      const sellerResponse = await axios.get(
        `https://localhost:7220/odata/Account/${recipe.createById}`,
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
        alert("You don't have enough coins to make this purchase.");
        return;
      }
  
      const coinFlucstration = 0 - recipe.price;
      console.log("Coin",coinFlucstration);
      // Dữ liệu cần gửi
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
  
      const dataRT = {
        recipeId: recipe.recipeId,
        customerId: accountId,
        coinFluctuations: parseFloat(coinFlucstration),
        date: new Date().toISOString().slice(0, 10),
        status: 1,
        detail: "Buy recipe",
      };
  console.log("datart",dataRT);
      const dataRTSeller = {
        recipeId: recipe.recipeId,
        customerId: sellerData.accountId,
        coinFluctuations: parseFloat(recipe.price),
        date: new Date().toISOString().slice(0, 10),
        status: 1,
        detail: "Sell recipe",
      };
  
      // Gửi các request cập nhật dữ liệu
      await axios.put(`https://localhost:7220/odata/Account/${accountId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      await axios.put(
        `https://localhost:7220/odata/Account/${recipe.createById}`,
        dataSL,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      await axios.post("https://localhost:7220/odata/PersonalRecipe", dataPR, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      await axios.post("https://localhost:7220/odata/RecipeTransaction", dataRT, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      await axios.post(
        "https://localhost:7220/odata/RecipeTransaction",
        dataRTSeller,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
  
      alert("Purchase successful! Your coin balance has been updated.");
      setCoin(newCoin);
      Cookies.set("Coin", newCoin);
      setPurchasedRecipes((prev) => new Set([...prev, recipe.recipeId]));
    } catch (error) {
      console.error("Error processing purchase:", error);
      alert("An error occurred while processing your purchase.");
    }
  };
  

  return (
    <div>
      <h1>Recipes</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((recipe) => (
            <li key={recipe.recipeId}>
              <div>Recipe ID: {recipe.recipeId}</div>
              <div>Name: {recipe.recipeName}</div>
              <div>Description: {recipe.description}</div>
              <div>Servings: {recipe.numberOfService}</div>
              <div>Nutrition: {recipe.nutrition}</div>
              <div>Ingredient: {recipe.ingredient}</div>
              <div>Price: ${recipe.price}</div>
              {recipe.price === 0 ? (
                <button onClick={() => handleSave(recipe)}>Save</button>
              ) : (
                <button onClick={() => handleBuy(recipe)}>Buy</button>
              )}
              <br />
              <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RecipeComponent;
