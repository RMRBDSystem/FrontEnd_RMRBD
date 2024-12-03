import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import {
  FaPlus,
  FaEdit,
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

  return (
    <>
      <div className="p-6 bg-gray-50">
        <ToastContainer />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recipe List</h2>
          <Link to="/add-recipe">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
              <FaPlus className="mr-2" /> Add Recipe
            </button>
          </Link>
        </div>

        <Table
          striped
          bordered
          hover
          responsive
          className="bg-white rounded-md shadow-lg"
        >
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
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
                  <td className="text-center">{index + 1}</td>
                  <td>{recipe.recipeName}</td>
                  <td>{recipe.price}</td>
                  <td>{recipe.numberOfService}</td>
                  <td>
                    {recipe.images?.length > 0 && (
                      <img
                        src={recipe.images[0].imageUrl}
                        alt="Recipe preview"
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    )}
                  </td>
                  <td className="text-center">
                    {getStatusIcon(recipe.status)}
                  </td>
                  <td className="flex space-x-2 justify-center">
                    <Link to={`/edit-recipe/${recipe.recipeId}`}>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 flex items-center">
                        <FaEdit />
                      </button>
                    </Link>
                    <Link to={`/recipe-customer-detail/${recipe.recipeId}`}>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                        <FaEye /> {/* Icon for details */}
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500">
                  No recipes found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ShowRecipes;
