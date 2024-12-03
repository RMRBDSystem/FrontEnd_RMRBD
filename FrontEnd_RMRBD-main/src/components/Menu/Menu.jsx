import React, { useEffect } from "react";
import "./style.css";
import "./common.css";
import "./popUpWindow.css";
import getDishesFromCategory from "./getDishesFromCategory";

function Menu() {
  useEffect(() => {
    const categorySelector = document.getElementById("categorySelector");

    async function initializeMenu() {
      const loading = document.getElementById("loading");
      loading.style.display = "flex";

      let categories = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      categories = await categories.json();
      categories = categories.categories;

      categorySelector.addEventListener("change", (event) => {
        getDishesFromCategory(categories, event.target.value);
      });
      getDishesFromCategory(categories, "1");
      loading.style.display = "none";
    }

    initializeMenu();
  }, []);

  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { id: "loading", className: "loading" },
      React.createElement("div", { className: "loader" }, "Loading...")
    ),
    React.createElement(
      "header",
      { className: "header" },
      React.createElement(
        "div",
        { className: "max-width-header" },
        React.createElement(
          "div",
          { className: "dflex-row select" },
          React.createElement(
            "select",
            { className: "select-tag", id: "categorySelector" },
            React.createElement("option", { value: "GitFood" }, "GitFood")
          )
        )
      )
    ),
    React.createElement(
      "section",
      { className: "banner dflex-flexend-center", id: "introBanner" },
      React.createElement(
        "div",
        { className: "innerAligment dflex-column-alignCenter-justifyCenter" },
        React.createElement(
          "h1",
          { id: "introBannerH1" },
          React.createElement("span", { className: "sr-only" }, "Dishes category")
        ),
        React.createElement("span", { id: "introBannerSpan" })
      )
    ),
    React.createElement(
      "section",
      null,
      React.createElement(
        "h2",
        { className: "sr-only" },
        "Dishes menu"
      ),
      React.createElement("div", {
        className: "cards dflex-row-wrap-center",
        id: "foodDishes",
      })
    ),
    React.createElement(
      "section",
      { className: "popup-window comments-popup" },
      React.createElement(
        "h2",
        { className: "sr-only" },
        "Meal Comments popup window"
      ),
      React.createElement(
        "div",
        {
          className:
            "popup-window__content dflex-column-alignCenter-justifyFlexStart comments-popup__content",
          id: "popup-comments-window",
        },
        React.createElement(
          "div",
          { className: "popup-window__header comments-popup__header" },
          React.createElement(
            "button",
            {
              className: "popup-window__close comments-popup__close",
              type: "button",
            },
            "\u00d7" // Dấu nhân (×)
          )
        ),
        React.createElement("div", {
          className: "popup-window__body comments-popup__body",
        })
      )
    )
  );
}

export default Menu;
