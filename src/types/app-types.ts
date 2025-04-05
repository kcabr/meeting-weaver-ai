/**
 * @description
 * This file defines the core TypeScript types and interfaces used throughout the MeetingWeaver AI application,
 * particularly for defining the structure of the Redux state slices.
 *
 * Key interfaces:
 * - ContextState: Defines the shape of the project/company context state.
 * - SlideNotesState: Defines the shape of the slide/meeting notes state.
 * - TranscriptState: Defines the shape of the meeting transcript state, including original and cleaned versions.
 * - ModalState: Defines the shape of the state managing the visibility of various modals.
 *
 * @dependencies
 * - None
 *
 * @notes
 * - These interfaces ensure type safety when interacting with the Redux store.
 */

/**
 * @description Represents the state slice for the project and company context.
 */
export interface ContextState {
  /**
   * @description The raw text content entered by the user in the context modal.
   */
  text: string;
}

/**
 * @description Represents the state slice for the slide and meeting notes.
 */
export interface SlideNotesState {
  /**
   * @description The text content of the slide/meeting notes text area.
   */
  text: string;
}

/**
 * @description Represents the state slice for the meeting transcript.
 */
export interface TranscriptState {
  /**
   * @description The currently displayed text in the transcript text area (can be original or cleaned).
   */
  displayText: string;
  /**
   * @description The original transcript text stored before the 'Clean ✨' operation was performed.
   * Null if no cleaning has been done or if 'Undo' was used.
   */
  originalText: string | null;
  /**
   * @description Flag indicating if the 'Clean ✨' operation has been successfully performed
   * since the last manual edit or 'Undo'. Used to enable/disable the 'Undo' button.
   */
  isCleaned: boolean;
  /**
   * @description Flag indicating if the 'Clean ✨' operation (API call) is currently in progress.
   * Used to disable the 'Clean ✨' button.
   */
  isLoading: boolean;
  /**
   * @description Stores any error message resulting from the 'Clean ✨' API call.
   * Null if there is no error.
   */
  error: string | null;
}

/**
 * @description Represents the state slice managing the visibility of all modals in the application.
 */
export interface ModalState {
  /**
   * @description Controls the visibility of the Project & Company Context modal.
   */
  isContextModalOpen: boolean;
  /**
   * @description Controls the visibility of the Image-to-Text Extraction modal.
   */
  isImageExtractModalOpen: boolean;
  /**
   * @description Controls the visibility of the Add Context Line modal for transcripts.
   */
  isAddContextLineModalOpen: boolean;
  /**
   * @description Controls the visibility of the Generate Note Builder Prompt modal.
   */
  isGeneratePromptModalOpen: boolean;
}

