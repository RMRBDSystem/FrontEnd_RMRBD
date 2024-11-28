import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import EditIcon from "/images/icon/edit.svg"
import EyeIcon from "/images/icon/eye.svg"
import {
  FaPlus,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaEye,
} from "react-icons/fa";
const ShowRecipes = () => {
  const [data, setData] = useState([]);
  const [accountId, setAccountID] = useState("");

  useEffect(() => {
    const storedUserId = Cookies.get("UserId");
    console.log("Stored UserId:", storedUserId);

    if (storedUserId) {
      setAccountID(storedUserId);
    } else {
      toast.error("No user found, please login first.");
    }
  }, []);

  useEffect(() => {
    if (accountId) {
      getData(); // Fetch data only when accountId is available
    }
  }, [accountId]);

  const getData = async () => {
    try {
      const result = await axios.get(
        `https://rmrbdapi.somee.com/odata/Recipe?$filter=createbyid eq ${accountId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc", // Ensure the correct token is passed here
          },
        }
      );
      setData(result.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast.error("Failed to fetch recipes.");
    }
  };

  // Function to return the status icon based on the recipe's status
  const getStatusIcon = (status) => {
    switch (status) {
      case 1:
        return <FaCheck style={{ color: "green" }} />;
      case -1:
        return <FaExclamationTriangle style={{ color: "orange" }} />;
      case 0:
        return <FaTimes style={{ color: "red" }} />;
      default:
        return <FaExclamationTriangle style={{ color: "gray" }} />;
    }
  };

  //Phân trang 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });


  // Hàm sắp xếp
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);
  // Tính toán dữ liệu phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  // Thay đổi trạng thái sắp xếp
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    // <>
    //   <div className="p-6 bg-gray-50">
    //     <ToastContainer />
    //     <div className="flex justify-between items-center mb-4">
    //       <h2 className="text-2xl font-bold text-gray-800">Recipe List</h2>
    //       <Link to="/add-recipe">
    //         <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
    //           <FaPlus className="mr-2" /> Add Recipe
    //         </button>
    //       </Link>
    //     </div>

    //     <Table
    //       striped
    //       bordered
    //       hover
    //       responsive
    //       className="bg-white rounded-md shadow-lg"
    //     >
    //       <thead className="bg-gray-100">
    //         <tr className="text-gray-700">
    //           <th>#</th>
    //           <th>Recipe Name</th>
    //           <th>Price</th>
    //           <th>Number of Servings</th>
    //           <th>Images</th>
    //           <th>Status</th>
    //           <th>Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {data.length > 0 ? (
    //           data.map((recipe, index) => (
    //             <tr key={recipe.recipeId}>
    //               <td className="text-center">{index + 1}</td>
    //               <td>{recipe.recipeName}</td>
    //               <td>{recipe.price}</td>
    //               <td>{recipe.numberOfService}</td>
    //               <td>
    //                 {recipe.images?.length > 0 && (
    //                   <img
    //                     src={recipe.images[0].imageUrl}
    //                     alt="Recipe preview"
    //                     className="w-24 h-24 object-cover rounded-md"
    //                   />
    //                 )}
    //               </td>
    //               <td className="text-center">
    //                 {getStatusIcon(recipe.status)}
    //               </td>
    //               <td className="flex space-x-2 justify-center">
    //                 <Link to={`/edit-recipe/${recipe.recipeId}`}>
    //                   <button className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 flex items-center">
    //                     <FaEdit />
    //                   </button>
    //                 </Link>
    //                 <Link to={`/recipe-customer-detail/${recipe.recipeId}`}>
    //                   <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
    //                     <FaEye /> {/* Icon for details */}
    //                   </button>
    //                 </Link>
    //               </td>
    //             </tr>
    //           ))
    //         ) : (
    //           <tr>
    //             <td colSpan="7" className="text-center text-gray-500">
    //               No recipes found.
    //             </td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </Table>
    //   </div>
    // </>
    <div className="bg-white rounded-md shadow-lg p-6 mx-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách công thức</h2>
        <Link to="/add-recipe">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <FaPlus className="mr-2" /> Thêm công thức
          </button>
        </Link>
      </div>
      <table className="table-auto w-full">
        <thead className="bg-gray-200">
          <tr className="text-gray-700">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("recipeName")}>
              Tên công thức {sortConfig.key === "recipeName" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
            </th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("price")}>
              Giá {sortConfig.key === "price" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
            </th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("numberOfService")}>
              Khẩu phần {sortConfig.key === "numberOfService" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
            </th>
            <th className="px-4 py-2 text-left">Hình ảnh</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("status")}>
              Trạng thái {sortConfig.key === "status" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
            </th>
            <th className="px-4 py-2 text-left">Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((recipe, index) => (
              <tr key={recipe.recipeId} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{indexOfFirstItem + index + 1}</td>
                <td className="px-4 py-2">{recipe.recipeName}</td>
                <td className="px-4 py-2">{recipe.price}</td>
                <td className="px-4 py-2">{recipe.numberOfService}</td>
                <td className="px-4 py-2">
                  {recipe.images?.length > 0 && (
                    <img
                      src={recipe.images[0].imageUrl}
                      alt="Recipe preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                </td>
                <td className="px-4 py-2 text-center">{getStatusIcon(recipe.status)}</td>
                <td className="px-4 py-2 flex space-x-2 justify-center items-center">
                  <Link to={`/edit-recipe/${recipe.recipeId}`}>
                    <img src={EditIcon} alt="Edit Icon" className="w-6 h-6 mr-2" />
                  </Link>
                  <Link to={`/recipe-customer-detail/${recipe.recipeId}`}>
                    <img src={EyeIcon} alt="Edit Icon" className="w-6 h-6 mr-2" />
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 px-4 py-2">
                No recipes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4">
        <div>
          Hiển thị trên mỗi trang:{" "}
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border rounded-md px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowRecipes;
