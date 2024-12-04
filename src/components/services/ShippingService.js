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
    console.log('Creating shipping order with:', { bookDetails, selectedAddress, senderAddress, codAmount });

    // Format sender information
    const senderInfo = {
      from_name: senderAddress.accountName || "Sender",
      from_phone: senderAddress.phoneNumber,
      from_address: senderAddress.addressDetail,
      from_ward_code: String(senderAddress.wardCode),
      from_district_id: parseInt(senderAddress.districtCode),
      from_province_id: parseInt(senderAddress.provinceCode),
    };

    // Get recipient name from selectedAddress
    const recipientName = selectedAddress.accountName || selectedAddress.userName || selectedAddress.recipientName;
    if (!recipientName) {
      throw new Error('Recipient name is required');
    }

    // Calculate total weight and dimensions for all books in the group
    const totalWeight = bookDetails.reduce((sum, book) => {
      const bookWeight = Math.max((book?.weight || 0), 1);
      return sum + (bookWeight * (book?.quantity || 1));
    }, 0);
    
    const maxDimensions = bookDetails.reduce((dims, book) => ({
      length: Math.max(dims.length, book?.length || 1),
      width: Math.max(dims.width, book?.width || 1),
      height: dims.height + ((book?.height || 1) * (book?.quantity || 1)), // Stack books height
    }), { length: 1, width: 1, height: 0 });

    // Calculate total value for insurance
    const totalValue = bookDetails.reduce((sum, book) => {
      return sum + ((book?.price || 0) * (book?.quantity || 1));
    }, 0);

    // Basic order data structure based on GHN documentation
    const orderData = {
      payment_type_id: codAmount > 0 ? 2 : 1, // 2 for COD, 1 for pre-paid
      note: "Book Order",
      required_note: "KHONGCHOXEMHANG",
      client_order_code: "", // Optional: You can generate a unique code here
      to_name: recipientName,
      to_phone: selectedAddress.phoneNumber,
      to_address: selectedAddress.addressDetail,
      to_ward_code: String(selectedAddress.wardCode),
      to_district_id: parseInt(selectedAddress.districtCode),
      from_name: senderInfo.from_name,
      from_phone: senderInfo.from_phone,
      from_address: senderInfo.from_address,
      from_ward_code: senderInfo.from_ward_code,
      from_district_id: senderInfo.from_district_id,
      cod_amount: Math.max(0, parseInt(codAmount) || 0),
      content: "Book Order",
      weight: Math.max(Math.min(Math.ceil(totalWeight), 30000), 1),
      length: Math.max(Math.min(Math.ceil(maxDimensions.length), 150), 10),
      width: Math.max(Math.min(Math.ceil(maxDimensions.width), 150), 10),
      height: Math.max(Math.min(Math.ceil(maxDimensions.height), 150), 10),
      pick_station_id: 0,
      deliver_station_id: 0,
      insurance_value: Math.min(totalValue, 5000000), // Max 5M VND for insurance
      service_id: 0,
      service_type_id: 2,
      order_value: totalValue,
      items: bookDetails.map(book => ({
        name: book.bookName,
        code: book.bookId?.toString(),
        quantity: book.quantity || 1,
        price: book.price || 0,
        length: Math.max(book?.length || 1, 1),
        width: Math.max(book?.width || 1, 1),
        height: Math.max(book?.height || 1, 1),
        weight: Math.max(book?.weight || 1, 1),
        category: {
          level1: "Books"
        }
      }))
    };

    console.log('Shipping order payload:', orderData);

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
