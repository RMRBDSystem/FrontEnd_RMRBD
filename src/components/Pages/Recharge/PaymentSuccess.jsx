import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { updateAccountCoin } from '../../services/PaymentSuccess.js';
import { decryptData } from "../../Encrypt/encryptionUtils";


const Success = () => {
  const [userId, setUserId] = useState('');
  const [coin, setCoin] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = decryptData(Cookies.get("UserId"));
    if (storedUserId) {
      setUserId(storedUserId);
      console.log("data: ", storedUserId);
    }

    const storedCoin = localStorage.getItem('Coin');
    if (storedCoin) {
      setCoin(storedCoin);
    }

    const storedPrice = localStorage.getItem('Price');
    if (storedPrice) {
      setPrice(storedPrice);
    }
  }, []);

  useEffect(() => {
    if (userId && coin) {
      updateAccountCoin(userId, coin, price); // Call the imported function
      Cookies.remove("Coin");
      localStorage.removeItem("Coin");
      localStorage.removeItem("Price");
      setLoading(false);
    }
  }, [userId, coin]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-center">
      <h2 className="text-2xl font-bold text-green-500 mb-4">Thanh toán thành công!</h2>
      <p className="text-gray-800">Cảm ơn bạn đã hoàn tất thanh toán.</p>
      <p className="text-sm text-gray-500 mt-4">Bạn có thể xem lịch sử giao dịch của mình trong tài khoản.</p>
      <a href="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Trở về trang chủ
      </a>
    </div>
  );
};

export default Success;