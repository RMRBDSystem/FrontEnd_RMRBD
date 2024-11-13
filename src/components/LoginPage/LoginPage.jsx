import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/Components/LoginPage.css"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import  { useEffect, useState  } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../RouterPage/AuthContext"
const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  useEffect(() => {
    // Kiểm tra cookie UserRole để xác định trạng thái đăng nhập
    const userRole = Cookies.get("UserRole");
    if (userRole) {
      // Nếu đã đăng nhập, điều hướng đến trang tương ứng
      setIsLoggedIn(true);
      navigate(getDashboardPath(userRole));
    }

    // Lắng nghe sự kiện storage để đồng bộ giữa các tab
    const handleStorageChange = (event) => {
      if (event.key === "UserRole") {
        const newUserRole = event.newValue;
        if (newUserRole) {
          navigate(getDashboardPath(newUserRole));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  const getDashboardPath = (role) => {
    switch (role) {
      // case "Moderator":
      //   return "/homepageDashboard";
      // case "Order Distributor":
      //   return "/homepageDashboard";
      // case "Admin":
      //   return "/homepageDashboard";
      // case "Customer":
      //   return "/homepageDashboard";
      // case "Seller":
      //   return "/homepageDashboard";
      default:
        return "/home";
    }
  };


  const handleLogin = async ({ credential }) => {
    const { sub: googleId, email, name: userName } = jwtDecode(credential);
    const data = { googleId, userName, email };

    // const url = `https://localhost:7220/odata/Login`; // test localhost
    const url = `https://rmrbdapi.somee.com/odata/Login`;
    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      const { role, userId } = response.data;

      // Nếu người dùng đã có một vai trò, không cho phép đăng nhập với vai trò khác
      const existingRole = Cookies.get("UserRole");
      if (existingRole && existingRole !== role) {
        alert("Bạn đã đăng nhập với vai trò khác. Vui lòng đăng xuất trước khi đăng nhập lại.");
        return; // Ngăn không cho tiếp tục đăng nhập
      }

      // Lưu vai trò và tên người dùng vào cookie và localStorage
      Cookies.set("UserRole", role, { expires: 1 });
      localStorage.setItem("UserRole", role); // Lưu vào localStorage
      Cookies.set("UserName", userName, { expires: 1 });
      Cookies.set("UserId", userId, { expires: 1 });
      localStorage.setItem("UserName", userName);
      localStorage.setItem("UserId", userId);

      setIsLoggedIn(true);
      // Điều hướng đến dashboard tương ứng
      navigate(getDashboardPath(role));
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-box p-4">
          <div className="logo">
            <img src="/images/LogoA.png" className="img-fluid " alt="RecipeCook LogoA" />
          </div>
          <div>
            <h2 className="text-center mb-3">Log in</h2>
            <p className="text-center mb-4">
              Log in to save and review your favorite recipes.
            </p>
          </div>
          <div className="google-login text-center mb-4">
            <div className="d-flex align-items-center justify-content-center w-100">
              <GoogleLogin
                onSuccess={handleLogin}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </div>
          <div className="register text-center">
            <p>
              Don’t have an account? <a href="#">Join now</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;