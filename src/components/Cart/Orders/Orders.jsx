import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { getShippingOrderStatus } from '../../services/ShippingService';
import { cancelOrder } from '../../services/OrderService';
import { motion } from 'framer-motion';
import LoadingOverlay from '../../shared/LoadingOverlay';
import Swal from 'sweetalert2';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const userId = Cookies.get('UserId');
  const [orderStatuses, setOrderStatuses] = useState({});
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders
        const response = await axios.get('https://rmrbdapi.somee.com/odata/BookOrder', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });

        // Filter orders for current user
        const userOrders = response.data.filter(order => 
          order.customerId === parseInt(userId) && order.orderCode !== null
        );

        // Fetch order details
        const detailsResponse = await axios.get(`https://rmrbdapi.somee.com/odata/BookOrderdetail`, {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });

        // Create a map of order details, filtering by orderId
        const detailsMap = {};
        detailsResponse.data.forEach(detail => {
          if (!detailsMap[detail.orderId]) {
            detailsMap[detail.orderId] = [];
          }
          // Only add details that belong to our user's orders
          if (userOrders.some(order => order.orderId === detail.orderId)) {
            detailsMap[detail.orderId].push(detail);
          }
        });

        console.log('Order details map:', detailsMap);
        console.log('User orders:', userOrders);

        setOrderDetails(detailsMap);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  useEffect(() => {
    const fetchOrderStatuses = async () => {
      const statusPromises = orders.map(async (order) => {
        if (order.orderCode) {
          try {
            const status = await getShippingOrderStatus(order.orderCode);
            return [order.orderId, status];
          } catch (error) {
            console.error(`Error fetching status for order ${order.orderId}:`, error);
            return [order.orderId, null];
          }
        }
        return [order.orderId, null];
      });

      const statuses = await Promise.all(statusPromises);
      const statusMap = Object.fromEntries(statuses);
      setOrderStatuses(statusMap);
    };

    if (orders.length > 0) {
      fetchOrderStatuses();
    }
  }, [orders]);

  const getStatusDisplay = (order) => {
    const shippingStatus = orderStatuses[order.orderId];
    if (!shippingStatus) return 'Đang Xử Lý';

    switch (shippingStatus.status) {
      case 1:
        return 'Đang Xử Lý';
      case 2:
        return 'Đã Hoàn Thành';
      case 3:
        return 'Đã Hủy';
      default:
        return 'Đang Xử Lý';
    }
  };

  const getStatusColor = () => {
    return 'text-orange-800';
  };

  const handleCancelOrder = async (orderCode) => {
    const result = await Swal.fire({
      title: "Xác nhận hủy đơn hàng",
      text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316", // orange-500
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setIsProcessing(true);
        const response = await cancelOrder(orderCode);
        
        await Swal.fire({
          title: "Thành công!",
          text: response.message,
          icon: "success"
        });
        
        window.location.reload();
      } catch (error) {
        console.error('Error cancelling order:', error);
        Swal.fire({
          title: "Lỗi!",
          text: error.message,
          icon: "error"
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div className="container mx-auto px-4 py-8">
        <LoadingOverlay />
      </motion.div>
    );
  }

  return (
    <motion.div>
      {isProcessing && <LoadingOverlay />}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-2xl font-bold mb-6">Đơn Hàng Của Tôi</h1>
        
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">
            Không tìm thấy đơn hàng nào
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-semibold">Mã Đơn Hàng #{order.orderId}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(order.totalPrice)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="font-semibold">Mã Vận Đơn: </span>
                      {order.orderCode}
                    </div>
                  </div>
                </div>

                {orderDetails[order.orderId]?.map((detail) => (
                  <div key={detail.orderDetailId} className="flex items-start gap-4 py-4 border-t">
                    <img
                      src={detail.book?.images?.[0]?.imageUrl || 'placeholder.jpg'}
                      alt={detail.book?.bookName}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex flex-1 justify-between">
                      <div>
                        <h4 className="font-medium">{detail.book?.bookName}</h4>
                        <p className="text-sm text-gray-500">x{detail.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div>{new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(detail.price)}</div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Thành tiền:</span>
                    <span className="text-orange-800">{new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">Tình Trạng: </span>
                    <span className="text-orange-800">
                      {getStatusDisplay(order)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Phí Vận Chuyển: </span>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(order.shipFee)}
                  </div>
                  
                  {orderStatuses[order.orderId]?.status === 1 && (
                    <button
                      onClick={() => handleCancelOrder(order.orderCode)}
                      className="px-4 py-2 bg-orange-400 text-white rounded 
                      hover:bg-orange-600 transition-colors duration-300 ease-in-out"
                    >
                      Hủy Đơn Hàng
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Orders; 