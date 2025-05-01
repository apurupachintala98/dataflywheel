import { ReactNode } from 'react';

export type MessageType = {
  text: string | ReactNode;
  fromUser: boolean;
  streaming?: boolean;
  isHTML?: boolean;
  isCode?: boolean;
  showExecute?: boolean;
  showSummarize?: boolean;
  executedResponse?: any;
  sqlQuery?: string;
  type?: "text" | "sql";
  interpretation?: string;
  sql?: string;
  prompt?: any;
};
