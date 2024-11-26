import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ViewRoleUpdateSubmit = () => {
  const navigate = useNavigate();

  const [accountID, setAccountID] = useState(null);
  const [accountProfile, setAccountProfileData] = useState({});
  const [accountData, setAccountData] = useState({});

  useEffect(() => {
    const userId = Cookies.get("UserId");
    setAccountID(userId);
    if (userId) {
      fetchAccountProfileData(userId);
      fetchAccountData(userId);
    }
  }, []);

  const fetchAccountProfileData = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:7220/odata/AccountProfile/${userId}`,
        {
          headers: { "Content-Type": "application/json", Token: "123-abc" },
        }
      );
      const data = response.data;
      setAccountProfileData(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch personal data.");
    }
  };
  const fetchAccountData = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:7220/odata/Account/${userId}`,
        {
          headers: { "Content-Type": "application/json", Token: "123-abc" },
        }
      );
      const data = response.data;
      setAccountData(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch account data.");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleBackButton = () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col md:flex-row justify-center min-h-screen items-start p-4 space-y-8 md:space-y-0 md:space-x-8">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 bg-white p-4 shadow-md rounded-lg">
        <div className="text-center">
          <img
            src={accountData.avatar || "/default-avatar.png"}
            alt="User Avatar"
            className="w-16 h-16 rounded-full mx-auto mb-2"
          />
          <h3 className="font-bold text-lg text-gray-800">
            {accountData.userName || "User"}
          </h3>
          <p className="text-sm text-gray-500">{accountData.email}</p>
        </div>
        <div className="mt-6">
          <ul className="space-y-4">
            <li>
              <a
                href="/update-information"
                className="text-orange-600 hover:underline flex items-center"
              >
                <i className="fas fa-user mr-2"></i> Thông tin cá nhân
              </a>
            </li>
            <li>
              <a
                href="/form-updated-role"
                className="text-orange-600 hover:underline flex items-center"
              >
                <i className="fas fa-cogs mr-2"></i> Thông tin đã yêu cầu
              </a>
            </li>
            <li>
              <a
                href="/list-saved-recipe"
                className="text-orange-600 hover:underline flex items-center"
              >
                <i className="fas fa-heart mr-2"></i> Công thức đã lưu
              </a>
            </li>
            <li>
              <a
                href="/recipecustomer-list"
                className="text-orange-600 hover:underline flex items-center"
              >
                <i className="fas fa-book mr-2"></i> Công thức đã đăng
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-lg max-w-xl w-full p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
            Thông tin đã gửi
          </h2>
          <div className="space-y-8">
            {/* ID Card Number */}
            <div className="flex justify-start items-center space-x-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Mã CCCD
              </label>
              <p className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 w-3/4">
                {accountProfile.idcardNumber || "Chưa có"}
              </p>
            </div>

            {/* Date of Birth */}
            <div className="flex justify-start items-center space-x-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Ngày sinh
              </label>
              <p className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 w-3/4">
                {formatDate(accountProfile.dateOfBirth)}
              </p>
            </div>

            {/* Status */}
            <div className="flex justify-start items-center space-x-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Trạng thái
              </label>
              <div className="flex items-center w-3/4">
                {accountProfile.status === 1 ? (
                  <span className="text-green-500 flex items-center space-x-2">
                    <FaCheckCircle size={20} />
                    <span>Đã được kiểm duyệt</span>
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center space-x-2">
                    <FaTimesCircle size={20} />
                    <span>Chưa được kiểm duyệt</span>
                  </span>
                )}
              </div>
            </div>

            {/* Front ID Card */}
            <div className="flex justify-start items-center space-x-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Ảnh CCCD mặt trước
              </label>
              {accountProfile.frontIdcard ? (
                <div className="w-1/2 flex justify-center">
                  <img
                    src={accountProfile.frontIdcard}
                    alt="Front ID Card"
                    className="w-96 h-60 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              ) : (
                <p className="text-gray-500">Không có ảnh</p>
              )}
            </div>

            {/* Back ID Card */}
            <div className="flex justify-start items-center space-x-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Ảnh CCCD mặt sau
              </label>
              {accountProfile.backIdcard ? (
                <div className="w-1/2 flex justify-center">
                  <img
                    src={accountProfile.backIdcard}
                    alt="Back ID Card"
                    className="w-96 h-60 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              ) : (
                <p className="text-gray-500">Không có ảnh</p>
              )}
            </div>

            {/* Portrait */}
            <div className="flex justify-start items-center space-x-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Ảnh chân dung
              </label>
              {accountProfile.portrait ? (
                <div className="w-1/2 flex justify-center">
                  <img
                    src={accountProfile.portrait}
                    alt="Portrait"
                    className="w-96 h-60 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              ) : (
                <p className="text-gray-500">Không có ảnh</p>
              )}
            </div>

            {/* Bank Account QR */}
            <div className="flex justify-start items-center space-x-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Mã QR ngân hàng
              </label>
              {accountProfile.bankAccountQR ? (
                <div className="w-1/2 flex justify-center">
                  <img
                    src={accountProfile.bankAccountQR}
                    alt="Bank Account QR"
                    className="w-96 h-60 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              ) : (
                <p className="text-gray-500">Không có ảnh</p>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleBackButton}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Quay lại trang chủ
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ViewRoleUpdateSubmit;
