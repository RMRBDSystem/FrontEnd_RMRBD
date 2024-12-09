import axios from 'axios';

const API_URL = 'https://rmrbdapi.somee.com/odata';
const TOKEN = '123-abc';

const apiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Token': TOKEN,
        'Content-Type': 'application/json'
    }
});

// Get all purchased ebooks for a user
export const getPurchasedEbooks = async (customerId) => {
    try {
        // First get all bookshelf entries for the user
        const bookshelfResponse = await apiInstance.get(`/bookshelf?$filter=customerId eq ${customerId} and status eq 1`);
        
        if (!bookshelfResponse.data || !bookshelfResponse.data.length) {
            return [];
        }

        // Get detailed ebook information for each bookshelf entry
        const purchasedEbooks = await Promise.all(
            bookshelfResponse.data.map(async (bookshelfItem) => {
                try {
                    const ebookResponse = await apiInstance.get(`/ebook/${bookshelfItem.ebookId}`);
                    return {
                        ...ebookResponse.data,
                        purchaseDate: bookshelfItem.purchaseDate,
                        purchasePrice: bookshelfItem.purchasePrice
                    };
                } catch (error) {
                    console.error(`Error fetching ebook details for ID ${bookshelfItem.ebookId}:`, error);
                    return null;
                }
            })
        );

        return purchasedEbooks.filter(ebook => ebook !== null);
    } catch (error) {
        console.error('Error fetching purchased ebooks:', error);
        throw error;
    }
};

// Save an ebook to user's bookshelf
export const saveEbook = async (customerId, ebookId) => {
    try {
        const bookshelfData = {
            customerId: parseInt(customerId),
            ebookId: parseInt(ebookId),
            purchaseDate: new Date().toISOString(),
            status: 1
        };

        const response = await apiInstance.post('/bookshelf', bookshelfData);
        return response.data;
    } catch (error) {
        console.error('Error saving ebook:', error);
        throw error;
    }
};

// Remove an ebook from bookshelf
export const removeFromBookshelf = async (customerId, ebookId) => {
    try {
        const response = await apiInstance.delete(`/bookshelf/${customerId}/${ebookId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing ebook from bookshelf:', error);
        throw error;
    }
}; 