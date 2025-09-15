export interface Highlight {
  id: string;
  text: string;
  note?: string;
  color: string;
  createdAt: string;
  position?: {
    paragraphIndex: number;
    startOffset: number;
    endOffset: number;
  };
}

export const createHighlight = (
  text: string,
  color = "#ffeb3b",
  position?: { paragraphIndex: number; startOffset: number; endOffset: number }
): Highlight => {
  return {
    id: Date.now().toString(),
    text,
    color,
    createdAt: new Date().toISOString(),
    position,
  };
};

export const addNoteToHighlight = (
  highlight: Highlight,
  note: string
): Highlight => {
  return {
    ...highlight,
    note,
  };
};
