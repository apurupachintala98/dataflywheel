// import { toast } from 'react-toastify';
// import { MessageType } from '../types/message.types';

// export const useStreamHandler = (
//     setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
// ) => {
//     const handleStream = async (
//         stream: ReadableStream<Uint8Array>,
//         {
//             fromUser,
//             streaming,
//             onComplete,
//         }: {
//             fromUser: boolean;
//             streaming: boolean;
//             onComplete?: (response: any) => void;
//         }
//     ) => {
//         const reader = stream.getReader();
//         const decoder = new TextDecoder("utf-8");
//         let buffer = "";

//         let done = false;
//         while (!done) {
//             const result = await reader.read();
//             done = result.done;
//             if (done) break;
//             const chunk = decoder.decode(result.value, { stream: true });
//             buffer += chunk;
//             setMessages(prev => {
//                 const temp = [...prev];
//                 temp[temp.length - 1] = { ...temp[temp.length - 1], text: buffer, streaming: true };
//                 return temp;
//             });
//         }

//         try {
//             const parsed = JSON.parse(buffer);
//             onComplete?.(parsed);
//         } catch (e) {
//             console.error("Parse error", e);
//             toast.error("Could not parse response.");
//         }
//     };

//     return { handleStream };
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

    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (done) break;

      const chunk = decoder.decode(result.value, { stream: true });
      buffer += chunk;

      // Check for end_of_stream marker
      const endIndex = buffer.indexOf('end_of_stream');
      if (endIndex !== -1) {
        buffer = buffer.slice(0, endIndex).trim(); // trim any trailing whitespace
        done = true; // stop further reading
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

      if (done) break;
    }

    // Final update after streaming ends
    try {
      const parsed = JSON.parse(buffer);
      onComplete?.(parsed);
    } catch (e) {
      console.error('Parse error', e);
      toast.error('Could not parse response.');
    }
  };

  return { handleStream };
};
