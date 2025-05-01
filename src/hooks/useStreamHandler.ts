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
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let done = false;
    let meta = '';
    const jsons: any[] = [];

    while (!done) {
      const { value, done: readDone } = await reader.read();
      done = readDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const endIndex = buffer.indexOf('end_of_stream');
        if (endIndex !== -1) {
          const [textPart, trailingPart] = buffer.split('end_of_stream');
          buffer = textPart.trim();
          meta = trailingPart?.trim() || '';
          done = true;
        }

        setMessages(prev => {
          const temp = [...prev];
          temp[temp.length - 1] = {
            ...temp[temp.length - 1],
            text: buffer,
            streaming: true,
          };
          return temp;
        });
      }
    }

    let parsed: any = { text: buffer, type: 'text' };

    if (meta) {
      try {
        const jsons = meta
          .split(/(?<=})\s*(?={)/g)
          .map(json => JSON.parse(json));

        const enriched = jsons.find(j => j.type || j.citations);
        if (enriched) {
          parsed = { ...parsed, ...enriched };
        }
      } catch (e) {
        console.warn('Could not parse trailing metadata:', meta);
      }
    }

    // if (parsed.type === 'sql') {
    //   const interpretationMatch = buffer.match(/([\s\S]*?)end_of_interpretation/);
    //   const sqlMatch = buffer.match(/end_of_interpretation([\s\S]*?)end_of_stream/);

    //   parsed = {
    //     ...parsed,
    //     interpretation: interpretationMatch?.[1]?.trim() || '',
    //     sql: sqlMatch?.[1]?.trim() || '',
    //   };
    // }

    // if (jsons.find((j: any) => j.type === 'sql')) {
    //   const [interpretationPart] = buffer.split('end_of_interpretation');
    //   const sqlMatch = buffer.match(/end_of_interpretation([\s\S]*?)end_of_stream/);
    //   const sqlText = sqlMatch?.[1]?.trim() || '';

    //   parsed = {
    //     ...parsed,
    //     type: 'sql',
    //     interpretation: interpretationPart?.trim(),
    //     sql: sqlText,
    //   };
    // }

    if (jsons.find((j: any) => j.type === 'sql')) {
      const [interpretationPartRaw] = buffer.split('end_of_interpretation');
      const sqlMatch = buffer.match(/end_of_interpretation([\s\S]*?)end_of_sql/);
      const sqlText = sqlMatch?.[1]?.trim() || '';

      const interpretationPart = interpretationPartRaw?.replace(/end_of_interpretation/g, '').trim();

      parsed = {
        ...parsed,
        type: 'sql',
        interpretation: interpretationPart,
        sql: sqlText,
      };
    }


    try {
      onComplete?.(parsed);
    } catch (e) {
      console.error('onComplete error:', e);
      toast.error('Something went wrong handling the response.');
    }
  };

  return { handleStream };
};
