/**
 * @description
 * Custom hook to manage the state and logic for the transcript cleaning feature.
 * Encapsulates the API call to 'cleanTranscript', updates Redux state for loading,
 * error handling, and setting the original/cleaned text.
 *
 * Key features:
 * - Provides a 'cleanTranscriptHandler' function to trigger the cleaning process.
 * - Uses 'useAppDispatch' and 'useAppSelector' to interact with the Redux store.
 * - Dispatches actions to manage loading, error, original text, and cleaned text states.
 * - Shows toast notifications for API errors.
 *
 * @dependencies
 * - react: For hook creation (useCallback).
 * - react-redux: For hooks 'useAppDispatch', 'useAppSelector'.
 * - react-hot-toast: For error notifications.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/transcriptSlice: Action creators for setting loading, error, original text, and cleaned text.
 * - ~/utils/apiClient: The 'cleanTranscript' API function.
 *
 * @returns An object containing the 'cleanTranscriptHandler' function.
 */

// BEGIN WRITING FILE CODE
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  setTranscriptLoading,
  setTranscriptError,
  setTranscriptOriginalText,
  setTranscriptCleanedText,
} from "~/store/slices/transcriptSlice";
import { cleanTranscript as callCleanTranscriptApi } from "~/utils/apiClient";

/**
 * @description Custom hook providing logic for the transcript cleaning feature.
 * @returns An object with a 'cleanTranscriptHandler' function.
 */
export function useTranscriptCleaner() {
  const dispatch = useAppDispatch();
  // Get the current display text from the store to send to the API
  const currentDisplayText = useAppSelector(
    (state) => state.transcript.displayText
  );

  /**
   * @description Asynchronous function to handle the transcript cleaning process.
   * It dispatches state updates for loading, sets the original text backup,
   * calls the API, and updates the state with the result or error.
   */
  const cleanTranscriptHandler = useCallback(async () => {
    // Prevent cleaning if text is empty
    if (!currentDisplayText.trim()) {
      toast.error("Transcript is empty, nothing to clean.");
      return;
    }

    dispatch(setTranscriptLoading(true)); // Start loading state
    dispatch(setTranscriptOriginalText(currentDisplayText)); // Backup current text

    try {
      const cleanedText = await callCleanTranscriptApi(currentDisplayText);
      // Dispatch action to update state with cleaned text and set flags
      dispatch(setTranscriptCleanedText(cleanedText));
      toast.success("Transcript cleaned successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Transcript cleaning failed.";
      dispatch(setTranscriptError(errorMessage)); // Set error state
      toast.error(errorMessage);
      // No need to explicitly set loading false here, setError reducer handles it
    }
    // setLoading(false) is handled implicitly by setTranscriptCleanedText and setTranscriptError reducers
  }, [currentDisplayText, dispatch]);

  return { cleanTranscriptHandler };
}
// END WRITING FILE CODE
