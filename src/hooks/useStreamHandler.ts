// import { toast } from 'react-toastify';
// import { MessageType } from '../types/message.types';

// export const useStreamHandler = (
//   setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
// ) => {
//   const handleStream = async (
//     stream: ReadableStream<Uint8Array>,
//     {
//       fromUser,
//       streaming,
//       onComplete,
//     }: {
//       fromUser: boolean;
//       streaming: boolean;
//       onComplete?: (response: any) => void;
//     }
//   ) => {
//     const reader = stream.getReader();
//     const decoder = new TextDecoder('utf-8');
//     let buffer = '';
//     let done = false;
//     let meta = '';

//     while (!done) {
//       const { value, done: readDone } = await reader.read();
//       done = readDone;
//       if (value) {
//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         const endIndex = buffer.indexOf('end_of_stream');
//         if (endIndex !== -1) {
//           const [textPart, trailingPart] = buffer.split('end_of_stream');
//           buffer = textPart.trim();
//           meta = trailingPart?.trim() || '';
//           done = true;
//         }

//         setMessages(prev => {
//           const temp = [...prev];
//           temp[temp.length - 1] = {
//             ...temp[temp.length - 1],
//             text: buffer,
//             streaming: true,
//           };
//           return temp;
//         });
//       }
//     }

//     // Build base response
//     let parsed: any = { text: buffer, type: 'text' };

//     // Extract JSON only if citations block exists
//     if (meta) {
//       try {
//         const jsons = meta
//           .split(/(?<=})\s*(?={)/g) // safely split multiple trailing JSONs
//           .map(json => JSON.parse(json));

//         // Find the one with citations (or you can search based on "type")
//         const citationJson = jsons.find(j => Array.isArray(j.citations));
//         if (citationJson) {
//           parsed = { ...parsed, ...citationJson };
//         }
//       } catch (e) {
//         console.warn('Could not parse trailing metadata:', meta);
//       }
//     }

//     try {
//       onComplete?.(parsed);
//     } catch (e) {
//       console.error('onComplete error:', e);
//       toast.error('Something went wrong handling the response.');
//     }
//   };

//   return { handleStream };
// };

// useStreamHandler.ts
import { toast } from 'react-toastify';
import { MessageType } from '../types/message.types';

export const useStreamHandler = (
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
  const handleStream = async (
    stream: ReadableStream<Uint8Array>,
    {
      fromUser,
      streaming,
      onComplete,
    }: {
      fromUser: boolean;
      streaming: boolean;
      onComplete?: (response: any) => void;
    }
  ) => {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let done = false;

    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (done) break;

      const chunk = decoder.decode(result.value, { stream: true });
      buffer += chunk;

      const endIndex = buffer.indexOf("end_of_stream");
      if (endIndex !== -1) {
        buffer = buffer.slice(0, endIndex); // Cut at end_of_stream
        done = true;
      }

      setMessages((prev) => {
        const temp = [...prev];
        temp[temp.length - 1] = {
          ...temp[temp.length - 1],
          text: buffer,
          streaming: true,
        };
        return temp;
      });
    }

    try {
      const jsonMatch = buffer.match(/({[\s\S]+})\s*$/); // get last JSON
      const jsonPart = jsonMatch ? jsonMatch[1] : null;

      // Trim to pure content (remove metadata)
      const pureText = buffer.replace(/end_of_stream\s*({[\s\S]+})\s*$/, "").trim();

      let parsed: any = { text: pureText };

      if (jsonPart) {
        try {
          const metadata = JSON.parse(jsonPart);
          parsed = { ...parsed, ...metadata };
        } catch (e) {
          console.warn("Trailing metadata couldn't be parsed:", jsonPart);
        }
      }

      if (parsed.type === "sql") {
        const interpMatch = pureText.match(/^(.*?)end_of_interpretation\s*/);
        const interpretation = interpMatch?.[1]?.trim() || "";
        const sql = pureText.replace(/^[\s\S]*?end_of_interpretation\s*/, "").replace(/end_of_sql.*/, "").trim();

        parsed = {
          ...parsed,
          interpretation,
          sql,
        };
      }

      onComplete?.(parsed);
    } catch (err) {
      console.error("Could not parse stream metadata:", err);
      toast.error("Something went wrong parsing the response.");
    }
  };

  return { handleStream };
};
