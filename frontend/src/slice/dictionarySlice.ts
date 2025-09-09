import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Phonetic {
    text: string;
    audio?: string;
}

interface Definition { 
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
}

interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
}

interface WordData {
    word: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
}

interface DictionaryState {
    word: string;
    data: WordData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DictionaryState = {
    word: '',
    data: null,
    status: 'idle',
    error: null
}

export const fetchWordDefinition = createAsyncThunk(
    'dictionary/fetchWord',
    async (word: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3001/api/dictionary/${word}`);

            if (!response.ok) {
                throw new Error('Word not found');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
)

const dictionarySlice = createSlice({
    name: 'dictionary',
    initialState,
    reducers: {
        setSearchWord(state, action: PayloadAction<string>){
            state.word = action.payload;
        },
        clearResults: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWordDefinition.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWordDefinition.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchWordDefinition.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { setSearchWord, clearResults } = dictionarySlice.actions;

export default dictionarySlice.reducer;