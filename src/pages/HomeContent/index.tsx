import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import ApiService from "../../services/index";
import MainContent from "../MainContent"; // Adjust path if needed
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BarChartIcon from '@mui/icons-material/BarChart';
import { Button } from '@mui/material';


const HomeContent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(prev => !prev);

  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [data, setData] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [anchorEls, setAnchorEls] = useState({
    account: null,
    chat: null,
    search: null,
    upload: null,
  });
  const open = Boolean(anchorEls.upload);

  const [fileLists, setFileLists] = useState({
    yaml: [] as string[],
    search: [] as string[],
  });

  const [selectedModels, setSelectedModels] = useState<{
    yaml: string[];
    search: string[];
  }>({ yaml: [], search: [] });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, type: keyof typeof anchorEls) => {
    setAnchorEls((prev) => ({ ...prev, [type]: event.currentTarget }));
  };
  const handleGraphClick = () => {
    setIsModalVisible(true);
  };

  const handleMenuClose = () => {
    setAnchorEls({ account: null, chat: null, search: null, upload: null });
  };

  const handleUploadFromComputer = () => {
    handleMenuClose();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleModelSelect = (file: string, type: keyof typeof selectedModels) => {
    setSelectedModels(prev => ({
      ...prev,
      [type]: prev[type].includes(file)
        ? prev[type].filter(f => f !== file)
        : [...prev[type], file],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post("http://10.126.192.122:8888/upload_csv/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(response?.data?.message || "File uploaded successfully!");
        setSelectedFile(null);
      } catch {
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
      return;
    }

    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, fromUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setSubmitted(true);

    const payload = {
      query: {
        aplctn_cd: "aedldocai",
        app_id: "docai",
        api_key: "78a799ea-a0f6-11ef-a0ce-15a449f7a8b0",
        model: "llama3.1-70b",
        semantic_model: selectedModels.yaml,
        search_service: selectedModels.search,
        search_limit: 0,
        prompt: { messages: [{ role: "user", content: inputValue }] },
        app_lvl_prefix: "",
        session_id: "ec2aebd4-0a7e-415f-a26b-5b663fc9356c",
        database_nm: "POC_SPC_SNOWPARK_DB",
        schema_nm: "HEDIS_SCHEMA",
        stage_nm: ""
      }
    };

    try {
      setIsLoading(true);
      const response = await fetch("http://10.126.192.122:8340/api/cortex/txt2sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let isDone = false;
      setMessages(prev => [...prev, { text: "", fromUser: false, streaming: true }]);

      while (!isDone) { // <-- fixed here
        const { value, done } = await reader.read();
        if (done) {
          isDone = true;
          break;
        }
        fullText += decoder.decode(value, { stream: true });

        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.streaming) {
            return [...prev.slice(0, -1), { ...last, text: fullText, streaming: true }];
          }
          return prev;
        });
      }

      setMessages(prev =>
        prev.map((msg, i) => (i === prev.length - 1 && msg.streaming ? { ...msg, streaming: false } : msg))
      );

    } catch (error) {
      console.error("handleSubmit error:", error);
      toast.error("Something went wrong.");
      setMessages(prev => [...prev, { text: "An error occurred.", fromUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };


  const executeSQL = async (sqlQuery: any) => {
    try {
      setIsLoading(true);
      const payload = {
        "query": {
          "aplctn_cd": "aedldocai",
          "app_id": "docai",
          "api_key": "78a799ea-a0f6-11ef-a0ce-15a449f7a8b0",
          "prompt": {
            "messages": [
              {
                "role": "user",
                "content": sqlQuery.prompt || sqlQuery.text
              }
            ]
          },
          "app_lvl_prefix": "",
          "session_id": "9df7d52d-da64-470c-8f4e-081be1dbbbfb",
          "exec_sql": sqlQuery.text
        }
      };

      const response = await ApiService.runExeSql(payload);
      const data = await response;
      setData(data);
      const convertToString = (input: any): string => {
        if (typeof input === 'string') {
          return input;
        } else if (Array.isArray(input)) {
          return input.map(convertToString).join(', ');
        } else if (typeof input === 'object' && input !== null) {
          return Object.entries(input)
            .map(([key, value]) => `${key}: ${convertToString(value)}`)
            .join(', ');
        }
        return String(input);
      };
      let modelReply: string | React.ReactNode = "";
      if (data && Array.isArray(data) && data.length > 0) {
        const columns = Object.keys(data[0]);
        const rows = data;
        modelReply = (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column} style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map(column => (
                      <td key={`${rowIndex}-${column}`} style={{ border: '1px solid black', padding: '8px' }}>
                        {convertToString(row[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {(rows.length > 1 && columns.length > 1) && (
              <Button
                variant="contained"
                startIcon={<BarChartIcon />}
                sx={{ marginTop: '15px', fontSize: '0.875rem', fontWeight: 'bold', color: '#fff', backgroundColor: '#000' }}
                onClick={handleGraphClick}
              >
                Graph View
              </Button>
            )}
          </div>
        );
      } else if (typeof data === 'string') {
        modelReply = data;
      } else {
        modelReply = convertToString(data);
      }
      const botMessage = {
        text: modelReply,
        fromUser: false,
        executedResponse: data,
        showExecute: false,
        showSummarize: true,
        prompt: sqlQuery.prompt,
      };

      setMessages((prevChatLog) => [...prevChatLog, botMessage]);
    } catch (err) {
      const fallbackErrorMessage = 'Error communicating with backend.';
      const errorMessageContent = {
        role: 'assistant',
        text: (
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{fallbackErrorMessage}</p>
          </div>
        ),
        fromUser: false,
        showExecute: false,
        showSummarize: false,
      };
      setMessages((prevChatLog) => [...prevChatLog, errorMessageContent]); // Update chat log with assistant's error message
      console.error('Error:', err); // Log the error for debugging
    } finally {
      setIsLoading(false);
      setMessages((prevChatLog) =>
        prevChatLog.map((msg) =>
          msg.text === sqlQuery.text
            ? { ...msg, showExecute: false }
            : msg
        )
      );
    }
  }

  const apiCortex = async (message: any) => {
    const sys_msg = "You are powerful AI assistant in providing accurate answers always. Be Concise in providing answers based on context.";

    const payload = {
      query: {
        aplctn_cd: "aedl",
        app_id: "aedl",
        api_key: "78a799ea-a0f6-11ef-a0ce-15a449f7a8b0",
        method: "cortex",
        model: "llama3.1-70b-elevance",
        sys_msg: `${sys_msg}${JSON.stringify(message.executedResponse)}`,
        limit_convs: "0",
        prompt: {
          messages: [
            {
              role: "user",
              content: message.prompt,
            }
          ]
        },
        app_lvl_prefix: "",
        user_id: "",
        session_id: "ad339c7f-feeb-49a3-a5b5-009152b47006"
      }
    };

    try {
      const response = await fetch("http://10.126.192.122:8340/api/cortex/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.body) throw new Error("No stream in response.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = '';
      let isDone = false;

      setMessages(prev => [
        ...prev,
        {
          text: '',
          fromUser: false,
          summarized: true,
          type: 'text',
          streaming: true
        }
      ]);

      while (!isDone) {
        const { value, done } = await reader.read();
        if (done) break;

        let chunk = decoder.decode(value, { stream: true });

        const eosIndex = chunk.indexOf("end_of_stream");
        if (eosIndex !== -1) {
          chunk = chunk.slice(0, eosIndex);
          isDone = true;
        }

        fullText += chunk;

        setMessages(prev => {
          const lastIndex = prev.length - 1;
          const last = prev[lastIndex];
          if (last?.streaming) {
            return [
              ...prev.slice(0, lastIndex),
              {
                ...last,
                text: fullText,
                streaming: true
              }
            ];
          }
          return prev;
        });
      }
      setMessages(prev => {
        const updatedMessages = prev.map((msg, index) => {
          if (msg === message) {
            return {
              ...msg,
              showSummarize: false
            };
          }

          if (index === prev.length - 1 && msg.streaming) {
            return {
              ...msg,
              streaming: false,
              summarized: true,
              showSummarize: false
            };
          }

          return msg;
        });

        return updatedMessages;
      });



    } catch (err) {
      console.error("Streaming error:", err);

      setMessages(prev => {
        if (prev.length && prev[prev.length - 1]?.streaming) {
          return prev.slice(0, -1); // Remove failed message
        }
        return prev;
      });

      const errorMessage = {
        text: "An error occurred while summarizing.",
        fromUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    }
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
  }, [messages]);

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
      handleUploadFromComputer={handleUploadFromComputer}
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
