import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import Swal from "sweetalert2";
import { fetchRecipeData,saveRecipeData } from "../../services/CustomerService/CustomerService";
import { decryptData } from "../../Encrypt/encryptionUtils";
const EditSavedRecipe = () => {
  const { recipeId } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getRecipeData(recipeId);
  }, [recipeId]);

  const getRecipeData = async (recipeId) => {
    setLoading(true);
    try {
      const userId = decryptData(Cookies.get("UserId")) ;
      const data = await fetchRecipeData(userId, recipeId);

      setRecipeData(data);
      console.log(data);
      setEditFields({
        ingredient: data.ingredient || "",
        numberOfService: data.numberOfService || 0,
        nutrition: data.nutrition || "",
        tutorial: data.tutorial || "",
        purchasePrice: data.purchasePrice || 0,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu công thức:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi khi người dùng nhập
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!editFields.ingredient?.trim()) {
      newErrors.ingredient = "Nguyên liệu không được để trống.";
    }
    if (editFields.numberOfService <= 0) {
      newErrors.numberOfService = "Số người phục vụ phải lớn hơn 0.";
    }
    if (!editFields.nutrition?.trim()) {
      newErrors.nutrition = "Dinh dưỡng không được để trống.";
    }
    if (!editFields.tutorial?.trim()) {
      newErrors.tutorial = "Hướng dẫn không được để trống.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const restoreFields = () => {
    setConfirmDialog({
      open: true,
      action: "restore",
    });
  };

  const saveChanges = () => {
    if (validateFields()) {
      setConfirmDialog({
        open: true,
        action: "save",
      });
    }
  };
  const executeAction = async () => {
    if (confirmDialog.action === "save") {
      try {
        const userId = decryptData(Cookies.get("UserId"));
        await saveRecipeData(userId, recipeId, editFields);

        Swal.fire({
          title: "Thành công!",
          text: "Đã lưu thay đổi thành công.",
          icon: "success",
          confirmButtonText: "Đồng ý",
        });
        setIsEditing(false);
      } catch (error) {
        console.error("Lỗi khi lưu thay đổi:", error);
        Swal.fire({
          title: "Thất bại!",
          text: "Không thể lưu thay đổi.",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
    } else if (confirmDialog.action === "restore" && recipeData) {
      setEditFields({
        ingredient: recipeData.recipe?.ingredient || "",
        numberOfService: recipeData.recipe?.numberOfService || 0,
        nutrition: recipeData.recipe?.nutrition || "",
        tutorial: recipeData.recipe?.tutorial || "",
        purchasePrice: recipeData.recipe?.price || 0,
      });
    }
    setConfirmDialog({ open: false, action: null });
  };

  if (loading) return <CircularProgress />;
  if (!recipeData) return <Typography>Đang tải...</Typography>;

  const recipeName = recipeData.recipe?.recipeName || "Tên công thức";

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 5,
        backgroundColor: "white",
        p: 3,
        borderRadius: 2,
        marginBottom: 4,
        minHeight: "500px",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <BuildIcon sx={{ color: "#FF6F00", marginRight: 1 }} /> Chỉnh sửa công
          thức
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
          Hãy chỉnh sửa công thức đã lưu theo ý của bạn. Bạn có thể thay đổi
          nguyên liệu, hướng dẫn, và các thông tin khác của công thức.
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Box>
      <hr className="my-6 border-t-2 border-gray-500" />

      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        {recipeName}
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nguyên liệu"
          multiline
          fullWidth
          rows={4}
          value={editFields.ingredient}
          onChange={(e) => handleFieldChange("ingredient", e.target.value)}
          disabled={!isEditing}
          error={!!errors.ingredient}
          helperText={errors.ingredient}
        />
        <hr className="my-6 border-t-2 border-gray-500" />

        <Box display="flex" gap={2}>
          <TextField
            label="Số người phục vụ"
            type="number"
            fullWidth
            value={editFields.numberOfService}
            onChange={(e) =>
              handleFieldChange("numberOfService", e.target.value)
            }
            error={!!errors.numberOfService}
            helperText={errors.numberOfService}
            disabled={!isEditing}
          />
          <TextField
            label="Giá đã thanh toán"
            type="number"
            fullWidth
            value={editFields.purchasePrice}
            onChange={(e) => handleFieldChange("purchasePrice", e.target.value)}
            disabled={true}
          />
        </Box>
        <hr className="my-6 border-t-2 border-gray-500" />

        <TextField
          label="Dinh dưỡng"
          multiline
          fullWidth
          rows={4}
          value={editFields.nutrition}
          onChange={(e) => handleFieldChange("nutrition", e.target.value)}
          disabled={!isEditing}
          error={!!errors.nutrition}
          helperText={errors.nutrition}
        />
        <hr className="my-6 border-t-2 border-gray-500" />
        <p className="text-gray-500 text-sm mb-2">
          Nếu bạn muốn thêm bước khi chỉnh sửa thì vui lòng thêm chữ{" "}
          <strong>Bước</strong> ngay ở phía trước nhé{" "}
          <span role="img" aria-label="smile">
            😊
          </span>
        </p>
        <TextField
          label="Hướng dẫn"
          multiline
          fullWidth
          rows={4}
          value={editFields.tutorial}
          onChange={(e) => handleFieldChange("tutorial", e.target.value)}
          disabled={!isEditing}
          error={!!errors.tutorial}
          helperText={errors.tutorial}
        />
      </Box>
      <hr className="my-6 border-t-2 border-gray-500" />

      <Box sx={{ mt: 3 }}>
        {!isEditing ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF6F00", // Màu cam
              "&:hover": {
                backgroundColor: "#FF8F1F", // Màu cam nhạt khi hover
              },
            }}
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </Button>
        ) : (
          <>
            <Button variant="contained" color="success" onClick={saveChanges}>
              Lưu
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={restoreFields}
              sx={{ ml: 2 }}
            >
              Khôi phục
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsEditing(false)}
              sx={{ ml: 2 }}
            >
              Hủy
            </Button>
          </>
        )}
      </Box>

      {/* Dialog Confirmation */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null })}
      >
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.action === "save"
              ? "Bạn chắc chắn muốn lưu thay đổi?"
              : "Bạn chắc chắn muốn khôi phục lại giá trị ban đầu?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, action: null })}
          >
            Hủy
          </Button>
          <Button onClick={executeAction} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditSavedRecipe;
