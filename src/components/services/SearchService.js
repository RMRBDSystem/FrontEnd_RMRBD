import axios from 'axios';

const API_URL = 'https://rmrbdapi.somee.com/odata'; 
const TOKEN = '123-abc';


const apiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Token': TOKEN, 
    },
})

export const searchRecipe = async (searchString) => {
    try {
        const response = await apiInstance.get(`Search/Recipe/${searchString}`);
        return response.data; 
    } catch (error) {
        console.error(`Error searching Recipe with search string ${searchString}:`, error);
        throw error;
    }
};

export const searchEbook = async (searchString) => {

    try {
        const response = await apiInstance.get(`Search/Ebook/${searchString}`);
        return response.data; 
    } catch (error) {
        console.error(`Error searching Ebook with search string ${searchString}:`, error);
        throw error;
    }
};

export const searchBook = async (searchString) => {

    try {
        const response = await apiInstance.get(`Search/Book/${searchString}`);
        return response.data; 
    } catch (error) {
        console.error(`Error searching Bookwith search string ${searchString}:`, error);
        throw error;
    }
};


