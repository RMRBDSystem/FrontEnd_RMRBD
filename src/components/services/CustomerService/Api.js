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

export const logout = async () => {
  const response = await axios.post(
    `${API_URL}/Login/logout`,
    {},
    {
      headers: DEFAULT_HEADERS,
    }
  );
  return response.data;
};
// UpdateToSeller
export const updateToSeller = async (accountID, formData) => {
  const result = await axios.post(
    `${API_URL}/AccountProfile/${accountID}`,
    formData,
    {
      headers: DEFAULT_HEADERS_FORM,
    }
  );
  return result.data;
};
// UpdateToSellerInfo + EditRoleUpdate

export const getAccountProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/AccountProfile/${userId}`, {
    headers: DEFAULT_HEADERS_FORM,
  });

  return response.data;
};
// UpdateInfomation

export const getAccountData = async (userId) => {
  const response = await axios.get(`${API_URL}/Account/${userId}`, {
    headers: DEFAULT_HEADERS,
  });
  return response.data;
};
// Cập nhật thông tin tài khoản
export const updateInformation = async (accountID, formData) => {
  const result = await axios.put(`${API_URL}/Account/${accountID}`, formData, {
    headers: DEFAULT_HEADERS_FORM,
  });
  return result.data;
};

// Chuyển URL thành file
export const convertURLToFile = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

// Gửi thông tin lại sau khi Mod từ chối (EditRoleUpdate)
export const updateToSellerResubmit = async (accountID, formData) => {
  const result = await axios.put(
    `${API_URL}/AccountProfile/${accountID}`,
    formData,
    {
      headers: DEFAULT_HEADERS_FORM,
    }
  );
  return result.data;
};
// Lấy công thức đã lưu
export const fetchPersonalRecipes = async (accountId) => {
  const result = await axios.get(
    `${API_URL}/Recipe?$filter=personalRecipes/any(p: p/customerId eq ${accountId})`,
    {
      headers: DEFAULT_HEADERS,
    }
  );

  return result.data;
};
// Lấy chi tiết các trường công thức đã lưu
export const fetchRecipeData = async (userId, recipeId) => {
  const url = `${API_URL}/PersonalRecipe/${userId}/${recipeId}`;
  const response = await axios.get(url, {
    headers: DEFAULT_HEADERS,
  });
  return response.data;
};

export const saveRecipeData = async (userId, recipeId, editFields) => {
  const updatedData = {
    recipeId,
    customerId: userId,
    ...editFields,
    status: -1,
  };
  await axios.put(
    `${API_URL}/PersonalRecipe/${userId}/${recipeId}`,
    updatedData,
    {
      headers: DEFAULT_HEADERS,
    }
  );
  return true;
};

// Lấy danh sách công thức đã mua
export const fetchPurchasedRecipes = async (userId) => {
  const result = await axios.get(`${API_URL}/PersonalRecipe/${userId}`, {
    headers: DEFAULT_HEADERS,
  });

  // Lấy danh sách recipeId từ kết quả trả về và chuyển thành Set để loại bỏ trùng lặp
  const purchasedIds = new Set(result.data.map((item) => item.recipeId));
  return purchasedIds;
};
