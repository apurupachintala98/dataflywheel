import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  tooltipClasses,
  styled,
  TooltipProps,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { FaArrowUp, FaUserCircle, FaAngleDown } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { HashLoader } from "react-spinners";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import MessageWithFeedback from "../pages/Feedback";
import { MessageType } from "../types/message.types";
import Chart from "../components/Chart";
import axios from "axios";
import { config } from "../hooks/config";
import { v4 as uuidv4 } from "uuid";
import { useSelectedApp } from "../components/SelectedAppContext";
import ApiService from "../services/index";
import { CssTextField, Loader } from "./styled.components";
import loading from "assests/images/loadingBlack.png";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface MainContentProps {
  messages: MessageType[];
  collapsed: boolean;
  toggleSidebar: () => void;
  inputValue: string;
  anchorEls: {
    account: HTMLElement | null;
    chat: HTMLElement | null;
    search: HTMLElement | null;
    upload: HTMLElement | null;
    schema: HTMLElement | null;
    environment: HTMLElement | null;
  };
  vegaChartData: any;
  setVegaChartData: React.Dispatch<React.SetStateAction<any>>;
  fileLists: { yaml: string[]; search: string[] };
  setFileLists: React.Dispatch<React.SetStateAction<{ yaml: string[]; search: string[] }>>;
  selectedModels: { yaml: string[]; search: string[] };
  handleMenuClick: (
    e: React.MouseEvent<HTMLElement>,
    type: keyof MainContentProps["anchorEls"],
  ) => void;
  handleMenuClose: () => void;
  user_nm: string;
  user_pwd: string;
  setUserNm: (value: string) => void;
  setUserPwd: (value: string) => void;
  handleModelSelect: (file: string, type: "yaml" | "search") => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  isUploading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: (type: "yaml" | "data", triggerFileDialog?: boolean) => void;
  data: any;
  setSelectedFile: (file: File | null) => void;
  executeSQL: (sqlQuery: any) => Promise<void>;
  apiCortex: (message: any) => Promise<void>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  dbDetails: {
    database_nm: string;
    schema_nm: string;
  };
  setDbDetails: React.Dispatch<
    React.SetStateAction<{
      database_nm: string;
      schema_nm: string;
    }>
  >;
  checkIsLogin: boolean;
  setCheckIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  isLogOut: boolean;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f9f9f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const MainContent = ({
  inputValue,
  messages,
  anchorEls,
  fileLists,
  setFileLists,
  selectedModels,
  handleMenuClick,
  handleMenuClose,
  handleModelSelect,
  handleInputChange,
  handleSubmit,
  isLoading,
  fileInputRef,
  selectedFile,
  isUploading,
  handleFileChange,
  submitted,
  handleUpload,
  setSelectedFile,
  executeSQL,
  apiCortex,
  open,
  data,
  user_nm,
  user_pwd,
  setUserNm,
  setUserPwd,
  checkIsLogin,
  setCheckIsLogin,
  isLogOut,
  vegaChartData,
  setVegaChartData,
}: MainContentProps) => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [error, setError] = useState("");
  const [chartOpen, setChartOpen] = useState(false);
  const [validating, setValidating] = useState(false);
  const [credentials, setCredentials] = useState({
    anthemId: "",
    password: "",
  });
  const [appIds, setAppIds] = useState<string[]>([]);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [loginInfo, setLoginInfo] = useState<string | null>(null);
  const [sessionId] = useState(() => uuidv4());
  // const [dbDetails, setDbDetails] = useState({ database_nm: "", schema_nm: "" });
  const { selectedAppId, setSelectedAppId, dbDetails, setDbDetails } = useSelectedApp();
  const [availableSchemas, setAvailableSchemas] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<"DEV" | "PREPROD" | undefined>(undefined);
  const [appLvlPrefix, setAppLvlPrefix] = useState<string>("");
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const { APP_CONFIG, API_BASE_URL, ENDPOINTS } = config({
    environment,
    appLvlPrefix,
    selectedAppId,
  });
  const { APP_ID, API_KEY, DEFAULT_MODEL, APP_NM, DATABASE_NAME, SCHEMA_NAME, APP_LVL_PREFIX } =
    APP_CONFIG;
  const aplctnCdValue = selectedAppId.toLowerCase();

  useEffect(() => {
    const anchor = document.getElementById("scroll-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleGraphClick = () => {
    setChartOpen(true);
  };

  const handleValidateLogin = async () => {
    setValidating(true);
    setError("");

    try {
      const response = await fetch(
        "https://9gw2c50g75-vpce-076e779fef63877dd.execute-api.us-east-2.amazonaws.com/dev/validateldapcredentials",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: credentials.anthemId,
            usrval: credentials.password,
            env: "dev",
            app_id: "dataframework",
          }),
        },
      );

      const result = await response.json();
      console.log("result", result);
      if (response.ok && result?.app_cd?.length) {
        setAppIds(result.app_cd);
        setUserNm(credentials.anthemId);
        setUserPwd(credentials.password);
      } else {
        setError("Validation failed or no apps found.");
      }
    } catch {
      setError("Network or server error.");
    } finally {
      setValidating(false);
    }
  };

  // const handleFinalLogin = async () => {
  //   const payload = {
  //     query: {
  //       aplctn_cd: aplctnCdValue,
  //       app_id: APP_ID,
  //       api_key: API_KEY,
  //       app_lvl_prefix: APP_LVL_PREFIX,
  //       session_id: sessionId,
  //     },
  //   };

  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}${ENDPOINTS.DB_SCHEMA_LIST}`,
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );

  //     console.log("API Response:", response.data);

  //     if (response.status === 200) {
  //       const { database, schema_nm } = response.data;

  //       const selectedDatabase = database?.[0] || "";
  //       setAvailableSchemas(schema_nm || []);
  //       setDbDetails({ database_nm: selectedDatabase, schema_nm: "" });
  //       console.log(setDbDetails);
  //       console.log(selectedDatabase);
  //       setOpenLoginDialog(false);
  //       setLoginInfo(`${credentials.anthemId} (${selectedAppId})`);
  //       setCheckIsLogin(true);
  //     } else {
  //       setError(response.data?.message || "Login failed.");
  //     }
  //   } catch (error: any) {
  //     console.error("Final login API error:", error);
  //     setError("Final login API error.");
  //   }
  // };

  const handleFinalLogin = async () => {
    if (!environment || !appLvlPrefix || checkIsLogin) return;

    try {
      const payload = {
        query: {
          aplctn_cd: aplctnCdValue,
          app_id: APP_ID,
          api_key: API_KEY,
          app_lvl_prefix: appLvlPrefix,
          session_id: sessionId,
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.DB_SCHEMA_LIST}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const { database, schema_nm } = response.data;
        const selectedDatabase = database?.[0] || "";

        setAvailableSchemas(schema_nm || []);
        setDbDetails({ database_nm: selectedDatabase, schema_nm: "" });
        setCheckIsLogin(true);
      } else {
        setError(response.data?.message || "Login failed.");
      }
    } catch (error: any) {
      console.error("Final login API error:", error);
      setError("Final login API error.");
    }
  };

  useEffect(() => {
    if (loginInfo && environment && appLvlPrefix) {
      handleFinalLogin();
    }
  }, [loginInfo, environment, appLvlPrefix]);

  useEffect(() => {
    if (isLogOut) {
      setLoginInfo(null);
      setCheckIsLogin(false);
      setCredentials({ anthemId: "", password: "" });
      setAppIds([]);
      setSelectedAppId("");
      setShowLoginButton(false);
    }
  }, [isLogOut]);


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <Box sx={{ flexShrink: 0, px: 3, py: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {loginInfo && (
                <>
                  <Box
                    onClick={(e) => handleMenuClick(e, "environment")}
                    sx={{
                      color: "#000",
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    {environment || "Select Environment"} <FaAngleDown />
                  </Box>

                  <Menu
                    anchorEl={anchorEls["environment"]}
                    open={Boolean(anchorEls["environment"])}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    {(["DEV", "PREPROD"] as const).map((env) => (
                      <MenuItem
                        key={env}
                        onClick={() => {
                          setEnvironment(env);
                          handleMenuClose();
                        }}
                      >
                        {env}
                      </MenuItem>
                    ))}

                  </Menu>


                  {/* App_Lvl_Prefix Input */}
                  <CssTextField
                    label="App_Lvl_Prefix"
                    value={appLvlPrefix}
                    size="small"
                    onChange={(e) => setAppLvlPrefix(e.target.value)}
                    sx={{ minWidth: 180 }}
                  />

                  <Box
                    onClick={(e) => handleMenuClick(e, "schema")}
                    sx={{
                      color: "#000",
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    {selectedSchema || "Select Schema"} <FaAngleDown />
                  </Box>
                </>
              )}
              {availableSchemas.length > 0 && (
                <Box sx={{ display: "inline-block" }}>
                  <Box
                    onClick={(e) => handleMenuClick(e, "schema")}
                    sx={{
                      color: "#000",
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    {selectedSchema || "Select Schema"} <FaAngleDown />
                  </Box>
                  <Menu
                    anchorEl={anchorEls["schema"]}
                    open={Boolean(anchorEls["schema"])}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    {availableSchemas.map((schema) => (
                      <MenuItem
                        key={schema}
                        onClick={async () => {
                          setSelectedSchema(schema);
                          setDbDetails({ database_nm: dbDetails.database_nm, schema_nm: schema });
                          const yamlFiles = await ApiService.getCortexAnalystDetails({
                            database_nm: dbDetails.database_nm,
                            schema_nm: schema,
                            aplctn_cd: aplctnCdValue,
                            session_id: sessionId,
                          });

                          const searchFiles = await ApiService.getCortexSearchDetails({
                            database_nm: dbDetails.database_nm,
                            schema_nm: schema,
                            aplctn_cd: aplctnCdValue,
                            session_id: sessionId,
                          });

                          setFileLists({ yaml: yamlFiles || [], search: searchFiles || [] });
                          handleMenuClose();
                        }}
                      >
                        {schema}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}

              {selectedSchema && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  {(["chat", "search"] as const).map((type) => (
                    <Box key={type} sx={{ display: "inline-block" }}>
                      <Box
                        onClick={(e) => handleMenuClick(e, type)}
                        sx={{
                          color: "#000",
                          px: 2,
                          py: 1,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "space-between",
                        }}
                      >
                        {type === "chat" ? "Semantic Model" : "Search"} <FaAngleDown />
                      </Box>
                      <Menu
                        anchorEl={anchorEls[type]}
                        open={Boolean(anchorEls[type])}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                      >
                        {fileLists[type === "chat" ? "yaml" : "search"].length ? (
                          fileLists[type === "chat" ? "yaml" : "search"].map((file) => (
                            <MenuItem
                              key={file}
                              onClick={() =>
                                handleModelSelect(file, type === "chat" ? "yaml" : "search")
                              }
                            >
                              {file}{" "}
                              {selectedModels[type === "chat" ? "yaml" : "search"].includes(file) &&
                                "✓"}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No Files</MenuItem>
                        )}
                      </Menu>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* RIGHT: Login Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: 15, color: "#5d5d5d" }}>
                {loginInfo ? (
                  `Logged in as ${loginInfo}`
                ) : (
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">
                          You are in read-only mode. <br />
                          <b>Login</b> to know more details.
                        </Typography>
                      </React.Fragment>
                    }
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 25, cursor: "pointer", margin: "10px" }} />
                  </HtmlTooltip>
                )}
              </Typography>
              {loginInfo ? (
                ""
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    px: 2.5,
                    py: 1,
                    backgroundColor: "#373535",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 14,
                    borderRadius: "30px",
                    "&:hover": {
                      backgroundColor: "#131313",
                    },
                  }}
                  onClick={() => setOpenLoginDialog(true)}
                >
                  Login
                </Button>
              )}
            </Box>
            <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
              <DialogTitle>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "baseline",
                    gap: 1,
                    padding: "0px",
                  }}
                >
                  {/* <LockIcon
                    sx={{ fontSize: 20, color: "#000", position: "relative", top: "2px" }}
                  /> */}
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
                    Login
                  </Typography>
                </Box>
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ px: 3, pb: 3 }}>
                <CssTextField
                  label="AnthemID *"
                  fullWidth
                  margin="normal"
                  value={credentials.anthemId}
                  onChange={(e) => setCredentials({ ...credentials, anthemId: e.target.value })}
                />
                <CssTextField
                  label="Password *"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />

                {appIds.length > 0 && (
                  <CssTextField
                    select
                    label="Select App ID"
                    fullWidth
                    margin="normal"
                    value={selectedAppId}
                    onChange={(e) => {
                      setSelectedAppId(e.target.value);
                      setShowLoginButton(true);
                    }}
                  >
                    {appIds.map((id) => (
                      <MenuItem key={id} value={id}>
                        {id}
                      </MenuItem>
                    ))}
                  </CssTextField>
                )}

                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 3 }}>
                {!showLoginButton && (
                  <Button
                    variant="outlined"
                    sx={{
                      px: 2,
                      py: 1,
                      color: "#fff",
                      borderColor: "#000",
                      borderRadius: "30px",
                      textTransform: "none",
                      backgroundColor: "#373535",
                      "&:hover": {
                        backgroundColor: "#131313",
                      },
                    }}
                    onClick={handleValidateLogin}
                  >
                    {validating ? "Validating..." : "Validate"}
                  </Button>
                )}
                {showLoginButton && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setLoginInfo(`${credentials.anthemId} (${selectedAppId})`);
                      setCheckIsLogin(true);
                      setOpenLoginDialog(false);
                    }}
                    disabled={!selectedAppId}
                    sx={{
                      px: 2,
                      py: 1,
                      textTransform: "none",
                      borderRadius: "30px",
                      backgroundColor: "#373535",
                      "&:hover": {
                        backgroundColor: "#131313",
                      },
                    }}
                  >
                    Login
                  </Button>
                )}

                <Button
                  variant="outlined"
                  sx={{
                    px: 2,
                    py: 1,
                    color: "#000",
                    borderColor: "#000",
                    borderRadius: "30px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f3f3f3",
                    },
                  }}
                  onClick={() => setOpenLoginDialog(false)}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "73%",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <Box
              id="message-scroll-container"
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                //px: 2,
                //py: 1,
                marginBottom: "50px",
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "6px" },
              }}
            >
              {messages.map((message, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: message.fromUser ? "flex-end" : "flex-start",
                    }}
                  >
                    {message.fromUser ? (
                      <Box
                        sx={{
                          padding: "12px",
                          backgroundColor: "hsla(0, 0%, 91%, .5)",
                          color: "#000",
                          borderRadius: "24px 4px 24px 24px",
                          maxWidth: "75%",
                        }}
                      >
                        <Typography variant="body1">{message.text}</Typography>
                      </Box>
                    ) : (
                      <MessageWithFeedback
                        message={message}
                        executeSQL={executeSQL}
                        apiCortex={apiCortex}
                        handleGraphClick={handleGraphClick}
                      />
                    )}
                  </Box>
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "start", mt: 2 }}>
                  {/* <HashLoader color="#000000" size={20} /> */}
                  <Loader src={loading} alt="Loading..." />
                </Box>
              )}
              <div id="scroll-anchor" style={{ height: 1 }} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                marginTop: messages.length === 0 ? "36%" : "40px",
                zIndex: 1200,
              }}
            >
              {messages.length === 0 && (
                <Typography
                  /*className="gradientText"*/
                  variant="h5"
                  sx={{
                    marginBottom: "30px",
                    fontWeight: "600",
                    fontSize: "28px",
                    lineHeight: "36px",
                    textAlign: "center",
                    bottom: "60%",
                    position: "absolute",
                    color: "#373535",
                  }}
                >
                  Data at your Fingertips
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid #D9D9D9",
                  boxSizing: "border-box",
                  boxShadow: "0px 4px 12px 0px rgba(39, 97, 187, 0.20)",
                  width: "100%",
                  maxWidth: "73%",
                  position: "absolute",
                  flexShrink: 0,
                  bottom: submitted ? "40px" : "50%",
                  transform: submitted ? "translateY(0)" : "translateY(50%)",
                  transition: "all 0.5s ease-in-out",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {selectedFile && (
                    <Box sx={{ mr: 2, position: "relative" }}>
                      <Box
                        sx={{
                          height: 48,
                          width: 48,
                          borderRadius: "12px",
                          border: "1px solid #e0e0e0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        {isUploading ? (
                          <CircularProgress size={22} />
                        ) : (
                          <InsertDriveFileIcon sx={{ color: "#9e9e9e", fontSize: 20 }} />
                        )}
                        <IconButton
                          size="small"
                          onClick={() => setSelectedFile(null)}
                          sx={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            backgroundColor: "#000",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "#333",
                            },
                            width: 18,
                            height: 18,
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                  <TextField
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    variant="standard"
                    placeholder="Ask anything"
                    sx={{
                      flexGrow: 1,
                      marginX: "10px",
                      "& .MuiInputBase-root": {
                        border: "none",
                        boxShadow: "none",
                      },
                      "& .MuiInput-underline:before": {
                        borderBottom: "none !important",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "none !important",
                      },
                      "& .MuiInput-underline": {
                        visibility: "visible",
                      },
                    }}
                  />

                  {messages.length !== 0 && (
                    <IconButton
                      onClick={handleSubmit}
                      sx={{ backgroundColor: "#5d5d5d", borderRadius: "50%" }}
                    >
                      <FaArrowUp color="#fff" />
                    </IconButton>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </Box>
                {messages.length === 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      marginTop: "12px",
                    }}
                  >
                    <>
                      <Box sx={{ display: "flex", gap: "8px" }}>
                        <Box sx={{ position: "relative" }}>
                          <IconButton
                            onClick={(e) => handleMenuClick(e, "upload")}
                            sx={{
                              border: "1px solid #5d5d5d",
                              borderRadius: "50%",
                              padding: "8px",
                              color: "#5d5d5d",
                            }}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 3C12.5523 3 13 3.44772 13 4V11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H13V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H11V4C11 3.44772 11.4477 3 12 3Z"
                                fill="currentColor"
                              />
                            </svg>
                          </IconButton>

                          <Menu
                            anchorEl={anchorEls.upload}
                            open={Boolean(anchorEls.upload)}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            transformOrigin={{ vertical: "top", horizontal: "left" }}
                          >
                            <MenuItem onClick={() => handleUpload("yaml")}>Upload YAML</MenuItem>
                            {/* <MenuItem onClick={() => handleUpload("data", true)}>
                              Upload Data
                            </MenuItem> */}
                          </Menu>
                        </Box>
                        <Button
                          variant="outlined"
                          component="a"
                          href="https://app-carelon-eda_preprod.privatelink.snowflakecomputing.com/carelon/eda_preprod/#/studio/analyst"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            borderRadius: "50px",
                            textTransform: "none",
                            fontSize: "14px",
                            padding: "6px 12px",
                            color: "#5d5d5d",
                            borderColor: "#5d5d5d",
                            "&:hover": {
                              backgroundColor: "#f3f3f3",
                            },
                          }}
                        >
                          Semantic Model
                        </Button>

                        <Button
                          variant="outlined"
                          component="a"
                          href="https://app-carelon-eda_preprod.privatelink.snowflakecomputing.com/carelon/eda_preprod/#/studio"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            borderRadius: "50px",
                            textTransform: "none",
                            fontSize: "14px",
                            padding: "6px 12px",
                            color: "#5d5d5d",
                            borderColor: "#5d5d5d",
                            "&:hover": {
                              backgroundColor: "#f3f3f3",
                            },
                          }}
                        >
                          Search Service
                        </Button>
                      </Box>
                      <IconButton
                        onClick={handleSubmit}
                        sx={{
                          backgroundColor: "#5d5d5d",
                          borderRadius: "50%",
                          "&:hover": {
                            backgroundColor: "#969696",
                          },
                        }}
                      >
                        <FaArrowUp color="#fff" />
                      </IconButton>
                    </>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Dialog open={chartOpen} onClose={() => setChartOpen(false)} maxWidth="lg" fullWidth>
          <Chart chartData={vegaChartData} onClose={() => setChartOpen(false)} />
        </Dialog>
      </Box>
    </>
  );
};

export default MainContent;
