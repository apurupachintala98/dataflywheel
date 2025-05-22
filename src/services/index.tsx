import axios from "axios";
import config from "../utils/config.json";

const { API_BASE_URL, ENDPOINTS, APP_CONFIG } = config;
const {
  APLCTN_CD,
  APP_ID,
  API_KEY,
  DATABASE_NAME,
  SCHEMA_NAME
} = APP_CONFIG;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const buildQueryParams = (overrides = {}) => {
  const params = {
    aplctn_cd: APLCTN_CD,
    app_id: APP_ID,
    api_key: API_KEY,
    session_id: "0c508184-5da9-4bfe-9651-bb56e8bbf2ee",
    database_nm: DATABASE_NAME,
    schema_nm: SCHEMA_NAME,
    ...overrides
  };

  return Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join("&");
};

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
      const queryParams = buildQueryParams();
      const response = await axiosInstance.post(`${ENDPOINTS.CORTEX_SEARCH}/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cortex search details:", error);
      throw error;
    }
  },

  getCortexAnalystDetails: async () => {
    try {
      const queryParams = buildQueryParams();
      const response = await axiosInstance.post(`${ENDPOINTS.CORTEX_ANALYST}/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cortex analyst details:', error);
      throw error;
    }
  },

};

export default ApiService;
