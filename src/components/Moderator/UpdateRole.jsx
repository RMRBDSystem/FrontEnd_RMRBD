import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaBan, FaCheckCircle, FaRegClock, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AccountProfile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);

    // Define headers once
    const headers = { "Content-Type": "application/json", token: "123-abc" };

    try {
      // Call API AccountProfile
      const result = await axios.get(
        "https://localhost:7220/odata/AccountProfile",
        { headers }
      );
      const accountProfiles = result.data;
      setData(accountProfiles);
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetails = (accountId) => {
    navigate(`/update-role/${accountId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen justify-center items-start p-4">
      <ToastContainer />

      {/* Main Content */}
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-7">
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên tài khoản</th>
                <th>Ngày sinh</th>
                <th>Ảnh CMND mặt trước</th>
                <th>Số CMND</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.account?.userName || "Không có tên"}</td>
                    <td>{item.dateOfBirth.split("T")[0]}</td> {/* Display only the date */}
                    <td>
                      {item.frontIdcard && (
                        <img
                          alt="Ảnh CMND mặt trước"
                          className="w-32 h-32 object-cover" // Increase image size
                          src={item.frontIdcard}
                        />
                      )}
                    </td>
                    <td>{item.idcardNumber}</td>
                    <td>
                      {item.status === 0 && (
                        <FaBan
                          style={{
                            color: "red",
                            cursor: "pointer",
                            fontSize: "24px",
                          }}
                          title="Bị khóa"
                        />
                      )}
                      {item.status === 1 && (
                        <FaCheckCircle
                          style={{
                            color: "green",
                            cursor: "pointer",
                            fontSize: "24px",
                          }}
                          title="Đã xác nhận"
                        />
                      )}
                      {item.status === -1 && (
                        <FaRegClock
                          style={{
                            color: "orange",
                            cursor: "pointer",
                            fontSize: "24px",
                          }}
                          title="Chờ được xác nhận"
                        />
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-link"
                        onClick={() => handleDetails(item.accountId)}
                      >
                        <FaInfoCircle
                          style={{
                            color: "#007bff",
                            cursor: "pointer",
                            fontSize: "24px",
                          }}
                          title="Chi tiết"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
