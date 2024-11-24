import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getAccountById } from '../../services/AccountService';
//import { AddCoin } from '../../services/AddCoin.js';


const RechargePage = () => {
  const coinOptions = [
    { coins: 5000, price: 5000 },
    { coins: 10000, price: 10000 },
    { coins: 15000, price: 15000 },
    { coins: 20000, price: 20000 },
    { coins: 25000, price: 25000 },
    { coins: 35000, price: 35000 },
    { coins: 450000, price: 450000 }
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [coin, setCoin] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [total, setTotal] = useState(0);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customCoins, setCustomCoins] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PayOS'); // Lưu phương thức thanh toán
  const conversionRate = 1 / 1; // Tỷ lệ quy đổi: 100 xu = 10,500 đồng




  const handleGetPaymentLink = async (coin, userId) => {
    setIsLoading(true);
    const url = `https://rmrbdapi.somee.com/odata/Payment/${userId}/${coin}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Token": "123-abc",
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.statusText}`);
      }

      const link = await response.text();
      if (link.startsWith("http")) {
        Cookies.set("Coin", coin, { expires: 1 });
        localStorage.setItem("Coin", coin);
        window.location.href = link;
      } else {
        console.error("Liên kết thanh toán không hợp lệ:", link);
        alert("Không thể tải trang thanh toán. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Không thể lấy liên kết thanh toán:", error);
      alert("Có lỗi xảy ra khi tải trang thanh toán. Vui lòng kiểm tra kết nối và thử lại.");
    }
    setIsLoading(false);
  };



  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem('UserId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
      const storedUserName = localStorage.getItem('UserName');
      if (storedUserName) {
        setUserName(storedUserName);
      }
      const storedCoin = await getAccountById(Cookies.get("UserId"));
      if (storedCoin) {
        setCoin(storedCoin.coin);
      }
    };
    fetchUserData();
  }, []);
  // Xử lý khi người dùng chọn một gói xu
  const handleSelect = (option) => {
    setSelectedOption(option.coins);
    setTotal(option.price);
  };

  // Mở Modal Custom
  const handleOpenCustomModal = () => {
    setIsCustomModalOpen(true);
    setSelectedOption(null); // Xóa lựa chọn trước đó
  };

  // Đóng Modal Custom
  const handleCloseCustomModal = () => {
    setIsCustomModalOpen(false);
    setCustomCoins('');
    setTotal(0);
  };

  // Xử lý khi nhập số lượng xu custom
  const handleCustomCoinInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Kiểm tra chỉ cho phép nhập số
      setCustomCoins(value);
      setTotal(value * conversionRate); // Cập nhật tổng giá trị theo số xu nhập
    }
  };

  // Gửi yêu cầu tạo link thanh toán hoặc xử lý đơn hàng khi nhận hàng


  return (
    <div className="max-w-[1140px] mx-auto p-6 bg-white rounded-lg shadow-md mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Coins</h2>

      {/* Thông tin người dùng */}
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-4">
        <div className="flex items-center">
          <img
            src="/images/avatar.png"
            alt="User avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-bold text-gray-800">{userName}</p>
            <p className="text-sm text-gray-500">&#11088;{coin}</p>
          </div>
        </div>
        <a href="/coinTransaction" className="text-gray-900 text-xl cursor-pointer">
          View transaction history
        </a>
      </div>

      {/* Thông báo khuyến mãi */}
      <div className="max-w-[450px] bg-yellow-100 p-2 rounded-md mb-4">
        <p className="font-semibold">Time-limited Cash Back Offer</p><span className="text-sm font-bold">Recharge: <span className="font-semibold text-red-500">Save around 25% with a lower third-party service fee.</span></span>
      </div>
      {/* Lựa chọn số xu */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {coinOptions.map((option, index) => (
          <div
            key={index}
            className={`p-3 rounded-sm shadow-sm flex flex-col justify-between ${selectedOption === option.coins ? 'border-3 border-yellow-500' : 'border'
              } cursor-pointer`}
            onClick={() => handleSelect(option)}
          >
            <div className="font-semibold text-gray-900 text-xl text-center mb-1">&#11088; {option.coins}</div>
            <div className="text-gray-600 text-sm text-center">
              {typeof option.price === 'number' ? `₫${option.price.toLocaleString()}` : option.price}
            </div>
          </div>
        ))}

        {/* Tùy chọn Custom */}
        <div
          className="p-3 rounded-sm shadow-sm cursor-pointer border-3"
          onClick={handleOpenCustomModal}
        >
          <div className="font-bold text-2xl mb-1">&#11088; Custom</div>
          <div className="text-gray-600 font-bold text-sm">Large amount supported</div>
        </div>
      </div>

      {/* Chọn phương thức thanh toán */}
      <div className="mb-4">
        <div className="font-bold">
          <label>
            Payment method
            <img
              src="/images/payos_crop.png" 
              alt="PayOS icon"
              className="inline w-30 h-4 ml-4" 
            />
            <img
              src="/images/VietQR.png" 
              alt="VietQR icon"
              className="inline w-30 h-5 ml-1" 
            />
            <img
              src="/images/Napas247.png"
              alt="Napas247 icon"
              className="inline w-30 h-7 ml-1"
            />
          </label>

        </div>
      </div>

      {/* Tổng tiền */}
      <div className="flex justify-start mb-4">
        <p className="text-lg font-medium text-gray-900 mr-4">Total</p>
        <p className="text-xl font-bold text-gray-900">{total ? `₫${total.toLocaleString()}` : '₫0'}</p>
      </div>

      {/* Nút Recharge */}
      <button
        id="create-payment-link-btn"
        onClick={(event) => {
          event.preventDefault();
          handleGetPaymentLink(total, userId);
        }}
        className="min-w-[200px] py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-900 transition"
        disabled={!total || !paymentMethod}
      >
        Recharge
      </button>

      {/* Modal Custom */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Enter Custom Coin Amount</h3>
            <input
              type="text"
              value={customCoins}
              onChange={handleCustomCoinInput}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter amount of coins"
            />
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-medium text-gray-800">Total</p>
              <p className="text-lg font-medium text-gray-800">{`₫${total.toLocaleString()}`}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseCustomModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                id="create-payment-link-btn"
                onClick={(event) => {
                  event.preventDefault();
                  handleGetPaymentLink(total, userId);
                }}
                className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                disabled={!total || !paymentMethod || isLoading}
              >
                {isLoading ? "Waiting..." : "Recharge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default function App() {
  return <RechargePage />;
}
