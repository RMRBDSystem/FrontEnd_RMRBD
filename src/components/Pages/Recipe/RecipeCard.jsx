import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

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
        const storedUserId = Cookies.get("UserId");
        if (storedUserId) {
            setAccountId(storedUserId);
        }
        const storedCoin = Cookies.get("Coin");
        if (storedCoin) {
            setCoin(storedCoin);
        }
        getAccountInfo();
        getPurchasedRecipes();
    }, [accountId]);

    const handleCardClick = () => {
        navigate(`/recipe/${recipe.recipeId}`);
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
            setDataAccount(result.data);
        } catch (error) {
            console.error("Error fetching account data:", error);
        }
    };

    const getPurchasedRecipes = async () => {
        try {
            const result = await axios.get(
                `https://rmrbdapi.somee.com/odata/PersonalRecipe?customerId=${accountId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Token: "123-abc",
                    },
                }
            );
            const purchasedIds = new Set(result.data.map((item) => item.recipeId));
            setPurchasedRecipes(purchasedIds);
        } catch (error) {
            console.error("Error fetching purchased recipes:", error);
        }
    };

    const handleBuy = async () => {
        if (purchasedRecipes.has(recipe.recipeId)) {
            alert("You have already purchased this recipe.");
            return;
        }
        if (Number(accountId) === Number(recipe.createById)) {
            alert("You cannot buy your own recipe.");
            return;
        }

        if (
            !window.confirm(
                `Buying recipe: ${recipe.recipeName} for ${recipe.price} đ. Confirm?`
            )
        ) {
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
                alert("You don't have enough coins to make this purchase.");
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

            // Update account balances and transaction data
            await axios.put(
                `https://rmrbdapi.somee.com/odata/Account/${accountId}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Token: "123-abc",
                    },
                }
            );
            await axios.put(
                `https://rmrbdapi.somee.com/odata/Account/${recipe.createById}`,
                dataSL,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Token: "123-abc",
                    },
                }
            );
            await axios.post("https://rmrbdapi.somee.com/odata/PersonalRecipe", dataPR, {
                headers: {
                    "Content-Type": "application/json",
                    Token: "123-abc",
                },
            });
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

            alert("Purchase successful!");
            getPurchasedRecipes();
        } catch (error) {
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
                    src={recipe.images && recipe.images.length > 0
                        ? recipe.images[0].imageUrl
                        : defaultImage}
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
                            className={`${index < filledStars ? "text-yellow-500" : "text-gray-500"
                                } text-lg`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent card click from firing
                            handleBuy(); // Handle buying recipe
                        }}
                        className="text-white bg-gradient-to-br from-yellow-500 via-green-300 to-blue-500 px-6 py-2 rounded font-semibold hover:scale-105 transform transition shadow-lg"
                    >
                        Mua
                    </button>
                </div>
            </div>
        </div>
    );
}

// PropTypes configuration
RecipeCard.propTypes = {
    recipe: PropTypes.shape({
        accountId: PropTypes.number.isRequired,
        recipeId: PropTypes.number.isRequired,
        recipeName: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        recipeRate: PropTypes.number,
        images: PropTypes.array, // Add images to prop type
        createById: PropTypes.number.isRequired,
        numberOfService: PropTypes.number.isRequired,
        nutrition: PropTypes.string,
        tutorial: PropTypes.string,
        ingredient: PropTypes.string,
    }).isRequired,
};

export default RecipeCard;
