import { Navigate } from 'react-router-dom';
import Cookies from "js-cookie";
import {decryptData} from "../Encrypt/encryptionUtils"
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = decryptData(Cookies.get("UserRole"));

  // Nếu không đăng nhập, điều hướng về trang chủ
  if (!userRole) {
    return <Navigate to="/" />;
  }

  // Nếu có danh sách các quyền hợp lệ và quyền người dùng không nằm trong danh sách, chặn truy cập
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Hoặc trang thông báo lỗi tùy chỉnh
  }

  // Nếu tất cả điều kiện đều đúng, render nội dung con
  return children;
};

export default ProtectedRoute;