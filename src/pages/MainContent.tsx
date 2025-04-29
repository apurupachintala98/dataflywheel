import React from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Divider, TextField, Button, CircularProgress } from "@mui/material";
import { FaArrowUp, FaUserCircle, FaAngleDown } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { HashLoader } from "react-spinners";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';

interface MainContentProps {
    collapsed: boolean;
    toggleSidebar: () => void;
    inputValue: string;
    messages: { text: string; fromUser: boolean }[];
    anchorEls: {
        account: HTMLElement | null;
        chat: HTMLElement | null;
        search: HTMLElement | null;
        upload: HTMLElement | null;
    };
    fileLists: { yaml: string[]; search: string[] };
    selectedModels: { yaml: string[]; search: string[] };
    handleMenuClick: (e: React.MouseEvent<HTMLElement>, type: keyof MainContentProps["anchorEls"]) => void;
    handleMenuClose: () => void;
    handleModelSelect: (file: string, type: "yaml" | "search") => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
    isLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    selectedFile: File | null;
    isUploading: boolean;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleUploadFromComputer: () => void;
    isModalVisible: boolean;
    handleModalClose: () => void;
    data: any;
    setSelectedFile: (file: File | null) => void;
    executeSQL: (sqlQuery: any) => Promise<void>;
    apiCortex: (message: any) => Promise<void>;
    submitted: boolean;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
}

const MainContent = ({
    inputValue,
    messages,
    anchorEls,
    fileLists,
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
    handleUploadFromComputer,
    isModalVisible,
    handleModalClose,
    data,
    setSelectedFile,
    executeSQL,
    apiCortex,
    open,
}: MainContentProps) => {
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    padding: "20px",
                    overflowY: "auto",
                    position: "relative",
                    height: "100vh",
                }}
            >
                {/* Top Navigation */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: "0px 30px", position: "absolute", top: 0, width: "100%", zIndex: 100, marginTop: "20px" }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {(['chat', 'search'] as const).map((type) => (
                            <Box key={type} sx={{ display: 'inline-block', mr: 2 }}>
                                <Box
                                    onClick={(e) => handleMenuClick(e, type)}
                                    sx={{
                                        backgroundColor: '#2761BB', // The blue background
                                        color: '#FFFFFF', // White text
                                        px: 2,
                                        py: 1,
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        minWidth: 150,
                                        flexShrink: 0,
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {type === 'chat' ? 'Semantic Model' : 'Search'} <FaAngleDown />
                                </Box>
                                <Menu
                                    anchorEl={anchorEls[type]}
                                    open={Boolean(anchorEls[type])}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                >
                                    {fileLists[type === 'chat' ? 'yaml' : 'search'].length ? (
                                        fileLists[type === 'chat' ? 'yaml' : 'search'].map((file) => (
                                            <MenuItem
                                                key={file}
                                                onClick={() => handleModelSelect(file, type === 'chat' ? 'yaml' : 'search')}
                                            >
                                                {file}{' '}
                                                {selectedModels[type === 'chat' ? 'yaml' : 'search'].includes(file) && ' ✓'}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No Files</MenuItem>
                                    )}
                                </Menu>
                            </Box>
                        ))}


                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography>Welcome, Balaji!</Typography>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="33"
                            height="33"
                            viewBox="0 0 33 33"
                            fill="none"
                        >
                            <circle cx="16.5" cy="16.5" r="16.5" fill="#A6C8FF" />
                            <g transform="translate(7.5, 7.5)">
                                <path
                                    d="M14.2299 14.9418V13.5188C14.2299 12.764 13.9301 12.0401 13.3963 11.5063C12.8626 10.9726 12.1387 10.6727 11.3839 10.6727H5.69175C4.93693 10.6727 4.21303 10.9726 3.67929 11.5063C3.14555 12.0401 2.8457 12.764 2.8457 13.5188V14.9418"
                                    stroke="#002D9C"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8.53843 7.82662C10.1103 7.82662 11.3845 6.5524 11.3845 4.98057C11.3845 3.40874 10.1103 2.13452 8.53843 2.13452C6.9666 2.13452 5.69238 3.40874 5.69238 4.98057C5.69238 6.5524 6.9666 7.82662 8.53843 7.82662Z"
                                    stroke="#002D9C"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        </svg>


                    </Box>
                </Box>

                {/* Messages */}
                <Box id="message-scroll-container" sx={{ pt: 10, pb: 15, flexGrow: 1, maxWidth: "45%", mx: "auto" }}>
                    {messages.map((message, idx) => (
                        <Box key={idx} sx={{ textAlign: message.fromUser ? "right" : "left", my: 2 }}>
                            <Box sx={{ display: "inline-block", backgroundColor: "#f1f1f1", p: 2, borderRadius: 2 }}>
                                <Typography>{message.text}</Typography>
                            </Box>
                        </Box>
                    ))}
                    {isLoading && <HashLoader color="#000000" size={20} />}
                    <div id="scroll-anchor" style={{ height: 1 }} />
                </Box>

                {/* Input Box */}

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: messages.length === 0 ? '36%' : '40px', // Add spacing above input field
                    zIndex: 1200,
                }}>
                    {messages.length === 0 && (
                        <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: "600", fontSize: "28px", textAlign: "center", bottom: '57%', position: 'absolute', }}>
                            Data at your Fingertips
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: '12px 20px',
                            borderRadius: '20px',
                            border: '1px solid #e3e3e3',
                            boxSizing: 'border-box',
                            boxShadow: '0 0 0 0 #0000, 0 0 0 0 #0000, 0 9px 9px 0px rgba(0, 0, 0, 0.01), 0 2px 5px 0px rgba(0, 0, 0, 0.06)',
                            width: '100%',
                            maxWidth: '45%',
                            position: 'absolute',
                            bottom: submitted ? '20px' : '50%',
                            transform: submitted ? 'translateY(0)' : 'translateY(50%)',
                            transition: 'all 0.5s ease-in-out',
                        }}
                    >
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}>
                            {selectedFile && (
                                <Box sx={{ mr: 2, position: 'relative' }}>
                                    <Box
                                        sx={{
                                            height: 48,
                                            width: 48,
                                            borderRadius: '12px',
                                            border: '1px solid #e0e0e0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f9f9f9'
                                        }}
                                    >
                                        {isUploading ? (
                                            <CircularProgress size={22} />
                                        ) : (
                                            <InsertDriveFileIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />
                                        )}

                                        <IconButton
                                            size="small"
                                            onClick={() => setSelectedFile(null)}
                                            sx={{
                                                position: 'absolute',
                                                top: '-6px',
                                                right: '-6px',
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#333',
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
                                        e.preventDefault(); // Prevents new line in input field
                                        handleSubmit(); // Calls submit function
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
                                }} />

                            {messages.length !== 0 && (
                                <IconButton onClick={handleSubmit} sx={{ backgroundColor: "#5d5d5d", borderRadius: "50%" }}>
                                    <FaArrowUp color="#fff" />
                                </IconButton>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange} />


                        </Box>


                        {messages.length === 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between', // Ensures buttons left, submit button right
                                    alignItems: 'center',
                                    width: '100%',
                                    marginTop: '12px'
                                }}
                            >
                                <><Box sx={{ display: 'flex', gap: '8px' }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={(e) => handleMenuClick(e, 'upload')}
                                            rel="noopener noreferrer"
                                            sx={{
                                                borderRadius: "50px",
                                                textTransform: "none",
                                                fontSize: "14px",
                                                padding: "6px 12px",
                                                color: "#5d5d5d",
                                                borderColor: "#5d5d5d",
                                            }}
                                        >
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-label=""
                                                className="h-[18px] w-[18px]"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z"
                                                    fill="currentColor"
                                                />
                                            </svg>

                                            Upload your Data
                                        </Button>


                                        {open && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -50,
                                                    left: 0,
                                                    zIndex: 1300,
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    minWidth: '180px'
                                                }}
                                            >

                                                <MenuItem onClick={handleUploadFromComputer}>Upload from computer</MenuItem>
                                            </Box>
                                        )}
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
                                        }}
                                    >
                                        Search Service
                                    </Button>



                                </Box>
                                    <IconButton onClick={handleSubmit} sx={{ backgroundColor: "#5d5d5d", borderRadius: "50%" }}>
                                        <FaArrowUp color="#fff" />
                                    </IconButton></>
                            </Box>
                        )}
                    </Box>
                </Box>


            </Box>
        </>
    );
};

export default MainContent;
