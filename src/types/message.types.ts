export interface MessageType {
    text: string | React.ReactNode;
    fromUser: boolean;
    isHTML?: boolean;
    isCode?: boolean;
    sqlQuery?: string;
    executedResponse?: any;
    showExecute?: boolean;
    showSummarize?: boolean;
    streaming?: boolean;
    summarized?: boolean;
    prompt?: string;
  }