/**
 * @description
 * Redux slice for managing the state of the Project & Company Context.
 * This slice holds the text content entered by the user in the context modal
 * and handles loading/saving this content from/to localStorage.
 *
 * Key features:
 * - Manages the 'text' field for the context.
 * - Provides a 'setText' action to update the context, including persistence.
 * - Provides a 'loadContext' action to initialize state from localStorage.
 * - Initializes state by attempting to load from localStorage immediately.
 *
 * @dependencies
 * - @reduxjs/toolkit: For creating the slice and reducers.
 * - ~/types: Imports the ContextState interface for type safety.
 * - ~/utils/localStorage: For interacting with localStorage.
 * - ~/utils/constants: For localStorage key constant.
 *
 * @notes
 * - Persistence is now handled within the 'setText' action.
 * - Initial state loading is triggered by calling loadContext when the store is configured or app mounts.
 */

import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import type { ContextState } from '~/types';
import { getItem, setItem } from '~/utils/localStorage';
import { LS_CONTEXT_KEY } from '~/utils/constants';

/**
 * @description Action creator for triggering the load from localStorage.
 * This can be dispatched when the application initializes.
 */
export const loadContext = createAction('context/loadContext');

/**
 * @description Initial state for the context slice. Tries to load from localStorage immediately.
 */
const initialState: ContextState = {
  text: getItem(LS_CONTEXT_KEY) ?? '', // Initialize from localStorage or default to empty
};

/**
 * @description Redux slice definition for context state.
 */
export const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    /**
     * @description Action to set the entire context text content and persist it.
     * This is typically called when the context modal is closed.
     * @param state - The current context state.
     * @param action - Payload contains the new string value for the context text.
     */
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
      // Persist the text to localStorage whenever it's set via this action.
      setItem(LS_CONTEXT_KEY, action.payload);
    },
  },
   extraReducers: (builder) => {
    builder.addCase(loadContext, (state) => {
      const storedText = getItem(LS_CONTEXT_KEY);
      if (storedText !== null) {
        state.text = storedText;
      }
      // If null, the initial state already handled it or it remains empty.
    });
  },
});

// Export the action creator
export const { setText: setContextText } = contextSlice.actions;

// Export the reducer
export default contextSlice.reducer;
