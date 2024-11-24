import axios from 'axios';

const API_BASE_URL = "https://rmrbdapi.somee.com/odata";
const API_TOKEN = "123-abc"; 

// Axios instance for Order service
const orderService = axios.create({
    baseURL: `${API_BASE_URL}/BookOrder`,  
    headers: {
        'Content-Type': 'application/json',
        'Token': API_TOKEN,  
    }
});

const addressService = axios.create({
    baseURL: `${API_BASE_URL}/CustomerAddress`,  
    headers: {
        'Content-Type': 'application/json',
        'Token': API_TOKEN,
    },
});

/**
 * Get order details by orderId
 * @param {string} orderId - The order ID to fetch details
 * @returns {Promise<Object>} - Order details including price, customerId, and address details
 */
export const getOrderDetails = async (orderId) => {
    try {
        console.log("Fetching order details for orderId:", orderId);

        // Step 1: Fetch order details from the BookOrder API
        const orderResponse = await orderService.get(`/${orderId}`);
        console.log("Order Details Response:", orderResponse);

        const orderDetails = orderResponse.data;
        if (!orderDetails) {
            throw new Error(`No order details found for orderId: ${orderId}`);
        }

        const clientAddressId = orderDetails.clientAddressId;
        console.log("Sender Address ID (clientAddressId):", clientAddressId);

        if (!clientAddressId) {
            throw new Error(`No sender address ID (clientAddressId) found for orderId: ${orderId}`);
        }

        const addressDetails = await getAddressByclientAddressId(clientAddressId);
        console.log("Sender Address Details:", addressDetails);

        // Combine order details with sender address details
        return { ...orderDetails, senderAddress: addressDetails };
    } catch (error) {
        console.error(`Error fetching order details or sender address for orderId ${orderId}:`, error);
        throw error;
    }
};
/**
 * Get address details by clientAddressId
 * @param {string} clientAddressId - The address ID to fetch details
 * @returns {Promise<Object>} - Address details
 */
export const getAddressByclientAddressId = async (clientAddressId) => {
    try {
        console.log(`Fetching address details for clientAddressId: ${clientAddressId}`);

        const response = await addressService.get(`/${clientAddressId}`);
        console.log("Address Details Response:", response);

        const addressDetails = response.data;
        if (!addressDetails) {
            throw new Error(`No address details found for clientAddressId: ${clientAddressId}`);
        }

        return addressDetails;
    } catch (error) {
        console.error(`Error fetching address details for clientAddressId ${clientAddressId}:`, error);
        throw error;
    }
};
