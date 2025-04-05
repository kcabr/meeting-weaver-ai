/**
 * @description
 * Renders the right panel dedicated to the Meeting Transcript input.
 * Includes a labeled text area and a vertical stack of action buttons.
 * Connects the text area to the Redux store ('transcriptSlice') for state management.
 * Handles 'onChange' to update the displayed text and reset cleaning status.
 * Persists both display and original text to localStorage on blur.
 * Implements "Copy Text", "Save", "Add Context Line", and context line navigation functionalities.
 *
 * Key features:
 * - Displays a labeled multi-line text area for transcript input.
 * - Shows action buttons (Copy, Save, Add Context Line, Navigate Up/Down now functional).
 * - Uses Redux ('useAppSelector', 'useAppDispatch') to manage transcript state.
 * - Updates Redux state on text area change ('onChange').
 * - Persists state to localStorage on blur ('onBlur').
 * - Implements "Copy Text" button using 'copyToClipboard' utility.
 * - Implements "Save" button using 'saveTextToFile' utility.
 * - Implements "Add Context Line" button to save cursor position and open modal.
 * - Implements Up/Down arrow buttons for navigating between lines starting with "## ".
 * - Uses 'useRef' to hold a reference to the textarea element for cursor manipulation.
 *
 * @dependencies
 * - react: For component creation and 'useRef'.
 * - react-redux: For hooks 'useAppSelector', 'useAppDispatch'.
 * - react-hot-toast: For user feedback on navigation.
 * - ~/components/ui/label: Shadcn Label component.
 * - ~/components/ui/textarea: Shadcn Textarea component.
 * - ~/components/ui/button: Shadcn Button component.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/transcriptSlice: Action creators 'setTranscriptDisplayText', 'persistTranscript', 'setTranscriptLastKnownCursorPosition'.
 * - ~/store/slices/modalSlice: Action creator 'openAddContextLineModal'.
 * - ~/utils/textUtils: Utilities 'copyToClipboard', 'saveTextToFile', 'findNearestPrefixedLine'.
 * - ~/utils/constants: Constants like 'TRANSCRIPT_CONTEXT_PREFIX'.
 * - lucide-react: For icons.
 *
 * @notes
 * - Clean, Undo, and Generate Prompt buttons are still placeholders.
 * - Navigation uses the findNearestPrefixedLine utility.
 */
import {
  setTranscriptDisplayText,
  persistTranscript,
  setTranscriptLastKnownCursorPosition, // Import action for cursor position
} from "~/store/slices/transcriptSlice";
import { openAddContextLineModal } from "~/store/slices/modalSlice"; // Import action to open modal
import {
  copyToClipboard,
  saveTextToFile,
  findNearestPrefixedLine,
} from "~/utils/textUtils"; // Import utilities
import { TRANSCRIPT_CONTEXT_PREFIX } from "~/utils/constants"; // Import prefix constant
import {
  Sparkles, // Clean ✨
  Undo2, // Undo
  Save, // Save
  Copy, // Copy Text
  ArrowUp, // Up Arrow
  MessageSquarePlus, // Add Context Line
  ArrowDown, // Down Arrow
  Send, // Generate Note Builder Prompt...
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useRef } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import toast from "react-hot-toast"; // Import toast for navigation feedback

// BEGIN WRITING FILE CODE
export function TranscriptPanel() {
  const dispatch = useAppDispatch();
  const displayText = useAppSelector((state) => state.transcript.displayText);
  const originalText = useAppSelector((state) => state.transcript.originalText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
   * Finds the nearest line above starting with "## " and moves the cursor there.
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
   * Finds the nearest line below starting with "## " and moves the cursor there.
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
   * Saves the current cursor position and opens the modal.
   */
  const handleAddContextLine = () => {
    // Save cursor position before opening modal
    const currentPosition =
      textareaRef.current?.selectionStart ?? displayText.length;
    dispatch(setTranscriptLastKnownCursorPosition(currentPosition));
    dispatch(openAddContextLineModal()); // Dispatch action to open modal
  };

  // Placeholder handlers for other buttons
  const handleClean = () =>
    console.log("Clean button clicked (not implemented)");
  const handleUndo = () => console.log("Undo button clicked (not implemented)");
  const handleGeneratePrompt = () =>
    console.log("Generate Prompt button clicked (not implemented)");

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
          onClick={handleClean}
          title="Clean ✨ Transcript"
          //disabled // Disabled until implemented
        >
          <Sparkles className="h-4 w-4" />
          <span className="sr-only">Clean ✨</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleUndo}
          title="Undo Clean"
          disabled // Disabled until implemented
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
          onClick={handleNavigateUp} // Attach handler
          title="Navigate Up (Context Line)"
          // No longer disabled
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
          onClick={handleNavigateDown} // Attach handler
          title="Navigate Down (Context Line)"
          // No longer disabled
        >
          <ArrowDown className="h-4 w-4" />
          <span className="sr-only">Down Arrow (↓)</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleGeneratePrompt}
          title="Generate Note Builder Prompt..."
          disabled // Disabled until implemented
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Generate Note Builder Prompt...</span>
        </Button>
      </div>
    </div>
  );
}
// END WRITING FILE CODE
