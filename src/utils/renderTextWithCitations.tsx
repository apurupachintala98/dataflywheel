import React from "react";
import { Tooltip } from "@mui/material";

export const renderTextWithCitations = (
  text: string,
  citations: { source_id: number; text: string }[]
) => {
  const citationMap = new Map<number, string>();
  citations.forEach(c => citationMap.set(Math.floor(c.source_id), c.text));
  console.log(citations);
  const parts = text.split(/(\[\d+\])/g).map((part, i) => {
    const match = part.match(/\[(\d+)\]/);
    if (match) {
      const sourceId = parseInt(match[1]);
      const citationText = citationMap.get(sourceId);
      console.log(citationText);
      return (
        <Tooltip key={i} title={citationText || ''} arrow placement="top" enterDelay={100}>
          <span style={{ color: "blue", cursor: "pointer", fontSize: "14px" }}>{part}</span>
        </Tooltip>
      );
    }

    return <span key={i}>{part}</span>;
  });

  return <div style={{ whiteSpace: "pre-wrap" }}>{parts}</div>;
};
