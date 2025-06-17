import axios from "axios";
import config from "../utils/config.json";
import { useSelectedApp } from '../components/ SelectedAppContext';

interface QueryOverrides {
  database_nm?: string;
  schema_nm?: string;
  session_id?: string;
  [key: string]: any; // allows for future overrides without error
}

const { API_BASE_URL, ENDPOINTS, APP_CONFIG } = config;
const {
  APP_ID,
  API_KEY,
  DATABASE_NAME,
  SCHEMA_NAME
} = APP_CONFIG;
const { selectedAppId, setSelectedAppId } = useSelectedApp();

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



const buildQueryParams = (overrides: QueryOverrides = {}) => {
  const params = {
    aplctn_cd: selectedAppId,
    app_id: APP_ID,
    api_key: API_KEY,
    session_id: overrides.session_id || "0c508184-5da9-4bfe-9651-bb56e8bbf2ee",
    database_nm: overrides.database_nm || DATABASE_NAME,
    schema_nm: overrides.schema_nm || SCHEMA_NAME,
    ...overrides,
  };

  return Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join("&");
};

const ApiService = {
 
 getCortexSearchDetails: async ({ database_nm, schema_nm }: { database_nm?: string; schema_nm?: string }) => {
  try {
    const queryParams = buildQueryParams({ database_nm, schema_nm });
    const response = await axiosInstance.post(`${ENDPOINTS.CORTEX_SEARCH}/?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cortex search details:", error);
    throw error;
  }
},

getCortexAnalystDetails: async ({ database_nm, schema_nm }: { database_nm?: string; schema_nm?: string }) => {
  try {
    const queryParams = buildQueryParams({ database_nm, schema_nm });
    const response = await axiosInstance.post(`${ENDPOINTS.CORTEX_ANALYST}/?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cortex analyst details:", error);
    throw error;
  }
},


};

export default ApiService;
