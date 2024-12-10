import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import {
  getAccountData,
  updateInformation,
} from "../services/CustomerService/api";

const UpdateInformation = () => {
  const [accountID, setAccountID] = useState(null);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [accountData, setAccountData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userId = Cookies.get("UserId");
    setAccountID(userId);
    if (userId) {
      fetchAccountData(userId);
    }
  }, []);

  const fetchAccountData = async (userId) => {
    try {
      const data = await getAccountData(userId);
      setAccountData(data);
      setUserName(data.userName);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể tải thông tin tài khoản.",
      });
    }
  };
// Gọi tới api put Account để cập nhật thônng tin
  const handleUpdate = async () => {
    if (!userName) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Tên người dùng không được để trống.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("googleId", accountData.googleId);
    formData.append("email", accountData.email);
    formData.append("status", accountData.accountStatus);
    formData.append("roleId", accountData.roleId);
    formData.append("coin", accountData.coin);
    if (avatar) {
      formData.append("image", avatar);
    } else {
      formData.append("image", accountData.avatar);
    }

    try {
      setIsLoading(true);

      await updateInformation(accountID, formData);

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Tài khoản đã được cập nhật thành công.",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể cập nhật tài khoản.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra xem loại tệp có phải là ảnh hay không
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Vui lòng tải lên một tệp ảnh hợp lệ.",
        });
        return;
      }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start p-4 space-y-8 md:space-y-0 md:space-x-8">
     
      <section className="flex flex-col">
        <div className="section-center w-[1140px] bg-white p-4 rounded-lg shadow-md flex flex-col text-xl">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Cập nhật tài khoản
              </h2>

              <button
                type="submit"
                className={`px-6 py-2 font-medium text-white rounded-lg shadow-md transition duration-300 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 border-b border-gray-300 pb-2 opacity-50">
              <p>
                Chức năng "Cập nhật tài khoản" cho phép bạn thay đổi thông tin
                cá nhân như tên người dùng và ảnh đại diện.
                <p>
                  Bạn có thể cập nhật những thông tin này và nhấn "Cập nhật" để
                  lưu thay đổi. Lưu ý, bạn không thể thay đổi địa chỉ email vì
                  nó là thông tin xác thực của tài khoản.
                </p>
              </p>
            </div>

            {/* Email Field */}
            <div className="border-b border-gray-300 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ Email
              </label>
              <input
                type="text"
                value={accountData.email || ""}
                readOnly
                className="mx-auto px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700"
              />
            </div>

            {/* UserName Field */}
            <div className="border-b border-gray-300 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên người dùng
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isLoading}
                className="mx-auto px-4 py-2 border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Avatar Field */}
            <div className="border-b border-gray-300 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh đại diện
              </label>
              <div className="flex items-center space-x-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-16 h-16 object-cover border border-gray-300 rounded-full"
                  />
                ) : accountData.avatar ? (
                  <img
                    src={accountData.avatar}
                    alt="Current Avatar"
                    className="w-16 h-16 object-cover border border-gray-300 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300 rounded-full">
                    Ảnh
                  </div>
                )}
                <label
                  htmlFor="avatarUpload"
                  className="cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-indigo-500 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                >
                  Chọn ảnh
                </label>
                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isLoading}
                  className="hidden"
                />
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UpdateInformation;
