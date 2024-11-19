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

export const getCoinTransactionByAccountId = async (accountId) => {
    if (!accountId) {
        return 0;
    }
    try {
        const response = await apiInstance.get(`/CoinTransaction?$filter=CustomerId eq ${accountId}`);
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        console.error(`Error fetching Account with ID ${accountId}:`, error);
        throw error;
    }
};