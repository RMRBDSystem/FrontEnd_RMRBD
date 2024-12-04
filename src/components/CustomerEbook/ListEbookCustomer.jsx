import axios from "axios";
import { useState, useEffect } from "react";
import {
  FaBan,
  FaCheckCircle,
  FaRegClock,
  FaInfoCircle,
  FaFilter,
  FaRegEdit,
  FaPlusCircle, // Icon for Add
} from "react-icons/fa";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Sidebar from "../AccountProfile/Sidebar";

const EbookList = () => {
  const [Ebooks, setEbooks] = useState([]);
  const [accountId, setAccountID] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState(""); // State for name filter
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const navigate = useNavigate();

  useEffect(() => {
    setAccountID(Cookies.get("UserId"));
  }, []);
  useEffect(() => {
    if (accountId) {
      fetchEbooks(); // Fetch data only when accountId is available
    }
  }, [accountId]);
  const fetchEbooks = async () => {
    //https://rmrbdapi.somee.com/odata/Ebook?$filter=createbyid eq ${accountId}
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/Ebook?$filter=createbyid eq ${accountId}`,
        {
          headers: { "Content-Type": "application/json", token: "123-abc" },
        }
      );
      setEbooks(response.data);
    } catch (error) {
      console.error("Error fetching Ebooks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  const handleDetails = (EbookId) => {
    navigate(`/Ebook-list-customer/${EbookId}`);
  };

  const handleEdit = (EbookId) => {
    navigate(`/edit-Ebook/${EbookId}`);
  };

  const handleAddEbook = () => {
    navigate("/add-ebook-customer"); // Navigate to the add Ebook page
  };

  // Columns for DataTable
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Tên sách điện tử",
      selector: (row) => row.ebookName || "Unknown",
      sortable: true,
      filterable: true,
    },
    {
      name: "Ảnh",
      selector: (row) => (
        <img
          src={row.imageUrl || ""}
          alt="Ebook preview"
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
      sortable: false,
    },
    {
      name: "Trạng thái",
      selector: (row) => {
        if (row.status === 0) {
          return (
            <FaBan style={{ color: "red", fontSize: "24px" }} title="Bị khóa" />
          );
        }
        if (row.status === 1) {
          return (
            <FaCheckCircle
              style={{ color: "green", fontSize: "24px" }}
              title="Đã xác nhận"
            />
          );
        }
        if (row.status === -1) {
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
        <div className="">
          {/* Edit Icon */}
          <button
            className="btn btn-link"
            onClick={() => handleEdit(row.EbookId)}
          >
            <FaRegEdit
              style={{ color: "#28a745", fontSize: "24px" }}
              title="Chỉnh sửa"
            />
          </button>

          {/* Info Icon */}
          <button
            className="btn btn-link"
            onClick={() => handleDetails(row.EbookId)}
          >
            <FaInfoCircle
              style={{ color: "#007bff", fontSize: "24px" }}
              title="Chi tiết"
            />
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  // Filter Ebooks based on the filters applied (name and status)
  const filteredEbooks = Ebooks.filter((ebook) => {
    return (
      ebook.ebookName.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (statusFilter === "" || ebook.status.toString() === statusFilter)
    );
  });

  return (
    <div className="flex flex-col md:flex-row justify-center items-start p-4 space-y-8 md:space-y-0 md:space-x-8">
      {/* Sidebar */}
      <Sidebar />
      <div className="justify-center items-center bg-gray-100">
        <div
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl"
          style={{ minWidth: "1000px" }}
        >
          {/* Add Ebook Button */}

          <div className="mb-4 flex justify-end">
            <button
              onClick={handleAddEbook}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaPlusCircle className="mr-2" />
              Thêm sách điện tử
            </button>
          </div>
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
              {/* Filter by Ebook Name */}
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sách"
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
            title="Danh sách sách"
            columns={columns}
            data={filteredEbooks}
            progressPending={loading}
            pagination
            responsive
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default EbookList;
