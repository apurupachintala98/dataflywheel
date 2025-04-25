import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_SERVICE_URL;
// Set up a default axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const bodyParm = {};

const ApiService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/login", bodyParm);
      return response.data; // This should include the token
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },
  fetchUserInfo: async (token: string) => {
    try {
      const response = await axiosInstance.post(
        "/user-info",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data; // This should include the user info
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },
};
export default ApiService;
