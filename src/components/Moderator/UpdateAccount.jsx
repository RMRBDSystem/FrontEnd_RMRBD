import axios from "axios";
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

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [censorID, setcensorID] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setcensorID(Cookies.get("UserId"));
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://rmrbdapi.somee.com/odata/Account?$filter=roleId eq 1 or roleId eq 2",
        {
          headers: { "Content-Type": "application/json", token: "123-abc" },
        }
      );
      setAccounts(response.data);
      console.log("Data", response.data);
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
      width: "50px",
      style: {
        textAlign: "center",
        fontSize: "1.125rem", // Font lớn hơn (18px)
      },
    },
    {
      name: "Tên người dùng",
      selector: (row) => row.userName || "Không rõ",
      sortable: true,
      style: {
        textAlign: "left",
        fontSize: "1.125rem", // Font lớn hơn (18px)
      },
    },
    {
      name: "Vai trò",
      selector: (row) => row.role?.roleName || "Không rõ",
      sortable: true,
      style: {
        textAlign: "left",
        fontSize: "1.125rem", // Font lớn hơn (18px)
      },
    },
    {
      name: "Hình ảnh",
      selector: (row) => (
        <img
          src={row.avatar || ""}
          alt="Account preview"
          className="w-24 h-24 object-cover rounded-md"
        />
      ),
      sortable: false,
    },
    {
      name: "Trạng thái",
      selector: (row) => {
        if (row.accountStatus === 0) {
          return (
            <FaBan className="text-red-500 text-2xl" title="Bị khóa" />
          );
        }
        if (row.accountStatus === 1) {
          return (
            <FaCheckCircle className="text-green-500 text-2xl" title="Đã xác nhận" />
          );
        }
        if (row.accountStatus === -1) {
          return (
            <FaRegClock className="text-orange-500 text-2xl" title="Chờ xác nhận" />
          );
        }
      },
      sortable: true,
    },
    {
      name: "Thao tác",
      selector: (row) => (
        <button
          className="text-blue-500 hover:text-blue-700 text-xl" // Cỡ chữ lớn hơn cho icon
          onClick={() => handleDetails(row.accountId)}
        >
          <svg className="w-8 h-8 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" title="Chi tiết">
            <path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z" />
          </svg>
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
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-5xl">
        <div className="flex justify-end mr-4">
          <button
            className="flex items-center text-blue-500 hover:text-blue-700 text-xl"
            onClick={() => setShowFilter(!showFilter)}
          >
            <svg className="w-6 h-6 dark:text-white mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4" />
            </svg>
            Bộ lọc
          </button>
        </div>
        {showFilter && (
          <div className="mb-4 flex flex-wrap items-center gap-4 bg-gray-100 p-4 rounded-md">
            {/* Filter by Account Name */}
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng"
              className="border border-gray-300 p-2 rounded flex-1 min-w-[200px] text-lg"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            {/* Filter by Status */}
            <select
              className="border border-gray-300 p-2 rounded flex-1 min-w-[200px] text-lg"
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-lg"
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
          progressPending={loading} // Shows a loading spinner when data is being fetched
          pagination
          paginationPerPage={10} // Set the number of rows per page
          paginationRowsPerPageOptions={[5, 10, 15, 20]} // Options for rows per page
          responsive
          highlightOnHover
          striped // Adds alternating row colors for better readability
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

export default AccountList;
