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

// API lấy danh sách sách
export const getBooks = async () => {
    try {
        const response = await apiInstance.get('/Book'); // Lấy tất cả sách
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};

// API lấy chi tiết sách theo bookId
export const getBookById = async (bookId) => {
    try {
        // Gọi API với URL mới `/Book/{bookId}`
        const response = await apiInstance.get(`/Book/${bookId}`);
        return response.data; // Trả về dữ liệu sách
    } catch (error) {
        console.error(`Error fetching book with ID ${bookId}:`, error);
        throw error;
    }
};

// Lấy ảnh đầu tiên theo BookId với `$top=1`
export const getImagesByBookId = async (bookId) => {
    try {
        const response = await axios.get(`https://rmrbdapi.somee.com/odata/Image?$filter=BookId eq ${bookId}&$top=1`, {
            headers: {
              'token': '123-abc'
            }
        });
        
        // In toàn bộ phản hồi từ API ra console để kiểm tra cấu trúc
        console.log("API Response:", response.data);

        // Kiểm tra phản hồi từ API và cấu trúc dữ liệu
        if (response.data && response.data.length > 0) {
            return response.data[0].imageUrl; // Trả về URL của ảnh đầu tiên nếu có
        } else if (response.data && response.data.value && response.data.value.length > 0) {
            return response.data.value[0].imageUrl; // Trường hợp nếu dữ liệu nằm trong `value`
        } else {
            console.warn(`No images found for book ID ${bookId}`);
            return 'https://via.placeholder.com/150'; // URL mặc định nếu không có ảnh
        }
    } catch (error) {
        console.error(`Error fetching image for book ID ${bookId}:`, error);
        return 'https://via.placeholder.com/150'; // URL mặc định trong trường hợp có lỗi
    }
};



export const getFirstImageByBookId = async (bookId) => {
    try {
        const response = await apiInstance.get(`/Image?$filter=BookId eq ${bookId}`);
        
        if (response.data && response.data.length > 0) {
            return response.data[0].imageUrl;
        } else {
            console.warn(`No image found for book ID ${bookId}`);
            return ''; // Trả về chuỗi rỗng nếu không có ảnh nào
        }
    } catch (error) {
        console.error(`Error fetching image for book ID ${bookId}:`, error);
        return ''; // Trả về chuỗi rỗng nếu có lỗi xảy ra
    }
};


// API tạo sách mới
export const createBook = async (bookData) => {
    try {
        const response = await apiInstance.post('/Book', bookData);
        return response.data;
    } catch (error) {
        console.error("Error creating book:", error);
        throw error;
    }
};

// API cập nhật sách theo bookId
export const updateBook = async (bookId, bookData) => {
    try {
        const response = await apiInstance.put(`/Book/${bookId}`, bookData);
        return response.data;
    } catch (error) {
        console.error(`Error updating book with ID ${bookId}:`, error);
        throw error;
    }
};

// API xóa sách theo bookId
export const deleteBook = async (bookId) => {
    try {
        await apiInstance.delete(`/Book/${bookId}`);
    } catch (error) {
        console.error(`Error deleting book with ID ${bookId}:`, error);
        throw error;
    }
};
