import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import ApiService from "../../services/index";
import MainContent from "../MainContent";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BarChartIcon from '@mui/icons-material/BarChart';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useApiRequest } from "../../hooks/useApiRequest";
import { useStreamHandler } from "../../hooks/useStreamHandler";
import { buildPayload } from "../../utils/buildPayload";
import { renderTextWithCitations } from "../../utils/renderTextWithCitations";
import config from "../../utils/config.json";
import { MessageType } from '../../types/message.types';
import { v4 as uuidv4 } from 'uuid';

interface SelectedModelState {
  yaml: string[];
  search: string[];
}

interface AnchorElState {
  account: HTMLElement | null;
  chat: HTMLElement | null;
  search: HTMLElement | null;
  upload: HTMLElement | null;
}

const HomeContent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(prev => !prev);
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { sendRequest } = useApiRequest();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { handleStream } = useStreamHandler(setMessages);
  const [data, setData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storedPrompt, setStoredPrompt] = useState<string>("");
  const [sessionId] = useState(() => uuidv4());

  const [anchorEls, setAnchorEls] = useState<AnchorElState>({
    account: null,
    chat: null,
    search: null,
    upload: null,
  });
  const open = Boolean(anchorEls.upload);
  const [fileLists, setFileLists] = useState({ yaml: [] as string[], search: [] as string[] });
  const [selectedModels, setSelectedModels] = useState<SelectedModelState>({ yaml: [], search: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, type: keyof AnchorElState) => {
    const target = e.currentTarget as HTMLElement;
    if (type === "upload") {
      if (anchorEls.upload === target) {
        handleMenuClose();
      } else {
        setAnchorEls(prev => ({ ...prev, upload: target as HTMLElement }));
      }
    } else {
      setAnchorEls(prev => ({ ...prev, [type]: target }));
    }
  };
  const handleMenuClose = () => setAnchorEls({ account: null, chat: null, search: null, upload: null });
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) setSelectedFile(file); };
  const handleModelSelect = (file: string, type: keyof SelectedModelState) => {
    setSelectedModels(prev => ({
      ...prev,
      [type]: prev[type as keyof SelectedModelState].includes(file) ?
        prev[type as keyof SelectedModelState].filter(f => f !== file) :
        [...prev[type as keyof SelectedModelState], file]
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const handleSubmit = async () => {
    if (selectedFile) {
      await handleUpload('data');
      return;
    }
    if (!inputValue.trim()) return;
    setIsLoading(true);
    const userMessage = { text: inputValue, fromUser: true };
    const assistantPlaceholder = { text: "", fromUser: false, streaming: true };

    setMessages(prev => [...prev, userMessage, assistantPlaceholder]);
    setInputValue("");
    setSubmitted(true);

    const payload = buildPayload({
      prompt: inputValue,
      semanticModel: selectedModels.yaml,
      searchModel: selectedModels.search,
      model: "llama3.1-70b",
      sessionId,
      database_nm: "POC_SPC_SNOWPARK_DB",
      schema_nm: "HEDIS_SCHEMA"
    });

    const endpoint = config.ENDPOINTS.AGENT
      ? `${config.API_BASE_URL}${config.ENDPOINTS.AGENT}`
      : `${config.API_BASE_URL}${config.ENDPOINTS.TEXT_TO_SQL}`;

    const { stream, error } = await sendRequest(endpoint, payload, undefined, true);

    if (!stream || error) {
      toast.error("Something went wrong.");
      setMessages(prev => [...prev, { text: "An error occurred.", fromUser: false }]);
      setIsLoading(false);
      return;
    }

    await handleStream(stream, {
      fromUser: false,
      streaming: true,
      onComplete: async (response: any) => {
        if (response.prompt) {
          setStoredPrompt(response.prompt);
        }
        if (response.type === "text") {
          if (response.citations?.length) {
            const html = renderTextWithCitations(response.text, response.citations);
            setMessages(prev => {
              const temp = [...prev];
              temp[temp.length - 1] = {
                ...temp[temp.length - 1],
                text: html,
                streaming: false,
                isHTML: true,
                type: "text",
              };
              return temp;
            });
          } else {
            setMessages(prev => {
              const temp = [...prev];
              temp[temp.length - 1] = {
                ...temp[temp.length - 1],
                text: response.text,
                streaming: false,
                type: "text",
              };
              return temp;
            });
          }
        } else if (response.type === "sql") {
          const rawText = response.text;
          const [interpretationPart, sqlPart] = rawText.split('end_of_interpretation');
          const interpretation = (interpretationPart || '').trim();
          const sql = (sqlPart || '').trim();
          const sqlMessage: MessageType = {
            text: sql,
            fromUser: false,
            isCode: true,
            showExecute: true,
            sqlQuery: sql,
            type: "sql",
            interpretation,
            streaming: false,
          };
          console.log("sqlMessage", sqlMessage);

          setMessages(prev => {
            const temp = [...prev];
            const last = temp[temp.length - 1];

            if (last?.streaming && !last.fromUser) {
              temp[temp.length - 1] = sqlMessage;
            } else {
              temp.push(sqlMessage);
            }

            return temp;
          });
        }
        setIsLoading(false);
      }
    });
  };

  const handleUpload = async (
    type: 'yaml' | 'data',
    triggerFileDialog: boolean = false
  ): Promise<void> => {
    handleMenuClose();

    if (triggerFileDialog) {
      fileInputRef.current?.click();
      return;
    }

    if (type === 'data') {
      if (!selectedFile) {
        return;
      }

      setIsUploading(true);
      const formData = new FormData();

      const query = {
        aplctn_cd: "aedl",
        app_id: "aedl",
        api_key: "78a799ea-a0f6-11ef-a0ce-15a449f7a8b0",
        app_nm: "sample2",
        app_lvl_prefix: "",
        session_id: sessionId
      };

      formData.append("query", JSON.stringify(query));
      formData.append("files", selectedFile);

      try {
        const response = await axios.post(`${config.API_BASE_URL}${config.ENDPOINTS.UPLOAD_URL}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        });

        const successMessage = response?.data?.message || "File uploaded successfully!";
        toast.success(successMessage, { position: 'top-right' });
        setSelectedFile(null);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed. Please try again.", { position: 'top-right' });
      } finally {
        setIsUploading(false);
      }
    } else if (type === 'yaml') {
      window.open("https://app.snowflake.com/carelon/eda_preprod/#/studio/analyst", "_blank");
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    handleUpload('data');
  };


  const executeSQL = async (sqlQuery: any) => {
    console.log(sqlQuery);
    setIsLoading(true);
    const payload = buildPayload({
      prompt: storedPrompt,
      execSQL: sqlQuery.sqlQuery,
      sessionId,
      minimal: true,
    });
    const { data, error } = await sendRequest(`${config.API_BASE_URL}${config.ENDPOINTS.RUN_SQL_QUERY}`, payload);
    if (error || !data) {
      setMessages(prev => [...prev, { text: "Error communicating with backend.", fromUser: false, showExecute: false, showSummarize: false }]);
      console.error("Error:", error);
      setIsLoading(false);
      return;
    }

    const convertToString = (input: any): string => {
      if (input === null || input === undefined) return '';
      if (typeof input === 'string') return input;
      if (Array.isArray(input)) return input.map(convertToString).join(', ');
      if (typeof input === 'object') return Object.entries(input).map(([k, v]) => `${k}: ${convertToString(v)}`).join(', ');
      return String(input);
    };
    let modelReply: string | React.ReactNode = "";
    modelReply = typeof data === 'string' ? data : convertToString(data);
    setData(data);
    setMessages(prev => [...prev, {
      text: modelReply,
      fromUser: false,
      executedResponse: data,
      type: "table",
      showExecute: false,
      showSummarize: true,
      prompt: sqlQuery.prompt
    }]);
    setIsLoading(false);
  };

  const apiCortex = async (message: any) => {
    console.log(message);
    setIsLoading(true);
    setMessages(prev =>
      prev.map(msg => {
        const isSameResponse =
          JSON.stringify(msg.executedResponse) === JSON.stringify(message.executedResponse);

        if (msg.fromUser === false && msg.showSummarize && isSameResponse) {
          return { ...msg, showSummarize: false };
        }
        return msg;
      })
    );
    const payload = buildPayload({
      method: "cortex",
      model: "llama3.1-70b-elevance",
      prompt: storedPrompt,
      sysMsg: "You are powerful AI assistant in providing accurate answers always. Be Concise in providing answers based on context.",
      responseData: message.executedResponse,
      sessionId
    });

    const { stream, error } = await sendRequest(`${config.API_BASE_URL}${config.ENDPOINTS.CORTEX_COMPLETE}`, payload, undefined, true);

    if (!stream || error) {
      console.error("Streaming error:", error);
      setMessages(prev => [...prev, { text: "An error occurred while summarizing.", fromUser: false }]);
      setIsLoading(false);
      return;
    }

    let streamedText = '';

    await handleStream(stream, {
      fromUser: false,
      streaming: true,
      onToken: (token: string) => {
        const endIndex = token.indexOf("end_of_stream");
        if (endIndex !== -1) {
          token = token.substring(0, endIndex);
        }

        if (token) {
          streamedText += token;
          setMessages(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].streaming) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                text: streamedText,
              };
            } else {
              updated.push({
                text: token,
                fromUser: false,
                streaming: true,
                type: "text",
                showSummarize: false,
                prompt: message.prompt,
              });
            }
            return updated;
          });
        }
      },
      onComplete: () => {
        setMessages(prev =>
          prev.map(msg => {
            const isSameResponse =
              JSON.stringify(msg.executedResponse) === JSON.stringify(message.executedResponse);

            if (
              msg.fromUser === false &&
              msg.showSummarize &&
              isSameResponse
            ) {
              return {
                ...msg,
                streaming: false,
                summarized: true,
                showSummarize: false,
                showFeedback: true,
              };
            }
            return msg;
          })
        );
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yaml = await ApiService.getCortexAnalystDetails();
        const search = await ApiService.getCortexSearchDetails();
        setFileLists({ yaml: yaml || [], search: search || [] });
      } catch {
        setFileLists({ yaml: [], search: [] });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const anchor = document.getElementById("scroll-anchor");
    if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <MainContent
      collapsed={collapsed}
      toggleSidebar={toggleSidebar}
      inputValue={inputValue}
      messages={messages}
      anchorEls={anchorEls}
      fileLists={fileLists}
      selectedModels={selectedModels}
      handleMenuClick={handleMenuClick}
      handleMenuClose={handleMenuClose}
      handleModelSelect={handleModelSelect}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      fileInputRef={fileInputRef}
      selectedFile={selectedFile}
      isUploading={isUploading}
      handleFileChange={handleFileChange}
      handleUpload={handleUpload}
      data={data}
      setSelectedFile={setSelectedFile}
      executeSQL={executeSQL}
      apiCortex={apiCortex}
      submitted={submitted}
      setSubmitted={setSubmitted}
      open={open}
    />
  );
};

export default HomeContent;
