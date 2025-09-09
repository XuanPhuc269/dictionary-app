export interface Highlight {
    id: string;
    text: string;
    note?: string;
    color: string;
    createdAt: string;
}

export const createHighlight = (text: string, color = '#ffeb3b'): Highlight => {
    return {
        id: Date.now().toString(),
        text,
        color,
        createdAt: new Date().toISOString()
    };
};

export const addNoteToHighlight = (highlight: Highlight, note: string): Highlight => {
    return {
        ...highlight,
        note
    };
}