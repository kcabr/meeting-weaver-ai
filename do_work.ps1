# Step 20: Implement Add Context Line Modal

# Create the AddContextLineModal component file
$addContextLineModalPath = "src/components/AddContextLineModal.tsx"
New-Item -ItemType File -Path $addContextLineModalPath -Force

# Generate content for AddContextLineModal.tsx
Set-Content -Path $addContextLineModalPath -Value @'
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

'@

# Modify TranscriptPanel.tsx to connect the button
$transcriptPanelPath = "src/components/TranscriptPanel.tsx"
$transcriptPanelContent = Get-Content -Path $transcriptPanelPath -Raw

# Define the updated onClick handler for the Add Context Line button
$newAddContextLineHandler = @'
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
'@

# Define the pattern to find the placeholder handler
$placeholderHandlerPattern = [regex]'(?s)(const handleAddContextLine = \(\) => console\.log\(''.*?''\);)'
# Define the pattern to find the disabled prop on the Add Context Line button
$disabledButtonPattern = [regex]'(<Button\s+variant="outline"\s+size="icon"\s+onClick={handleAddContextLine}\s+title="Add Context Line \(Modal\)"\s+)disabled(\s*// Disabled until implemented\s*>\s*<MessageSquarePlus className="h-4 w-4" />)'

# Replace the placeholder handler
$transcriptPanelContent = $placeholderHandlerPattern.Replace($transcriptPanelContent, $newAddContextLineHandler, 1)
# Remove the disabled prop from the button
$transcriptPanelContent = $disabledButtonPattern.Replace($transcriptPanelContent, '$1$2', 1)

# Add imports for the new actions
$importsToAdd = @'
import {
  setTranscriptDisplayText,
  persistTranscript,
  setTranscriptLastKnownCursorPosition, // Import action for cursor position
} from '~/store/slices/transcriptSlice';
import { openAddContextLineModal } from '~/store/slices/modalSlice'; // Import action to open modal
import { copyToClipboard, saveTextToFile } from '~/utils/textUtils'; // Import utilities
'@
$importPattern = [regex]'(?s)(import .*? from ''~/store/slices/transcriptSlice'';\s*)(import .*? from ''~/utils/textUtils'';)'
$transcriptPanelContent = $importPattern.Replace($transcriptPanelContent, $importsToAdd, 1)


# Update the entire file content
Set-Content -Path $transcriptPanelPath -Value $transcriptPanelContent

# Modify transcriptSlice.ts to add lastKnownCursorPosition
$transcriptSlicePath = "src/store/slices/transcriptSlice.ts"
$transcriptSliceContent = Get-Content -Path $transcriptSlicePath -Raw

# Add lastKnownCursorPosition to the initial state
$initialStatePattern = [regex]'(const initialState: TranscriptState = \{[\s\S]*?)(error: null,\s*\};)'
$newInitialState = @'
$1  lastKnownCursorPosition: null, // Add cursor position state
  error: null,
};
'@
$transcriptSliceContent = $initialStatePattern.Replace($transcriptSliceContent, $newInitialState, 1)

# Add the setLastKnownCursorPosition reducer
$reducersPattern = [regex]'(reducers: \{[\s\S]*?)(},)\s*extraReducers:'
$newReducer = @'
$1    /**
     * @description Sets the last known cursor position in the transcript textarea.
     * @param state - The current transcript state.
     * @param action - Payload contains the cursor position number or null.
     */
    setLastKnownCursorPosition: (state, action: PayloadAction<number | null>) => {
      state.lastKnownCursorPosition = action.payload;
    },
$2
  extraReducers:
'@
$transcriptSliceContent = $reducersPattern.Replace($transcriptSliceContent, $newReducer, 1)

# Add the action export
$exportsPattern = [regex]'(export const \{[\s\S]*?revertToOriginal: revertTranscriptToOriginal,\s*)(insertText: insertTranscriptText,\s*\})'
$newExports = @'
$1  insertText: insertTranscriptText,
  setLastKnownCursorPosition: setTranscriptLastKnownCursorPosition, // Export new action
}
'@
$transcriptSliceContent = $exportsPattern.Replace($transcriptSliceContent, $newExports, 1)

# Update the loadTranscript extra reducer to reset cursor position
$loadTranscriptPattern = [regex]'(builder\s*\.addCase\(loadTranscript, \(state\) => \{[\s\S]*?state\.error = null;\s*)(\});)'
$newLoadTranscriptReducer = @'
$1      state.lastKnownCursorPosition = null; // Reset cursor position on load
    });
'@
$transcriptSliceContent = $loadTranscriptPattern.Replace($transcriptSliceContent, $newLoadTranscriptReducer, 1)

# Update the entire file content
Set-Content -Path $transcriptSlicePath -Value $transcriptSliceContent

# Modify app-types.ts to add lastKnownCursorPosition to TranscriptState
$appTypesPath = "src/types/app-types.ts"
$appTypesContent = Get-Content -Path $appTypesPath -Raw

# Add lastKnownCursorPosition to TranscriptState interface
$transcriptStatePattern = [regex]'(export interface TranscriptState \{[\s\S]*?error: string \| null;\s*)(\})'
$newTranscriptState = @'
$1  /**
   * @description Stores the cursor position from the TranscriptPanel textarea
   * right before the AddContextLineModal is opened. Used to insert the
   * context line at the correct position. Null if not set.
   */
  lastKnownCursorPosition: number | null;
}
'@
$appTypesContent = $transcriptStatePattern.Replace($appTypesContent, $newTranscriptState, 1)

# Update the entire file content
Set-Content -Path $appTypesPath -Value $appTypesContent

# Modify AppLayout.tsx to include the new modal
$appLayoutPath = "src/components/AppLayout.tsx"
$appLayoutContent = Get-Content -Path $appLayoutPath -Raw

# Add import for AddContextLineModal
$importPatternAppLayout = [regex]'(import \{ ImageExtractModal \} from "./ImageExtractModal";)'
$newImportAppLayout = @'
$1 // Import the new modal
import { AddContextLineModal } from "./AddContextLineModal";
'@
$appLayoutContent = $importPatternAppLayout.Replace($appLayoutContent, $newImportAppLayout, 1)

# Add the AddContextLineModal component render
$modalRenderPattern = [regex]'(<ImageExtractModal />)'
$newModalRender = @'
$1 {/* Add the AddContextLineModal here */}
      <AddContextLineModal />
'@
$appLayoutContent = $modalRenderPattern.Replace($appLayoutContent, $newModalRender, 1)

# Update the entire file content
Set-Content -Path $appLayoutPath -Value $appLayoutContent

Write-Host "STEP 20 COMPLETE: Implemented Add Context Line Modal."