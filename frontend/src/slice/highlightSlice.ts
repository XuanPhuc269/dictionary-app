import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Highlight } from '../services/highlightService';

interface HighlightState {
    highlights: Highlight[];
}

const initialState: HighlightState = {
    highlights: []
};

const highlightSlice = createSlice({
    name: 'highlight',
    initialState,
    reducers: {
        addHighlight: (state, action: PayloadAction<Highlight>) => {
            state.highlights.push(action.payload);
        },
        removeHighlight: (state, action: PayloadAction<string>) => {
            state.highlights = state.highlights.filter(h => h.id !== action.payload);
        },
        updateHighlightNote: (state, action: PayloadAction<{ id: string; note: string }>) => {
            const highlight = state.highlights.find(h => h.id === action.payload.id);
            if (highlight) {
                highlight.note = action.payload.note;
            }
        }
    }
});

export const { addHighlight, removeHighlight, updateHighlightNote } = highlightSlice.actions;

export default highlightSlice.reducer;