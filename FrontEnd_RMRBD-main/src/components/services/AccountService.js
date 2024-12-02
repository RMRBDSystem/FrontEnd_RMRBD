import axios from 'axios';

const API_BASE_URL = 'https://rmrbdapi.somee.com/odata';
const API_HEADERS = {
    'Content-Type': 'application/json',
    'Token': '123-abc'
};

/**
 * Fetches account details by account ID
 * @param {string|number} accountId - The ID of the account to fetch
 * @returns {Promise<Object>} The account data
 * @throws {Error} If the request fails
 */
export const getAccountById = async (accountId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Account/${accountId}`, {
            headers: API_HEADERS
        });
        console.log('API Response for account', accountId, ':', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching account details:', error);
        throw error;
    }
};

/**
 * Fetches all accounts
 * @returns {Promise<Array>} Array of account data
 * @throws {Error} If the request fails
 */
export const getAllAccounts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Account`, {
            headers: API_HEADERS
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
    }
}; 