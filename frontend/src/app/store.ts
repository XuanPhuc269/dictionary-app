import { configureStore } from '@reduxjs/toolkit';
import dictionarySlice from '../slice/dictionarySlice';
import highlightSlice from '../slice/highlightSlice';

export const store = configureStore({
    reducer: {
        dictionary: dictionarySlice,
        highlights: highlightSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;