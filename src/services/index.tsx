// import axios from "axios";
// import { config } from "../hooks/config";

// interface QueryOverrides {
//   database_nm?: string;
//   schema_nm?: string;
//   session_id?: string;
//   [key: string]: any;
// }

// const buildQueryParams = (overrides: QueryOverrides = {}) => {
//   const { APP_CONFIG } = config();
//   const { APP_ID, API_KEY, DATABASE_NAME, SCHEMA_NAME, APP_LVL_PREFIX } = APP_CONFIG;

//   const safeOverrides = Object.fromEntries(
//     Object.entries(overrides).filter(([, val]) => val !== undefined)
//   );

//   const params = {
//     ...safeOverrides,
//     aplctn_cd: safeOverrides.aplctn_cd, 
//     app_id: APP_ID,
//     api_key: API_KEY,
//     session_id: safeOverrides.session_id || "default-session-id",
//     database_nm: safeOverrides.database_nm ?? DATABASE_NAME,
//     schema_nm: safeOverrides.schema_nm ?? SCHEMA_NAME,
//     app_lvl_prefix: APP_LVL_PREFIX,
//   };

//   return Object.entries(params)
//     .filter(([, val]) => val !== undefined) // remove any leftover undefined
//     .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
//     .join("&");
// };


// const ApiService = {
//   getCortexSearchDetails: async ({
//     aplctn_cd, database_nm, schema_nm, session_id
//   }: QueryOverrides) => {
//     try {
//       const { API_BASE_URL, ENDPOINTS } = config();
//       const queryParams = buildQueryParams({aplctn_cd, database_nm, schema_nm, session_id});
//       const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.CORTEX_SEARCH}/?${queryParams}`);
//       console.log(API_BASE_URL);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching cortex search details:", error);
//       throw error;
//     }
//   },

//   getCortexAnalystDetails: async ({
//     aplctn_cd, database_nm, schema_nm, session_id
//   }: QueryOverrides) => {
//     try {
//       const { API_BASE_URL, ENDPOINTS } = config();
//       const queryParams = buildQueryParams({aplctn_cd, database_nm, schema_nm, session_id});
//       const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.CORTEX_ANALYST}/?${queryParams}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching cortex analyst details:", error);
//       throw error;
//     }
//   },
// };

// export default ApiService;

import axios from "axios";
import { config } from "../hooks/config";

interface QueryOverrides {
  database_nm?: string;
  schema_nm?: string;
  session_id?: string;
  [key: string]: any;
}

const buildPayload = (overrides: QueryOverrides = {}) => {
  const { APP_CONFIG } = config();
  const { APP_ID, API_KEY, DATABASE_NAME, SCHEMA_NAME, APP_LVL_PREFIX } = APP_CONFIG;

  const safeOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([, val]) => val !== undefined)
  );

  const query = {
    ...safeOverrides,
    // aplctn_cd: safeOverrides.aplctn_cd,
    app_id: APP_ID,
    api_key: API_KEY,
    // session_id: safeOverrides.session_id || "default-session-id",
    // database_nm: safeOverrides.database_nm ?? DATABASE_NAME,
    // schema_nm: safeOverrides.schema_nm ?? SCHEMA_NAME,
    app_lvl_prefix: APP_LVL_PREFIX,
  };

  return { query };
};

const ApiService = {
  getCortexSearchDetails: async ({
    aplctn_cd, database_nm, schema_nm, session_id
  }: QueryOverrides) => {
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

  getCortexAnalystDetails: async ({
    aplctn_cd, database_nm, schema_nm, session_id
  }: QueryOverrides) => {
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
  },
};

export default ApiService;
