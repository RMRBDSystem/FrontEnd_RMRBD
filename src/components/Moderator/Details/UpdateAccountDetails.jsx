import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSave, FaArrowLeft } from "react-icons/fa";

const AccountDetail = () => {
  const { accountId } = useParams(); // Lấy ID từ URL
  const [account, setAccount] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [status, setStatus] = useState();

  // Hàm lấy chi tiết tài khoản
  const fetchAccountDetail = async () => {
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/Account/${accountId}`,
        {
          headers: { "Content-Type": "application/json", Token: "123-abc" },
        }
      );
      const accountData = response.data;
      if (accountData.roleId === 1 || accountData.roleId === 2) {
        setAccount(accountData);
        setStatus(accountData.accountStatus);
        setMainImage(accountData.avatar);
      } else {
        // Nếu roleId không phải là 1 hoặc 2, thông báo lỗi hoặc xử lý khác
        Swal.fire({
          title: "Lỗi",
          text: "Tài khoản không có quyền truy cập.",
          icon: "error",
          showCancelButton: false,
        }).then(() => {
          // Quay lại trang trước khi người dùng nhấn OK
          window.history.back();
        });
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      Swal.fire("Lỗi", "Không thể tải thông tin tài khoản.", "error");
    }
  };

  // Hàm lưu cập nhật
  const handleSave = async () => {
    const confirmResult = await Swal.fire({
      title: "Bạn có chắc chắn muốn thay đổi trạng thái?",
      text: "Điều này sẽ cập nhật trạng thái tài khoản!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (confirmResult.isConfirmed) {
      try {
        const updatedAccount = {
          ...account,
          accountStatus: status,
        };
        await axios.put(
          `https://rmrbdapi.somee.com/odata/Account/info/${accountId}`,
          updatedAccount,
          {
            headers: { "Content-Type": "application/json", Token: "123-abc" },
          }
        );
        Swal.fire("Thành công!", "Tài khoản đã được cập nhật.", "success");
      } catch (error) {
        console.error("Error updating account:", error);
        Swal.fire("Thất bại!", "Không thể cập nhật tài khoản.", "error");
      }
    }
  };

  useEffect(() => {
    fetchAccountDetail();
  }, [accountId]);

  if (!account) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {account.accountName || "N/A"}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Section */}
        <div className="flex-1">
          <img
            src={mainImage || "https://via.placeholder.com/400"}
            alt="Account"
            className="rounded-lg shadow-md object-cover w-full h-64 lg:h-full"
          />
        </div>

        {/* Details Section */}
        <div className="flex-1 space-y-4">
          <div>
            <span className="font-semibold">Tên người dùng:</span>{" "}
            {account.userName || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Email:</span>{" "}
            {account.email || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Vai trò:</span>{" "}
            {account.role.roleName || "N/A"}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Trạng thái:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            >
              <option value={1}>Xác nhận</option>
              <option value={0}>Khóa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-4">
        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 shadow-lg transform transition-transform duration-300 hover:scale-105"
        >
          <FaSave className="text-lg" />
          <span>Lưu</span>
        </button>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 shadow-lg transform transition-transform duration-300 hover:scale-105"
        >
          <FaArrowLeft className="text-lg" />
          <span>Quay lại</span>
        </button>
      </div>
    </div>
  );
};

export default AccountDetail;
