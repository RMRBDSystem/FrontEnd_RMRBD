import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBan,
  FaCheckCircle,
  FaRegClock,
  FaInfoCircle,
  FaFilter,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";

const AccountProfile = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [showFilter, setShowFilter] = useState(false); // State to control the filter visibility

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const headers = { "Content-Type": "application/json", token: "123-abc" };

    try {
      const result = await axios.get(
        "https://rmrbdapi.somee.com/odata/AccountProfile",
        { headers }
      );
      setData(result.data);
    } catch (error) {
      console.error("Error fetching account data:", error);
    } 
  };

  const handleDetails = (accountId) => {
    navigate(`/update-role/${accountId}`);
  };

  // Filter the data based on the search term
  const filteredData = data.filter((row) =>
    row.account?.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: "STT",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px", // Reduced width for smaller display
    },
    {
      name: "Tên người dùng",
      selector: (row) => row.account?.userName || "Không có tên",
      sortable: true,
      width: "250px", // Adjusted width
      style: { fontSize: "14px" }, // Reduced font size for smaller text
    },
    {
      name: "Ngày sinh",
      selector: (row) => row.dateOfBirth.split("T")[0], // Display only the date
      sortable: true,
      width: "120px", // Adjusted width for smaller display
      style: { fontSize: "14px" }, // Reduced font size for smaller text
    },
    {
      name: "Ảnh CMND mặt trước",
      cell: (row) =>
        row.frontIdcard ? (
          <img
            alt="Ảnh CMND mặt trước"
            className="w-24 h-24 object-cover rounded-md" // Reduced size for image
            src={row.frontIdcard}
          />
        ) : (
          "Không có"
        ),
      width: "250px", // Adjusted width
      height: "150px", // Adjusted height
    },
    {
      name: "Số CMND",
      selector: (row) => row.idcardNumber,
      sortable: true,
      width: "120px", // Adjusted width
      style: { fontSize: "14px" }, // Reduced font size for smaller text
    },
    {
      name: "Trạng thái",
      cell: (row) =>
        row.status === 0 ? (
          <FaBan style={{ color: "red", fontSize: "18px" }} title="Bị khóa" /> // Reduced icon size
        ) : row.status === 1 ? (
          <FaCheckCircle
            style={{ color: "green", fontSize: "18px" }}
            title="Đã xác nhận"
          />
        ) : (
          <FaRegClock
            style={{ color: "orange", fontSize: "18px" }}
            title="Chờ xác nhận"
          />
        ),
      sortable: true,
      width: "120px", // Adjusted width
    },
    {
      name: "Thao tác",
      cell: (row) => (
        <button
          className="btn btn-link p-0"
          onClick={() => handleDetails(row.accountId)}
        >
          <FaInfoCircle
            style={{ color: "#007bff", fontSize: "18px" }} // Reduced icon size
            title="Chi tiết"
          />
        </button>
      ),
      width: "120px", // Adjusted width
    },
  ];


  return (
    <div className="flex-1 p-4">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-5">
        {/* Filter button with icon */}
        <div className="mb-4 flex items-center justify-between">
          <button
            className="flex items-center text-blue-500 hover:text-blue-700"
            onClick={() => setShowFilter(!showFilter)} // Toggle filter visibility
          >
            <FaFilter className="mr-2" />
            Bộ lọc
          </button>
        </div>

        {showFilter && (
          <div className="flex flex-wrap mb-4 gap-4 bg-gray-100 p-4 rounded-md">
            <input
              type="text"
              className="form-control ml-2 p-2 text-sm"
              placeholder="Tìm kiếm tên người dùng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* DataTable component */}
        <DataTable
          title="Danh sách tài khoản"
          columns={columns}
          data={filteredData} // Use filtered data
          pagination
          highlightOnHover
          striped
          customStyles={{
            rows: {
              style: {
                fontSize: "14px", // Smaller font size for rows
                padding: "12px", // Reduced row padding
              },
            },
            headCells: {
              style: {
                fontSize: "16px", // Smaller font size for headers
                padding: "10px", // Reduced header padding
              },
            },
            cells: {
              style: {
                padding: "10px", // Reduced cell padding
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AccountProfile;
