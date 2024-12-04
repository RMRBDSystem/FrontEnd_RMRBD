import axios from "axios";

const API_URL = "https://rmrbdapi.somee.com/odata"; // Base API URL
const TOKEN = "123-abc";

// Create axios instance with default config
const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Token: TOKEN,
  },
});

// Get all ebooks
export const getEbooks = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/ebook?$filter=status eq 1&$expand=category`,
      {
        headers: {
          token: TOKEN,
          mode: "no-cors",
        },
      }
    );


    // Check if response.data is an array
    const ebooksData = Array.isArray(response.data) ? response.data : [];

    if (ebooksData.length === 0) {
      console.warn("No ebooks found in response");
      return [];
    }

    const transformedData = ebooksData.map(ebook => ({
      ebookId: ebook.EbookId,
      ebookName: ebook.EbookName,
      author: ebook.Author,
      description: ebook.Description,
      price: ebook.Price,
      imageUrl: ebook.ImageUrl,
      pdfUrl: ebook.PdfUrl,
      category: ebook.Category?.Name,
      categoryId: ebook.CategoryId,
      status: ebook.Status,
      createBy: ebook.CreateBy?.UserName
    }));

    console.log("Transformed Data:", transformedData);

    return transformedData;
  } catch (error) {
    console.error("Error fetching ebooks:", error);
    return [];
  }
};

// Get ebook by ID
export const getEbookById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/ebook/${id}?$expand=category`,
      {
        headers: {
          token: TOKEN,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error in getEbookById:", error);
    throw error;
  }
};

// Get ebooks by category
export const getEbooksByCategory = async (categoryId) => {
  try {
    const response = await apiInstance.get(`/ebook?$filter=categoryId eq ${categoryId} and status eq 1`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ebooks for category ${categoryId}:`, error);
    throw error;
  }
};

// Create new ebook
export const createEbook = async (ebookData) => {
  try {
    const response = await apiInstance.post("/ebook", {
      ...ebookData,
      author: ebookData.author || null,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating ebook:", error);
    throw error;
  }
};

// Update ebook
export const updateEbook = async (ebookId, ebookData) => {
  try {
    const response = await apiInstance.put(`/ebook/${ebookId}`, ebookData);
    return response.data;
  } catch (error) {
    console.error(`Error updating ebook with ID ${ebookId}:`, error);
    throw error;
  }
};

// Delete ebook
export const deleteEbook = async (ebookId) => {
  try {
    const response = await apiInstance.delete(`/ebook/${ebookId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ebook with ID ${ebookId}:`, error);
    throw error;
  }
};

// Add this new function
export const checkEbookOwnership = async (customerId, ebookId) => {
  try {
    const response = await axios.get(
      `${API_URL}/bookshelf?$filter=customerId eq ${customerId} and ebookId eq ${ebookId} and status eq 1`,
      {
        headers: {
          token: TOKEN,
        },
      }
    );

    console.log("Ownership check response:", response.data);

    // Ensure response.data is an array
    const isOwned = Array.isArray(response.data) && response.data.length > 0;
    console.log(`Ebook ${ebookId} owned by customer ${customerId}:`, isOwned);

    return isOwned;
  } catch (error) {
    console.error("Error checking ebook ownership:", error);
    return false;
  }
}; 