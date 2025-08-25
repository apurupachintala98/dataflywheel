interface ConfigParams {
  environment: string;
  appLvlPrefix: string;
}

export const config = ({ environment, appLvlPrefix }: ConfigParams) => {

  const apiBaseUrl =
    environment === "PREPROD"
      ? "https://sfassist.edagenaipreprod.awsdns.internal.das/api/cortex/"
      : "https://sfassist.edagenaidev.awsdns.internal.das/api/cortex/";
  return {
    API_BASE_URL: apiBaseUrl,
    APP_CONFIG: {
      APP_ID: "edadip",
      API_KEY: "78a799ea-a0f6-11ef-a0ce-15a449f7a8b0",
      DEFAULT_MODEL: "llama3.1-70b",
      APP_NM: "app_nm",
      DATABASE_NAME: "",
      SCHEMA_NAME: "schema_nm",
      STAGE_NAME: "",
      APP_LVL_PREFIX:  appLvlPrefix,
    },

    ENDPOINTS: {
      LOGIN: "/login",
      USER_INFO: "/user-info",
      CORTEX_SEARCH: "search_details",
      CORTEX_ANALYST: "analyst_details",
      TEXT_TO_SQL: "txt2sql",
      AGENT: "agent",
      RUN_SQL_QUERY: "txt2sql/run_sql_query",
      CORTEX_COMPLETE: "complete",
      UPLOAD_URL: "upload_file/",
      FEEDBACK: "update_feedback/",
      DB_SCHEMA_LIST: "get_app_db_schm_lst",
      GET_PROMPTS: "prompts",
      GET_VEGALITE_JSON: "txt2sql/generate_vega_lite_json"
    }
  }
};

