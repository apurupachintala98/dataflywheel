import { useState } from "react";

export const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const sendRequest = async <T>(
    url: string,
    payload: any,
    options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    },
    isStream: boolean = false
  ): Promise<{ data: T | null; stream: ReadableStream<Uint8Array> | null; error: any }> => {
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        ...options,
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      if (isStream) {
        return {
          data: null,
          stream: response.body || null,
          error: null
        };
      }
      const data = await response.json();
      return { data, stream: null, error: null };
    } catch (err) {
      return { data: null, stream: null, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  return { sendRequest, isLoading };
};
