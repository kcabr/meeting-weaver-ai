/**
 * @description
 * Redux slice for managing the state of the Slide/Meeting Notes panel.
 * This slice holds the text content entered by the user in the notes text area
 * and handles loading/saving this content from/to localStorage.
 *
 * Key features:
 * - Manages the 'text' field for slide/meeting notes.
 * - Provides a 'setSlideNotesText' action for immediate UI updates based on user input.
 * - Provides a 'persistSlideNotes' action, typically triggered on blur, to save state to localStorage.
 * - Provides an 'insertSlideNotesText' action for programmatically adding text (like separators), which also persists.
 * - Provides a 'loadSlideNotes' action to initialize state from localStorage on app load.
 * - Initializes state by attempting to load from localStorage immediately.
 *
 * @dependencies
 * - @reduxjs/toolkit: For creating the slice and reducers.
 * - ~/types: Imports the SlideNotesState interface for type safety.
 * - ~/utils/localStorage: For interacting with localStorage.
 * - ~/utils/constants: For localStorage key constant.
 * - ~/utils/textUtils: For text manipulation helper 'insertTextAtCursor'.
 *
 * @notes
 * - Persistence logic is primarily handled by the persistSlideNotes action and within the insertSlideNotesText action.
 * - setSlideNotesText is for responsive UI updates during typing.
 * - Initial state loading is triggered by calling loadSlideNotes when the app mounts.
 */

import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import type { SlideNotesState } from '~/types';
import { getItem, setItem } from '~/utils/localStorage';
import { LS_SLIDE_NOTES_KEY } from '~/utils/constants';
import { insertTextAtCursor } from '~/utils/textUtils'; // Import the utility

// BEGIN WRITING FILE CODE

/**
 * @description Action creator for triggering the load from localStorage.
 */
export const loadSlideNotes = createAction('slideNotes/loadSlideNotes');

/**
 * @description Action creator for explicitly triggering persistence, e.g., on blur.
 * The payload should be the current text content.
 */
export const persistSlideNotes = createAction<string>('slideNotes/persistSlideNotes');

/**
 * @description Initial state for the slide notes slice. Tries to load from localStorage immediately.
 */
const initialState: SlideNotesState = {
  text: getItem(LS_SLIDE_NOTES_KEY) ?? '', // Initialize from localStorage or default to empty
};

/**
 * @description Redux slice definition for slide notes state.
 */
export const slideNotesSlice = createSlice({
  name: 'slideNotes',
  initialState,
  reducers: {
    /**
     * @description Action to set the entire slide notes text content.
     * This updates the state immediately for UI responsiveness but doesn't persist automatically.
     * Persistence should be triggered separately, e.g., by 'persistSlideNotes' on blur.
     * @param state - The current slide notes state.
     * @param action - Payload contains the new string value for the notes text.
     */
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    /**
     * @description Action to insert text at a specific position. Also handles persistence.
     * It uses the insertTextAtCursor utility to calculate the new text state.
     * @param state - The current slide notes state.
     * @param action - Payload contains the text to insert and the position (cursor index).
     */
    insertText: (state, action: PayloadAction<{ textToInsert: string; position: number }>) => {
      const { textToInsert, position } = action.payload;
      const { newText } = insertTextAtCursor(state.text, textToInsert, position);
      state.text = newText;
       // Persist the change immediately after insertion
       setItem(LS_SLIDE_NOTES_KEY, newText);
    },
  },
   extraReducers: (builder) => {
    builder
      .addCase(loadSlideNotes, (state) => {
        const storedText = getItem(LS_SLIDE_NOTES_KEY);
        if (storedText !== null) {
          state.text = storedText;
        }
        // If null, the initial state already handled it or it remains empty.
      })
      .addCase(persistSlideNotes, (_state, action) => {
        // Persists the text passed in the action payload (triggered by onBlur).
        setItem(LS_SLIDE_NOTES_KEY, action.payload);
      });
  },
});

// Export the action creators
// Renamed 'setText' export to avoid naming collision if imported directly elsewhere
export const { setText: setSlideNotesText, insertText: insertSlideNotesText } = slideNotesSlice.actions;

// Export the reducer
export default slideNotesSlice.reducer;
