import axios from "axios";
import { config } from "../hooks/config";
import { useSelectedApp } from "components/SelectedAppContext";

interface QueryOverrides {
  database_nm?: string;
  schema_nm?: string;
  session_id?: string;
  [key: string]: any;
}

// const buildPayload = (overrides: QueryOverrides = {}) => {
//   const { environment, appLvlPrefix } = useSelectedApp();
//   const { API_BASE_URL, ENDPOINTS, APP_CONFIG } = config({
//     environment,
//     appLvlPrefix,
//   });

//   // const { APP_CONFIG } = config();
//   // const { APP_ID, API_KEY, DATABASE_NAME, SCHEMA_NAME, APP_LVL_PREFIX } = APP_CONFIG;

//   // const safeOverrides = Object.fromEntries(
//   //   Object.entries(overrides).filter(([, val]) => val !== undefined)
//   // );

//   // const query = {
//   //   ...safeOverrides,
//   //   app_id: APP_ID,
//   //   api_key: API_KEY,
//   //   app_lvl_prefix: APP_LVL_PREFIX,
//   // };

//   return { query };
// };



const buildPayload = (overrides: QueryOverrides = {}) => {
  const { environment, appLvlPrefix } = useSelectedApp();
  const { API_BASE_URL, ENDPOINTS, APP_CONFIG } = config({
    environment,
    appLvlPrefix,
  });

  const { APP_ID, API_KEY, DATABASE_NAME, SCHEMA_NAME, APP_LVL_PREFIX } =
    APP_CONFIG;

  const safeOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([, val]) => val !== undefined)
  );

  const query = {
    ...safeOverrides,
    app_id: APP_ID,
    api_key: API_KEY,
    app_lvl_prefix: APP_LVL_PREFIX,
  };

  return { query };
};
const ApiService = {

  async getCortexSearchDetails({
    aplctn_cd, database_nm, schema_nm, session_id
  }: QueryOverrides) {
    try {
      const { API_BASE_URL, ENDPOINTS } = config();
      const payload = buildPayload({ aplctn_cd, database_nm, schema_nm, session_id });

      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.CORTEX_SEARCH}/`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching cortex search details:", error);
      throw error;
    }
  },

  async getCortexAnalystDetails({
    aplctn_cd, database_nm, schema_nm, session_id
  }: QueryOverrides) {
    try {
      const { API_BASE_URL, ENDPOINTS } = config();
      const payload = buildPayload({ aplctn_cd, database_nm, schema_nm, session_id });

      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.CORTEX_ANALYST}/`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching cortex analyst details:", error);
      throw error;
    }
  }
};

export default ApiService;

