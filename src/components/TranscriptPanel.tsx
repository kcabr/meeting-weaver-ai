/**
 * @description
 * Renders the right panel dedicated to the Meeting Transcript input.
 * Includes a labeled text area and a vertical stack of action buttons.
 * Connects the text area to the Redux store ('transcriptSlice') for state management.
 * Handles 'onChange' to update the displayed text and reset cleaning status.
 * Persists both display and original text to localStorage on blur.
 * Implements "Copy Text", "Save", "Add Context Line", context line navigation,
 * AI cleaning ('Clean ✨'), and 'Undo' functionalities.
 * Enables the "Generate Note Builder Prompt..." button when all inputs have text.
 *
 * Key features:
 * - Displays a labeled multi-line text area for transcript input.
 * - Shows action buttons with icons and tooltips.
 * - Uses Redux ('useAppSelector', 'useAppDispatch') to manage transcript state.
 * - Updates Redux state on text area change ('onChange').
 * - Persists state to localStorage on blur ('onBlur').
 * - Implements "Copy Text" using 'copyToClipboard' utility.
 * - Implements "Save" using 'saveTextToFile' utility.
 * - Implements "Add Context Line" button to save cursor position and open modal.
 * - Implements Up/Down arrow buttons for navigating context lines ("## ").
 * - Implements "Clean ✨" button using 'useTranscriptCleaner' hook.
 * - Implements "Undo" button by dispatching 'revertTranscriptToOriginal'. Includes success toast.
 * - Implements enablement logic for the "Generate Note Builder Prompt..." button.
 * - Uses 'useRef' for the textarea element.
 *
 * @dependencies
 * - react: For component creation and 'useRef'.
 * - react-redux: For hooks 'useAppSelector', 'useAppDispatch'.
 * - react-hot-toast: For user feedback.
 * - ~/components/ui/*: Shadcn components (Label, Textarea, Button).
 * - ~/hooks/useTranscriptCleaner: Hook for AI cleaning logic.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/transcriptSlice: Actions and selectors for transcript state.
 * - ~/store/slices/modalSlice: Action creators 'openAddContextLineModal', 'openGeneratePromptModal'.
 * - ~/store/slices/contextSlice: Selector for context text.
 * - ~/store/slices/slideNotesSlice: Selector for slide notes text.
 * - ~/utils/textUtils: Utility functions for text manipulation and navigation.
 * - ~/utils/constants: Constants like 'TRANSCRIPT_CONTEXT_PREFIX'.
 * - lucide-react: For icons.
 *
 * @notes
 * - Generate Prompt button now opens the modal and has enablement logic.
 * - Button disabling logic is implemented for Clean and Undo.
 * - Added success toast for Undo action.
 */
import {
  setTranscriptDisplayText,
  persistTranscript,
  setTranscriptLastKnownCursorPosition,
  revertTranscriptToOriginal, // Import Undo action
} from "~/store/slices/transcriptSlice";
import {
  openAddContextLineModal,
  openGeneratePromptModal, // Import action to open Generate Prompt modal
} from "~/store/slices/modalSlice";
import {
  copyToClipboard,
  saveTextToFile,
  findNearestPrefixedLine,
} from "~/utils/textUtils";
import { TRANSCRIPT_CONTEXT_PREFIX } from "~/utils/constants";
import {
  Sparkles,
  Undo2,
  Save,
  Copy,
  ArrowUp,
  MessageSquarePlus,
  ArrowDown,
  Send,
  Loader2, // Import Loader2 for Clean button
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useRef } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useTranscriptCleaner } from "~/hooks/useTranscriptCleaner"; // Import the hook

// BEGIN WRITING FILE CODE
export function TranscriptPanel() {
  const dispatch = useAppDispatch();
  const {
    displayText,
    originalText,
    isLoading,
    isCleaned,
  } = useAppSelector((state) => state.transcript);
  // Selectors for enablement logic
  const contextText = useAppSelector((state) => state.context.text);
  const slideNotesText = useAppSelector((state) => state.slideNotes.text);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { cleanTranscriptHandler } = useTranscriptCleaner(); // Use the hook

  /**
   * @description Determines if the Generate Prompt button should be enabled.
   * Checks if all three input areas (context, slide notes, transcript) contain non-whitespace text.
   */
  const isGenerateButtonEnabled =
    contextText.trim().length > 0 &&
    slideNotesText.trim().length > 0 &&
    displayText.trim().length > 0;

  /**
   * @description Handles changes in the textarea input.
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setTranscriptDisplayText(e.target.value));
  };

  /**
   * @description Handles the blur event on the textarea.
   */
  const handleBlur = () => {
    dispatch(persistTranscript({ displayText, originalText }));
  };

  /**
   * @description Handles the click event for the "Copy Text" button.
   */
  const handleCopyText = () => {
    copyToClipboard(displayText);
  };

  /**
   * @description Handles the click event for the "Save" button.
   */
  const handleSave = () => {
    saveTextToFile(displayText, "meeting_transcript.txt");
  };

  /**
   * @description Handles the click event for the "Navigate Up" (Context Line) button.
   */
  const handleNavigateUp = () => {
    if (textareaRef.current) {
      const currentPosition = textareaRef.current.selectionStart;
      const text = textareaRef.current.value;
      const newPosition = findNearestPrefixedLine(
        text,
        currentPosition,
        TRANSCRIPT_CONTEXT_PREFIX,
        "up"
      );

      if (newPosition !== null) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      } else {
        toast("No context line (##) found above.", {
          icon: "🤷",
          duration: 1500,
        });
      }
    }
  };

  /**
   * @description Handles the click event for the "Navigate Down" (Context Line) button.
   */
  const handleNavigateDown = () => {
    if (textareaRef.current) {
      const currentPosition = textareaRef.current.selectionStart;
      const text = textareaRef.current.value;
      const newPosition = findNearestPrefixedLine(
        text,
        currentPosition,
        TRANSCRIPT_CONTEXT_PREFIX,
        "down"
      );

      if (newPosition !== null) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      } else {
        toast("No context line (##) found below.", {
          icon: "🤷",
          duration: 1500,
        });
      }
    }
  };

  /**
   * @description Handles the click event for the "Add Context Line (Modal)" button.
   */
  const handleAddContextLine = () => {
    const currentPosition =
      textareaRef.current?.selectionStart ?? displayText.length;
    dispatch(setTranscriptLastKnownCursorPosition(currentPosition));
    dispatch(openAddContextLineModal());
  };

  /**
   * @description Handles the click event for the "Clean ✨" button.
   * Uses the handler from the useTranscriptCleaner hook.
   */
  const handleClean = () => {
    cleanTranscriptHandler();
  };

  /**
   * @description Handles the click event for the "Undo" button.
   * Dispatches the action to revert to the original text and shows a success toast.
   */
  const handleUndo = () => {
    dispatch(revertTranscriptToOriginal());
    toast.success("Reverted to original transcript."); // Added success toast
  };

  /**
   * @description Handles the click event for the "Generate Note Builder Prompt..." button.
   * Dispatches the action to open the modal.
   */
  const handleGeneratePrompt = () => {
    dispatch(openGeneratePromptModal());
  };

  return (
    <div className="flex gap-2 h-full">
      {/* Text Area Section */}
      <div className="flex flex-col flex-grow h-full">
        <Label
          htmlFor="transcript-textarea"
          className="mb-2 text-sm font-medium"
        >
          Meeting Transcript Text Area
        </Label>
        <Textarea
          id="transcript-textarea"
          ref={textareaRef}
          value={displayText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder="Paste or type the meeting transcript here..."
          className="flex-grow resize-none text-sm"
          spellCheck={false}
        />
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleClean} // Connect to handler
          title="Clean ✨ Transcript (AI)"
          disabled={isLoading} // Disable while loading
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span className="sr-only">Clean ✨</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleUndo} // Connect to handler
          title="Undo Clean"
          disabled={!isCleaned || isLoading} // Disable if not cleaned or if loading
        >
          <Undo2 className="h-4 w-4" />
          <span className="sr-only">Undo</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleSave}
          title="Save Transcript"
        >
          <Save className="h-4 w-4" />
          <span className="sr-only">Save</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyText}
          title="Copy Transcript"
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy Text</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateUp}
          title="Navigate Up (Context Line)"
        >
          <ArrowUp className="h-4 w-4" />
          <span className="sr-only">Up Arrow (↑)</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddContextLine}
          title="Add Context Line (Modal)"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span className="sr-only">Add Context Line (Modal)</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateDown}
          title="Navigate Down (Context Line)"
        >
          <ArrowDown className="h-4 w-4" />
          <span className="sr-only">Down Arrow (↓)</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleGeneratePrompt}
          title="Generate Note Builder Prompt..."
          disabled={!isGenerateButtonEnabled} // Enable/disable based on content
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Generate Note Builder Prompt...</span>
        </Button>
      </div>
    </div>
  );
}
// END WRITING FILE CODE
