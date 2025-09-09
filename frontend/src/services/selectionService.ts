export const getSelectedText = (): {
  text: string;
  range: Range | null;
} => {
  const selection = window.getSelection();
  const text = selection?.toString() || "";

  return {
    text,
    range: selection?.rangeCount ? selection.getRangeAt(0) : null,
  };
};
