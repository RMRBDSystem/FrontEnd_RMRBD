import axios from 'axios';

const BASE_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';
const FEE_TOKEN = '780e97f0-7ffa-11ef-8e53-0a00184fe694';

const ORDER_INFO_SERVICE_TOKEN = '4520b255-7ffa-11ef-8e53-0a00184fe694';
const SHOP_ID = '194691'; // Use consistent ShopId

const BOOK_ORDER_API_URL = 'https://rmrbdapi.somee.com/odata/BookOrder'; // URL for BookOrder API

const createApiClient = (token, shopId) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Token': token,
            'ShopId': shopId, // Use shopId dynamically
        },
    });
};

const feeApiClient = createApiClient(FEE_TOKEN, SHOP_ID);
const orderInfoServiceApiClient = createApiClient(ORDER_INFO_SERVICE_TOKEN, SHOP_ID);

// Helper function to calculate shipping fee with different service_ids
const getShippingFeeWithService = async (feeData, serviceId) => {
    try {
        feeData.service_id = serviceId;
        const response = await feeApiClient.post('/shipping-order/fee', feeData);
        return response.data;
    } catch (error) {
        console.error(`Error fetching shipping fee with service_id ${serviceId}:`, error.response?.data || error.message);
        throw error; // rethrow to handle fallback logic
    }
};

/**
 * Fetch address details using the BookOrder API
 * @param {Number} orderId - The order ID from BookOrder API
 * @returns {Promise<Object>} - Address details
 */
export const fetchOrderAddress = async (orderId) => {
    try {
        const response = await axios.get(`${BOOK_ORDER_API_URL}/${orderId}`);
        const orderData = response.data;

        if (orderData && orderData.clientAddressId) {
            const clientAddressId = orderData.clientAddressId;
            const addressResponse = await axios.get(`https://rmrbdapi.somee.com/odata/CustomerAddress/${clientAddressId}`);
            
            // Check if the address exists and return it
            if (addressResponse.data) {
                return addressResponse.data;
            } else {
                throw new Error(`No address found for clientAddressId: ${clientAddressId}`);
            }
        } else {
            throw new Error('No clientAddressId found for this order.');
        }
    } catch (error) {
        console.error('Error fetching order address:', error);
        throw error; // Handle error and propagate
    }
};

/**
 * Calculate shipping fee with fallback for multiple services
 * @param {Object} feeData - Fee calculation data
 * @param {Number} orderId - The order ID to fetch address
 * @returns {Promise<Object>} - Shipping fee details
 */
export const calculateShippingFee = async (feeData, orderId) => {
    const serviceIds = [53322, 100039]; // List of service IDs to try

    const senderAddress = await fetchOrderAddress(orderId); // Call fetchOrderAddress correctly
    if (!senderAddress) {
        throw new Error('Sender address not found for this order.');
    }
    console.log('Fetched Sender Address:', senderAddress);

    feeData.sender_district = senderAddress.district;
    feeData.sender_ward = senderAddress.ward;
    feeData.sender_province = senderAddress.province;
    feeData.sender_address = senderAddress.street;

    // Try getting the shipping fee with different service IDs
    for (let serviceId of serviceIds) {
        try {
            console.log('Attempting to get shipping fee with service_id:', serviceId);
            const feeResponse = await getShippingFeeWithService(feeData, serviceId);
            console.log('Shipping Fee Response:', feeResponse);
            return feeResponse;  // Return the successful response
        } catch (error) {
            console.log(`Failed with service_id ${serviceId}, trying next...`);
        }
    }
    
    throw new Error('All shipping fee attempts failed');
};
// Fetch available shipping services
export const getAvailableShippingServices = async (requestData) => {
    try {
        const response = await orderInfoServiceApiClient.post('/shipping-order/available-services', requestData);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching available shipping services:', error);
        throw error;
    }
};

// Get shipping order details
export const getShippingOrderDetails = async (orderCode) => {
    try {
        const response = await orderInfoServiceApiClient.post('/shipping-order/detail', { order_code: orderCode });
        return response.data;
    } catch (error) {
        console.error('Error fetching shipping order details:', error);
        throw error;
    }
};
