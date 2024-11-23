import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FaPlus, FaEdit, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa"; // Import icons for status

const ShowRecipes = () => {
  const [data, setData] = useState([]);
  const [accountId, setAccountID] = useState('');

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
      const result = await axios.get(`https://localhost:7220/odata/Recipe?$filter=createbyid eq ${accountId}`, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc", // Ensure the correct token is passed here
        },
      });
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
        return <FaCheck style={{ color: 'green' }} />; // Censored (green checkmark)
      case -1:
        return <FaExclamationTriangle style={{ color: 'orange' }} />; // Uncensored (orange exclamation)
      case 0:
        return <FaTimes style={{ color: 'red' }} />; // Blocked (red cross)
      default:
        return <FaExclamationTriangle style={{ color: 'gray' }} />; // Unknown status (gray exclamation)
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-center">Recipe List</h2>
      </div>
      <Link to="/add-recipe" style={{ marginLeft: "10px" }}>
        <button className="btn btn-primary btn-sm">
          <FaPlus /> Add Recipe
        </button>
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Recipe Name</th>
            <th>Price</th>
            <th>Number of Servings</th>
            <th>Images</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((recipe, index) => (
              <tr key={recipe.recipeId}>
                <td>{index + 1}</td>
                <td>{recipe.recipeName}</td>
                <td>{recipe.price}</td>
                <td>{recipe.numberOfService}</td>
                <td><img src={recipe.images[0].imageUrl} alt="Preview" style={{ width: "100px", height: "100px" }} /></td>
                <td>{getStatusIcon(recipe.status)}</td> {/* Display status icon here */}
                <td>
                  <Link to={`/edit-recipe/${recipe.recipeId}`}>
                    <button className="btn btn-warning btn-sm">
                      <FaEdit />
                    </button>
                  </Link>
                  <Link to={`/recipe-detail/${recipe.recipeId}`}>
                    <button className="btn btn-info btn-sm" style={{ marginLeft: "5px" }}>
                      Detail
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No recipes found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ShowRecipes;
