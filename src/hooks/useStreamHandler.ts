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
    let metadata = '';
    let done = false;

    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (done) break;

      const chunk = decoder.decode(result.value, { stream: true });
      buffer += chunk;

      const endIndex = buffer.indexOf('end_of_stream');
      if (endIndex !== -1) {
        // Extract only the streamed content up to the marker
        const parts = buffer.split('end_of_stream');
        buffer = parts[0].trim();
        metadata = parts[1]?.trim() || '';
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

      if (done) break;
    }

    // Try to parse metadata if it exists
    let parsed: any = { text: buffer, type: 'text' };
    if (metadata) {
      try {
        const metaParsed = JSON.parse(metadata);
        parsed = { ...parsed, ...metaParsed };
      } catch (e) {
        console.warn("Could not parse trailing metadata:", metadata);
      }
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
