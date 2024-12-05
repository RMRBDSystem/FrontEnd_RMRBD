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
  CircularProgress,
  Link,
} from "@mui/material";
import Sidebar from "../../AccountProfile/Sidebar";
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
  const handleDetails = (recipeId) => {
    // Navigate to the edit page
    navigate(`/recipecustomer-detail/${recipeId}`);
  };
  return (
    <section className="flex flex-col md:flex-row justify-center items-start p-4 space-y-8 md:space-y-0 md:space-x-8">
      <Sidebar />
      <div className="flex flex-col">
        <Container
          className="section-center w-[1000px] bg-white p-4 rounded-lg shadow-md flex flex-col"
        >
          <h2 className="text-2xl font-bold text-gray-800 pb-10">
            Công thức nấu ăn đã lưu
          </h2>

          {/* Show loading indicator when data is being fetched */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh", // Center the loading spinner in the middle of the screen
                width: "100vh"
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
                    maxWidth: 350,
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
                      minHeight: 200, // Ensures enough space for content and button
                      flexGrow: 1, // Ensures the content area grows to fill available space
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {recipe.recipeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recipe.description || "No description"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        marginTop: "auto",
                        flexDirection: "row",
                        width: "100%",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleEdit(recipe.recipeId)}
                        sx={{
                          background: "linear-gradient(45deg, #FF6F00, #FF8F00)", // Gradient from dark to light orange
                          color: "white", // White text color for contrast
                          "&:hover": {
                            background: "linear-gradient(45deg, #FF8F00, #FF6F00)", // Reverse the gradient on hover for effect
                          },
                          boxShadow: 2, // Optional shadow for the button to give it a floating effect
                          flex: 1, // Makes the button flexible within the container
                        }}
                      >
                        Chỉnh sửa
                      </Button>

                      <Button
                        variant="contained"
                        onClick={() => handleDetails(recipe.recipeId)}
                        sx={{
                          background: "linear-gradient(45deg, #FF6F00, #FF8F00)", // Gradient from dark to light orange
                          color: "white", // White text color for contrast
                          "&:hover": {
                            background: "linear-gradient(45deg, #FF8F00, #FF6F00)", // Reverse the gradient on hover for effect
                          },
                          boxShadow: 2, // Optional shadow for the button to give it a floating effect
                          flex: 1, // Makes the button flexible within the container
                        }}
                      >
                        Chi tiết
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Bạn chưa có công thức nào đã lưu.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginTop: 2, textAlign: "center", lineHeight: 1.5 }}
              >
                Hãy tới trang này để làm đầy bộ sưu tập của bạn nhé!{" "}
                <Link
                  href="/recipe"
                  color="primary"
                  sx={{ fontWeight: "bold", textDecoration: "underline" }}
                >
                  Mua công thức ngay!
                </Link>
              </Typography>
            </Box>
          )}
        </Container>
      </div>
    </section>
  );
};

export default GetListSaveRecipe;
