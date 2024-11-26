import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";

const UpdateAccount = () => {
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
      const response = await axios.get(
        `https://localhost:7220/odata/Account/${userId}`,
        {
          headers: { "Content-Type": "application/json", Token: "123-abc" },
        }
      );
      const data = response.data;
      setAccountData(data);
      setUserName(data.userName);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch account data.");
    }
  };

  const handleUpdate = async () => {
    if (!userName) {
      toast.error("UserName cannot be empty.");
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

      await axios.put(
        `https://localhost:7220/odata/Account/${accountID}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data", Token: "123-abc" },
        }
      );
      toast.success("Account updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update account.");
    } finally {
      setIsLoading(false); // Kết thúc gửi request, trạng thái nút trở lại bình thường
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image.");
        return;
      }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <ToastContainer />
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

        {/* Update Form */}
        <div className="flex-1 bg-white rounded-lg shadow-lg max-w-xl w-full p-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Update Account
          </h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="text"
                value={accountData.email || ""}
                readOnly
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700"
              />
            </div>

            {/* UserName Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Avatar Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar
              </label>
              <div className="flex items-center space-x-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                  />
                ) : accountData.avatar ? (
                  <img
                    src={accountData.avatar}
                    alt="Current Avatar"
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300">
                    Image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isLoading}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-indigo-500 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className={`w-full font-medium py-2 rounded-lg ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                }`}
                disabled={isLoading} // Vô hiệu hóa khi đang loading
              >
                {isLoading ? "Updating..." : "Update Account"}{" "}
                {/* Hiển thị trạng thái */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateAccount;
