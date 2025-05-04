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
                </IconButton>
            </Tooltip>
            <Tooltip title="Good Response">
                <IconButton>
                </IconButton>
            </Tooltip>
            <Tooltip title="Bad Response">
                <IconButton>
                </IconButton>
            </Tooltip>
            <Tooltip title={isSpeaking ? "Stop Reading" : "Read Aloud"}>
                <IconButton onClick={handleSpeak}>
                </IconButton>
            </Tooltip>
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
    const shouldShowFeedback =
        message.type === "text" &&
        !message.fromUser && message.streaming &&
        (message.summarized || message.showFeedback);
    // message.type === "text" &&
    // !message.fromUser &&
    // !message.streaming &&
    // (message.summarized || message.showFeedback);


    console.log(message);
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
