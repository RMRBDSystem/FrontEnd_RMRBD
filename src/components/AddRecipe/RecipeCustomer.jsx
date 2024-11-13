import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Cookies from "js-cookie";

const RecipeCustomer = () => {
  const [recipeName, setRecipeName] = useState("");
  const [numberOfService, setNumberOfService] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [recipeImage, setRecipeImage] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [tagsVisible, setTagsVisible] = useState(false);
  const [nutrition, setNutrition] = useState("");
  const [tutorial, setTutorial] = useState("");
  const [video, setVideo] = useState("");
  const [description, setDescription] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [totalTime, setTotalTime] = useState();
  const [createById, setcreateById] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const storedUserId = Cookies.get("UserId");
    console.log("Stored UserId:", storedUserId);
    if (storedUserId) {
      setcreateById(storedUserId);
    }
    const today = new Date().toISOString().slice(0, 10);
    setCreateDate(today);
    fetchActiveTags();
  }, []);

  const fetchActiveTags = async () => {
    try {
      //"https://localhost:7220/odata/Tag",
      //https://rmrbdapi.somee.com/odata/Tag
      const response = await axios.get("https://rmrbdapi.somee.com/odata/Tag", {
        params: {
          $filter: "status eq 1",
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

  const validateFields = () => {
    const newErrors = {};

    if (!recipeName) newErrors.recipeName = "Recipe name is required.";
    if (!numberOfService || isNaN(numberOfService) || numberOfService <= 0) {
      newErrors.numberOfService = "Please enter a valid number of servings.";
    }
    if (!price || isNaN(price) || price < 0) {
      newErrors.price = "Please enter a valid price.";
    }
    if (!nutrition) newErrors.nutrition = "Nutrition information is required.";
    if (!tutorial) newErrors.tutorial = "Tutorial is required.";
    if (!video) newErrors.video = "Video is required.";
    if (!ingredient) newErrors.ingredient = "Ingredient is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!totalTime || isNaN(totalTime) || totalTime <= 0) {
      newErrors.totalTime = "Please enter a valid total time.";
    }
    if (recipeImage.length === 0) {
      newErrors.recipeImage = "At least one image is required.";
    }
    if (selectedTagIds.length === 0) {
      newErrors.selectedTagIds = "Please select at least one tag.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (image, recipeId) => {
    // const url = `https://localhost:7220/odata/UploadImage/Recipe/${recipeId}`;
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
    // const urlRecipeTag = "https://localhost:7220/odata/RecipeTag";
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
    toast.info("Đang lưu công thức...");
    if (!validateFields()) return;
    // const url = "https://localhost:7220/odata/Recipe";
    const url = "https://rmrbdapi.somee.com/odata/Recipe";
    const recipeData = {
      recipeName,
      numberOfService,
      price,
      createById,
      nutrition,
      tutorial,
      ingredient,
      totalTime,
      createDate,
      description,
      video,
    };

    console.log("Recipe data:", recipeData);

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
    setNutrition("");
    setTutorial("");
    setDescription("");
    setVideo("");
    setIngredient("");
    setTotalTime("");
    const today = new Date().toISOString().slice(0, 10);
    setCreateDate(today); // Reset createDate to today's date
    setErrors({});
  };
  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };
  const handleImageChange = (e) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      recipeImage: "",
    }));
    const files = Array.from(e.target.files);
    setRecipeImage((prevImages) => [...prevImages, ...files]); // Cập nhật state với các file mới
  };
  const removeImage = (index) => {
    setRecipeImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Sử dụng renderImageInputs để hiển thị hình ảnh đã chọn
  const renderImageInputs = () => {
    return recipeImage.map((file, index) => (
      <Col key={index} style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index}`}
            style={{ width: "100px", height: "100px", margin: "10px 0" }}
          />
          <Button
            variant="danger"
            size="sm"
            style={{
              marginTop: "5px",
            }}
            onClick={() => removeImage(index)}
          >
            Remove
          </Button>
        </div>
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
                {errors.recipeName && (
                  <p className="text-danger">{errors.recipeName}</p>
                )}
                <Form.Control
                  type="text"
                  placeholder="Enter Recipe Name"
                  value={recipeName}
                  onChange={handleInputChange(setRecipeName, "recipeName")}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                {errors.description && (
                  <p className="text-danger">{errors.description}</p>
                )}
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={handleInputChange(setDescription, "description")}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="video">
                <Form.Label>Video</Form.Label>
                {errors.video && <p className="text-danger">{errors.video}</p>}
                <Form.Control
                  type="text"
                  placeholder="Video"
                  value={video}
                  onChange={handleInputChange(setVideo, "video")}
                />
              </Form.Group>
            </Col>
          </Row>
          

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="numberOfService">
                <Form.Label>Number of Servings</Form.Label>
                {errors.numberOfService && (
                  <p className="text-danger">{errors.numberOfService}</p>
                )}
                <Form.Control
                  type="text"
                  placeholder="Enter Number of Servings"
                  value={numberOfService}
                  onChange={handleInputChange(
                    setNumberOfService,
                    "numberOfService"
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                {errors.price && <p className="text-danger">{errors.price}</p>}
                <Form.Control
                  type="text"
                  placeholder="Enter Price"
                  value={price}
                  onChange={handleInputChange(setPrice, "price")}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="tutorial">
                <Form.Label>Tutorial</Form.Label>
                {errors.tutorial && (
                  <p className="text-danger">{errors.tutorial}</p>
                )}
                <Form.Control
                  as="textarea" // Cho phép nhiều dòng
                  placeholder="Tutorial"
                  value={tutorial}
                  onChange={handleInputChange(setTutorial, "tutorial")}
                  rows={4} // Số dòng mặc định hiển thị
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="ingredient">
                <Form.Label>Ingredient</Form.Label>
                {errors.ingredient && (
                  <p className="text-danger">{errors.ingredient}</p>
                )}
                <Form.Control
                  as="textarea" // Cho phép nhiều dòng
                  placeholder="Ingredient"
                  value={ingredient}
                  onChange={handleInputChange(setIngredient, "ingredient")}
                  rows={4} // Số dòng mặc định hiển thị
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="nutrition">
                <Form.Label>Nutrition</Form.Label>
                {errors.nutrition && (
                  <p className="text-danger">{errors.nutrition}</p>
                )}
                <Form.Control
                  placeholder="Nutrition"
                  value={nutrition}
                  onChange={handleInputChange(setNutrition, "nutrition")}
                  rows={4} // Số dòng mặc định hiển thị
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="createDate">
                <Form.Label>Create Date</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Create Date"
                  value={createDate}
                  onChange={(e) => setCreateDate(e.target.value)}
                  readOnly
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
                  {errors.tag && <p className="text-danger">{errors.tag}</p>}
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
                {errors.recipeImage && (
                  <p className="text-danger">{errors.recipeImage}</p>
                )}
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "10px",
                  }}
                >
                  {renderImageInputs()}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Row className="mb-4">
              <Col>
                <Form.Group controlId="totaltime">
                  <Form.Label>Total Time</Form.Label>
                  {errors.totalTime && (
                    <p className="text-danger">{errors.totalTime}</p>
                  )}
                  <Form.Control
                    type="text"
                    placeholder="totaltime"
                    value={totalTime}
                    onChange={handleInputChange(setTotalTime, "totaltime")}
                  />
                </Form.Group>
              </Col>
            </Row>

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
  );
};

export default RecipeCustomer;
