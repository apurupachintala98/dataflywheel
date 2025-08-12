import { useEffect, useRef, useState } from "react";
import { config } from "../utils/config";
import { useSelectedApp } from "components/SelectedAppContext";

export interface promptProps {
  prompt_name: string;
  description: string;
  content: string;
}

interface promptDataProps {
  checkIsLogin: boolean;
}
export function usePromptData({ checkIsLogin }: promptDataProps) {
  const { selectedAppId } = useSelectedApp();

  const [prompts, setPrompts] = useState<promptProps[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedAllPromptDetails = useRef<boolean>(false);
  const { APP_CONFIG, API_BASE_URL, ENDPOINTS } = config();
    const aplctnCdValue =
  selectedAppId === "POCGENAI"
    ? "edagnai"
    : selectedAppId.toLowerCase();
  useEffect(() => {
    if (checkIsLogin) {
      if (hasFetchedAllPromptDetails.current) {
        return;
      } else {
        fetchPrompts();
      }
    }
  }, [checkIsLogin]);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      console.log('selectedAppId::', selectedAppId);
      const aplctn_cd = aplctnCdValue;
      const endPoint = `${API_BASE_URL}${ENDPOINTS.GET_PROMPTS}/${aplctn_cd}`;
      const response = await fetch(endPoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const finalData = data?.contents[0]?.text;
      setPrompts(JSON.parse(finalData));
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
