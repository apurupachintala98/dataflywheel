import { useEffect, useRef, useState } from "react";

export interface promptProps {
  id: string | number;
  prompt_title: string;
}
export function usePromptData() {
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
      const response = await fetch("YOUR_API_ENDPOINT_URL");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      //const data = await response.json();
      const data = [
        { id: 1, prompt_title: "What is considered continuous enrollment for FMC in HEDIS?" },
        { id: 2, prompt_title: "How should I handle direct transfers for PCR in HEDIS?" },
        { id: 3, prompt_title: "What is the FMC denominator based on in HEDIS?" }
      ];
      setPrompts(data);
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
