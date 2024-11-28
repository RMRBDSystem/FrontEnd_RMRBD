import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation } from 'react-router-dom';


const CRUD = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [recipeName, setRecipeName] = useState("");
  const [numberOfService, setNumberOfService] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(0);
  const [editId, setEditId] = useState("");
  const [editRecipeName, setEditRecipeName] = useState("");
  const [editIsActive, setEditIsActive] = useState(0);
  const [editNumberOfService, setEditNumberOfService] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [recipeImage, setRecipeImage] = useState([]);
  const [editRecipeImage, setEditRecipeImage] = useState([]);
  const [data, setData] = useState([]);
  const [allRecipeImages, setAllRecipeImages] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [tagsVisible, setTagsVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    getData();
    fetchActiveTags();
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get("https://rmrbdapi.somee.com/odata/Recipe", {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      setData(result.data);
      fetchImageUrls(result.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchImageUrls = async (recipes) => {
    const urls = {};
    for (const recipe of recipes) {
      try {
        const response = await fetch(
          `https://rmrbdapi.somee.com/odata/UploadImage/firstImage/${recipe.recipeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();
        urls[recipe.recipeId] = URL.createObjectURL(blob); // Create object URL for image
      } catch (error) {
        console.error("Error fetching image:", error);
        urls[recipe.recipeId] = "https://via.placeholder.com/50"; // Fallback to default image on error
      }
    }
    setImageUrls(urls); // Update state with fetched URLs
  };

  const fetchActiveTags = async () => {
    try {
      const response = await axios.get("https://rmrbdapi.somee.com/odata/Tag", {
        params: {
          "$filter": "status eq 1",
        },
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      console.log("API Response:", response.data); // Thêm dòng log này
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching active tags:", error);
    }
  };

  const uploadImage = async (image, recipeId) => {
    const url = `https://rmrbdapi.somee.com/odata/UploadImage/Recipe/${recipeId}`;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("recipeId", recipeId);
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Token: "123-abc",
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Upload failed with status code: ${response.status}`);
      }
    } catch (error) {
      console.error("There was an error uploading the image!", error);
      throw error;
    }
  };
  const saveRecipeTag = async (tagId, recipeId) => {
    const urlRecipeTag = "https://rmrbdapi.somee.com/odata/RecipeTag";
    const RecipeTagData = {
      tagId,
      recipeId,
    };

    try {
      const result = await axios.post(urlRecipeTag, RecipeTagData, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      console.log("Response from RecipeTag server:", result);
    } catch (error) {
      console.error("Error saving RecipeTag:", error);
      throw new Error("Failed to save RecipeTag.");
    }
  };

  const handleSave = async () => {
    const url = "https://rmrbdapi.somee.com/odata/Recipe";
    const recipeData = {
      recipeName,
      numberOfService,
      status,
      price,
    };

    try {
      // Step 1: Save the recipe data
      const result = await axios.post(url, recipeData, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      const recipeId = result.data.recipeId;
      console.log("Response from server:", result);
      if (!recipeId) {
        throw new Error("Failed to retrieve recipe ID from server response.");
      }

      for (const tagId of selectedTagIds) {
        await saveRecipeTag(tagId, recipeId);
      }
      // Step 2: Upload images if any are selected
      if (recipeImage.length > 0) {
        for (const image of recipeImage) {
          await uploadImage(image, recipeId);
        }
      }
      // Step 3: Refresh the data and clear inputs
      await getData();
      clear();
      toast.success("Công thức và hình ảnh đã được thêm thành công!");
    } catch (error) {
      console.error("Error saving recipe or uploading images:", error);
      toast.error(`Failed to add recipe or upload images: ${error.message}`);
    }
  };

  const handleEdit = async (recipeId) => {
    if (!recipeId) {
      console.error("Invalid recipe ID:", recipeId);
      return;
    }
    handleShow();

    try {
      // Fetch recipe details
      const recipeResponse = await axios.get(
        `https://https://rmrbdapi.somee.com/Recipe/${recipeId}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Token: "123-abc",
          },
        }
      );
      const recipeData = recipeResponse.data;

      // Set recipe details in state
      setEditId(recipeData.recipeId);
      setEditRecipeName(recipeData.recipeName);
      setEditIsActive(recipeData.status);
      setEditNumberOfService(recipeData.numberOfService);
      setEditPrice(recipeData.price);

      const fullImageUrls = await fetchFullImageUrls(recipeId);
      setAllRecipeImages(fullImageUrls);
      console.log("All recipe images:", fullImageUrls);
    } catch (error) {
      console.error("Error fetching recipe or images!", error);
    }
  };

  const fetchFullImageUrls = async (recipeId) => {
    try {
      const imagesResponse = await axios.get(
        `https://rmrbdapi.somee.com/odata/UploadImage/allImages/${recipeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      console.log("Raw images response:", imagesResponse);

      // Assuming the API response contains an array of image paths
      const baseURL = "https://rmrbdapi.somee.com/";
      const fullImageUrls = imagesResponse.data.map((path) => baseURL + path);

      return fullImageUrls; // Return the full image URLs
    } catch (error) {
      console.error("Error fetching images!", error);
      return []; // Return an empty array on error
    }
  };
  const handleUpdate = async () => {
    const url = `https://rmrbdapi.somee.com/odata/Recipe/${editId}`;
    const updatedData = {
      recipeId: editId,
      recipeName: editRecipeName,
      price: editPrice,
      status: editIsActive,
      numberOfService: editNumberOfService,
    };

    try {
      await axios.put(url, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });

      if (editRecipeImage.length > 0) {
        for (const image of editRecipeImage) {
          await uploadImage(image, editId);
        }
      }

      getData();
      handleClose();
      toast.success("Recipe has been updated successfully!");
    } catch (error) {
      console.error("Error updating the recipe!", error);
      toast.error("Failed to update the recipe.");
    }
  };

  const clear = () => {
    setRecipeName("");
    setStatus(0);
    setNumberOfService("");
    setPrice("");
    setRecipeImage([]);
    setSelectedTagIds([]); 
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setRecipeImage((prevImages) => [...prevImages, ...files]); // Cập nhật state với các file mới
  };

  // Sử dụng renderImageInputs để hiển thị hình ảnh đã chọn
  const renderImageInputs = () => {
    return recipeImage.map((file, index) => (
      <Col key={index}>
        <img
          src={URL.createObjectURL(file)} // Tạo URL cho mỗi file khi render
          alt={`Preview ${index}`}
          style={{ width: "100px", height: "100px", margin: "10px 0" }}
        />
      </Col>
    ));
  };
  const handleEditImageChange = (e) => {
    setEditRecipeImage(Array.from(e.target.files));
  };

  const toggleTagsVisibility = () => {
    setTagsVisible(!tagsVisible); // Toggle the visibility
  };
  return (
    <>
      <ToastContainer />
      <div className="flex"> {/* Dùng flex để đặt aside và Container cạnh nhau */}
        {/* Sidebar */}
        <aside 
          className={`bg-white text-black flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-1/5' : 'w-16'}`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <div className="p-2 flex justify-center">
            <img src="/images/Logo.png" alt="Logo" className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} w-40`} />
          </div>
          <nav className="mt-10">
            {["Dashboard", "Account Management", "Income Management", "Feedback & Comments", "Reports", "Category Management","Recipe Management"].map((item, index) => (
              <div key={index}>
                <Link 
                  to={`/admin/${item.replace(/ & /g, '-').replace(/ /g, '-').toLowerCase()}`} 
                  className={`block py-2.5 px-4 rounded transition-colors duration-200 
                    ${location.pathname === `/admin/${item.replace(/ & /g, '-').replace(/ /g, '-').toLowerCase()}` ? 
                      "text-orange-500 font-semibold border-b-2 border-orange-500" : 
                      "text-black"}`}
                  style={{ opacity: isSidebarOpen ? 1 : 0 }}
                >
                  {isSidebarOpen ? item : <span className="text-transparent">{item.charAt(0)}</span>}
                </Link>
                {isSidebarOpen && <div className={`border-b border-gray-300 ${item !== "Reports" ? "mb-2" : ""}`} />}
              </div>
            ))}
          </nav>
        </aside>

        {/* Nội dung chính */}
        <Container fluid className="ml-4"> {/* Thêm khoảng cách từ sidebar */}
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Recipe Name"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Number of Services"
                value={numberOfService}
                onChange={(e) => setNumberOfService(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Col>
            <Col>
              <label htmlFor="tags">Tags:</label>
              <Button variant="link" onClick={toggleTagsVisibility}>
                {tagsVisible ? "Hide Tags" : "Select Tags"}
              </Button>
              {tagsVisible && (
                <select
                  id="tags"
                  multiple
                  value={selectedTagIds}
                  onChange={(e) => {
                    const options = e.target.options;
                    const values = [];
                    for (let i = 0; i < options.length; i++) {
                      if (options[i].selected) {
                        values.push(options[i].value);
                      }
                    }
                    setSelectedTagIds(values);
                  }}
                >
                  {tags.map((tag) => (
                    <option key={tag.tagId} value={tag.tagId}>
                      {tag.tagName}
                    </option>
                  ))}
                </select>
              )}
            </Col>
            <Col>
              <input type="file" multiple onChange={handleImageChange} />
              <label>Recipe Images</label>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {renderImageInputs()}
              </div>
            </Col>
            <Col>
              <select
                className="form-control"
                onChange={(e) => setStatus(Number(e.target.value))}
                value={status}
              >
                <option value="0">Locked</option>
                <option value="1">Censored</option>
                <option value="2">Uncensored</option>
              </select>
            </Col>
            <Col>
              <button className="btn btn-primary" onClick={handleSave}>
                Submit
              </button>
            </Col>
          </Row>
        </Container>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Recipe Name</th>
            <th>Number of Services</th>
            <th>Price</th>
            <th>Status</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.recipeName}</td>
                    <td>{item.numberOfService}</td>
                    <td>{item.price}</td>
                    <td>
                      {item.status === 0
                        ? "Locked"
                        : item.status === 1
                        ? "Censored"
                        : "Uncensored"}
                    </td>
                    <td>
                      <img
                        alt="Recipe"
                        style={{ width: "100px", height: "100px" }}
                        src={
                          imageUrls[item.recipeId] ||
                          "https://via.placeholder.com/50"
                        } // Use fetched image URL or default
                      />
                    </td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item.recipeId)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            : "Loading ..."}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify / Update / Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Recipe Name"
                value={editRecipeName}
                onChange={(e) => setEditRecipeName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Number of Services"
                value={editNumberOfService}
                onChange={(e) => setEditNumberOfService(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Price"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </Col>
            <Col>
              <label>Recipe Images</label>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {allRecipeImages.length > 0 ? (
                  allRecipeImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Recipe Image ${index}`}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50";
                      }}
                      style={{
                        width: "100px",
                        height: "100px",
                        margin: "5px",
                        objectFit: "cover",
                      }}
                    />
                  ))
                ) : (
                  <p>No images available for this recipe.</p>
                )}
              </div>
            </Col>
            <Col>
              <select
                className="form-control"
                onChange={(e) => setEditIsActive(Number(e.target.value))}
                value={editIsActive}
              >
                <option value="0">Locked</option>
                <option value="1">Censored</option>
                <option value="2">Uncensored</option>
              </select>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close Button
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CRUD;
