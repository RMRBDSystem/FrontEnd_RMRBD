import axios from 'axios';

export const createOrderStatus = async (orderId, status, details) => {
  try {
    const response = await axios.post(
      'https://rmrbdapi.somee.com/odata/bookorderstatus',
      {
        orderId: parseInt(orderId),
        status: status,
        statusDate: new Date().toISOString(),
        details: details
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order status:', error);
    throw error;
  }
}; 