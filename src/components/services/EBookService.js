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

// API lấy danh sách ebook
export const getEbooks = async () => {
    try {
        const response = await axios.get(`${API_URL}/Ebook?$filter=status eq 1`, {
            headers: { token: TOKEN }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching ebooks:", error);
        throw error;
    }
};

// API lấy chi tiết ebook theo ebookId
export const getEbookById = async (ebookId) => {
    try {
        const response = await apiInstance.get(`/Ebook/${ebookId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ebook with ID ${ebookId}:`, error);
        throw error;
    }
};

// API lấy ảnh của ebook theo ebookId
export const getImageByEbookId = async (ebookId) => {
    try {
        const response = await axios.get(`${API_URL}/Image?$filter=EbookId eq ${ebookId}&$top=1`, {
            headers: { token: TOKEN }
        });
        if (response.data && response.data.length > 0) {
            return response.data[0].imageUrl; // Trả về URL của ảnh
        } else {
            console.warn(`No images found for ebook ID ${ebookId}`);
            return 'https://via.placeholder.com/150'; // Trả về URL mặc định nếu không có ảnh
        }
    } catch (error) {
        console.error(`Error fetching images for ebook ID ${ebookId}:`, error);
        return 'https://via.placeholder.com/150'; // Trả về URL mặc định nếu có lỗi
    }
};

// API tạo ebook mới
export const createEbook = async (ebookData) => {
    try {
        const response = await apiInstance.post('/Ebook', ebookData);
        return response.data;
    } catch (error) {
        console.error("Error creating ebook:", error);
        throw error;
    }
};

// API cập nhật ebook theo ebookId
export const updateEbook = async (ebookId, ebookData) => {
    try {
        const response = await apiInstance.put(`/Ebook/${ebookId}`, ebookData);
        return response.data;
    } catch (error) {
        console.error(`Error updating ebook with ID ${ebookId}:`, error);
        throw error;
    }
};

// API xóa ebook theo ebookId
export const deleteEbook = async (ebookId) => {
    try {
        await apiInstance.delete(`/Ebook/${ebookId}`);
    } catch (error) {
        console.error(`Error deleting ebook with ID ${ebookId}:`, error);
        throw error;
    }
};

// Lấy ebook theo categoryId
export const getEbooksByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/Ebook?$filter=categoryId eq ${categoryId} and status eq 1`, {
            headers: { token: TOKEN }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ebooks for category ${categoryId}:`, error);
        throw error;
    }
};
