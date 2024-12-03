import { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import "./addrecipecus.css";
import { FiPlus, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
const RecipeCustomer = () => {
  const [recipeName, setRecipeName] = useState("");
  const [numberOfService, setNumberOfService] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [recipeImage, setRecipeImage] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  //const [tagsVisible, setTagsVisible] = useState(false);
  const [nutrition, setNutrition] = useState("");
  const [tutorial, setTutorial] = useState(["", ""]);
  const [video, setVideo] = useState("");
  const [description, setDescription] = useState("");
  const [ingredient, setIngredients] = useState(["", ""]);
  const [createDate, setCreateDate] = useState("");
  const [totalTime, setTotalTime] = useState();
  const [createById, setcreateById] = useState("");
  const [censorNote, setCensorNote] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await axios.get("https://rmrbdapi.somee.com/odata/Tag", {
        params: {
          $filter: "status eq 1",
        },
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching active tags:", error);
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!recipeName) newErrors.recipeName = "Tên công thức là bắt buộc.";
    if (!numberOfService || isNaN(numberOfService) || numberOfService <= 0) {
      newErrors.numberOfService = "Vui lòng nhập số khẩu phần hợp lệ.";
    }
    if (!price || isNaN(price) || price < 0) {
      newErrors.price = "Vui lòng nhập giá hợp lệ.";
    }
    if (!nutrition) newErrors.nutrition = "Thông tin dinh dưỡng là bắt buộc.";
    if (!tutorial) newErrors.tutorial = "Hướng dẫn là bắt buộc.";
    if (!video) newErrors.video = "Video là bắt buộc.";
    if (!ingredient) newErrors.ingredient = "Nguyên liệu là bắt buộc.";
    if (!description) newErrors.description = "Mô tả là bắt buộc.";
    if (!totalTime || isNaN(totalTime) || totalTime <= 0) {
      newErrors.totalTime = "Vui lòng nhập thời gian nấu hợp lệ.";
    }
    if (recipeImage.length === 0) {
      newErrors.recipeImage = "Cần ít nhất một hình ảnh.";
    }
    if (selectedTagIds.length === 0) {
      newErrors.selectedTagIds = "Vui lòng chọn ít nhất một thẻ.";
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
    if (!validateFields()) return;
  
    const url = "https://rmrbdapi.somee.com/odata/Recipe";
    const formattedTutorial = tutorial.map(
      (step, index) => `Bước ${index + 1}: ${step}`
    );
    const recipeData = {
      recipeName,
      numberOfService,
      price,
      createById,
      nutrition,
      tutorial: formattedTutorial.join(", "),
      ingredient: ingredient.join(", "),
      totalTime,
      createDate,
      description,
      video,
      censorNote,
      Energy: 123,
    };
  
    console.log("Recipe data:", recipeData);
    setIsLoading(true);
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
        throw new Error("Không thể lấy ID công thức từ phản hồi của máy chủ.");
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
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Công thức và hình ảnh đã được thêm thành công!",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error saving recipe or uploading images:", error);
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: `Không thể thêm công thức hoặc tải lên hình ảnh: ${error.message}`,
        confirmButtonText: "Thử lại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setRecipeName("");
    setNumberOfService("");
    setPrice("");
    setRecipeImage([]);
    setSelectedTagIds([]);
    setNutrition("");
    setTutorial([]);
    setDescription("");
    setVideo("");
    setIngredients([]);
    setTotalTime("");
    const today = new Date().toISOString().slice(0, 10);
    setCreateDate(today); // Reset createDate to today's date
    setErrors({});
    setIsLoading(false);
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
            disabled={isLoading}
          >
            Remove
          </Button>
        </div>
      </Col>
    ));
  };


  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredient];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredient, ""]); // Add an empty input field
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredient.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  //
  const handleTutorialChange = (index, value) => {
    const updatedTutorial = [...tutorial];
    updatedTutorial[index] = value;
    setTutorial(updatedTutorial);
  };

  const addTutorialStep = () => {
    setTutorial([...tutorial, ""]); // Thêm một bước trống
  };

  const removeTutorialStep = (index) => {
    const updatedTutorial = tutorial.filter((_, idx) => idx !== index);
    setTutorial(updatedTutorial);
  };

  const [showNoteForm, setShowNoteForm] = useState(false);

  const handleAddNoteClick = () => {
    setShowNoteForm(true);
  };

  const handleCancelNote = () => {
    setShowNoteForm(false);
  };

  const toggleTagSelection = (tagId) => {
    const isSelected = selectedTagIds.includes(tagId);
    const updatedSelection = isSelected
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    setSelectedTagIds(updatedSelection);
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-6 flex items-center">
          <span className="text-orange-500 mr-2 text-5xl">+</span> Thêm Công
          thức của bạn
        </h1>
        <p className="text-gray-600 mb-8">
          Tải lên công thức nấu ăn cá nhân thật dễ dàng! Thêm mục yêu thích của
          bạn, chia sẻ với bạn bè, gia đình hoặc cộng đồng RMRBD.
        </p>

        <hr className="mb-8" />

        {/* Form */}
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recipe Title */}
            <Col>
              <Form.Group controlId="recipeName">
                <Form.Label>Tên công thức</Form.Label>
                {errors.recipeName && (
                  <p className="text-danger">{errors.recipeName}</p>
                )}
                <Form.Control
                  type="text"
                  placeholder="Đặt tiêu đề cho công thức của bạn"
                  value={recipeName}
                  onChange={handleInputChange(setRecipeName, "recipeName")}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </Form.Group>
            </Col>

            {/* Photo Upload */}
            <div className="relative">
              <Form.Group controlId="recipeImage">
                <Form.Label>Ảnh công thức</Form.Label>
                {errors.recipeImage && (
                  <p className="text-danger">{errors.recipeImage}</p>
                )}
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  disabled={isLoading}
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
            </div>
          </div>

          {/* Description */}
          <div>
            <Form.Group controlId="description">
              <Form.Label>Mô tả công thức</Form.Label>
              {errors.description && (
                <p className="text-danger">{errors.description}</p>
              )}
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Chia sẻ câu chuyện đằng sau công thức của bạn và điều gì làm cho nó trở nên đặc biệt."
                value={description}
                onChange={handleInputChange(setDescription, "description")}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </Form.Group>
          </div>

          <hr className="mb-8" />

          {/* Ingredients */}
          <h2 className="text-2xl font-bold mb-4">Thành phần</h2>
          <p className="text-gray-600 mb-6">
            Nhập một thành phần trên mỗi dòng. Bao gồm số lượng (ví dụ: cốc,
            muỗng canh) và bất kỳ chế phẩm đặc biệt nào (ví dụ: rây, làm mềm,
            xắt nhỏ).
          </p>
          {ingredient.map((ingredient_chirld, index) => (
            <Row className="mb-4" key={index}>
              <Col>
                <Form.Group controlId={`ingredients-${index}`}>
                  <Form.Label>Thành phần</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder={`e.g. ${
                      index === 0 ? "2 chén bột mì, rây" : "1 chén đường"
                    }`}
                    value={ingredient_chirld}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    rows={4}
                  />
                </Form.Group>
              </Col>
              <Col
                xs="auto"
                className="d-flex align-items-center justify-content-center"
              >
                <Button
                  variant="link"
                  onClick={() => removeIngredient(index)}
                  className="text-danger"
                >
                  <FiX size={24} />
                </Button>
              </Col>
            </Row>
          ))}
          <Button
            variant="outline-warning" // Use Bootstrap's orange variant for the border
            onClick={addIngredient}
            className="custom-button d-flex align-items-center mt-4"
          >
            <FiPlus className="mr-2" /> Thêm thành phần
          </Button>

          <hr className="mb-8" />

          {/* Directions Section */}
          <h2 className="text-2xl font-bold mb-4">Hướng dẫn</h2>
          <p className="text-gray-600 mb-6">
            Giải thích cách làm công thức của bạn, bao gồm nhiệt độ lò, thời
            gian nướng hoặc nấu, và kích thước chảo, v.v. Sử dụng các tiêu đề
            tùy chọn để sắp xếp các phần khác nhau của công thức (tức là Chuẩn
            bị, Nướng, Trang trí).
          </p>

          {tutorial.map((step, index) => (
            <Row className="mb-4" key={index}>
              <Col>
                <Form.Group controlId={`tutorial-${index}`}>
                  <Form.Label>Bước {index + 1}</Form.Label>
                  {errors.tutorial && errors.tutorial[index] && (
                    <p className="text-danger">{errors.tutorial[index]}</p>
                  )}
                  <Form.Control
                    as="textarea"
                    placeholder={`e.g. ${
                      index === 0
                        ? "Làm nóng lò ở 350 ° F..."
                        : "Kết hợp các nguyên liệu khô trong một cái bát..."
                    }`}
                    value={step}
                    onChange={(e) =>
                      handleTutorialChange(index, e.target.value)
                    }
                    rows={3}
                    disabled={isLoading}
                  />
                </Form.Group>
              </Col>
              <Col
                xs="auto"
                className="d-flex align-items-center justify-content-center"
              >
                <Button
                  variant="link"
                  onClick={() => removeTutorialStep(index)}
                  className="text-danger"
                >
                  <FiX size={24} />
                </Button>
              </Col>
            </Row>
          ))}

          <Button
            onClick={addTutorialStep}
            className="custom-button d-flex align-items-center mt-4"
          >
            <FiPlus className="mr-2" /> Thêm bước
          </Button>

          <hr className="mb-8" />

          <div className="grid grid-cols-2 gap-4 mt-6">
            {/* Servings */}
            <Row className="mb-4">
              <Col>
                <Form.Group controlId="numberOfService">
                  <Form.Label>Khẩu phần</Form.Label>
                  {errors.numberOfService && (
                    <p className="text-danger">{errors.numberOfService}</p>
                  )}
                  <Form.Control
                    type="number"
                    placeholder="e.g. 8 người"
                    value={numberOfService}
                    onChange={handleInputChange(
                      setNumberOfService,
                      "numberOfService"
                    )}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Total Time */}
            <Row className="mb-4">
              <Col>
                <Form.Group controlId="totalTime">
                  <Form.Label>Tổng thời gian</Form.Label>
                  {errors.totalTime && (
                    <p className="text-danger">{errors.totalTime}</p>
                  )}
                  <Form.Control
                    type="number"
                    placeholder="e.g. 12 phút"
                    value={totalTime}
                    onChange={handleInputChange(setTotalTime, "totalTime")}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <Form.Group controlId="price">
                  <Form.Label>Giá</Form.Label>
                  {errors.price && (
                    <p className="text-danger">{errors.price}</p>
                  )}
                  <Form.Control
                    type="number"
                    placeholder="e.g. 5,000 vnd"
                    value={price}
                    onChange={handleInputChange(setPrice, "price")}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <Form.Group controlId="video">
                  <Form.Label>Video</Form.Label>
                  {errors.video && (
                    <p className="text-danger">{errors.video}</p>
                  )}
                  <Form.Control
                    type="text"
                    placeholder="e.g. link video"
                    value={video}
                    onChange={handleInputChange(setVideo, "video")}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <Form.Group controlId="createDate">
                  <Form.Label>Ngày tạo</Form.Label>
                  {errors.createDate && (
                    <p className="text-danger">{errors.createDate}</p>
                  )}
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
                <Form.Group controlId="nutrition">
                  <Form.Label>Dinh dưỡng</Form.Label>
                  {errors.nutrition && (
                    <p className="text-danger">{errors.nutrition}</p>
                  )}
                  <Form.Control
                    type="text"
                    placeholder="e.g. 120 calories"
                    value={nutrition}
                    onChange={handleInputChange(setNutrition, "nutrition")}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label className="fw-bold">Thể loại công thức</Form.Label>
              {errors.tag && <p className="text-danger">{errors.tag}</p>}
              <div className="tags-container">
                {tags.map((tag) => (
                  <button
                    key={tag.tagId}
                    type="button"
                    className={`tag-button ${
                      selectedTagIds.includes(tag.tagId) ? "selected" : ""
                    }`}
                    onClick={() => toggleTagSelection(tag.tagId)}
                    disabled={isLoading}
                  >
                    <span className="tag-icon">{tag.icon}</span>
                    <span className="tag-name">{tag.tagName}</span>
                  </button>
                ))}
              </div>
              <Form.Control
                as="select"
                multiple
                value={selectedTagIds}
                onChange={() => {}}
                disabled={isLoading}
                className="custom-multi-select"
              >
                {tags.map((tag) => (
                  <option key={tag.tagId} value={tag.tagId}>
                    {tag.tagName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <hr className="nm-8" />
          <div className="notes-section">
            <h2 className="text-2xl font-bold mb-4">Ghi chú (Tùy chọn)</h2>
            <p>
              Thêm bất kỳ lời khuyên hữu ích nào về thay thế thành phần, phục vụ
              hoặc lưu trữ tại đây.
            </p>

            {!showNoteForm ? (
              // UI for Button (Image 1)
              <Button
                className="custom-button d-flex align-items-center mt-4"
                onClick={handleAddNoteClick}
              >
                + Thêm ghi chú
              </Button>
            ) : (
              // UI for Form (Image 2)
              <Form>
                <Form.Group controlId="censorNote">
                  <Form.Control
                    as="textarea"
                    value={censorNote}
                    rows={3}
                    onChange={handleInputChange(setCensorNote, "censorNote")}
                    placeholder="e.g. Cố gắng không trộn quá nhiều bột. Gấp nhẹ nhàng."
                  />
                </Form.Group>
                <div
                  className="d-flex justify-content-start"
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    className="custom-button d-flex align-items-center mt-4"
                    onClick={handleCancelNote}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button
              variant="danger"
              onClick={handleSave}
              className="px-4 py-2 fw-bold"
            >
              Gửi công thức
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RecipeCustomer;
