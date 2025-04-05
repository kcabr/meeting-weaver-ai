/**
 * @description
 * Redux slice for managing the state of the Meeting Transcript panel.
 * This includes the displayed text, the original text (pre-cleaning),
 * loading/error states for AI cleaning, cleaned status, and cursor position.
 * It also handles loading/saving relevant state from/to localStorage.
 *
 * Key features:
 * - Manages 'displayText', 'originalText', 'isLoading', 'error', 'isCleaned', 'lastKnownCursorPosition'.
 * - Provides actions to update these state fields.
 * - Handles persistence of displayText and originalText within relevant actions.
 * - Provides loading actions for initialization.
 *
 * @dependencies
 * - @reduxjs/toolkit: For creating the slice and reducers.
 * - ~/types: Imports the TranscriptState interface for type safety.
 * - ~/utils/localStorage: For interacting with localStorage.
 * - ~/utils/constants: For localStorage key constants.
 * - ~/utils/textUtils: For text insertion utility.
 *
 * @notes
 * - Persistence is handled within specific actions or via the dedicated persistTranscript action.
 * - Initial state loading reads both display and original text.
 * - Reducers like setDisplayText, insertText, and revertToOriginal handle resetting cleaning status and persistence.
 */

import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import type { TranscriptState } from '~/types';
import { getItem, setItem } from '~/utils/localStorage';
import { LS_TRANSCRIPT_DISPLAY_KEY, LS_TRANSCRIPT_ORIGINAL_KEY } from '~/utils/constants';
import { insertTextAtCursor } from '~/utils/textUtils';

// BEGIN WRITING FILE CODE

/**
 * @description Action creator for triggering the load from localStorage.
 */
export const loadTranscript = createAction('transcript/loadTranscript');
/**
 * @description Action creator for explicitly triggering persistence, e.g., on blur.
 * The payload should contain both the current displayText and originalText.
 */
export const persistTranscript = createAction<{ displayText: string; originalText: string | null }>('transcript/persistTranscript');

/**
 * @description Initial state for the transcript slice. Tries to load from localStorage immediately.
 */
const initialState: TranscriptState = {
  displayText: getItem(LS_TRANSCRIPT_DISPLAY_KEY) ?? '',
  originalText: getItem(LS_TRANSCRIPT_ORIGINAL_KEY) || null,
  isCleaned: !!getItem(LS_TRANSCRIPT_ORIGINAL_KEY),
  isLoading: false,
  lastKnownCursorPosition: null,
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
     * @description Sets the displayed text. Resets cleaning status and original text if manually editing after a clean.
     * @param state - Current state.
     * @param action - Payload contains the new display text.
     */
    setDisplayText: (state, action: PayloadAction<string>) => {
      const textChanged = state.displayText !== action.payload;
      state.displayText = action.payload;
      if (state.isCleaned && textChanged) {
        state.originalText = null;
        state.isCleaned = false;
        setItem(LS_TRANSCRIPT_ORIGINAL_KEY, ''); // Persist the reset
      }
      if (textChanged) {
        state.error = null;
      }
      // Display text persistence happens on blur via persistTranscript action
    },
    /**
     * @description Sets the original transcript text backup before cleaning. Persists the backup.
     * @param state - Current state.
     * @param action - Payload contains the original text.
     */
    setOriginalText: (state, action: PayloadAction<string | null>) => {
      state.originalText = action.payload;
      setItem(LS_TRANSCRIPT_ORIGINAL_KEY, action.payload ?? '');
    },
    /**
     * @description Sets the loading state for AI cleaning. Clears errors when starting.
     * @param state - Current state.
     * @param action - Payload contains loading status boolean.
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    /**
     * @description Sets an error message from AI cleaning. Stops loading.
     * @param state - Current state.
     * @param action - Payload contains error message or null.
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false; // Ensure loading stops on error
    },
    /**
     * @description Sets the state after successful AI cleaning. Updates displayText, sets isCleaned, stops loading, clears errors, and persists the new displayText.
     * @param state - Current state.
     * @param action - Payload contains the cleaned text string.
     */
    setCleanedText: (state, action: PayloadAction<string>) => {
      state.displayText = action.payload;
      state.isCleaned = true;
      state.isLoading = false;
      state.error = null;
      setItem(LS_TRANSCRIPT_DISPLAY_KEY, action.payload); // Persist cleaned display text
      // originalText should have been persisted by setOriginalText before this
    },
    /**
     * @description Reverts displayText to originalText (Undo). Clears originalText backup, resets isCleaned, clears error, and persists changes.
     * @param state - Current state.
     */
    revertToOriginal: (state) => {
      if (state.originalText !== null) {
        const revertedText = state.originalText; // Store before clearing
        state.displayText = revertedText;
        state.originalText = null;
        state.isCleaned = false;
        state.error = null;
        // Persist changes after undo
        setItem(LS_TRANSCRIPT_DISPLAY_KEY, revertedText);
        setItem(LS_TRANSCRIPT_ORIGINAL_KEY, ''); // Clear persisted original text
      }
    },
    /**
     * @description Inserts text into displayText. Resets cleaning status and persists changes.
     * @param state - Current state.
     * @param action - Payload contains textToInsert and position.
     */
    insertText: (state, action: PayloadAction<{ textToInsert: string; position: number }>) => {
      const { textToInsert, position } = action.payload;
      const currentText = state.displayText;
      const safePosition = Math.max(0, Math.min(position ?? currentText.length, currentText.length));
      const { newText } = insertTextAtCursor(currentText, textToInsert, safePosition);
      state.displayText = newText;

      if (state.isCleaned) {
        state.originalText = null;
        state.isCleaned = false;
        setItem(LS_TRANSCRIPT_ORIGINAL_KEY, ''); // Clear persisted original text
      }
      setItem(LS_TRANSCRIPT_DISPLAY_KEY, newText); // Persist after insertion
    },
    /**
     * @description Sets the last known cursor position in the transcript textarea.
     * @param state - Current state.
     * @param action - Payload contains the cursor position number or null.
     */
    setLastKnownCursorPosition: (state, action: PayloadAction<number | null>) => {
      state.lastKnownCursorPosition = action.payload;
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
        state.originalText = storedOriginalText || null;
        state.isCleaned = !!state.originalText;
        state.isLoading = false;
        state.error = null;
        state.lastKnownCursorPosition = null; // Reset cursor position on load
      })
      .addCase(persistTranscript, (_state, action) => {
        // This action only saves, triggered by blur.
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
  setCleanedText: setTranscriptCleanedText,
  revertToOriginal: revertTranscriptToOriginal,
  insertText: insertTranscriptText,
  setLastKnownCursorPosition: setTranscriptLastKnownCursorPosition,
} = transcriptSlice.actions;

// Export the reducer
export default transcriptSlice.reducer;
