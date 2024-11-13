import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../RouterPage/AuthContext";
import { Button } from "@material-tailwind/react";
const LogoutButton = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const handleLogout = async () => {
    try {
      // Gọi endpoint logout từ server với header chứa token
      await axios.post("https://rmrbdapi.somee.com/odata/Login/logout", {}, {
        headers: {
          "Content-Type": "application/json",
          Token: '123-abc', // Thêm token vào header
        },
      });
      setIsLoggedIn(false);
      // Xóa cookie người dùng
      Cookies.remove("UserRole");
      Cookies.remove("UserName");
      Cookies.remove("UserId");

      localStorage.setItem("loggedOut", "true");
      // Chuyển hướng về trang chính
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button variant="text" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;