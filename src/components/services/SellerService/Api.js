import axios from "axios";
const API_URL = "https://rmrbdapi.somee.com/odata";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Token: "123-abc",
};
const DEFAULT_HEADERS_FORM = {
  "Content-Type": "multipart/form-data",
  Token: "123-abc",
};

export const fetchRecipes = async (accountId) => {
  const result = await axios.get(
    `${API_URL}/Recipe?$filter=createbyid eq ${accountId}`,
    {
      headers: DEFAULT_HEADERS,
    }
  );
  return result.data;
};
// Hàm để lấy chi tiết công thức
export const getRecipeById = async (recipeId) => {
  const result = await axios.get(`${API_URL}/Recipe/${recipeId}`, {
    headers: DEFAULT_HEADERS,
  });
  return result.data;
};
// Hàm để lấy thông tin tài khoản
export const getAccountById = async (accountId) => {
  const result = await axios.get(`${API_URL}/Account/${accountId}`, {
    headers: DEFAULT_HEADERS,
  });
  return result.data;
};
// Hàm để lấy mảng hình ảnh của công thức
export const getImagesByRecipeId = async (recipeId) => {
  const result = await axios.get(`${API_URL}/Image/Recipe/${recipeId}`, {
    headers: DEFAULT_HEADERS,
  });
  return result.data;
};
// Hàm để lấy tất cả tags
export const getTags = async () => {
  const result = await axios.get(`${API_URL}/Tag`, {
    headers: DEFAULT_HEADERS,
  });
  return result.data;
};

// Hàm để lấy các tag hoạt động
export const fetchActiveTags = async () => {
  const response = await axios.get(`${API_URL}/Tag`, {
    params: {
      $filter: "status eq 1",
    },
    headers: DEFAULT_HEADERS,
  });
  return response.data;
};

// Hàm để tải hình ảnh
export const uploadImageApi = async (image, recipeId) => {
  const url = `${API_URL}/UploadImage/Recipe/${recipeId}`;
  const formData = new FormData();
  formData.append("image", image);
  formData.append("recipeId", recipeId);
  try {
    const response = await axios.post(url, formData, {
      headers: DEFAULT_HEADERS_FORM,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Để có thể bắt lỗi ở nơi gọi hàm
  }
};

// Hàm để lưu RecipeTag
export const saveRecipeTagApi = async (tagId, recipeId) => {
  const urlRecipeTag = `${API_URL}/RecipeTag`;
  const RecipeTagData = {
    tagId,
    recipeId,
  };

  try {
    await axios.post(urlRecipeTag, RecipeTagData, {
      headers: DEFAULT_HEADERS,
    });
  } catch (error) {
    console.error("Error saving RecipeTag:", error);
    throw error; // Để có thể bắt lỗi ở nơi gọi hàm
  }
};

// Hàm để lưu công thức (recipe)
export const saveRecipeApi = async (recipeData) => {
  const url = `${API_URL}/Recipe`;
  try {
    const result = await axios.post(url, recipeData, {
      headers: DEFAULT_HEADERS,
    });
    return result.data;
  } catch (error) {
    console.error("Error saving recipe:", error);
    throw error; // Để có thể bắt lỗi ở nơi gọi hàm
  }
};

// Cập nhật recipe
export const updateRecipe = async (id, updatedRecipe) => {
  const response = await axios.put(`${API_URL}/Recipe/${id}`, updatedRecipe, {
    headers: DEFAULT_HEADERS,
  });
  return response.data;
};

// Lấy các tag hiện tại của recipe
export const getRecipeTags = async (id) => {
  const response = await axios.get(`${API_URL}/RecipeTag/${id}`, {
    headers: DEFAULT_HEADERS,
  });
  return response.data;
};
// Xóa tag của recipe
export const deleteRecipeTag = async (id, tagId) => {
  await axios.delete(`${API_URL}/RecipeTag/${id}/${tagId}`, {
    headers: DEFAULT_HEADERS,
  });
};
// Thêm tag mới vào recipe
export const addRecipeTag = async (tagId, recipeId) => {
  await axios.post(
    `${API_URL}/RecipeTag`,
    { tagId, recipeId },
    { headers: DEFAULT_HEADERS }
  );
};
// Hàm gọi API để lấy danh sách tag có status = 1
export const fetchActiveTags2 = async () => {
    const response = await axios.get(`${API_URL}/Tag`, {
      params: {
        $filter: "status eq 1",
      },
      headers: DEFAULT_HEADERS,
    });
    return response.data || [];
  };2