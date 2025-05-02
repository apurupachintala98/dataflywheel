import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import ApiService from "../../services/index";
import MainContent from "../MainContent";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BarChartIcon from '@mui/icons-material/BarChart';
import { Button } from '@mui/material';
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
  const handleUpload = (type: 'yaml' | 'data') => { };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) setSelectedFile(file); };
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
      await uploadFile();
      return;
    }
    if (!inputValue.trim()) return;
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
          setMessages(prev => [
            ...prev,
            { text: response.interpretation, fromUser: false },
            {
              text: response.sql,
              fromUser: false,
              isCode: true,
              showExecute: true,
              sqlQuery: response.sql,
              type: "sql",
              interpretation: response.interpretation,
            },
          ]);
        } 
      }      
    });
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post(config.ENDPOINTS.UPLOAD_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(response?.data?.message || "File uploaded successfully!");
      setSelectedFile(null);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const executeSQL = async (sqlQuery: any) => {
    const payload = buildPayload({
      prompt: sqlQuery.prompt || sqlQuery.text,
      execSQL: sqlQuery.text,
      sessionId: "9df7d52d-da64-470c-8f4e-081be1dbbbfb"
    });

    const { data, error } = await sendRequest("http://10.126.192.122:8341/api/cortex/execute", payload);

    if (error || !data) {
      setMessages(prev => [...prev, { text: "Error communicating with backend.", fromUser: false, showExecute: false, showSummarize: false }]);
      console.error("Error:", error);
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

    if (Array.isArray(data) && data.length > 0) {
      const columns = Object.keys(data[0]);
      modelReply = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead><tr>{columns.map(col => <th key={col}>{col}</th>)}</tr></thead>
            <tbody>{data.map((row: any, i: number) => <tr key={i}>{columns.map(col => <td key={`${i}-${col}`}>{convertToString(row[col])}</td>)}</tr>)}</tbody>
          </table>
          {data.length > 1 && columns.length > 1 && (
            <Button variant="contained" startIcon={<BarChartIcon />} onClick={handleGraphClick}>Graph View</Button>
          )}
        </div>
      );
    } else {
      modelReply = typeof data === 'string' ? data : convertToString(data);
    }
    setData(data);
    setMessages(prev => [...prev, { text: modelReply, fromUser: false, executedResponse: data, showExecute: false, showSummarize: true, prompt: sqlQuery.prompt }]);
  };

  const apiCortex = async (message: any) => {
    const payload = buildPayload({
      method: "cortex",
      model: "llama3.1-70b-elevance",
      prompt: message.prompt,
      sysMsg: "You are powerful AI assistant in providing accurate answers always. Be Concise in providing answers based on context.",
      responseData: message.executedResponse,
      sessionId: "ad339c7f-feeb-49a3-a5b5-009152b47006"
    });

    const { stream, error } = await sendRequest("http://10.126.192.122:8341/api/cortex/complete", payload, undefined, true);

    if (!stream || error) {
      console.error("Streaming error:", error);
      setMessages(prev => [...prev, { text: "An error occurred while summarizing.", fromUser: false }]);
      return;
    }
    await handleStream(stream, { fromUser: false, streaming: true });

    setMessages(prev => prev.map((msg, index) => {
      if (msg === message) return { ...msg, showSummarize: false };
      if (index === prev.length - 1 && msg.streaming) return { ...msg, streaming: false, summarized: true, showSummarize: false };
      return msg;
    }));
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
