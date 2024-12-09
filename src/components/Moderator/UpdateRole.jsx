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
  const [statusFilter, setStatusFilter] = useState("");
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
  const filteredData = data.filter((row) => {
    const matchesName = row.account?.userName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      !statusFilter || row.status?.toString() === statusFilter;

    return matchesName && matchesStatus;
  });

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "50px",
      style: {
        textAlign: "center",
        fontSize: "1.125rem", // Font lớn hơn (18px)
      },
    },
    {
      name: "Tên người dùng",
      selector: (row) => row.account?.userName || "Không có tên",
      sortable: true,
      style: {
        textAlign: "left",
        fontSize: "1.125rem", // Font lớn hơn (18px)
      },
    },
    {
      name: "Ngày sinh",
      selector: (row) => row.dateOfBirth.split("T")[0], // Display only the date
      sortable: true,
      width: "200px", // Adjusted width for smaller display
      style: { fontSize: "14px" }, // Reduced font size for smaller text
    },
    {
      name: "Hình ảnh CCCD",
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
      width: "200px", // Adjusted width
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-5xl">
        {/* Filter Button */}
        <div className="mb-4 flex items-center justify-between">
          <button
            className="flex items-center text-blue-500 hover:text-blue-700"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter className="mr-2" />
            Bộ lọc
          </button>
        </div>

        {/* Filter Section */}
        {showFilter && (
          <div className="flex flex-wrap items-center mb-4 gap-4 bg-gray-100 p-4 rounded-md">
            <input
              type="text"
              className="border p-2 rounded flex-1 min-w-[200px]"
              placeholder="Tìm kiếm tên người dùng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border p-2 rounded flex-1 min-w-[200px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="-1">Chờ xác nhận</option>
              <option value="0">Bị khóa</option>
              <option value="1">Đã xác nhận</option>
            </select>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
              }}
            >
              Xóa lọc
            </button>
          </div>
        )}

        {/* DataTable */}
        <DataTable
          title="Cập nhật vai trò người dùng"
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          customStyles={{
            table: {
              style: {
                fontSize: '16px', // Apply font size to table
                padding: '10px',
              },
            },
            rows: {
              style: {
                fontSize: '14px', // Font size for rows
              },
            },
            headCells: {
              style: {
                fontSize: '16px', // Font size for header cells
                padding: '10px', // Adjust padding for header cells
                fontWeight: 'bold', // Make header text bold
              },
            },
            cells: {
              style: {
                fontSize: '14px', // Font size for cell content
                padding: '8px', // Padding for individual cells
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AccountProfile;
