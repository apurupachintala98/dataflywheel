import config from '../utils/config.json';
const { APP_CONFIG } = config;

type BasePayloadParams = {
  selectedAppId: string;
  sessionId: string;
  database_nm?: string;
  schema_nm?: string;
  stage_nm?: string;
  user_nm?: string;
  user_pwd?: string;
};

type MinimalPayloadParams = BasePayloadParams & {
  prompt: string;
  execSQL: string;
  minimal: true;
};

type FullPayloadParams = BasePayloadParams & {
  model?: string;
  prompt: string;
  semanticModel?: string[];
  searchModel?: string[];
  execSQL?: string;
  sysMsg?: string;
  method?: string;
  responseData?: any;
  minimal?: false;
};

export const buildPayload = (params: MinimalPayloadParams | FullPayloadParams) => {
  const {
    APP_ID,
    API_KEY,
    DEFAULT_MODEL,
    DATABASE_NAME,
    SCHEMA_NAME,
    STAGE_NAME,
  } = APP_CONFIG;

  const {
    selectedAppId,
    sessionId,
    database_nm = DATABASE_NAME,
    schema_nm = SCHEMA_NAME,
    stage_nm = STAGE_NAME,
    user_nm,
    user_pwd,
  } = params;

  if ('minimal' in params && params.minimal) {
    const { prompt, execSQL } = params;
    return {
      query: {
        aplctn_cd: selectedAppId.toLowerCase(),
        app_id: APP_ID,
        api_key: API_KEY,
        prompt: {
          messages: [{ role: "user", content: prompt }],
        },
        app_lvl_prefix: "supportcbt_dml",
        session_id: sessionId,
        exec_sql: execSQL,
        user_nm,
        user_pwd,
        database_nm,
        schema_nm,
      },
    };
  }

  const {
    model = DEFAULT_MODEL,
    prompt,
    semanticModel = [],
    searchModel = [],
    execSQL,
    sysMsg,
    method,
    responseData,
  } = params;

  return {
    query: {
      aplctn_cd: selectedAppId.toLowerCase(),
      app_id: APP_ID,
      api_key: API_KEY,
      model,
      method,
      semantic_model: semanticModel,
      search_service: searchModel,
      search_limit: 0,
      prompt: {
        messages: [{ role: "user", content: prompt }],
      },
      app_lvl_prefix: "supportcbt_dml",
      session_id: sessionId,
      exec_sql: execSQL,
      sys_msg: sysMsg ? `${sysMsg}${JSON.stringify(responseData)}` : undefined,
      database_nm,
      schema_nm,
      stage_nm,
      user_nm,
      user_pwd,
    },
  };
};
