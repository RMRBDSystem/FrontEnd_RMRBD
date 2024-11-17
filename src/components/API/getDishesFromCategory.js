import { getLikes } from "./involvementAPI";
import { resetCategoriesAndCountDishes } from "./resetCategoriesAndCountDishes";

const getDishesFromCategory = async (categories, id) => {
  const selectedCategory = categories[id - 1];
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory.strCategory}`
  );
  const data = await response.json();
  const dishes = data.meals.slice(0, 6);

  const likes = await getLikes();
  resetCategoriesAndCountDishes(dishes, categories, id);

  return { dishes, likes };
};

export default getDishesFromCategory;
