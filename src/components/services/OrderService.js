import axios from 'axios';

const API_BASE_URL = "https://rmrbdapi.somee.com/odata";
const API_TOKEN = "123-abc";
const GHN_TOKEN = "4520b255-7ffa-11ef-8e53-0a00184fe694";
const GHN_SHOP_ID = "194692";

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

// Add new GHN service instance
const ghnService = axios.create({
  baseURL: 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2',
  headers: {
    'Content-Type': 'application/json',
    'Token': GHN_TOKEN,
    'ShopId': GHN_SHOP_ID
  }
});

/**
 * Get order details by orderId
 * @param {string} orderId - The order ID to fetch details
 * @returns {Promise<Object>} - Order details including price, customerId, and address details
 */
export const getOrderDetails = async (orderId) => {
    if (!orderId) {
        console.error("Order ID is undefined or null");
        throw new Error("Invalid orderId");
    }

    try {
        console.log("Fetching order details for orderId:", orderId);

        // Fetch order details
        const orderResponse = await orderService.get(`/${orderId}`);
        console.log("Order Details Response:", orderResponse);

        const orderDetails = orderResponse.data;
        if (!orderDetails) {
            throw new Error(`No order details found for orderId: ${orderId}`);
        }

        const clientAddressId = orderDetails.clientAddressId;
        if (!clientAddressId) {
            throw new Error(`No sender address ID found for orderId: ${orderId}`);
        }

        const addressDetails = await getAddressByclientAddressId(clientAddressId);
        console.log("Sender Address Details:", addressDetails);

        return { ...orderDetails, senderAddress: addressDetails };
    } catch (error) {
        console.error(`Error fetching order details: ${error.message}`);
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
        console.error(`Error fetching address details for clientAddressId ${clientAddressId}:`, error.response || error);
        throw error;
    }
};

/**
 * Cancel an order using GHN API and update order status
 * @param {string} orderCode - The GHN order code to cancel
 * @returns {Promise<Object>} - Response from GHN API
 */
export const cancelOrder = async (orderCode) => {
  try {
    console.log(`Attempting to cancel order: ${orderCode}`);
    
    // First, cancel the order with GHN
    const ghnResponse = await ghnService.post('/switch-status/cancel', {
      order_codes: [orderCode]
    });

    console.log("GHN cancel order response:", ghnResponse.data);

    if (ghnResponse.data.code === 200) {
      // Get the order ID from BookOrder using orderCode
      const orderResponse = await axios.get(`${API_BASE_URL}/BookOrder`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': API_TOKEN,
        }
      });

      const order = orderResponse.data.find(o => o.orderCode === orderCode);
      
      if (!order) {
        throw new Error('Order not found');
      }

      // Create new status record
      await axios.post(`${API_BASE_URL}/bookorderstatus`, {
        orderId: order.orderId,
        status: 3, // Status code for cancelled
        statusDate: new Date().toISOString(),
        details: 'cancel' // Update details to 'cancel'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Token': API_TOKEN,
        }
      });

      return { success: true, message: 'Đã hủy đơn hàng thành công' };
    } else {
      throw new Error(ghnResponse.data.message || 'Không thể hủy đơn hàng');
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw new Error(error.response?.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại sau.');
  }
};
