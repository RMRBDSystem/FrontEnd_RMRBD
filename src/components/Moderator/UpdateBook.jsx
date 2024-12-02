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

const BookList = () => {
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [censorID, setcensorID] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState(""); // State for name filter
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter

  useEffect(() => {
    setcensorID(Cookies.get("UserId"));
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://rmrbdapi.somee.com/odata/Book",
        {
          headers: { "Content-Type": "application/json", token: "123-abc" },
        }
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching Books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to format date as YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Adjust locale if necessary
  };

  // Columns for DataTable
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Tên sách",
      selector: (row) => row.bookName || "Unknown",
      sortable: true,
      filterable: true,

    },
    {
      name: "Ngày đăng",
      selector: (row) => formatDate(row.createDate) || "Unknown",
      sortable: true,
    },
    {
      name: "Ảnh",
      selector: (row) => (
        <img
          src={row.images?.[0]?.imageUrl || ""}
          alt="Book preview"
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
        <button
          className="btn btn-link"
          onClick={() => console.log("View details for", row.bookId)}
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

  // Filter books based on the filters applied (name and status)
  const filteredBooks = Books.filter((book) => {
    return (
      book.bookName.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (statusFilter === "" || book.status.toString() === statusFilter)
    );
  });

  return (
    <div className="flex-1 ml-0 md:ml-64 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl mx-auto">
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
          <div className="mb-4 flex flex-wrap gap-4">
            {/* Filter by Book Name */}
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách"
              className="border p-2 rounded flex-1"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            {/* Filter by Status */}
            <select
              className="border p-2 rounded flex-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Lọc theo trạng thái</option>
              <option value="0">Bị khóa</option>
              <option value="1">Đã xác nhận</option>
              <option value="-1">Chờ được xác nhận</option>
            </select>
          </div>
        )}

        <DataTable
          title="Danh sách sách"
          columns={columns}
          data={filteredBooks}
          progressPending={loading}
          pagination
          responsive
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
};

export default BookList;
