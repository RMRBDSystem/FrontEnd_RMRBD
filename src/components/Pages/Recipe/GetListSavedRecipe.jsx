import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress, // Import CircularProgress for loading indicator
} from "@mui/material";

const GetListSaveRecipe = () => {
  const [data, setData] = useState([]); // State to store Recipe data
  const [accountId, setAccountID] = useState(null); // State to store UserId
  const [loading, setLoading] = useState(true); // State for loading status
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = Cookies.get("UserId");
    if (storedUserId) {
      setAccountID(storedUserId);
    }
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true); // Set loading to true before the request
      const accountId = Cookies.get("UserId");
      const result = await axios.get(
        `https://rmrbdapi.somee.com/odata/Recipe?$filter=personalRecipes/any(p: p/customerId eq ${accountId})`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      setData(result.data);
      console.log("Data", result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  const handleEdit = (recipeId) => {
    // Navigate to the edit page
    navigate(`/editrecipecustomer-recipe/${recipeId}`);
  };

  return (
    <Container className="section-center pb-12 bg-gray-300 rounded-full" maxWidth={"xl"}>
      <div className="flex justify-center items-center">
        <Typography className="flex items-center" variant="h4" gutterBottom>
          Công thức nấu ăn đã lưu<img src="/images/icon/recipe.svg" alt="Công thức nấu ăn" className="h-20 w-20 ml-2" />
        </Typography>
      </div>
      {/* Show loading indicator when data is being fetched */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh", // Center the loading spinner in the middle of the screen
          }}
        >
          <CircularProgress />
        </Box>
      ) : data.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {data.map((recipe) => (
            <Card
              key={recipe.recipeId}
              sx={{
                display: "flex",
                flexDirection: "column", // Ensures the content is stacked vertically
                maxWidth: 345,
                width: "100%", // Ensures it spans full width on small screens
                flex: "1 1 calc(33.333% - 16px)", // 3 cards per row with 16px gap
                "@media (max-width: 900px)": {
                  flex: "1 1 calc(50% - 16px)", // 2 cards per row on medium screens
                },
                "@media (max-width: 600px)": {
                  flex: "1 1 100%", // 1 card per row on small screens
                },
              }}
            >
              {recipe.images && recipe.images.length > 0 ? (
                <CardMedia
                  className="block w-full h-60 mb-4 object-cover object-center rounded-lg"
                  component="img"
                  height="140"
                  image={recipe.images[0].imageUrl}
                  alt={`${recipe.recipeName} Image`}
                />
              ) : (
                <CardMedia
                  className="block w-full h-60 mb-4 object-cover object-center rounded-lg"
                  component="div"
                  sx={{
                    height: 140,
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#888",
                    fontSize: "1rem",
                  }}
                >
                  No Image Available
                </CardMedia>
              )}
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column", // Ensures the content is stacked vertically
                  justifyContent: "space-between", // Ensures spacing between elements
                  minHeight: 250, // Ensures enough space for content and button
                  flexGrow: 1, // Ensures the content area grows to fill available space
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {recipe.recipeName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {recipe.description || "No description"}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(recipe.recipeId)}
                  fullWidth
                  sx={{ marginTop: "auto" }} // Ensures the button stays at the bottom
                >
                  Edit Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ marginTop: 2 }}>
          No recipes found.
        </Typography>
      )}
    </Container>
  );
};

export default GetListSaveRecipe;
