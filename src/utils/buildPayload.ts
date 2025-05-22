import { APP_CONFIG } from '../utils/config.json';

type MinimalPayloadParams = {
  prompt: string;
  execSQL: string;
  sessionId: string;
  minimal: true;
};

type FullPayloadParams = {
  model?: string;
  prompt: string;
  semanticModel?: string[];
  searchModel?: string[];
  execSQL?: string;
  sysMsg?: string;
  method?: string;
  responseData?: any;
  sessionId?: string;
  database_nm?: string;
  schema_nm?: string;
  stage_nm?: string;
  minimal?: false;
};

export const buildPayload = (params: MinimalPayloadParams | FullPayloadParams) => {
  const {
    APLCTN_CD,
    APP_ID,
    API_KEY,
    DEFAULT_MODEL,
    APP_NM,
    DATABASE_NAME,
    SCHEMA_NAME,
    STAGE_NAME
  } = APP_CONFIG;

  if ('minimal' in params && params.minimal) {
    const { prompt, execSQL, sessionId } = params;
    return {
      query: {
        aplctn_cd: APLCTN_CD,
        app_id: APP_ID,
        api_key: API_KEY,
        prompt: {
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        app_lvl_prefix: "",
        session_id: sessionId,
        exec_sql: execSQL,
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
    sessionId = "default-session-id",
    database_nm = DATABASE_NAME,
    schema_nm = SCHEMA_NAME,
    stage_nm = STAGE_NAME,
  } = params;

  return {
    query: {
      aplctn_cd: APLCTN_CD,
      app_id: APP_ID,
      api_key: API_KEY,
      model,
      method,
      semantic_model: semanticModel,
      search_service: searchModel,
      search_limit: 0,
      prompt: {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      app_lvl_prefix: "",
      session_id: sessionId,
      exec_sql: execSQL,
      sys_msg: sysMsg ? `${sysMsg}${JSON.stringify(responseData)}` : undefined,
      database_nm,
      schema_nm,
      stage_nm,
    },
  };
};

