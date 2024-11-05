import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import Footer from '../Footer/Footer';
const RecipeCustomer = () => {

  const [recipeName, setRecipeName] = useState("");
  const [numberOfService, setNumberOfService] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [recipeImage, setRecipeImage] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [tagsVisible, setTagsVisible] = useState(false)
  useEffect(() => {
    fetchActiveTags();
  }, []);

 
  const fetchActiveTags = async () => {
    try {
      const response = await axios.get("https://localhost:7220/odata/Tag", {
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
    const url = `https://localhost:7220/odata/UploadImage/Recipe/${recipeId}`;
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
    const urlRecipeTag = "https://localhost:7220/odata/RecipeTag";
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
    const url = "https://localhost:7220/odata/Recipe";
    const recipeData = {
      recipeName,
      numberOfService,
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

      clear();
      toast.success("Recipe and images have been added successfully!");
    } catch (error) {
      console.error("Error saving recipe or uploading images:", error);
      toast.error(`Failed to add recipe or upload images: ${error.message}`);
    }
  };


  const clear = () => {
    setRecipeName("");
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

  const toggleTagsVisibility = () => {
    setTagsVisible(!tagsVisible); // Toggle the visibility
  };
  return (
    <>
    <ToastContainer />
    <Navbar />
    <Container className="my-5">
      <h2 className="text-center mb-4">Create a New Recipe</h2>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="recipeName">
              <Form.Label>Recipe Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Recipe Name"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Form.Group controlId="numberOfService">
              <Form.Label>Number of Servings</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Number of Servings"
                value={numberOfService}
                onChange={(e) => setNumberOfService(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Button variant="link" onClick={toggleTagsVisibility}>
                {tagsVisible ? "Hide Tags" : "Select Tags"}
              </Button>
              {tagsVisible && (
                <Form.Control
                  as="select"
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
                </Form.Control>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Form.Group controlId="recipeImages">
              <Form.Label>Recipe Images</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageChange} />
              <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
                {renderImageInputs()}
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex align-items-end">
            <Button variant="primary" onClick={handleSave} className="w-100">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
    <Footer />
    </>
  )
}

export default RecipeCustomer;
