import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaBan } from "react-icons/fa";

const ShowRecipes = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get("https://localhost:7220/odata/Recipe", {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
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

        // Giữ nguyên các trường còn lại, chỉ cập nhật trạng thái
        const updatedRecipe = {
          ...currentRecipe,
          status: newStatus,
        };

        // Cập nhật trạng thái của recipe
        await axios.put(
          `https://localhost:7220/odata/Recipe/${recipeId}`,
          updatedRecipe,
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          }
        );

        // Hiển thị thông báo thành công
        toast.success(
          `${recipeName} status updated to ${getStatusLabel(newStatus)}`
        );

        getData(); // Reload data sau khi cập nhật
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Error updating recipe status.");
      }
    } else {
      // Nếu người dùng không xác nhận, thông báo sẽ hiển thị nhưng không có thay đổi gì
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
            color: status === 1 ? "green" : "gray", // Nếu trạng thái là censored, thì icon này sẽ sáng lên
            cursor: "pointer",
            marginRight: "10px",
          }}
          title="Censored"
          onClick={() => handleStatusChange(recipeId, 1, recipeName)}
        />
        <FaTimesCircle
          style={{
            color: status === -1 ? "orange" : "gray", // Nếu trạng thái là uncensored, thì icon này sẽ sáng lên
            cursor: "pointer",
            marginRight: "10px",
          }}
          title="Uncensored"
          onClick={() => handleStatusChange(recipeId, -1, recipeName)}
        />
        <FaBan
          style={{
            color: status === 0 ? "red" : "gray", // Nếu trạng thái là blocked, thì icon này sẽ sáng lên
            cursor: "pointer",
            marginRight: "10px",
          }}
          title="Blocked"
          onClick={() => handleStatusChange(recipeId, 0, recipeName)}
        />
      </div>
    );
  };

  return (
    <div>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-center">Recipe List</h2>
      </div>
      <Link to="/create-recipe" style={{ marginLeft: "10px" }}>
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
          {data.map((recipe, index) => (
            <tr key={recipe.recipeId}>
              <td>{index + 1}</td>
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
                  >
                    Detail
                  </button>
                </Link>
              </td>
              <td>
                {/* Hiển thị ảnh đầu tiên */}
                {recipe.images && recipe.images.length > 0 ? (
                  <img
                    src={recipe.images[0].imageUrl} // Ảnh đầu tiên
                    alt={recipe.recipeName}
                    style={{
                      width: "100px",
                      height: "auto",
                      borderRadius: "5px",
                    }}
                  />
                ) : (
                  <span>No Image</span> // Placeholder nếu không có ảnh
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ShowRecipes;
