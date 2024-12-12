import CryptoJS from "crypto-js";

const secretKey = "your-secret-key"; 

// Hàm mã hóa
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Hàm giải mã
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Giải mã thất bại:", error);
    return null; 
  }
};