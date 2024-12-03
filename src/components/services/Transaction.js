import axios from 'axios';
const API_URL = 'https://rmrbdapi.somee.com/odata';
const TOKEN = '123-abc';


const apiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Token': TOKEN,
    },
});

export const getCoinTransactionByAccountId = async (accountId) => {
    if (!accountId) {
        return 0;
    }
    try {
        const response = await apiInstance.get(`/CoinTransaction?$filter=CustomerId eq ${accountId} and status eq 1&$orderby=date desc`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching Account with ID ${accountId}:`, error);
        throw error;
    }
};

export const getCoinTransactionByCoinTransactionId = async (coinTransactionId) => {
    if (!coinTransactionId) {
        return 0;
    }
    try {
        const response = await apiInstance.get(`/CoinTransaction?$filter=CoinTransactionId eq ${coinTransactionId}`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching Account with ID ${coinTransactionId}:`, error);
        throw error;
    }
}

export const addCoinTransaction = async (newCoinTransaction) => {
    try {
        const response = await apiInstance.post('/CoinTransaction', newCoinTransaction);
        return response; 
    } catch (error) {
        console.error(`Error adding CoinTransaction:`, error);
        throw error;
    }
};

export const getWithdrawCoinTransactionByAccountId = async (accountId) => {
    if (!accountId) {
        return 0;
    }
    try {
        const response = await apiInstance.get(`/CoinTransaction?$filter=CustomerId eq ${accountId} and coinFluctuations lt 0&$orderby=date desc`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching Account with ID ${accountId}:`, error);
        throw error;
    }
};

export const getNotDonWithdrawCoinTransactionByAccountId = async (accountId) => {
    if (!accountId) {
        return 0;
    }
    try {
        const response = await apiInstance.get(`/CoinTransaction?$filter=CustomerId eq ${accountId} and coinFluctuations lt 0 and status eq -1`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching Account with ID ${accountId}:`, error);
        throw error;
    }
};

export const getWithdraw = async () => {
    try {
        const response = await apiInstance.get(`/CoinTransaction?$filter=coinFluctuations lt 0 and status eq -1`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching Account with ID ${accountId}:`, error);
        throw error;
    }
}

export const updateCoinTransaction = async (coinTransaction) => {
    try {
        const response = await apiInstance.put(`/CoinTransaction/${coinTransaction.coinTransactionId}`, coinTransaction);
        return response; 
    } catch (error) {
        console.error(`Error updating CoinTransaction with ID ${coinTransaction.coinTransactionId}:`, error);
        throw error;
    }
}
