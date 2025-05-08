import axios from "axios";
import config from "../utils/config.json";

const { API_BASE_URL, ENDPOINTS } = config;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const ApiService = {
  // login: async (email: string, password: string) => {
  //   try {
  //     const response = await axiosInstance.post(ENDPOINTS.LOGIN, {});
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //     throw error;
  //   }
  // },

  // fetchUserInfo: async (token: string) => {
  //   try {
  //     const response = await axiosInstance.post(
  //       ENDPOINTS.USER_INFO,
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching user info:", error);
  //     throw error;
  //   }
  // },

  getCortexSearchDetails: async () => {
    try {
      const response = await axiosInstance.post(`${ENDPOINTS.CORTEX_SEARCH}/?aplctn_cd=aedl&app_id=aedl&api_key=78a799ea-a0f6-11ef-a0ce-15a449f7a8b0&session_id=0c508184-5da9-4bfe-9651-bb56e8bbf2ee&database_nm=POC_SPC_SNOWPARK_DB&schema_nm=HEDIS_SCHEMA`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cortex search details:", error);
      throw error;
    }
  },

  getCortexAnalystDetails: async () => {
    try {
      const response = await axiosInstance.post(`${ENDPOINTS.CORTEX_ANALYST}/?aplctn_cd=aedl&app_id=aedl&api_key=78a799ea-a0f6-11ef-a0ce-15a449f7a8b0&session_id=111fc900-2712-4d3e-93c8-d22f64320218&database_nm=POC_SPC_SNOWPARK_DB&schema_nm=HEDIS_SCHEMA`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cortex analyst details:', error);
      throw error;
    }
  },

};

export default ApiService;
