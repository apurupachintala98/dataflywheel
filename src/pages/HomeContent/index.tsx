import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import ApiService from "../../services/index";
import MainContent from "../MainContent"; // Adjust path if needed
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
        session_id: "ec2aebd4-0a7e-415f-a26b-5b663fc9356c"
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
    console.log("Executing SQL query:", sqlQuery);
    // Future: add your actual SQL execution logic here.
  };

  const apiCortex = async (message: any) => {
    console.log("Summarizing with Cortex:", message);
    // Future: add your Cortex summarization logic here.
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
