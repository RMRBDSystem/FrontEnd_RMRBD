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
export const getCommentsbyRecipeId = async (recipeId) => {
    try {
        const response = await axios.get(`https://rmrbdapi.somee.com/odata/Comment?$filter=RecipeID eq ${recipeId}`, {
            headers: {
                token: '123-abc',
                mode: 'no-cors'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching Recipe Rate:", error);
        throw error;
    }
};
export const getCommentsbyBookId = async (bookId) => {
    try {
        const response = await axios.get(`https://rmrbdapi.somee.com/odata/Comment?$filter=BookID eq ${bookId}`, {
            headers: {
                token: '123-abc',
                mode: 'no-cors'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching Recipe Rate:", error);
        throw error;
    }
};
export const getCommentsbyEBookId = async (ebookId) => {
    try {
        const response = await axios.get(`https://rmrbdapi.somee.com/odata/Comment?$filter=EBookID eq ${ebookId}`, {
            headers: {
                token: '123-abc',
                mode: 'no-cors'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching Recipe Rate:", error);
        throw error;
    }
};
export const createComment = async (CommentData) => {
    try {
        const response = await apiInstance.post('/Comment', CommentData);
        const commentdata = response.data;
        return commentdata
    } catch (error) {
        console.error("Error creating CommentData:", error);
        throw error;
    }
};
export const UpdateComment = async (CommentData,commentId) => {
    try {
        const response = await apiInstance.put(`/Comment/${commentId}`, CommentData);
        const commentdata = response.data;
        return commentdata
    } catch (error) {
        console.error("Error creating CommentData:", error);
        throw error;
    }
};
export const RemoveComment = async (commentId) => {
    try {
        const response = await apiInstance.delete(`/Comment/${commentId}`);
        const commentdata = response.data;
        return commentdata
    } catch (error) {
        console.error("Error creating CommentData:", error);
        throw error;
    }
};
