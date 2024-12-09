import axios from "axios";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import {
  FaBan,
  FaCheckCircle,
  FaRegClock,
  FaFilter,
  FaSearch
  // Icon for Add
} from "react-icons/fa";
import Cookies from "js-cookie";

const EbookList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [ebookbyId, setEbookbyId] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [censorNote, setCensorNote] = useState();
  const [status, setStatus] = useState();
  const totalPages = Math.ceil(filteredEbooks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredEbooks.slice(indexOfFirstItem, indexOfLastItem);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedEbookId, setSelectedEbookId] = useState(null);
  const currentUserId = parseInt(Cookies.get('UserId')) || null;

  useEffect(() => {
    fetchEbooks();
    fetchCategories();
    fetchUsers();
  }, []);
  const fetchEbooks = async () => {
    try {
      const response = await axios.get('https://rmrbdapi.somee.com/odata/ebook', {
        headers: { 'Token': '123-abc' },
      });

      setEbooks(response.data);
      setFilteredEbooks(response.data);
    } catch (error) {
      console.error('Error fetching ebooks:', error.response ? error.response.data : error.message);
    }
  };

  const handleSearch = () => {
    let filtered = ebooks.filter((ebook) =>
      ebook.ebookName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedStatus) {
      filtered = filtered.filter((ebook) => ebook.status === parseInt(selectedStatus));
    }
    setFilteredEbooks(filtered);
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://rmrbdapi.somee.com/odata/BookCategory', {
        headers: { 'Token': '123-abc' },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://rmrbdapi.somee.com/odata/Account', {
        headers: { 'Token': '123-abc' },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const formatPrice = (price) => {
    return price === '' ? '' : new Intl.NumberFormat().format(price);
  };

  const editEbook = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn thay đổi trạng thái?",
      text: "Điều này sẽ cập nhật trạng thái tài khoản!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      const censorId = Cookies.get("UserId");
      try {
        const updatedEbook = {
          ...ebookbyId,
          status,
          censorNote,
          censorId,
        };
        await axios.put(
          `https://rmrbdapi.somee.com/odata/Ebook/${selectedEbookId}`,
          //`https://localhost:7220/odata/Recipe/${recipeId}`,
          updatedEbook,
          {
            headers: { "Content-Type": "application/json", Token: "123-abc" },
          }
        );

        Swal.fire({
          title: 'Thành công!',
          text: 'Cập nhật ebook thành công!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        
      } catch (error) {
        console.error("Error updating ebook:", error);
        const errorMessage = error.response?.data || error.message;
        Swal.fire({
          title: 'Lỗi!',
          text: `Lỗi cập nhật ebook: ${errorMessage}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      window.location.reload();
    }
  };

  const handleEditButtonClick = async (ebook) => {
    setModalOpen(true);
    setSelectedEbookId(ebook.ebookId);
    const response = await axios.get(
      //`https://rmrbdapi.somee.com/odata/Recipe/${id}`,
      `https://rmrbdapi.somee.com/odata/Ebook/${ebook.ebookId}`,
      {
        headers: { "Content-Type": "application/json", Token: "123-abc" },
      }
    );
    const ebookData = response.data;
    setCensorNote(ebookData.censorNote || "");
    setStatus(ebookData.status);
    setEbookbyId(ebookData);
  };

  const resetForm = () => {
    setModalOpen(false);
    setSelectedEbookId(null);
  };

  const getCreatorName = (createById) => {
    const creatorId = Number(createById);
    const user = users.find(user => Number(user.accountId) === creatorId);
    return user ? user.userName : 'Unknown';
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h1>
          <p className="text-gray-600">You need to be logged in to view your ebooks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Danh sách báo cáo</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-md px-4 py-2 w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="bg-[#f77c66] text-white px-4 py-2 rounded-md hover:bg-[#f56949] flex items-center"
              onClick={handleSearch}
            >
              <FaSearch className="w-4 h-4 mr-2" />
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-4 mb-4">
          <select
            className="border rounded-md px-4 py-2 w-48"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Chọn trạng thái</option>
            <option value="1">Đã duyệt</option>
            <option value="-1">Chưa xử lý</option>
            <option value="0">Bị khóa</option>
          </select>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center"
            onClick={handleSearch}
          >
            <FaFilter className="w-4 h-4 mr-2" />
            Lọc
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình Ảnh</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Ebook</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác Giả</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((ebook) => {
                return (
                  <tr key={ebook.ebookId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ebook.imageUrl ? (
                        <img
                          src={ebook.imageUrl}
                          alt={ebook.ebookName}
                          className="w-16 h-16 rounded-lg object-cover shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{ebook.ebookName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{getCreatorName(ebook.createById)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {ebook.pdfurl ? (
                        <a
                          href={ebook.pdfurl.startsWith('http') ? ebook.pdfurl : `https://rmrbdapi.somee.com${ebook.pdfurl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0015.414 4L13 1.586A2 2 0 0011.586 1H9a2 2 0 00-2 2z" />
                          </svg>
                          View PDF
                        </a>
                      ) : (
                        <span className="text-red-500 text-sm">Not available</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {ebook.status === 0 ? (
                        <FaBan style={{ color: "red", fontSize: "24px" }} title="Bị khóa" />
                      ) : ebook.status === -1 ? (
                        <FaRegClock
                          style={{ color: "orange", fontSize: "24px" }}
                          title="Chờ được xác nhận"
                        />
                      ) : ebook.status === 1 ? (
                        <FaCheckCircle
                          style={{ color: "green", fontSize: "24px" }}
                          title="Đã xác nhận"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {ebook.status}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEditButtonClick(ebook)}
                        className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md mx-1 ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
              {/* Close button */}
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {'Chỉnh Sửa Ebook'}
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ebook Name
                    </label>
                    <input
                      type="text"
                      value={ebookbyId.ebookName}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={ebookbyId.description}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <input
                        type="text"
                        value={formatPrice(ebookbyId.price)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={ebookbyId.categoryId}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.categoryId} value={category.categoryId}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold">Status:</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value={1}>Xác nhận</option>
                      <option value={-1}>Chờ xác nhận</option>
                      <option value={0}>Khóa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      type="text"
                      value={censorNote}
                      onChange={(e) => setCensorNote(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // const statusText = status === 1 ? "Xác nhận" : "Khóa";
                        // handleNotification(`Mod ${accountOnline} đã ${statusText} công thức ${recipe.recipeName} của bạn`);
                        editEbook();
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Update Ebook
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookList;
