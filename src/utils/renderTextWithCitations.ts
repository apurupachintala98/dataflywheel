export const renderTextWithCitations = (
    text: string,
    citations: { id: number; content: string }[]
  ): string => {
    return text.replace(/\[(\d+)\]/g, (_, number) => {
      const match = citations.find(c => c.id === parseInt(number));
      return match
        ? `<span class="citation" data-tooltip="${match.content}">[${number}]</span>`
        : `[${number}]`;
    });
  };
  