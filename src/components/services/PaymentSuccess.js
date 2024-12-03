import axios from "axios";

export const updateAccountCoin = async (accountId, coin) => {
  try {
    // Send the updated account data back to the API
    const updatedResponse = await axios.post(`https://rmrbdapi.somee.com/odata/Payment/${accountId}/${coin}`, {}, {
      headers: {
        "Content-Type": "application/json",
        Token: "123-abc",
      },
    });

    // Check if the update was successful
    if (updatedResponse.status === 200) {
      console.log("Account coin updated successfully");
    } else {
      console.error("Error updating account coin");
    }
  } catch (error) {
    console.error("Error updating account coin", error);
  }
};