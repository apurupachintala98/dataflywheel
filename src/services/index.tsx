import axios from "axios";
import config from "../utils/config";

interface QueryOverrides {
  database_nm?: string;
  schema_nm?: string;
  session_id?: string;
  [key: string]: any;
}

const { API_BASE_URL, ENDPOINTS, APP_CONFIG } = config;
const {
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

const buildQueryParams = (overrides: QueryOverrides = {}) => {
  const params = {
    aplctn_cd: overrides.aplctn_cd, // now passed explicitly
    app_id: APP_ID,
    api_key: API_KEY,
    session_id: overrides.session_id || "default-session-id",
    database_nm: overrides.database_nm || DATABASE_NAME,
    schema_nm: overrides.schema_nm || SCHEMA_NAME,
    ...overrides,
  };

  return Object.entries(params)
    .filter(([, val]) => val !== undefined) // remove undefined keys
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join("&");
};

const ApiService = {
 
getCortexSearchDetails: async ({
    aplctn_cd,
    database_nm,
    schema_nm,
    session_id,
  }: QueryOverrides) => {
    try {
      const queryParams = buildQueryParams({ aplctn_cd, database_nm, schema_nm, session_id });
      const response = await axiosInstance.post(`${ENDPOINTS.CORTEX_SEARCH}/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cortex search details:", error);
      throw error;
    }
  },

  getCortexAnalystDetails: async ({
    aplctn_cd,
    database_nm,
    schema_nm,
    session_id,
  }: QueryOverrides) => {
    try {
      const queryParams = buildQueryParams({ aplctn_cd, database_nm, schema_nm, session_id });
      const response = await axiosInstance.post(`${ENDPOINTS.CORTEX_ANALYST}/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cortex analyst details:", error);
      throw error;
    }
  },


};

export default ApiService;
