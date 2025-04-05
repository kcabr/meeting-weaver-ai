/**
 * @description
 * Renders the modal dialog for adding a formatted context line to the transcript.
 * Allows the user to input text, which is then formatted and inserted into the
 * transcript text area at the last known cursor position.
 *
 * Key features:
 * - Controlled by 'isAddContextLineModalOpen' state from modalSlice.
 * - Contains an Input field for user-provided context text.
 * - "Add" button inserts the formatted string "\n## [User Input] ##########\n"
 *   into the transcript using the 'insertTranscriptText' action.
 * - Uses the 'lastKnownCursorPosition' from transcriptSlice to determine insertion point.
 * - Resets local input state when the modal closes.
 *
 * @dependencies
 * - react: For component creation and hooks (useState, useCallback).
 * - react-redux: For accessing Redux state and dispatching actions (useAppSelector, useAppDispatch).
 * - ~/components/ui/*: Shadcn UI components (Dialog, Label, Input, Button).
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/modalSlice: Action 'closeAddContextLineModal'.
 * - ~/store/slices/transcriptSlice: Action 'insertTranscriptText', selector for cursor position.
 * - ~/utils/constants: Constant 'SLIDE_NOTES_SEPARATOR'.
 * - lucide-react: For Loader2 icon (optional for future async ops).
 *
 * @notes
 * - Assumes 'lastKnownCursorPosition' is set in 'transcriptSlice' before this modal opens.
 * - The formatting `## [User Input] ##########` includes the standard separator.
 */

import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { closeAddContextLineModal } from "~/store/slices/modalSlice";
import { insertTranscriptText } from "~/store/slices/transcriptSlice";
import { SLIDE_NOTES_SEPARATOR } from "~/utils/constants";
// import { Loader2 } from 'lucide-react'; // Keep for potential future use

// BEGIN WRITING FILE CODE
export function AddContextLineModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.modals.isAddContextLineModalOpen
  );
  // Retrieve last known cursor position from transcript state
  const lastKnownCursorPosition = useAppSelector(
    (state) => state.transcript.lastKnownCursorPosition
  );
  const transcriptLength = useAppSelector(
    (state) => state.transcript.displayText.length
  );

  // Local state for the input field
  const [contextText, setContextText] = useState("");

  /**
   * @description Resets the local input state.
   */
  const resetLocalState = useCallback(() => {
    setContextText("");
  }, []);

  /**
   * @description Handles closing the dialog and resetting state.
   */
  const handleClose = useCallback(() => {
    dispatch(closeAddContextLineModal());
    resetLocalState();
  }, [dispatch, resetLocalState]);

  /**
   * @description Handles the change event for the input field.
   * @param e - The React ChangeEvent for the input element.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContextText(e.target.value);
  };

  /**
   * @description Handles the "Add" button click.
   * Constructs the formatted context string and dispatches the insertion action.
   */
  const handleAddContext = () => {
    if (!contextText.trim()) {
      // Optionally add validation/toast message here
      return;
    }

    // Determine insertion position, default to end if null
    const position = lastKnownCursorPosition ?? transcriptLength;

    // Construct the string to insert
    const textToInsert = `\n\n## [${contextText.trim()}] ${SLIDE_NOTES_SEPARATOR}\n\n`;

    // Dispatch the action to insert text into the transcript
    dispatch(insertTranscriptText({ textToInsert, position }));

    handleClose(); // Close the modal after adding
  };

  // Reset local state if the modal is closed externally
  useEffect(() => {
    if (!isOpen) {
      resetLocalState();
    }
  }, [isOpen, resetLocalState]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transcript Context Line</DialogTitle>
          <DialogDescription>
            Enter the context text you want to add. It will be formatted and
            inserted into the transcript at the current cursor position.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="context-input" className="text-right col-span-1">
              Context
            </Label>
            <Input
              id="context-input"
              value={contextText}
              onChange={handleInputChange}
              placeholder="Enter context text..."
              className="col-span-3"
              aria-label="Context text input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddContext}
            disabled={!contextText.trim()} // Disable if input is empty
          >
            Add Context Line
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

