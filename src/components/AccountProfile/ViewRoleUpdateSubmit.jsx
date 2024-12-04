import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaCheckCircle, FaTimesCircle, FaClock, FaBan } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
const ViewRoleUpdateSubmit = () => {
  const navigate = useNavigate();

  const [accountID, setAccountID] = useState(null);
  const [accountProfile, setAccountProfileData] = useState({});

  useEffect(() => {
    const userId = Cookies.get("UserId");
    setAccountID(userId);
    if (userId) {
      fetchAccountProfileData(userId);
    }
  }, []);

  const fetchAccountProfileData = async (userId) => {
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/AccountProfile/${userId}`,
        {
          headers: { "Content-Type": "application/json", Token: "123-abc" },
        }
      );
      const data = response.data;
      setAccountProfileData(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể lấy thông tin cá nhân.",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };
  const handleEdit = () => {
    navigate(`/edit-profile/${accountID}`);
  };
  const handleBackButton = () => {
    Swal.fire({
      title: "Quay lại trang chủ?",
      text: "Bạn có chắc muốn quay lại trang chủ không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, quay lại!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-center min-h-screen items-start p-4 space-y-8 md:space-y-0 md:space-x-8">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 bg-white shadow-lg max-w-6xl w-full p-6">
        <div className="bg-white rounded-lg shadow-lg w-full p-8">
          <h2 className="text-3xl font-semibold text-gray-800 text-start mb-8">
            Thông tin đã gửi
          </h2>
          <div className="mt-8 text-xs text-gray-500 border-b border-gray-300 pb-4 opacity-50">
            <p>
              Lưu ý: Các thông tin trên sẽ được kiểm duyệt trong thời gian sớm
              nhất. Nếu có bất kỳ thay đổi nào, chúng tôi sẽ thông báo qua email
              hoặc tin nhắn cho bạn.
            </p>
          </div>
          <div className="space-y-8 mt-4">
            {/* ID Card Number */}
            <div className="flex justify-start items-center space-x-4 border-b border-gray-300 pb-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Mã CCCD
              </label>
              <p className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 w-3/4">
                {accountProfile.idcardNumber || "Chưa có"}
              </p>
            </div>

            {/* Date of Birth */}
            <div className="flex justify-start items-center space-x-4 border-b border-gray-300 pb-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Ngày sinh
              </label>
              <p className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 w-3/4">
                {formatDate(accountProfile.dateOfBirth)}
              </p>
            </div>

            {/* Status */}
            <div className="flex justify-start items-center space-x-4 border-b border-gray-300 pb-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Trạng thái
              </label>
              <div className="flex items-center w-3/4">
                {accountProfile.status === 1 ? (
                  <span className="text-green-500 flex items-center space-x-2">
                    <FaCheckCircle size={20} />
                    <span>Đã được kiểm duyệt</span>
                  </span>
                ) : accountProfile.status === -1 ? (
                  <span className="text-yellow-500 flex items-center space-x-2">
                    <FaClock size={20} />
                    <span>Trong quá trình kiểm duyệt</span>
                  </span>
                ) : accountProfile.status === -2 ? (
                  <>
                    <span className="text-orange-500 flex items-center space-x-2">
                      <FaBan size={20} />
                      <span>Từ chối</span>
                    </span>
                    <button
                      onClick={handleEdit}
                      className="ml-4 px-4 py-2 bg-indigo-500 text-white text-sm rounded-md hover:bg-indigo-600 transition"
                    >
                      Chỉnh sửa
                    </button>
                  </>
                ) : (
                  <span className="text-red-500 flex items-center space-x-2">
                    <FaTimesCircle size={20} />
                    <span>Đã bị khóa</span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-start items-center space-x-4 border-b border-gray-300 pb-4">
              <label className="block text-base font-medium text-gray-700 mb-1 w-1/4">
                Lưu ý
              </label>
              <div className="flex items-center w-3/4">
                {accountProfile.censorNote}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 border-b border-gray-300 pb-4">
              {/* Front ID Card */}
              <div className="flex flex-col items-center">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Ảnh CCCD mặt trước
                </label>
                {accountProfile.frontIdcard ? (
                  <img
                    src={accountProfile.frontIdcard}
                    alt="Front ID Card"
                    className="w-60 h-60 object-contain rounded-lg border border-gray-300"
                  />
                ) : (
                  <p className="text-gray-500">Không có ảnh</p>
                )}
              </div>

              {/* Back ID Card */}
              <div className="flex flex-col items-center">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Ảnh CCCD mặt sau
                </label>
                {accountProfile.backIdcard ? (
                  <img
                    src={accountProfile.backIdcard}
                    alt="Back ID Card"
                    className="w-60 h-60 object-contain rounded-lg border border-gray-300"
                  />
                ) : (
                  <p className="text-gray-500">Không có ảnh</p>
                )}
              </div>

              {/* Portrait */}
              <div className="flex flex-col items-center">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Ảnh chân dung
                </label>
                {accountProfile.portrait ? (
                  <img
                    src={accountProfile.portrait}
                    alt="Portrait"
                    className="w-60 h-60 object-contain rounded-lg border border-gray-300"
                  />
                ) : (
                  <p className="text-gray-500">Không có ảnh</p>
                )}
              </div>

              {/* Bank Account QR */}
              <div className="flex flex-col items-center">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Mã QR ngân hàng
                </label>
                {accountProfile.bankAccountQR ? (
                  <img
                    src={accountProfile.bankAccountQR}
                    alt="Bank Account QR"
                    className="w-60 h-60 object-contain rounded-lg border border-gray-300"
                  />
                ) : (
                  <p className="text-gray-500">Không có ảnh</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleBackButton}
              className="w-full font-medium py-2 rounded-lg text-white shadow-md transition duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRoleUpdateSubmit;
