import axios from 'axios';

const API_URL = 'https://rmrbdapi.somee.com/odata'; // Cấu hình URL API tổng quát
const TOKEN = '123-abc';

// Tạo instance của axios để dễ dàng thêm header cho tất cả các request
const apiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Token': TOKEN, // Thêm header Token
    },
});

// API lấy danh sách coong thuc
export const getRecipes = async () => {
    try {

        // Lấy tất cả recipe
        const response = await axios.get('https://rmrbdapi.somee.com/odata/Recipe', {
            headers: {
              token: '123-abc',
              mode: 'no-cors'
            }
          });
        return response.data;
    } catch (error) {
        console.error("Error fetching Recipe:", error);
        throw error;
    }
};

// API lấy chi tiết sách theo bookId
export const getRecipeById = async (recipeId) => {
    try {
        // Gọi API với URL mới `/Recipe/{recipeId}`
        const response = await apiInstance.get(`/Recipe/${recipeId}`);
        return response.data; // Trả về dữ liệu sách
    } catch (error) {
        console.error(`Error fetching Recipe with ID ${recipeId}:`, error);
        throw error;
    }
};

// Lấy ảnh đầu tiên theo RecipeId với `$top=1`
export const getImagesByRecipeId = async (recipeId) => {
    try {
        const response = await axios.get("https://rmrbdapi.somee.com/odata/Image?$filter=RecipeId eq" + recipeId + "&$top=1", {
            headers: {
              'token': '123-abc'
            }
        });
        
        // Kiểm tra phản hồi từ API và cấu trúc dữ liệu
        if (response.data && response.data.length > 0) {
            
            return response.data[0].imageUrl.Value; // Trả về URL của ảnh đầu tiên nếu có
        } else {
            console.warn(`No images found for Recipe ID ${recipeId}`);
            return 'https://via.placeholder.com/150'; // URL mặc định nếu không có ảnh
        }
    } catch (error) {
        console.error(`Error fetching image for Recipe ID ${recipeId}:`, error);
        return 'https://via.placeholder.com/150'; // URL mặc định trong trường hợp có lỗi
    }
};



export const getFirstImageByRecipeId = async (recipeId) => {
    try {
        const response = await axios.get(`https://rmrbdapi.somee.com/odata/Image?$filter=RecipeId eq ${recipeId}&$top=1&$Select=ImageUrl`,{
            headers: {
                token: '123-abc',
                mode: 'no-cors'
              }
        });
        const imageUrl = response.data;
        return imageUrl; // Trả về URL của ảnh đầu tiên           
    } catch (error) {
        console.error(`Error fetching image for recipe ID ${recipeId}:`, error);
        throw error; // Trả về chuỗi rỗng nếu có lỗi xảy ra
    }
};

