
import React, { useState, useEffect } from "react";
import "./style.css";
import "./common.css";
import "../../assets/styles/Components/popUpWindow.css";
import getDishesFromCategory from "./getDishesFromCategory";

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("1");
    const [isLoading, setIsLoading] = useState(false);
    const [bannerInfo, setBannerInfo] = useState({
        backgroundImage: "",
        title: "",
        description: "",
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    "https://www.themealdb.com/api/json/v1/1/categories.php"
                );
                const data = await response.json();
                setCategories(data.categories || []);
                renderIntro(data.categories[0]); // Load initial category intro
                getDishesFromCategory(data.categories, "1"); // Load initial dishes
            } catch (error) {
                console.error("Error fetching categories:", error);
                setError("Failed to fetch categories. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const renderIntro = (categoryInfo) => {
        setBannerInfo({
            backgroundImage: `url('${categoryInfo.strCategoryThumb}')`,
            title: categoryInfo.strCategory,
            description: `${categoryInfo.strCategoryDescription.substring(0, 250)}...`,
        });
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        const selectedCategoryInfo = categories.find(
            (cat) => cat.idCategory === category
        );
        if (selectedCategoryInfo) renderIntro(selectedCategoryInfo);
        getDishesFromCategory(categories, category);
    };

    return (
        <>
            <div>
                {isLoading && (
                    <div id="loading" className="loading">
                        <div className="loader">Loading...</div>
                    </div>
                )}
                {error && <div className="error-message">{error}</div>}

                <header className="header">
                    <div className="max-width-header">
                        <div className="dflex-row select">
                            <select
                                className="select-tag"
                                id="categorySelector"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                {categories.map((category) => (
                                    <option key={category.idCategory} value={category.idCategory}>
                                        {category.strCategory}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                <section
                    className="banner dflex-flexend-center"
                    id="introBanner"
                >
                    <div className="innerAligment dflex-column-alignCenter-justifyCenter">
                        <h1 id="introBannerH1">
                            <span className="sr-only">Dishes category</span>
                        </h1>
                        <span id="introBannerSpan"></span>
                    </div>
                </section>

                <section>
                    <h2 className="sr-only">Dishes menu</h2>
                    <div className="cards dflex-row-wrap-center" id="foodDishes">
                        {/* List loaded dynamically */}
                    </div>
                </section>

                <section className="popup-window comments-popup">
                    <h2 className="sr-only">Meal Comments popup window</h2>
                    <div
                        className="popup-window__content dflex-column-alignCenter-justifyFlexStart comments-popup__content"
                        id="popup-comments-window"
                    >
                        <div className="popup-window__header comments-popup__header">
                            <button
                                className="popup-window__close comments-popup__close"
                                type="button"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="popup-window__body comments-popup__body"></div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Menu;
