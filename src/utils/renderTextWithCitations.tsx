import React, { useState } from "react";
import { Box, Typography, Popover, Tooltip } from "@mui/material";

export const renderTextWithCitations = (
  text: string,
  citations: { source_id: number; text: string }[]
) => {
  const citationMap = new Map<number, string>();
  citations.forEach(c => citationMap.set(Math.floor(c.source_id), c.text)); 
console.log(citations);
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popoverText, setPopoverText] = useState("");

  const handleOpen = (event: React.MouseEvent<HTMLElement>, text: string) => {
    setAnchorEl(event.currentTarget);
    setPopoverText(text);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPopoverText("");
  };

  const open = Boolean(anchorEl);


  const parts = text.split(/(\[\d+\])/g).map((part, i) => {
    const match = part.match(/\[(\d+)\]/);
    if (match) {
      const sourceId = parseInt(match[1]);
      const citationText = citationMap.get(sourceId);
      console.log(citationText);
      // return (
      //   <Tooltip key={i} title={citationText || ''} arrow placement="top" enterDelay={100}>
      //     <span style={{ color: "blue", cursor: "pointer" }}>{part}</span>
      //   </Tooltip>
      // );
      return (
        <span
          key={i}
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onMouseEnter={(e) => handleOpen(e, citationText || '')}
          onMouseLeave={handleClose}
        >
          {part}
        </span>
      );
    }

    return <span key={i}>{part}</span>;
  });

  // return <div style={{ whiteSpace: "pre-wrap" }}>{parts}</div>;
  return (
    <div style={{ whiteSpace: "pre-wrap", position: "relative" }}>
      {parts}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        PaperProps={{
          sx: {
            p: 2,
            maxWidth: 260,
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
          },
        }}
        disableRestoreFocus
      >
        <Typography variant="body2">{popoverText}</Typography>
      </Popover>
    </div>
  );
};
