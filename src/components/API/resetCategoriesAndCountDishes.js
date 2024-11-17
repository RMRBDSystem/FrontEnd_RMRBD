export const resetCategoriesAndCountDishes = (dishes, categories, id) => {
    const selectedCategory = categories[id - 1];
    const newDishesCount = dishes.length;
  
    categories.forEach((category) => {
      category.count =
        category.strCategory === selectedCategory.strCategory
          ? newDishesCount
          : 0;
    });
  };
  