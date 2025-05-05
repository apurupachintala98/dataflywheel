import { toast } from 'react-toastify';
import { MessageType } from '../types/message.types';

interface StreamOptions {
  fromUser: boolean;
  streaming: boolean;
  onComplete?: (response: any) => void;
}


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
    if (jsons.find((j: any) => j.type === 'sql')) {
      const [interpretationPart] = buffer.split('end_of_interpretation');
      const sqlMatch = buffer.match(/end_of_interpretation([\s\S]*?)end_of_stream/);
      const sqlText = sqlMatch?.[1]?.trim() || '';

      parsed = {
        ...parsed,
        type: 'sql',
        interpretation: interpretationPart?.trim(),
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
