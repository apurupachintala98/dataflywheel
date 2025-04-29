import axios from "axios";
const API_BASE_URL = 'http://10.126.192.122:8340/';
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

  getCortexSearchDetails: async () => {
    try {
      const response = await axiosInstance.post('api/cortex/search_details/?aplctn_cd=aedldocai&app_id=docai&api_key=78a799ea-a0f6-11ef-a0ce-15a449f7a8b0&session_id=02c8491b-e128-4a0e-8caa-21c00124cddb&database_nm=DOC_AI_DB&schema_nm=HEDIS_SCHEMA');
      return response.data;
    } catch (error) {
      console.error("Error fetching cortex search details:", error);
      throw error;
    }
  },

  getCortexAnalystDetails: async () => {
    try {
      const response = await axiosInstance.post('/api/cortex/analyst_details/?aplctn_cd=aedldocai&app_id=docai&api_key=78a799ea-a0f6-11ef-a0ce-15a449f7a8b0&session_id=da69b1c3-e3f5-4901-9450-231a732fb996&database_nm=DOC_AI_DB&schema_nm=HEDIS_SCHEMA');
      return response.data;
    } catch (error) {
      console.error('Error fetching cortex analyst details:', error);
      throw error;
    }
  },

  sendTextToSQL: async (payload: any) => {
    try {
      const response = await axiosInstance.post('/api/cortex/txt2sql', payload);
      return response.data;
    } catch (error) {
      console.error('Error processing text-to-SQL request:', error);
      throw error;
    }
  },

  runExeSql: async (payload: any) => {
    try {
      const response = await axiosInstance.post('/api/cortex/txt2sql/run_sql_query', payload);
      return response.data;
    } catch (error) {
      console.error('Error processing request:', error);
      throw error;
    }
  },

  postCortexPrompt: async (payload: any) => {
    try {
      const response = await axiosInstance.post('/api/cortex/complete', payload);
      return response.data;
    } catch (error) {
      console.error("Error sending cortex prompt:", error);
      throw error;
    }
  }
};
export default ApiService;
