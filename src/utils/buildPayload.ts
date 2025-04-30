export const buildPayload = (params: {
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
  }) => {
    const {
      model = "llama3.1-70b",
      prompt,
      semanticModel = [],
      searchModel = [],
      execSQL,
      sysMsg,
      method,
      responseData,
      sessionId = "default-session-id",
      database_nm = "",
      schema_nm = "",
      stage_nm = ""
    } = params;
  
    return {
      query: {
        aplctn_cd: "aedl",
        app_id: "aedl",
        api_key: "78a799ea-a0f6-11ef-a0ce-15a449f7a8b0",
        model,
        method,
        semantic_model: semanticModel,
        search_service: searchModel,
        search_limit: 0,
        prompt: { messages: [{ role: "user", content: prompt }] },
        app_lvl_prefix: "",
        session_id: sessionId,
        exec_sql: execSQL,
        sys_msg: sysMsg ? `${sysMsg}${JSON.stringify(responseData)}` : undefined,
        database_nm,
        schema_nm,
        stage_nm
      }
    };
  };
  