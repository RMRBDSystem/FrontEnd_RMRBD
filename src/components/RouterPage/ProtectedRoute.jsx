import { Navigate } from 'react-router-dom';
import Cookies from "js-cookie";
// Component yêu cầu xác thực
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = Cookies.get('UserRole');

  // Nếu đã đăng nhập, điều hướng đến trang dashboard tương ứng
  if (userRole) {
    // Nếu người dùng có quyền hợp lệ, cho phép truy cập vào trang
    if (!allowedRoles || allowedRoles.includes(userRole)) {
      return children;  // Hiển thị nội dung của trang
    }
  }
  else {
    return <Navigate to="/home" />;
  }
  return children;
};


export default ProtectedRoute;