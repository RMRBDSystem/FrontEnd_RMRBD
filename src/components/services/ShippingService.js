import axios from 'axios';

const BASE_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';
const FEE_TOKEN = '780e97f0-7ffa-11ef-8e53-0a00184fe694';

const ORDER_INFO_SERVICE_TOKEN = '4520b255-7ffa-11ef-8e53-0a00184fe694';
const SHOP_ID = '194692'; // Use consistent ShopId

const BOOK_ORDER_API_URL = 'https://rmrbdapi.somee.com/odata/BookOrder'; // URL for BookOrder API

const GHN_STATUS_MAPPING = {
  'ready_to_pick': 1,      // Processing
  'picking': 1,            // Processing
  'picked': 1,             // Processing
  'storing': 1,            // Processing
  'delivering': 1,         // Processing
  'delivered': 2,          // Completed
  'delivery_fail': 3,      // Cancelled
  'cancel': 3,             // Cancelled
  'return': 3,             // Cancelled
  'return_fail': 3,        // Cancelled
  'returned': 3,           // Cancelled
};

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
export const calculateShippingFee = async (feeData) => {
    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
        {
          service_type_id: 2, // Standard delivery service
          insurance_value: 0,  // Insurance value
          coupon: null,      
          ...feeData
        },
        {
          headers: {
            'Token': '4520b255-7ffa-11ef-8e53-0a00184fe694',
            'Shopid': '194692',
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Shipping API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      throw error;
    }
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

/**
 * Create a shipping order with GHN
 * @param {Object} bookDetails - Book details from the API
 * @param {Object} selectedAddress - Selected delivery address
 * @param {Object} senderAddress - Sender's address details
 * @param {Number} codAmount - COD amount (if COD payment)
 * @returns {Promise<Object>} - Shipping order details
 */
export const createShippingOrder = async (bookDetails, selectedAddress, senderAddress, codAmount = 0) => {
  try {
    // Format sender information
    const senderInfo = {
      from_name: senderAddress.accountName || "Sender",
      from_phone: senderAddress.phoneNumber,
      from_address: senderAddress.addressDetail,
      from_ward_name: senderAddress.wardName,
      from_district_name: senderAddress.districtName,
      from_province_name: senderAddress.provinceName,
      return_phone: senderAddress.phoneNumber,
      return_address: senderAddress.addressDetail,
      return_district_id: parseInt(senderAddress.districtCode),
      return_ward_code: senderAddress.wardCode,
    };

    // Get recipient name from selectedAddress
    const recipientName = selectedAddress.accountName || selectedAddress.userName;
    if (!recipientName) {
      throw new Error('Recipient name is required');
    }

    // Format recipient information
    const recipientInfo = {
      to_name: recipientName,
      to_phone: selectedAddress.phoneNumber,
      to_address: selectedAddress.addressDetail,
      to_ward_code: selectedAddress.wardCode,
      to_district_id: parseInt(selectedAddress.districtCode),
    };

    // Basic order data structure based on GHN documentation
    const orderData = {
      payment_type_id: codAmount > 0 ? 2 : 1, // Use 1 for xu payment, 2 for COD
      note: "Book Order",
      required_note: "KHONGCHOXEMHANG",
      to_name: recipientInfo.to_name,
      to_phone: recipientInfo.to_phone,
      to_address: recipientInfo.to_address,
      to_ward_code: recipientInfo.to_ward_code,
      to_district_id: recipientInfo.to_district_id,
      from_name: senderInfo.from_name,
      from_phone: senderInfo.from_phone,
      from_address: senderInfo.from_address,
      from_ward_code: senderAddress.wardCode,
      from_district_id: parseInt(senderAddress.districtCode),
      cod_amount: parseInt(codAmount),
      content: "Book Order",
      weight: 200,
      length: 20,
      width: 20,
      height: 10,
      service_id: 0,
      service_type_id: 2,
      items: bookDetails.map(book => ({
        name: book.bookName,
        quantity: 1,
        price: book.price
      }))
    };

    // Create instance with specific headers
    const instance = axios.create({
      baseURL: 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2',
      headers: {
        'Content-Type': 'application/json',
        'Token': ORDER_INFO_SERVICE_TOKEN,
        'ShopId': SHOP_ID
      },
      timeout: 30000
    });

    const response = await instance.post('/shipping-order/create', orderData);

    if (response.data?.code !== 200) {
      throw new Error(response.data?.message || 'Failed to create shipping order');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating shipping order:', error);
    throw error;
  }
};

export const getShippingOrderStatus = async (orderCode) => {
  try {
    const response = await axios.post(
      'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail',
      { order_code: orderCode },
      {
        headers: {
          'Token': ORDER_INFO_SERVICE_TOKEN,
          'ShopId': SHOP_ID,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data?.code === 200 && response.data?.data) {
      const ghnStatus = response.data.data.status;
      const mappedStatus = GHN_STATUS_MAPPING[ghnStatus] || 1; // Default to Processing if status unknown
      
      return {
        status: mappedStatus,
        statusDate: new Date().toISOString(),
        details: `GHN Status: ${ghnStatus}`,
        ghnData: response.data.data // Include full GHN response for reference
      };
    }
    
    throw new Error('Invalid response from GHN');
  } catch (error) {
    console.error('Error fetching shipping status:', error);
    throw error;
  }
};
