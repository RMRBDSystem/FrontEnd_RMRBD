import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation } from "react-router-dom";
import {
  FaEdit,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaInfoCircle,
} from "react-icons/fa";

const ShowRecipes = () => {
  const [data, setData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(10); // Giới hạn 10 recipes mỗi trang
  const location = useLocation();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get(
        "https://rmrbdapi.somee.com/odata/Recipe",
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      setData(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (recipeId, newStatus, recipeName) => {
    const confirmed = window.confirm(
      `Are you sure you want to change the status of "${recipeName}" to ${getStatusLabel(
        newStatus
      )}?`
    );

    if (confirmed) {
      try {
        const currentRecipe = data.find(
          (recipe) => recipe.recipeId === recipeId
        );
        const updatedRecipe = { ...currentRecipe, status: newStatus };

        await axios.put(
          `https://rmrbdapi.somee.com/odata/${recipeId}`,
          updatedRecipe,
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          }
        );

        toast.success(
          `${recipeName} status updated to ${getStatusLabel(newStatus)}`
        );
        getData(); // Reload data after updating
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Error updating recipe status.");
      }
    } else {
      toast.info("Recipe status update canceled.");
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "Censored";
      case -1:
        return "Uncensored";
      case 0:
        return "Blocked";
      default:
        return "Unknown";
    }
  };

  const renderStatusIcons = (status, recipeId, recipeName) => {
    return (
      

          
      <div>
        <FaCheckCircle
          style={{
            color: status === 1 ? "green" : "gray",
            cursor: "pointer",
            marginRight: "10px",
          }}
          title="Censored"
          onClick={() => handleStatusChange(recipeId, 1, recipeName)}
        />
        <FaTimesCircle
          style={{
            color: status === -1 ? "orange" : "gray",
            cursor: "pointer",
            marginRight: "10px",
          }}
          title="Uncensored"
          onClick={() => handleStatusChange(recipeId, -1, recipeName)}
        />
        <FaBan
          style={{
            color: status === 0 ? "red" : "gray",
            cursor: "pointer",
            marginRight: "10px",
          }}
          title="Blocked"
          onClick={() => handleStatusChange(recipeId, 0, recipeName)}
        />
      </div>
    );
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = data.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / recipesPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`transition-all duration-300 bg-white text-black flex flex-col shadow-lg ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div
          className={`transition-opacity duration-300 p-4 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src="/images/Logo.png" alt="Logo" className="w-40 mx-auto" />
        </div>
        <nav className="mt-10">
          {[
            "Dashboard",
            "Account Management",
            "Income Management",
            "Feedback & Comments",
            "Reports",
            "Category Management",
            "Recipe Management",
          ].map((item, index) => {
            let path;
            switch (item) {
              case "Account Management":
                path = "/admin/account-management";
                break;
              case "Income Management":
                path = "/admin/income-management";
                break;
              case "Category Management":
                path = "/admin/category-management";
                break;
              default:
                path = `/admin/${item.replace(/ /g, "").toLowerCase()}`;
            }

            return (
              <Link
                key={index}
                to={path}
                className={`block py-2 px-4 rounded ${
                  location.pathname === path
                    ? "text-orange-500 font-semibold border-b-2 border-orange-500"
                    : "text-black"
                }`}
              >
                {sidebarOpen ? item : item[0]}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <ToastContainer />
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-center">Recipe List</h2>
        </div>
        <Link to="/admincreaterecipe" style={{ marginLeft: "10px" }}>
          <button className="btn btn-primary btn-sm">
            <FaPlus />
          </button>
        </Link>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Recipe Name</th>
              <th>Price</th>
              <th>Number of Services</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {currentRecipes.map((recipe, index) => (
              <tr key={recipe.recipeId}>
                <td>{index + 1 + (currentPage - 1) * recipesPerPage}</td>
                <td>{recipe.recipeName}</td>
                <td>{recipe.price}</td>
                <td>{recipe.numberOfService}</td>
                <td>
                  {renderStatusIcons(
                    recipe.status,
                    recipe.recipeId,
                    recipe.recipeName
                  )}
                </td>
                <td>
                  <Link to={`/edit-recipe/${recipe.recipeId}`}>
                    <button className="btn btn-warning btn-sm">
                      <FaEdit />
                    </button>
                  </Link>
                  <Link to={`/recipe-detail/${recipe.recipeId}`}>
                    <button
                      className="btn btn-info btn-sm"
                      style={{ marginLeft: "5px" }}
                      title="View Details"
                    >
                      <FaInfoCircle />
                    </button>
                  </Link>
                </td>

                <td>
                  {recipe.images && recipe.images.length > 0 ? (
                    <img
                      src={recipe.images[0].imageUrl}
                      alt={recipe.recipeName}
                      style={{
                        width: "100px",
                        height: "auto",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* Pagination */}
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-primary"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(data.length / recipesPerPage)}
          </span>
          <button
            className="btn btn-primary"
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(data.length / recipesPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowRecipes;
