/**
 * @description
 * Redux slice for managing the state of the Meeting Transcript panel.
 * This includes the displayed text, the original text (pre-cleaning),
 * loading/error states for AI cleaning, and the cleaned status.
 * It also handles loading/saving relevant state from/to localStorage.
 *
 * Key features:
 * - Manages 'displayText' (current view) and 'originalText' (backup).
 * - Tracks 'isLoading' state for the AI cleaning operation.
 * - Stores potential 'error' messages from the API.
 * - Maintains 'isCleaned' flag to control the 'Undo' button state.
 * - Provides actions to update these state fields.
 * - Handles persistence of displayText and originalText.
 * - Provides loading actions for initialization.
 *
 * @dependencies
 * - @reduxjs/toolkit: For creating the slice and reducers.
 * - ~/types: Imports the TranscriptState interface for type safety.
 * - ~/utils/localStorage: For interacting with localStorage.
 * - ~/utils/constants: For localStorage key constants.
 *
 * @notes
 * - Persistence is handled within specific actions or via a dedicated persist action.
 * - Initial state loading reads both display and original text from localStorage.
 */

import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import type { TranscriptState } from '~/types';
import { getItem, setItem } from '~/utils/localStorage';
import { LS_TRANSCRIPT_DISPLAY_KEY, LS_TRANSCRIPT_ORIGINAL_KEY } from '~/utils/constants';

/**
 * @description Action creator for triggering the load from localStorage.
 */
export const loadTranscript = createAction('transcript/loadTranscript');
/**
 * @description Action creator for explicitly triggering persistence, e.g., on blur.
 * The payload should contain both displayText and originalText.
 */
export const persistTranscript = createAction<{ displayText: string; originalText: string | null }>('transcript/persistTranscript');

/**
 * @description Initial state for the transcript slice. Tries to load from localStorage immediately.
 */
const initialState: TranscriptState = {
  displayText: getItem(LS_TRANSCRIPT_DISPLAY_KEY) ?? '',
  originalText: getItem(LS_TRANSCRIPT_ORIGINAL_KEY) ?? null, // originalText is nullable
  isCleaned: !!getItem(LS_TRANSCRIPT_ORIGINAL_KEY), // Consider it potentially 'cleaned' if original exists on load
  isLoading: false,
  error: null,
};

/**
 * @description Redux slice definition for transcript state.
 */
export const transcriptSlice = createSlice({
  name: 'transcript',
  initialState,
  reducers: {
    /**
     * @description Sets the displayed text. Should also reset originalText and isCleaned status
     * when called directly due to user typing. Persistence should be triggered separately (e.g., onBlur).
     * @param state - The current transcript state.
     * @param action - Payload contains the new display text string.
     */
    setDisplayText: (state, action: PayloadAction<string>) => {
      state.displayText = action.payload;
      // Reset cleaning status on manual edit ONLY if it was cleaned
      if (state.isCleaned) {
        state.originalText = null; // Clear original only if it was a cleaned state
        state.isCleaned = false;
        // Also persist the clearing of originalText
         setItem(LS_TRANSCRIPT_ORIGINAL_KEY, ''); // Use empty string or handle null appropriately in setItem/getItem
      }
      state.error = null; // Clear previous errors on new input
      // Do NOT persist displayText here, wait for blur/persist action
    },
    /**
     * @description Sets the original transcript text, typically before cleaning. Persists originalText.
     * @param state - The current transcript state.
     * @param action - Payload contains the original text string or null.
     */
    setOriginalText: (state, action: PayloadAction<string | null>) => {
      state.originalText = action.payload;
      setItem(LS_TRANSCRIPT_ORIGINAL_KEY, action.payload ?? ''); // Persist original text change
    },
    /**
     * @description Sets the loading state for the AI cleaning operation.
     * @param state - The current transcript state.
     * @param action - Payload contains a boolean indicating loading status.
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null; // Clear errors when starting to load
      }
    },
    /**
     * @description Sets an error message related to the AI cleaning operation.
     * @param state - The current transcript state.
     * @param action - Payload contains the error message string or null.
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false; // Ensure loading is off if an error occurs
    },
    /**
     * @description Sets the cleaned status flag, typically after a successful clean operation.
     * @param state - The current transcript state.
     * @param action - Payload contains a boolean indicating cleaned status.
     */
    setIsCleaned: (state, action: PayloadAction<boolean>) => {
      state.isCleaned = action.payload;
    },
    /**
     * @description Reverts the displayText to the originalText and clears the cleaned status. Persists changes.
     * This is the 'Undo' operation.
     * @param state - The current transcript state.
     */
    revertToOriginal: (state) => {
      if (state.originalText !== null) {
        state.displayText = state.originalText;
        state.originalText = null;
        state.isCleaned = false;
        state.error = null;
        // Persist changes after undo
        setItem(LS_TRANSCRIPT_DISPLAY_KEY, state.displayText);
        setItem(LS_TRANSCRIPT_ORIGINAL_KEY, ''); // Clear persisted original text
      }
    },
     /**
     * @description Inserts text at a specific position in the displayText. Persists the change.
     * Similar to slideNotesSlice action.
     * @param state - The current transcript state.
     * @param action - Payload contains text to insert and position.
     */
    insertText: (state, action: PayloadAction<{ textToInsert: string; position: number }>) => {
      const { textToInsert, position } = action.payload;
      const currentText = state.displayText;
      const newText =
        currentText.slice(0, position) +
        textToInsert +
        currentText.slice(position);
      state.displayText = newText;
      // Reset cleaning status if inserting manually
      if (state.isCleaned) {
        state.originalText = null;
        state.isCleaned = false;
         setItem(LS_TRANSCRIPT_ORIGINAL_KEY, ''); // Clear persisted original text
      }
       setItem(LS_TRANSCRIPT_DISPLAY_KEY, newText); // Persist after insertion
    },
  },
   extraReducers: (builder) => {
    builder
      .addCase(loadTranscript, (state) => {
        const storedDisplayText = getItem(LS_TRANSCRIPT_DISPLAY_KEY);
        const storedOriginalText = getItem(LS_TRANSCRIPT_ORIGINAL_KEY);

        if (storedDisplayText !== null) {
          state.displayText = storedDisplayText;
        }
        // Ensure originalText is null if the stored value is empty string or null
        state.originalText = storedOriginalText || null;
        // Set isCleaned based on whether originalText was successfully loaded
        state.isCleaned = !!state.originalText;
      })
      .addCase(persistTranscript, (_state, action) => {
        // Persists the text passed in the action payload.
        setItem(LS_TRANSCRIPT_DISPLAY_KEY, action.payload.displayText);
        setItem(LS_TRANSCRIPT_ORIGINAL_KEY, action.payload.originalText ?? '');
      });
  },
});

// Export action creators
export const {
  setDisplayText: setTranscriptDisplayText,
  setOriginalText: setTranscriptOriginalText,
  setLoading: setTranscriptLoading,
  setError: setTranscriptError,
  setIsCleaned: setTranscriptIsCleaned,
  revertToOriginal: revertTranscriptToOriginal,
  insertText: insertTranscriptText,
} = transcriptSlice.actions;

// Export the reducer
export default transcriptSlice.reducer;
