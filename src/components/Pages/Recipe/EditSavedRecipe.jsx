import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
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

const EditRecipe = () => {
  const { recipeId } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipeData(recipeId);
  }, [recipeId]);

  const fetchRecipeData = async (recipeId) => {
    setLoading(true);
    try {
      const userId = Cookies.get("UserId");
      const url = `https://rmrbdapi.somee.com/odata/PersonalRecipe/${userId}/${recipeId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      });

      const data = response.data;
      setRecipeData(data);
      setEditFields({
        ingredient: data.ingredient || "",
        numberOfService: data.numberOfService || 0,
        nutrition: data.nutrition || "",
        tutorial: data.tutorial || "",
        purchasePrice: data.purchasePrice || 0,
      });
    } catch (error) {
      console.error("Error fetching recipe data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const restoreFields = () => {
    setConfirmDialog({
      open: true,
      action: "restore",
    });
  };

  const saveChanges = () => {
    setConfirmDialog({
      open: true,
      action: "save",
    });
  };

  const executeAction = async () => {
    if (confirmDialog.action === "save") {
      try {
        const userId = Cookies.get("UserId");
        const updatedData = {
          recipeId,
          customerId: userId,
          ...editFields,
          status: -1,
        };

        await axios.put(
          `https://rmrbdapi.somee.com/odata/PersonalRecipe/${userId}/${recipeId}`,
          updatedData,
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          }
        );

        alert("Changes saved successfully!");
        setIsEditing(false);
      } catch (error) {
        console.error("Error saving changes:", error);
        alert("Failed to save changes.");
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
  if (!recipeData) return <Typography>Loading...</Typography>;

  const recipeName = recipeData.recipe?.recipeName || "Recipe Name";

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 5, backgroundColor: "white", p: 3, borderRadius: 2 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Recipe
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        {recipeName}
      </Typography>

      <Box color="#024e85" display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Ingredients"
          multiline
          fullWidth
          rows={4}
          value={editFields.ingredient}
          onChange={(e) => handleFieldChange("ingredient", e.target.value)}
          disabled={!isEditing}
        />
        <Box display="flex" gap={2}>
          <TextField
            label="Number of Services"
            type="number"
            fullWidth
            value={editFields.numberOfService}
            onChange={(e) =>
              handleFieldChange("numberOfService", e.target.value)
            }
            disabled={!isEditing}
          />
          <TextField
            label="Purchase Price"
            type="number"
            fullWidth
            value={editFields.purchasePrice}
            onChange={(e) => handleFieldChange("purchasePrice", e.target.value)}
            disabled={!isEditing}
          />
        </Box>
        <TextField
          label="Nutrition"
          multiline
          fullWidth
          rows={4}
          value={editFields.nutrition}
          onChange={(e) => handleFieldChange("nutrition", e.target.value)}
          disabled={!isEditing}
        />
        <TextField
          label="Tutorial"
          multiline
          fullWidth
          rows={4}
          value={editFields.tutorial}
          onChange={(e) => handleFieldChange("tutorial", e.target.value)}
          disabled={!isEditing}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        {!isEditing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        ) : (
          <>
            <Button variant="contained" color="success" onClick={saveChanges}>
              Save
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={restoreFields}
              sx={{ ml: 2 }}
            >
              Restore
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsEditing(false)}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </>
        )}
      </Box>

      {/* Dialog Confirmation */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null })}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.action === "save"
              ? "Are you sure you want to save the changes?"
              : "Are you sure you want to restore the original values?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, action: null })}
          >
            Cancel
          </Button>
          <Button onClick={executeAction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditRecipe;
