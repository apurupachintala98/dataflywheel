import { useEffect, useRef, useState } from "react";
import config from "../utils/config.json";
import { useSelectedApp } from "components/SelectedAppContext";

export interface promptProps {
  prompt_name: string;
  description: string;
  content: string;
}
export function usePromptData() {
  const { selectedAppId } = useSelectedApp();

  const [prompts, setPrompts] = useState<promptProps[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedAllPromptDetails = useRef<boolean>(false);

  useEffect(() => {
    if (hasFetchedAllPromptDetails.current) {
      return;
    } else {
      fetchPrompts();
    }
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      console.log('selectedAppId::', selectedAppId);
      const aplctn_cd = selectedAppId.toLowerCase();
      const endPoint = `${config.API_BASE_URL}${config.ENDPOINTS.GET_PROMPTS}/${aplctn_cd}`;
      const response = await fetch(endPoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const finalData = data?.contents[0]?.text;
      setPrompts(finalData);
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPrompt = async (payload: promptProps) => {
    try {
      setLoading(true);
      const response = await fetch("POST_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setPrompts((prev: promptProps[]) => [...prev, data]);
      await fetchPrompts();
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  return {
    prompts,
    setPrompts,
    loading,
    fetchPrompts,
    addPrompt,
  };
}
