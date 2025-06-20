import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import ApiService from "../../services/index";
import MainContent from "../MainContent";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useApiRequest } from "../../hooks/useApiRequest";
import { useStreamHandler } from "../../hooks/useStreamHandler";
import { buildPayload } from "../../utils/buildPayload";
import { renderTextWithCitations } from "../../utils/renderTextWithCitations";
import config from "../../utils/config.json";
import { MessageType } from "../../types/message.types";
import { v4 as uuidv4 } from "uuid";
import { useSelectedApp } from "../../components/SelectedAppContext";
import { HomeContentProps } from "interface";

interface SelectedModelState {
  yaml: string[];
  search: string[];
}

interface AnchorElState {
  account: HTMLElement | null;
  chat: HTMLElement | null;
  search: HTMLElement | null;
  upload: HTMLElement | null;
  schema: HTMLElement | null;
}

const HomeContent = ({ isReset, promptValue, recentValue, isLogOut, setCheckIsLogin }: HomeContentProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);
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
  const { selectedAppId, setSelectedAppId } = useSelectedApp();
  const [dbDetails, setDbDetails] = useState({ database_nm: "", schema_nm: "" });
  const [user_nm, setUserNm] = useState("");
  const [user_pwd, setUserPwd] = useState("");
  const { APP_CONFIG } = config;
  const { APP_ID, API_KEY, DEFAULT_MODEL, APP_NM, DATABASE_NAME, SCHEMA_NAME } = APP_CONFIG;

  const [anchorEls, setAnchorEls] = useState<AnchorElState>({
    account: null,
    chat: null,
    search: null,
    upload: null,
    schema: null,
  });
  const open = Boolean(anchorEls.upload);
  const [fileLists, setFileLists] = useState<{ yaml: string[]; search: string[] }>({
    yaml: [],
    search: [],
  });
  const [selectedModels, setSelectedModels] = useState<SelectedModelState>({
    yaml: [],
    search: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, type: keyof AnchorElState) => {
    const target = e.currentTarget as HTMLElement;
    if (type === "upload") {
      if (anchorEls.upload === target) {
        handleMenuClose();
      } else {
        setAnchorEls((prev) => ({ ...prev, upload: target as HTMLElement }));
      }
    } else {
      setAnchorEls((prev) => ({ ...prev, [type]: target }));
    }
  };
  const handleMenuClose = () =>
    setAnchorEls({ account: null, chat: null, search: null, upload: null, schema: null });
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) setSelectedFile(file); };
  const handleModelSelect = (file: string, type: keyof SelectedModelState) => {
    setSelectedModels((prev) => ({
      ...prev,
      [type]: prev[type as keyof SelectedModelState].includes(file)
        ? prev[type as keyof SelectedModelState].filter((f) => f !== file)
        : [...prev[type as keyof SelectedModelState], file],
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleSubmit = async () => {
    if (selectedFile) {
      await handleUpload("data");
      return;
    }
    if (!inputValue.trim()) return;
    setIsLoading(true);
    const userMessage = { text: inputValue, fromUser: true };
    const assistantPlaceholder = { text: "", fromUser: false, streaming: true };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setInputValue("");
    setSubmitted(true);

    const payload = buildPayload({
      prompt: inputValue,
      semanticModel: selectedModels.yaml,
      searchModel: selectedModels.search,
      model: DEFAULT_MODEL,
      sessionId,
      selectedAppId,
      database_nm: dbDetails.database_nm,
      schema_nm: dbDetails.schema_nm,
    });

    const endpoint = config.ENDPOINTS.AGENT
      ? `${config.API_BASE_URL}${config.ENDPOINTS.AGENT}`
      : `${config.API_BASE_URL}${config.ENDPOINTS.TEXT_TO_SQL}`;

    const { stream, error } = await sendRequest(endpoint, payload, undefined, true);

    if (!stream || error) {
     //toast.error("Something went wrong.");
      setMessages((prev) => [...prev, { text: "Something went wrong. Please try again later.", fromUser: false }]);
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
            setMessages((prev) => {
              const temp = [...prev];
              temp[temp.length - 1] = {
                ...temp[temp.length - 1],
                text: html,
                streaming: false,
                isHTML: true,
                type: "text",
                fdbck_id: response.fdbck_id,
                session_id: response.session_id,
              };
              return temp;
            });
          } else {
            setMessages((prev) => {
              const temp = [...prev];
              temp[temp.length - 1] = {
                ...temp[temp.length - 1],
                text: response.text,
                streaming: false,
                type: "text",
                fdbck_id: response.fdbck_id,
                session_id: response.session_id,
              };
              return temp;
            });
          }
        } else if (response.type === "sql") {
          const rawText = response.text;
          const [interpretationPart, sqlPart] = rawText.split("end_of_interpretation");
          // const interpretation = (interpretationPart || '').trim();
          const interpretationRaw = (interpretationPart || "").trim();
          const INTERPRETATION_PREFIX = "This is our interpretation of your question:";
          let interpretation = interpretationRaw;

          if (interpretationRaw.startsWith(INTERPRETATION_PREFIX)) {
            const remaining = interpretationRaw.slice(INTERPRETATION_PREFIX.length).trim();
            interpretation = `<strong>${INTERPRETATION_PREFIX}</strong><br/>${remaining}`;
          }

          const sql = (sqlPart || "").trim();
          const sqlMessage: MessageType = {
            text: sql,
            fromUser: false,
            isCode: true,
            showExecute: true,
            sqlQuery: sql,
            type: "sql",
            interpretation,
            isHTML: true,
            streaming: false,
            fdbck_id: response.fdbck_id,
            session_id: response.session_id,
          };
          console.log("sqlMessage", sqlMessage);

          setMessages((prev) => {
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
      },
    });
  };

  const handleUpload = async (
    type: "yaml" | "data",
    triggerFileDialog: boolean = false,
  ): Promise<void> => {
    handleMenuClose();

    if (triggerFileDialog) {
      fileInputRef.current?.click();
      return;
    }

    if (type === "data") {
      if (!selectedFile) {
        return;
      }

      setIsUploading(true);
      const formData = new FormData();

      const query = {
        aplctn_cd: selectedAppId.toLowerCase(),
        app_id: APP_ID,
        api_key: API_KEY,
        app_nm: APP_NM,
        app_lvl_prefix: "",
        session_id: sessionId,
      };

      formData.append("query", JSON.stringify(query));
      formData.append("files", selectedFile);

      try {
        const response = await axios.post(
          `${config.API_BASE_URL}${config.ENDPOINTS.UPLOAD_URL}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const successMessage = response?.data?.message || "File uploaded successfully!";
        toast.success(successMessage, { position: "top-right" });
        setSelectedFile(null);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed. Please try again.", { position: "top-right" });
      } finally {
        setIsUploading(false);
      }
    } else if (type === "yaml") {
      window.open(
        "https://app.snowflake.com/carelon/eda_preprod/#/data/databases/POC_SPC_SNOWPARK_DB/schemas/HEDIS_SCHEMA/stage/HEDIS_STAGE_FULL",
        "_blank",
      );
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    handleUpload("data");
  };

  const executeSQL = async (sqlQuery: any) => {
    console.log(sqlQuery);
    setIsLoading(true);

    const payload = buildPayload({
      prompt: storedPrompt,
      execSQL: sqlQuery.sqlQuery,
      sessionId,
      minimal: true,
      selectedAppId,
      user_nm,
      user_pwd,
      database_nm: dbDetails.database_nm,
      schema_nm: dbDetails.schema_nm,

    });
    const { data, error } = await sendRequest(
      `${config.API_BASE_URL}${config.ENDPOINTS.RUN_SQL_QUERY}`,
      payload,
    );
    if (error || !data) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Error communicating with backend.",
          fromUser: false,
          showExecute: false,
          showSummarize: false,
        },
      ]);
      console.error("Error:", error);
      setIsLoading(false);
      return;
    }

    const convertToString = (input: any): string => {
      if (input === null || input === undefined) return "";
      if (typeof input === "string") return input;
      if (Array.isArray(input)) return input.map(convertToString).join(", ");
      if (typeof input === "object")
        return Object.entries(input)
          .map(([k, v]) => `${k}: ${convertToString(v)}`)
          .join(", ");
      return String(input);
    };
    let modelReply: string | React.ReactNode = "";
    modelReply = typeof data === "string" ? data : convertToString(data);
    setData(data);
    console.log(data);
    setMessages((prev) => [
      ...prev,
      {
        text: modelReply,
        fromUser: false,
        executedResponse: data,
        type: "table",
        showExecute: false,
        showSummarize: true,
        prompt: sqlQuery.prompt,
      },
    ]);
    setIsLoading(false);
  };

  const apiCortex = async (message: any) => {
    console.log(message);
    setIsLoading(true);
    setMessages((prev) =>
      prev.map((msg) => {
        const isSameResponse =
          JSON.stringify(msg.executedResponse) === JSON.stringify(message.executedResponse);

        if (msg.fromUser === false && msg.showSummarize && isSameResponse) {
          return { ...msg, showSummarize: false };
        }
        return msg;
      }),
    );

    const payload = buildPayload({
      method: "cortex",
      model: "llama3.1-70b-elevance",
      prompt: storedPrompt,
      sysMsg:
        "You are powerful AI assistant in providing accurate answers always. Be Concise in providing answers based on context.",
      responseData: message.executedResponse,
      sessionId,
      selectedAppId,
    });

    const { stream, error } = await sendRequest(
      `${config.API_BASE_URL}${config.ENDPOINTS.CORTEX_COMPLETE}`,
      payload,
      undefined,
      true,
    );

    if (!stream || error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "An error occurred while summarizing.", fromUser: false },
      ]);
      setIsLoading(false);
      return;
    }

    let streamedText = "";

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
          setMessages((prev) => {
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
                fdbck_id: message.fdbck_id,
                session_id: message.session_id,
              });
            }
            return updated;
          });
        }
      },
      onComplete: (response: any) => {
        setMessages((prev) =>
          prev.map((msg) => {
            const isSameResponse =
              JSON.stringify(msg.executedResponse) === JSON.stringify(message.executedResponse);

            if (msg.fromUser === false && msg.showSummarize && isSameResponse) {
              return {
                ...msg,
                streaming: false,
                summarized: true,
                showSummarize: false,
                showFeedback: true,
                fdbck_id: response.fdbck_id,
                session_id: response.session_id,
              };
            }
            return msg;
          }),
        );
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yaml = await ApiService.getCortexAnalystDetails({
          aplctn_cd: selectedAppId.toLowerCase(),
          database_nm: dbDetails.database_nm,
          schema_nm: dbDetails.schema_nm,
        });

        const search = await ApiService.getCortexSearchDetails({
          aplctn_cd: selectedAppId.toLowerCase(),
          database_nm: dbDetails.database_nm,
          schema_nm: dbDetails.schema_nm,
        });

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

  const handleReset = () => {
    setInputValue("");
    setMessages([]);
    setSubmitted(false);
    setData(null);
    setSelectedFile(null);
    setIsUploading(false);
    setIsLoading(false);
    setStoredPrompt("");
    setDbDetails({ database_nm: "", schema_nm: "" });
  };

  useEffect(() => {
    handleReset();
  }, [isReset]);

  useEffect(() => {
    const InputVal = promptValue ? promptValue : "";
    setInputValue(InputVal);
  }, [promptValue]);

  useEffect(() => {
    if (recentValue) {
      /** Recent code flow will come here */
    }
  }, [recentValue]);

  return (
    <MainContent
      collapsed={collapsed}
      toggleSidebar={toggleSidebar}
      inputValue={inputValue}
      messages={messages}
      anchorEls={anchorEls}
      fileLists={fileLists}
      setFileLists={setFileLists}
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
      dbDetails={dbDetails}
      setDbDetails={setDbDetails}
      user_nm={user_nm}
      user_pwd={user_pwd}
      setUserNm={setUserNm}
      setUserPwd={setUserPwd}
      setCheckIsLogin={setCheckIsLogin}
      isLogOut={isLogOut}
    />
  );
};

export default HomeContent;
