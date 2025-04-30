import React, { useRef, useEffect } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Divider, TextField, Button, CircularProgress } from "@mui/material";
import { FaArrowUp, FaUserCircle, FaAngleDown } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { HashLoader } from "react-spinners";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import MessageWithFeedback from "../pages/Feedback";
type UploadType = 'yaml' | 'data';
import { MessageType } from '../types/message.types';


interface MainContentProps {
    messages: MessageType[];
    collapsed: boolean;
    toggleSidebar: () => void;
    inputValue: string;
    // messages: { text: string; fromUser: boolean }[];
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
    handleUpload: (type: UploadType) => void;
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
    handleUpload,
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

                <Box id="message-scroll-container" tabIndex={0}
                    sx={{
                        paddingTop: '80px',
                        paddingBottom: '140px',
                        flexGrow: 1,
                        textAlign: 'center',
                        // marginTop: '50px',
                        width: '100%',
                        overflowY: 'scroll',
                        scrollbarWidth: 'none',
                        scrollBehavior: 'smooth', // Firefox
                        '&::-webkit-scrollbar': {
                            display: 'none', // Chrome, Safari
                        },
                        maxWidth: '45%', // Set max width as needed
                        margin: '50px auto', // Center it horizontally
                    }}>

                    {messages.map((message, index) => (
                        <Box key={index} sx={{
                            width: '100%',
                            maxWidth: '100%',
                            margin: '10px auto 0',
                            overflowY: 'auto',
                        }}>
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.fromUser ? "flex-end" : "flex-start",
                                    // flexDirection: message.fromUser ? 'row-reverse' : 'row',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                }}
                            >
                                {message.fromUser ? (
                                    <Box
                                        sx={{
                                            padding: '10px',
                                            backgroundColor: message.fromUser ? 'hsla(0, 0%, 91%, .5)' : 'transparent', // User messages with background
                                            color: '#000',
                                            borderRadius: '10px',
                                            maxWidth: '75%',
                                        }}
                                    >
                                        <Typography variant="body1">{message.text}</Typography>
                                    </Box>
                                ) : (
                                    <MessageWithFeedback message={message} executeSQL={executeSQL} apiCortex={apiCortex} key={index} />
                                )}
                            </Box>
                        </Box>

                    ))}

                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'start', marginTop: '20px' }}>
                            <HashLoader color="#2761BB" size={20} aria-label="Loading Spinner" data-testid="loader" />
                        </Box>
                    )}
                    <div id="scroll-anchor" style={{ height: 1 }} />


                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: messages.length === 0 ? '36%' : '40px', // Add spacing above input field
                    zIndex: 1200,
                }}>
                    {messages.length === 0 && (
                        <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: "600", fontSize: "28px", textAlign: "center", bottom: '57%', position: 'absolute', color: "#2761BB" }}>
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
                            borderRadius: '12px',
                            border: '1px solid #D9D9D9',
                            boxSizing: 'border-box',
                            boxShadow: '0px 4px 12px 0px rgba(39, 97, 187, 0.20)',
                            width: '100%',
                            maxWidth: '45%',
                            position: 'absolute',
                            flexShrink: 0,
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
                                <IconButton onClick={handleSubmit} sx={{ backgroundColor: "#2761BB", borderRadius: "50%" }}>
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
                                        <IconButton
                                            onClick={(e) => handleMenuClick(e, 'upload')}
                                            sx={{
                                                border: '1px solid #002d9c',
                                                borderRadius: '50%',
                                                padding: '8px',
                                                color: '#002d9c',
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
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                        >
                                            <MenuItem onClick={() => handleUpload('yaml')}>Upload YAML</MenuItem>
                                            <MenuItem onClick={() => handleUpload('data')}>Upload Data</MenuItem>
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
                                            color: "#002d9c",
                                            borderColor: "#002d9c",
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
                                            color: "#002d9c",
                                            borderColor: "#002d9c",
                                        }}
                                    >
                                        Search Service
                                    </Button>
                                </Box>
                                    <IconButton onClick={handleSubmit} sx={{ backgroundColor: "#2761BB", borderRadius: "50%" }}>
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
