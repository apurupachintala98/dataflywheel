export interface MessageType {
  text: string | React.ReactNode;
  fromUser: boolean;
  streaming?: boolean;
  isHTML?: boolean;
  isCode?: boolean;
  sqlQuery?: string;
  showExecute?: boolean;
  showSummarize?: boolean;
  executedResponse?: any;
  summarized?: boolean;
  prompt?: string;
  interpretation?: string;
  type?: 'text' | 'sql';
}
