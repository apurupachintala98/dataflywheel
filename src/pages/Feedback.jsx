// Feedback.jsx

import { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, Tooltip, Button } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PropTypes from 'prop-types';  

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
                    {/* Your SVG here, make sure class -> className and fill-rule -> fillRule */}
                </IconButton>
            </Tooltip>
            <Tooltip title="Good Response">
                <IconButton>
                    {/* Your Good response SVG */}
                </IconButton>
            </Tooltip>
            <Tooltip title="Bad Response">
                <IconButton>
                    {/* Your Bad response SVG */}
                </IconButton>
            </Tooltip>
            <Tooltip title={isSpeaking ? "Stop Reading" : "Read Aloud"}>
                <IconButton onClick={handleSpeak}>
                    {/* Your Speaking / Stop SVG */}
                </IconButton>
            </Tooltip>
        </div>
    );
};

const MessageWithFeedback = ({ message, executeSQL, apiCortex }) => {
    if (!message?.text) {
        return null;
    }

    const isSQL = message.type === "sql";

    const shouldShowFeedback =
        message.type === "text" &&
        !message.fromUser &&
        (message.summarized || message.streaming);

    return (
        <div className="mb-4">
            <div
                className={`p-2 rounded-lg ${
                    message.fromUser
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
                {isSQL ? (
                    <SyntaxHighlighter language="sql" style={dracula}>
                        {message.text}
                    </SyntaxHighlighter>
                ) : (
                    <Typography>{message.text}</Typography>
                )}

                {message.showExecute && (
                    <Button
                        variant="contained"
                        sx={{ marginTop: '10px', backgroundColor: '#000', color: '#fff' }}
                        onClick={() => executeSQL(message)}
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

//
// Prop types validation
//

Feedback.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string,
    fromUser: PropTypes.bool,
    summarized: PropTypes.bool,
    streaming: PropTypes.bool,
    showExecute: PropTypes.bool,
    showSummarize: PropTypes.bool,
  }).isRequired,
};

MessageWithFeedback.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string,
    fromUser: PropTypes.bool,
    summarized: PropTypes.bool,
    streaming: PropTypes.bool,
    showExecute: PropTypes.bool,
    showSummarize: PropTypes.bool,
  }).isRequired,
  executeSQL: PropTypes.func.isRequired,
  apiCortex: PropTypes.func.isRequired,
};
