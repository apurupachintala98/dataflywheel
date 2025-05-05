import { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, Tooltip, Button } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PropTypes from 'prop-types';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';


const Feedback = ({ message }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef(window.speechSynthesis);
    const utteranceRef = useRef(null);
    const voicesRef = useRef([]);

    useEffect(() => {
        const loadVoices = () => {
            voicesRef.current = synthRef.current.getVoices();
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const handleSpeak = () => {
        if (!message?.text) {
            console.error("Message is undefined or empty");
            return;
        }

        const synth = synthRef.current;

        if (synth.speaking) {
            synth.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(message.text);
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.voice = voicesRef.current.find(
            voice =>
                voice.name.includes("Google UK English Female") ||
                voice.name.includes("Google US English Female")
        ) || voicesRef.current[0];

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (err) => {
            console.error("Speech Synthesis Error:", err);
            setIsSpeaking(false);
        };

        synth.cancel();
        synth.speak(utterance);
        utteranceRef.current = utterance;
    };

    const handleCopy = async () => {
        if (!message?.text) {
            console.error("Message is undefined or empty");
            return;
        }
        try {
            await navigator.clipboard.writeText(message.text);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <div className="flex space-x-4 p-2 border-t" style={{ textAlign: "left", marginTop: "10px" }}>
            <Tooltip title="Copy">
                <IconButton onClick={handleCopy}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-md-heavy"><path fillRule="evenodd" clipRule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="currentColor"></path></svg>
                </IconButton>
            </Tooltip>
            <Tooltip title="Good Response">
                <IconButton>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-md-heavy"><path fillRule="evenodd" clipRule="evenodd" d="M12.1318 2.50389C12.3321 2.15338 12.7235 1.95768 13.124 2.00775L13.5778 2.06447C16.0449 2.37286 17.636 4.83353 16.9048 7.20993L16.354 8.99999H17.0722C19.7097 8.99999 21.6253 11.5079 20.9313 14.0525L19.5677 19.0525C19.0931 20.7927 17.5124 22 15.7086 22H6C4.34315 22 3 20.6568 3 19V12C3 10.3431 4.34315 8.99999 6 8.99999H8C8.25952 8.99999 8.49914 8.86094 8.6279 8.63561L12.1318 2.50389ZM10 20H15.7086C16.6105 20 17.4008 19.3964 17.6381 18.5262L19.0018 13.5262C19.3488 12.2539 18.391 11 17.0722 11H15C14.6827 11 14.3841 10.8494 14.1956 10.5941C14.0071 10.3388 13.9509 10.0092 14.0442 9.70591L14.9932 6.62175C15.3384 5.49984 14.6484 4.34036 13.5319 4.08468L10.3644 9.62789C10.0522 10.1742 9.56691 10.5859 9 10.8098V19C9 19.5523 9.44772 20 10 20ZM7 11V19C7 19.3506 7.06015 19.6872 7.17071 20H6C5.44772 20 5 19.5523 5 19V12C5 11.4477 5.44772 11 6 11H7Z" fill="currentColor"></path></svg>
                </IconButton>
            </Tooltip>
            <Tooltip title="Bad Response">
                <IconButton>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-md-heavy"><path fillRule="evenodd" clipRule="evenodd" d="M11.8727 21.4961C11.6725 21.8466 11.2811 22.0423 10.8805 21.9922L10.4267 21.9355C7.95958 21.6271 6.36855 19.1665 7.09975 16.7901L7.65054 15H6.93226C4.29476 15 2.37923 12.4921 3.0732 9.94753L4.43684 4.94753C4.91145 3.20728 6.49209 2 8.29589 2H18.0045C19.6614 2 21.0045 3.34315 21.0045 5V12C21.0045 13.6569 19.6614 15 18.0045 15H16.0045C15.745 15 15.5054 15.1391 15.3766 15.3644L11.8727 21.4961ZM14.0045 4H8.29589C7.39399 4 6.60367 4.60364 6.36637 5.47376L5.00273 10.4738C4.65574 11.746 5.61351 13 6.93226 13H9.00451C9.32185 13 9.62036 13.1506 9.8089 13.4059C9.99743 13.6612 10.0536 13.9908 9.96028 14.2941L9.01131 17.3782C8.6661 18.5002 9.35608 19.6596 10.4726 19.9153L13.6401 14.3721C13.9523 13.8258 14.4376 13.4141 15.0045 13.1902V5C15.0045 4.44772 14.5568 4 14.0045 4ZM17.0045 13V5C17.0045 4.64937 16.9444 4.31278 16.8338 4H18.0045C18.5568 4 19.0045 4.44772 19.0045 5V12C19.0045 12.5523 18.5568 13 18.0045 13H17.0045Z" fill="currentColor"></path></svg>
                </IconButton>
            </Tooltip>
            {/* <Tooltip title={isSpeaking ? "Stop Reading" : "Read Aloud"}>
                <IconButton onClick={handleSpeak}>
                </IconButton>
            </Tooltip> */}
        </div>
    );
};

const MessageWithFeedback = ({ message, executeSQL, apiCortex }) => {
    if (!message?.text && message.type !== 'sql') {
        return null;
    }
    const [sqlState, setSqlState] = useState({
        collapsed: false,
        hidden: false,
        isEditing: false,
        editedSQL: message.text || ''
    });
    const isSQL = message.type === "sql";
    const shouldShowFeedback = !message.fromUser;    // !message.fromUser;
        // const shouldShowFeedback =
    //     message.type === "text" &&
    //     !message.fromUser &&
    //     (message.summarized);
    // message.type === "text" &&
    // !message.fromUser &&
    // !message.streaming &&
    // (message.summarized || message.showFeedback);

    console.log(shouldShowFeedback);
    return (
        <div className="mb-4">
            <div
                className={`p-2 rounded-lg ${message.fromUser
                    ? 'bg-blue-500 text-white'
                    : isSQL
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                style={{
                    fontFamily: 'ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Arial,sans-serif',
                    textAlign: 'left',
                    padding: isSQL ? '12px' : '8px',
                    borderRadius: '8px',
                }}
            >
                {message.type === 'sql' && !sqlState.hidden ? (
                    <><Box sx={{ position: 'relative', mb: 2 }}>
                        {message.interpretation && (
                            <Typography sx={{ mb: 1 }}>{message.interpretation}</Typography>
                        )}
                        <Box sx={{
                            position: 'absolute',
                            top: 34,
                            right: 8,
                            display: 'flex',
                            gap: 1,
                            backgroundColor: 'rgba(255,255,255)',
                            borderRadius: '8px',
                            padding: '4px 6px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            zIndex: 1000
                        }}>
                            <Tooltip title="Copy SQL">
                                <IconButton
                                    size="small"
                                    onClick={() => navigator.clipboard.writeText(sqlState.editedSQL)}
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={sqlState.collapsed ? "Expand SQL" : "Collapse SQL"}>
                                <IconButton
                                    size="small"
                                    onClick={() => setSqlState(prev => ({ ...prev, collapsed: !prev.collapsed }))}
                                >
                                    <ExpandMoreIcon
                                        fontSize="small"
                                        sx={{
                                            transform: sqlState.collapsed ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 0.2s ease'
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={sqlState.isEditing ? "Save SQL" : "Edit SQL"}>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        if (sqlState.isEditing) {
                                            message.text = sqlState.editedSQL;
                                        }
                                        setSqlState((prev) => ({ ...prev, isEditing: !prev.isEditing }));
                                    }}
                                >
                                    {sqlState.isEditing ? (
                                        <SaveIcon fontSize="small" />
                                    ) : (
                                        <EditIcon fontSize="small" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>
                        {!sqlState.collapsed && (
                            <Box sx={{
                                maxHeight: 300,
                                overflowY: 'auto',
                                borderRadius: 2,
                                border: '1px solid #333',
                                backgroundColor: '#282a36',
                                padding: 1,
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#555',
                                    borderRadius: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: '#2a2a2a',
                                },
                            }}>
                                {sqlState.isEditing ? (
                                    <textarea
                                        value={sqlState.editedSQL}
                                        onChange={(e) => setSqlState(prev => ({ ...prev, editedSQL: e.target.value }))}
                                        wrap="soft"
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            backgroundColor: '#1e1e1e',
                                            color: '#fff',
                                            fontFamily: 'monospace',
                                            fontSize: '14px',
                                            border: 'none',
                                            outline: 'none',
                                            resize: 'vertical',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            overflowX: 'hidden',
                                        }}
                                    />
                                ) : (
                                    <SyntaxHighlighter language="sql" style={dracula}>
                                        {typeof message.text === 'string' ? message.text : ''}
                                    </SyntaxHighlighter>
                                )}
                            </Box>
                        )}
                    </Box>
                    </>
                ) : typeof message.text === 'string' ? (
                    <Typography>{message.text}</Typography>
                ) : (
                    <Box sx={{ wordBreak: 'break-word', position: 'relative', zIndex: 1000, overflow: 'visible', }}>
                        {message.text}
                    </Box>
                )}

                {message.showExecute && (
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#000', color: '#fff' }}
                        onClick={() => executeSQL({ ...message, text: sqlState.editedSQL })}
                    >
                        Execute SQL
                    </Button>
                )}

                {message.showSummarize && (
                    <Button
                        variant="contained"
                        sx={{ marginTop: '10px', backgroundColor: '#000', color: '#fff' }}
                        onClick={() => apiCortex(message)}
                    >
                        Summarize
                    </Button>
                )}
            </div>
            {shouldShowFeedback && <Feedback message={message} />}
        </div>
    );
};

export default MessageWithFeedback;

Feedback.propTypes = {
    message: PropTypes.shape({
        text: PropTypes.string,
        type: PropTypes.string,
        fromUser: PropTypes.bool,
        summarized: PropTypes.bool,
        streaming: PropTypes.bool,
        showExecute: PropTypes.bool,
        showSummarize: PropTypes.bool,
        showFeedback: PropTypes.bool,
    }).isRequired,
};

MessageWithFeedback.propTypes = {
    message: PropTypes.shape({
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        type: PropTypes.string,
        fromUser: PropTypes.bool,
        summarized: PropTypes.bool,
        streaming: PropTypes.bool,
        showExecute: PropTypes.bool,
        showSummarize: PropTypes.bool,
        interpretation: PropTypes.string,
        showFeedback: PropTypes.bool,
        sql: PropTypes.string,
    }).isRequired,
    executeSQL: PropTypes.func.isRequired,
    apiCortex: PropTypes.func.isRequired,
};
