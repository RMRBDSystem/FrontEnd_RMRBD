import axios from 'axios';

const GHN_TOKEN = '4520b255-7ffa-11ef-8e53-0a00184fe694';
const API_URL = 'https://rmrbdapi.somee.com/odata/SMSSender';
const CUSTOMER_API_URL = 'https://rmrbdapi.somee.com/odata/CustomerAddress';
const GHN_API_BASE = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data';

// Fetch addresses associated with the user
export const fetchAddresses = async (userId) => {
  try {
    const response = await axios.get(CUSTOMER_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Token': '123-abc',
      },
    });
    console.log('Response from API:', response.data); // Log the raw response
    const addresses = response.data.filter((address) => address.accountId === parseInt(userId));
    console.log('Filtered Addresses:', addresses); // Log the filtered addresses
    return addresses;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    toast.error('Failed to load addresses.');
    return [];
  }
};

// Fetch province name from GHN API

let provinceCache = {}; // Initialize it as an empty object

export const getProvinceName = async (provinceCode) => {
  if (provinceCache[provinceCode]) {
    return provinceCache[provinceCode];
  }

  // Fetch the province name if it's not in the cache
  try {
    const response = await axios.get(`${GHN_API_BASE}/province`, {
      headers: { 'Token': GHN_TOKEN },
    });
    const province = response.data.data.find((prov) => prov.ProvinceID === Number(provinceCode));
    const provinceName = province ? province.ProvinceName : 'Unknown Province';
    
    // Cache the result for future use
    provinceCache[provinceCode] = provinceName;
    
    return provinceName;
  } catch (error) {
    console.error('Error fetching province name:', error);
    return 'Unknown Province';
  }
};

// Fetch district name based on province and district code
export const fetchDistrictName = async (provinceCode, districtCode) => {
  try {
    const response = await axios.post(
      `${GHN_API_BASE}/district`,
      { province_id: Number(provinceCode) },
      { headers: { 'Token': GHN_TOKEN } }
    );
    const district = response.data.data.find((dist) => dist.DistrictID === Number(districtCode));
    return district ? district.DistrictName : 'Unknown District';
  } catch (error) {
    console.error('Error fetching district name:', error.response ? error.response.data : error);
    return 'Unknown District';
  }
};

// Fetch ward name based on district code and ward code
export const fetchWardName = async (districtCode, wardCode) => {
  try {
    const response = await axios.post(
      `${GHN_API_BASE}/ward`,
      { district_id: Number(districtCode) },
      { headers: { 'Token': GHN_TOKEN } }
    );
    const ward = response.data.data.find((w) => w.WardCode === wardCode);
    return ward ? ward.WardName : 'Unknown Ward';
  } catch (error) {
    console.error('Error fetching ward name:', error.response ? error.response.data : error);
    return 'Unknown Ward';
  }
};

// Fetch all provinces from GHN
export const fetchProvinces = async () => {
  try {
    const response = await axios.get(`${GHN_API_BASE}/province`, {
      headers: { 'Token': GHN_TOKEN },
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching provinces:', error);
    toast.error('Failed to load provinces.');
    return [];
  }
};

// Fetch all districts in a province from GHN
export const fetchDistricts = async (provinceCode) => {
  try {
    const response = await axios.post(
      `${GHN_API_BASE}/district`,
      { province_id: Number(provinceCode) },
      { headers: { 'Token': GHN_TOKEN } }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    toast.error('Failed to load districts.');
    return [];
  }
};

// Fetch all wards in a district from GHN
export const fetchWards = async (districtCode) => {
  try {
    const response = await axios.post(
      `${GHN_API_BASE}/ward`,
      { district_id: Number(districtCode) },
      { headers: { 'Token': GHN_TOKEN } }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching wards:', error);
    toast.error('Failed to load wards.');
    return [];
  }
};

// Fetch available shipping services from GHN API
export const fetchAvailableServices = async () => {
  try {
    const response = await axios.post(
      'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
      {},
      {
        headers: {
          'Token': GHN_TOKEN,
        },
      }
    );

    if (response.data.code === 200) {
      return response.data.data; // List of available services
    } else {
      console.error('Error fetching available services:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching available services:', error);
    return [];
  }
};

// Fetch the shipping order details (sender and recipient information)
export const fetchShippingOrderDetail = async (orderId) => {
  try {
    const response = await axios.post(
      'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail',
      { order_id: orderId },
      {
        headers: {
          'Token': GHN_TOKEN,
        },
      }
    );
    return response.data.data; // Contains sender and recipient details
  } catch (error) {
    console.error('Error fetching shipping order details:', error);
    return null;
  }
};

// Calculate shipping fee based on service, dimensions, weight, and address details
export const calculateShippingFee = async (
  shopId,
  orderId,
  weight,
  length,
  width,
  height,
  insuranceValue
) => {
  try {
    // Fetch the shipping order details to get sender and recipient addresses
    const shippingOrder = await fetchShippingOrderDetail(orderId);
    console.log("Shipping Order Details:", shippingOrder);
    if (!shippingOrder) {
      console.error('Failed to fetch shipping order details');
      return {
        shipping_fee: 0,
        error: 'Failed to fetch shipping order details',
      };
    }

    const { sender, recipient } = shippingOrder;

    const fromDistrictId = sender.district_id;
    const fromWardCode = sender.ward_code;
    const toDistrictId = recipient.district_id;
    const toWardCode = recipient.ward_code;

    // Fetch available services
    const availableServices = await fetchAvailableServices();

    // Choose a service ID (e.g., the first service in the list or based on some condition)
    const selectedServiceId = availableServices[0]?.service_id || 53322;

    // Calculate the shipping fee using the selected service
    const response = await axios.post(
      'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
      {
        token: GHN_TOKEN,
        service_id: selectedServiceId,
        from_district_id: fromDistrictId,
        from_ward_code: fromWardCode,
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        weight: weight,
        length: length,
        width: width,
        height: height,
        cod_value: insuranceValue,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Token': GHN_TOKEN,
          'ShopId': shopId,
        },
      }
    );

    // Return the fee details from the response
    return response.data.data; // This will contain the shipping fee details
  } catch (error) {
    console.error('Error calculating shipping fee:', error);
    return {
      service_fee: 0,
      insurance_fee: 0,
      shipping_fee: 0,
      cod_fee: 0,
      coupon_value: 0,
      error: 'Failed to calculate shipping fee',
    };
  }
};

export const checkPhoneNumberAvailability = async (phoneNumber) => {
  try {
    const response = await axios.post(`${API_URL}/check`, { phoneNumber });
    return response.data.isAvailable;  // Adjust according to API response format
  } catch (error) {
    throw new Error('Error checking phone number availability.');
  }
};

export const sendOtp = async (phoneNumber) => {
  try {
    const response = await axios.post(`${API_URL}/send`, { phoneNumber });
    return response.data;  // Return response if needed for further handling
  } catch (error) {
    throw new Error('Error sending OTP.');
  }
};

export const verifyOtp = async (phoneNumber, otpCode) => {
  try {
    const response = await axios.post(`${API_URL}/verify`, { phoneNumber, OTPCode: otpCode });
    return response.data;  // Adjust according to API response format
  } catch (error) {
    throw new Error('Error verifying OTP.');
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await fetch(`/api/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error('Failed to update address');
    }

    const updatedAddress = await response.json();
    return updatedAddress;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};