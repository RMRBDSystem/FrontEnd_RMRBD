
import { useState, useEffect } from "react";
import {
  FaBan,
  FaCheckCircle,
  FaRegClock,
  FaInfoCircle,
  FaFilter,
} from "react-icons/fa";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { listAccountSellerAndCustomer } from "../services/ModeratorService/Api";
import { decryptData } from "../Encrypt/encryptionUtils";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [censorID, setcensorID] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setcensorID(decryptData(Cookies.get("UserId")));
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await listAccountSellerAndCustomer();
      setAccounts(response);
    } catch (error) {
      console.error("Error fetching Accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDetails = (accountId) => {
    navigate(`/update-account-mod/${accountId}`);
  };

  // Columns for DataTable
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Tên người dùng",
      selector: (row) => row.userName || "Unknown",
      sortable: true,
      filterable: true,
    },
    {
      name: "Vai trò",
      selector: (row) => row.role?.roleName || "Unknown",
      sortable: true,
      filterable: true,
    },
    {
      name: "Ảnh",
      selector: (row) => (
        <img
          src={row.avatar || "/images/avatar.png"}
          alt="Account preview"
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
      sortable: false,
    },
    {
      name: "Trạng thái",
      selector: (row) => {
        if (row.accountStatus === 0) {
          return (
            <FaBan style={{ color: "red", fontSize: "24px" }} title="Bị khóa" />
          );
        }
        if (row.accountStatus === 1) {
          return (
            <FaCheckCircle
              style={{ color: "green", fontSize: "24px" }}
              title="Đã xác nhận"
            />
          );
        }
        if (row.accountStatus === -1) {
          return (
            <FaRegClock
              style={{ color: "orange", fontSize: "24px" }}
              title="Chờ được xác nhận"
            />
          );
        }
      },
      sortable: true,
      filterable: true,
    },
    {
      name: "Thao tác",
      selector: (row) => (
        <button
          className="btn btn-link"
          onClick={() => handleDetails(row.accountId)}
        >
          <FaInfoCircle
            style={{ color: "#007bff", fontSize: "24px" }}
            title="Chi tiết"
          />
        </button>
      ),
      sortable: false,
    },
  ];

  // Filter Accounts based on the filters applied (name and status)
  const filteredAccounts = accounts.filter((account) => {
    return (
      account.userName.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (statusFilter === "" || account.accountStatus.toString() === statusFilter)
    );
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
        <div className="mb-4 flex items-center">
          <button
            className="flex items-center text-blue-500 hover:text-blue-700"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter className="mr-2" />
            Bộ lọc
          </button>
        </div>
        {showFilter && (
          <div className="mb-4 flex flex-wrap items-center gap-4 bg-gray-100 p-4 rounded-md">
            {/* Filter by Account Name */}
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng"
              className="border border-gray-300 p-2 rounded flex-1 min-w-[200px]"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            {/* Filter by Status */}
            <select
              className="border border-gray-300 p-2 rounded flex-1 min-w-[200px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Lọc theo trạng thái</option>
              <option value="0">Bị khóa</option>
              <option value="1">Đã xác nhận</option>
              <option value="-1">Chờ được xác nhận</option>
            </select>
            {/* Clear Filter Button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                setNameFilter("");
                setStatusFilter("");
              }}
            >
              Xóa lọc
            </button>
          </div>
        )}

        <DataTable
          title="Danh sách tài khoản"
          columns={columns}
          data={filteredAccounts}
          progressPending={loading}
          pagination
          responsive
          highlightOnHover
        />
      </div>
    </div>
  );
};

export default AccountList;
