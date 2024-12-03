import axios from "axios";

export const saveReport = async (ServicefeedbackData) => {
    const urlServicefeedback = "https://rmrbdapi.somee.com/odata/Servicefeedback";
    try {
        const response = await axios.post(urlServicefeedback, ServicefeedbackData, {
            headers: {
                Token: "123-abc"
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error saving Report:", error);
        throw new Error("Failed to save Report.");
    }
};

export const saveReportImage = async (id, image) => {
    const urlServicefeedback = `https://rmrbdapi.somee.com/odata/UploadImage/Service/${id}`;
    const formData = new FormData();
    formData.append('image', image);
  
    try {
      const response = await axios.post(urlServicefeedback, formData, {
        headers: {
          Token: "123-abc",
          'Content-Type': 'multipart/form-data'
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error saving Report Image:", error);
      throw new Error("Failed to save Report Image.");
    }
  };

  export const getReportByAccountId = async (accountId) => {
    const urlServicefeedback = `https://rmrbdapi.somee.com/odata/Servicefeedback?$filter=CustomerId eq ${accountId} &$OrderBy=date desc`;
    try {
      const response = await axios.get(urlServicefeedback, {
        headers: {
          Token: "123-abc"
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Report:", error);
      throw new Error("Failed to fetch Report.");
    }
  };

  export const getReportById = async (id) => {
    const urlServicefeedback = `https://rmrbdapi.somee.com/odata/Servicefeedback/${id}`;
    try {
      const response = await axios.get(urlServicefeedback, {
        headers: {
          Token: "123-abc"
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Report:", error);
      throw new Error("Failed to fetch Report.");
    }
};

export const deleteReport = async (id) => {
    const urlServicefeedback = `https://rmrbdapi.somee.com/odata/Servicefeedback/${id}`;
    try {
      const response = await axios.delete(urlServicefeedback, {
        headers: {
          Token: "123-abc"
        },
      });
      return response;
    } catch (error) {
      console.error("Error deleting Report:", error);
      throw new Error("Failed to delete Report.");
    }
  };

export const getAllReport = async () => {
  const urlServicefeedback = "https://rmrbdapi.somee.com/odata/Servicefeedback?$OrderBy=date desc";
  try {
    const response = await axios.get(urlServicefeedback, {
      headers: {
        Token: "123-abc"
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Report:", error);
    throw new Error("Failed to fetch Report.");
  }
}

export const updateReport = async (id, data) => {
    const urlServicefeedback = `https://rmrbdapi.somee.com/odata/Servicefeedback/${id}`;
    try {
      const response = await axios.put(urlServicefeedback, data, {
        headers: {
          Token: "123-abc"
        },
      });
      return response;
    } catch (error) {
      console.error("Error updating Report:", error);
      throw new Error("Failed to update Report.");
    }
  };