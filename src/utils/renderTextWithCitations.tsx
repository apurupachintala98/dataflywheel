import React from "react";
import Tooltip from "@mui/material/Tooltip";

export const renderTextWithCitations = (
  text: string,
  citations: { source_id: number; text: string }[]
) => {
  const citationMap = new Map<number, string>();

  // 🔧 Normalize float source_id like 2.0 → 2
  citations.forEach(c => citationMap.set(Math.floor(c.source_id), c.text));

  const parts = text.split(/(\[\d+\])/g).map((part, i) => {
    const match = part.match(/\[(\d+)\]/);
    if (match) {
      const sourceId = parseInt(match[1]); // From text like [2]
      const citationText = citationMap.get(sourceId);

      return citationText ? (
        <Tooltip key={i} title={citationText} arrow placement="top">
          <span style={{ color: "blue", cursor: "pointer" }}>{part}</span>
        </Tooltip>
      ) : (
        <span key={i}>{part}</span>
      );
    }
    return <span key={i}>{part}</span>;
  });

  return <div style={{ whiteSpace: "pre-wrap" }}>{parts}</div>;
};
