import { Navigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Component yêu cầu xác thực
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = Cookies.get('UserRole');

  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang homepage
  if (!userRole) {
    return <Navigate to="/homepageDashboard" />;
  }

  // Nếu người dùng có quyền hợp lệ, cho phép truy cập vào trang
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Chuyển hướng đến trang không có quyền truy cập
  }

  return children; // Hiển thị nội dung của trang
};

export default ProtectedRoute;