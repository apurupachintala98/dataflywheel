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
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const handleGraphClick = () => setIsModalVisible(true);
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
  const handleModalClose = () => setIsModalVisible(false);

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
      sessionId: "session-id",
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
        toast.warn("Please select a file before uploading.", { position: 'top-right' });
        return;
      }
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      try {
        const response = await axios.post(config.ENDPOINTS.UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
      toast.info("YAML upload is not yet implemented.", { position: 'top-right' });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    handleUpload('data');
  };
  

  const executeSQL = async (sqlQuery: any) => {
    setIsLoading(true);
    const payload = buildPayload({
      prompt: sqlQuery.prompt || sqlQuery.text,
      execSQL: sqlQuery.sqlQuery,
      sessionId: "9df7d52d-da64-470c-8f4e-081be1dbbbfb",
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
    setMessages(prev => [...prev, { text: modelReply, fromUser: false, executedResponse: data, type: "table", showExecute: false, showSummarize: true, prompt: sqlQuery.prompt }]);
    setIsLoading(false);
  };

  // const apiCortex = async (message: any) => {
  //   setIsLoading(true);
  //   let streamedText = '';
  //   const payload = buildPayload({
  //     method: "cortex",
  //     model: "llama3.1-70b-elevance",
  //     prompt: message.prompt,
  //     sysMsg: "You are powerful AI assistant in providing accurate answers always. Be Concise in providing answers based on context.",
  //     responseData: message.executedResponse,
  //     sessionId: "ad339c7f-feeb-49a3-a5b5-009152b47006"
  //   });

  //   const { stream, error } = await sendRequest(`${config.API_BASE_URL}${config.ENDPOINTS.CORTEX_COMPLETE}`, payload, undefined, true);

  //   if (!stream || error) {
  //     console.error("Streaming error:", error);
  //     setMessages(prev => [...prev, { text: "An error occurred while summarizing.", fromUser: false }]);
  //     setIsLoading(false);
  //     return;
  //   }
  //   // await handleStream(stream, { fromUser: false, streaming: true });
  //   // setMessages(prev => prev.map((msg, index) => {
  //   //   if (msg === message) return { ...msg, showSummarize: false };
  //   //   if (index === prev.length - 1 && msg.streaming) {
  //   //     return {
  //   //       ...msg,
  //   //       streaming: false,
  //   //       summarized: true,
  //   //       showSummarize: false,
  //   //       showFeedback: true,
  //   //     };
  //   //   }
  //   //   return msg;
  //   // }));
  //   await handleStream(stream, {
  //     fromUser: false,
  //     streaming: true,
  //     onToken: (token: string) => {
  //       streamedText += token;
  //       setMessages(prev => {
  //         const updated = [...prev];
  //         const lastIndex = updated.findIndex(msg => msg === message);
  //         if (lastIndex !== -1) {
  //           updated[lastIndex] = {
  //             ...updated[lastIndex],
  //             streaming: true,
  //             text: streamedText,
  //             isHTML: false,
  //           };
  //         }
  //         return updated;
  //       });
  //     },
  //     onComplete: () => {
  //       setMessages(prev => {
  //         const updated = [...prev];
  //         const lastIndex = updated.findIndex(msg => msg === message);
  //         if (lastIndex !== -1) {
  //           updated[lastIndex] = {
  //             ...updated[lastIndex],
  //             streaming: false,
  //             summarized: true,
  //             showSummarize: false,
  //             showFeedback: true,
  //             text: streamedText,
  //             isHTML: false,
  //           };
  //         }
  //         return updated;
  //       });
  //       setIsLoading(false);
  //     }
  //   });
  // };

  const apiCortex = async (message: any) => {
    setIsLoading(true);
    let streamedText = '';
  
    const payload = buildPayload({
      method: "cortex",
      model: "llama3.1-70b-elevance",
      prompt: message.prompt,
      sysMsg: "You are powerful AI assistant in providing accurate answers always. Be Concise in providing answers based on context.",
      responseData: message.executedResponse,
      sessionId: "ad339c7f-feeb-49a3-a5b5-009152b47006"
    });
  
    const { stream, error } = await sendRequest(`${config.API_BASE_URL}${config.ENDPOINTS.CORTEX_COMPLETE}`, payload, undefined, true);
  
    if (!stream || error) {
      console.error("Streaming error:", error);
      setMessages(prev => [...prev, { text: "An error occurred while summarizing.", fromUser: false }]);
      setIsLoading(false);
      return;
    }
  
    await handleStream(stream, {
      fromUser: false,
      streaming: true,
      onToken: (token: string) => {
        streamedText += token;
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.findIndex(msg =>
            msg.prompt === message.prompt && msg.fromUser === false
          );
          if (lastIndex !== -1) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              streaming: true,
              text: streamedText,
              isHTML: false,
            };
          }
          return updated;
        });
      },
      onComplete: () => {
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.findIndex(msg =>
            msg.prompt === message.prompt && msg.fromUser === false
          );
          if (lastIndex !== -1) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              streaming: false,
              summarized: true,
              showSummarize: false,
              showFeedback: true,
              text: streamedText,
              isHTML: false,
            };
          }
          return updated;
        });
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
      isModalVisible={isModalVisible}
      handleModalClose={handleModalClose}
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
