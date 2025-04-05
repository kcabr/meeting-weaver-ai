/**
 * @description
 * Renders the right panel dedicated to the Meeting Transcript input.
 * Includes a labeled text area and a vertical stack of action buttons.
 * Connects the text area to the Redux store ('transcriptSlice') for state management.
 * Handles 'onChange' to update the displayed text and reset cleaning status.
 * Persists both display and original text to localStorage on blur.
 * Implements "Copy Text" and "Save" button functionalities.
 *
 * Key features:
 * - Displays a labeled multi-line text area for transcript input.
 * - Shows action buttons (Copy and Save are now functional).
 * - Uses Redux ('useAppSelector', 'useAppDispatch') to manage transcript state.
 * - Updates Redux state on text area change ('onChange').
 * - Persists state to localStorage on blur ('onBlur').
 * - Implements "Copy Text" button using 'copyToClipboard' utility.
 * - Implements "Save" button using 'saveTextToFile' utility.
 * - Uses 'useRef' to hold a reference to the textarea element.
 *
 * @dependencies
 * - react: For component creation and 'useRef'.
 * - react-redux: For hooks 'useAppSelector', 'useAppDispatch'.
 * - ~/components/ui/label: Shadcn Label component.
 * - ~/components/ui/textarea: Shadcn Textarea component.
 * - ~/components/ui/button: Shadcn Button component.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/transcriptSlice: Action creators 'setTranscriptDisplayText', 'persistTranscript'.
 * - ~/utils/textUtils: Utilities 'copyToClipboard', 'saveTextToFile'.
 * - lucide-react: For icons.
 *
 * @notes
 * - Other button functionalities (Clean, Undo, Navigate, Add Context, Generate) will be implemented in subsequent steps.
 * - Copy and Save buttons are now enabled.
 */
import React, { useRef } from 'react';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { useAppSelector, useAppDispatch } from '~/store/hooks';
import { setTranscriptDisplayText, persistTranscript } from '~/store/slices/transcriptSlice';
import { copyToClipboard, saveTextToFile } from '~/utils/textUtils'; // Import utilities
import {
  Sparkles, // Clean ✨
  Undo2,    // Undo
  Save,     // Save
  Copy,     // Copy Text
  ArrowUp,  // Up Arrow
  MessageSquarePlus, // Add Context Line
  ArrowDown,// Down Arrow
  Send,     // Generate Note Builder Prompt...
} from 'lucide-react';

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
    saveTextToFile(displayText, 'meeting_transcript.txt');
  };

  // Placeholder handlers for other buttons
  const handleClean = () => console.log('Clean button clicked (not implemented)');
  const handleUndo = () => console.log('Undo button clicked (not implemented)');
  const handleNavigateUp = () => console.log('Navigate Up button clicked (not implemented)');
  const handleAddContextLine = () => console.log('Add Context Line button clicked (not implemented)');
  const handleNavigateDown = () => console.log('Navigate Down button clicked (not implemented)');
  const handleGeneratePrompt = () => console.log('Generate Prompt button clicked (not implemented)');

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
          disabled // Disabled until implemented
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
          onClick={handleSave} // Attach handler
          title="Save Transcript"
          // No longer disabled
        >
          <Save className="h-4 w-4" />
          <span className="sr-only">Save</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyText} // Attach handler
          title="Copy Transcript"
          // No longer disabled
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy Text</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateUp}
          title="Navigate Up (Context Line)"
          disabled // Disabled until implemented
        >
          <ArrowUp className="h-4 w-4" />
          <span className="sr-only">Up Arrow (↑)</span>
        </Button>
         <Button
          variant="outline"
          size="icon"
          onClick={handleAddContextLine}
          title="Add Context Line (Modal)"
          disabled // Disabled until implemented
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span className="sr-only">Add Context Line (Modal)</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateDown}
          title="Navigate Down (Context Line)"
          disabled // Disabled until implemented
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
