import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Swal from "sweetalert2";
import {
  Container,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
const EditRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [price, setPrice] = useState("");
  const [numberOfService, setNumberOfService] = useState("");
  const [status, setStatus] = useState(1);
  const [nutrition, setNutrition] = useState("");
  const [tutorial, setTutorial] = useState("");
  const [video, setVideo] = useState("");
  const [description, setDescription] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [createById, setCreateById] = useState("");
  const [tags, setTags] = useState([]); // Tất cả các tag đang hoạt động
  const [selectedTagIds, setSelectedTagIds] = useState([]); // Các tag được chọn
  const [selectedTagNames, setSelectedTagNames] = useState([]);
  const [tagMap, setTagMap] = useState({});
  const [updatedDate, setUpdatedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const { id } = useParams();
  const navigate = useNavigate();

  // Lấy dữ liệu Recipe từ API
  const fetchRecipeData = async () => {
    try {
      const recipeResult = await axios.get(
        `https://rmrbdapi.somee.com/odata/Recipe/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );

      const recipeData = recipeResult.data;
      setRecipe(recipeData);
      setRecipeName(recipeData.recipeName);
      setPrice(recipeData.price);
      setNumberOfService(recipeData.numberOfService);
      setStatus(recipeData.status);
      setNutrition(recipeData.nutrition);
      setTutorial(recipeData.tutorial);
      setVideo(recipeData.video);
      setDescription(recipeData.description);
      setIngredient(recipeData.ingredient);
      setCreateById(recipeData.createById);
      setCreateDate(recipeData.createDate?.slice(0, 10) || "");
      setTotalTime(recipeData.totalTime);

      // Cập nhật tag từ API
      setSelectedTagIds(recipeData.tags?.map((tag) => tag.tagId) || []);
      setSelectedTagNames(recipeData.tags?.map((tag) => tag.tagName) || []);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error("Failed to load recipe.");
    }
  };

  // Lấy tất cả các tag có `status = 1`
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

      const tags = response.data || [];
      setTags(tags);

      // Lưu map tagId -> tagName
      setTagMap(
        tags.reduce((acc, tag) => {
          acc[tag.tagId] = tag.tagName;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching tags:", error);
      Swal.fire("Lỗi", "Lỗi khi tải thẻ", "error");
    }
  };

  useEffect(() => {
    fetchActiveTags();
    fetchRecipeData();
  }, [id]);

  // Xử lý khi chọn tag
  // Handle the selection change for tags
  const handleTagSelection = (e) => {
    const tagId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    // Cập nhật selectedTagIds khi chọn/bỏ chọn tag
    if (isChecked) {
      setSelectedTagIds((prevSelected) => [...prevSelected, tagId]);
    } else {
      setSelectedTagIds((prevSelected) =>
        prevSelected.filter((id) => id !== tagId)
      );
    }
  };

  // Cập nhật công thức khi submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedRecipe = {
      ...recipe,
      recipeName,
      price,
      numberOfService,
      status,
      nutrition,
      tutorial,
      video,
      description,
      ingredient,
      createDate,
      updatedDate,
      totalTime,
      createById,
    };

    try {
      // Cập nhật recipe
      await axios.put(
        `https://rmrbdapi.somee.com/odata/Recipe/${id}`,
        updatedRecipe,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );

      // Lấy các tag hiện tại của recipe từ cơ sở dữ liệu
      const oldTagsResponse = await axios.get(
        `https://rmrbdapi.somee.com/odata/RecipeTag/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );

      const oldTagIds = oldTagsResponse.data.map((tag) => tag.tagId);

      // Xóa các tag không còn trong danh sách đã chọn
      for (const tagId of oldTagIds) {
        if (!selectedTagIds.includes(tagId)) {
          await axios.delete(
            `https://rmrbdapi.somee.com/odata/RecipeTag/${id}/${tagId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Token: "123-abc",
              },
            }
          );
        }
      }

      // Thêm các tag mới vào danh sách
      for (const tagId of selectedTagIds) {
        if (!oldTagIds.includes(tagId)) {
          await axios.post(
            `https://rmrbdapi.somee.com/odata/RecipeTag`,
            { tagId, recipeId: id },
            {
              headers: {
                "Content-Type": "application/json",
                Token: "123-abc",
              },
            }
          );
        }
      }

      // Gọi lại fetchRecipeData để làm mới danh sách tag
      await fetchRecipeData();
      Swal.fire("Thành công", "Cập nhật công thức thành công!", "success").then(
        () => navigate("/recipecustomer-list")
      );
    } catch (error) {
      toast.error("Error updating recipe!");
      console.error("Error:", error);
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Container
        style={{
          color: "Black",
          backgroundColor: "#fff",
          padding: "20px",
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Edit Recipe
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Recipe Name"
              variant="outlined"
              fullWidth
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              required
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Number of Services"
              variant="outlined"
              fullWidth
              type="number"
              value={numberOfService}
              onChange={(e) => setNumberOfService(e.target.value)}
              required
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Nutrition"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={nutrition}
              onChange={(e) => setNutrition(e.target.value)}
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Tutorial"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={tutorial}
              onChange={(e) => setTutorial(e.target.value)}
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Video URL"
              variant="outlined"
              fullWidth
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Ingredient"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Create Date"
              variant="outlined"
              fullWidth
              type="date"
              value={createDate}
              readOnly
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Total Time (in minutes)"
              variant="outlined"
              fullWidth
              type="number"
              value={totalTime}
              onChange={(e) => setTotalTime(e.target.value)}
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Updated Date"
              variant="outlined"
              fullWidth
              type="date"
              value={updatedDate}
              readOnly
              sx={{ color: "black" }}
            />
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle1">Tags</Typography>
            <FormGroup>
              {tags.map((tag) => (
                <FormControlLabel
                  key={tag.tagId}
                  control={
                    <Checkbox
                      checked={selectedTagIds.includes(tag.tagId)} // Kiểm tra nếu tagId đã được chọn
                      onChange={handleTagSelection} // Gọi hàm khi người dùng thay đổi checkbox
                      value={tag.tagId} // Gửi tagId khi checkbox thay đổi
                    />
                  }
                  label={tag.tagName}
                />
              ))}
            </FormGroup>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" color="black">
              Old Tags:
            </Typography>
            <ul>
              {recipe?.recipeTags?.length > 0 ? (
                recipe.recipeTags.map((tag, index) => (
                  <li key={index} style={{ color: "black" }}>
                    {tagMap[tag.tagId] || "Unknown"}
                  </li>
                ))
              ) : (
                <li style={{ color: "black" }}>No tags</li>
              )}
            </ul>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" color="black">
              Selected Tags:
            </Typography>
            <p style={{ color: "black" }}>{selectedTagNames.join(", ")}</p>
          </Box>

          <Box mb={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ color: "black" }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Container>
      <Footer />
    </>
  );
};

export default EditRecipe;
