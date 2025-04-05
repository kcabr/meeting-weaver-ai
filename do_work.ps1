# Step 14: Implement Slide/Notes Separator Navigation

# Create/Update src/utils/textUtils.ts
# Here's what I did and why:
# - Added the findNearestSeparatorLine function as specified in the step.
# - Implemented the logic to search upwards and downwards for lines containing exactly the separator.
# - Handles edge cases like searching from the beginning/end and not finding the separator.
# - Returns the starting index of the found line or null.
# - Added JSDoc documentation for the new function.
# - Kept existing functions (copyToClipboard, insertTextAtCursor).
New-Item -ItemType File -Path "src/utils/textUtils.ts" -Force

Set-Content -Path "src/utils/textUtils.ts" -Value @'
/**
 * @description
 * This file provides utility functions for common text manipulations required
 * across the MeetingWeaver AI application. This includes tasks like copying text
 * to the clipboard, inserting text at specific positions, and navigating within
 * text areas based on separators or prefixes.
 *
 * Key features:
 * - Copying text to the clipboard with user feedback.
 * - Inserting text at a given cursor position.
 * - Finding nearest separator/prefix lines for navigation.
 *
 * @dependencies
 * - react-hot-toast: For providing user feedback on clipboard operations.
 *
 * @notes
 * - Functions related to cursor manipulation and navigation will be added in subsequent steps.
 * - Error handling for clipboard operations is included.
 */

// BEGIN WRITING FILE CODE
import toast from 'react-hot-toast';

/**
 * @description Copies the provided text to the user's clipboard using the
 * navigator.clipboard API. Shows toast notifications for success or failure.
 * @param text - The string to be copied to the clipboard.
 * @returns Promise<void> - Resolves when the copy operation is attempted.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    toast.error('Clipboard API not available in this browser.');
    console.error('Clipboard API not supported');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard!');
  } catch (err) {
    toast.error('Failed to copy text to clipboard.');
    console.error('Failed to copy text: ', err);
  }
}

/**
 * @description Inserts text at a specific cursor position within a given string.
 * Calculates the new text content and the expected cursor position after insertion.
 * @param currentText - The original text string.
 * @param textToInsert - The string to insert into the currentText.
 * @param cursorPosition - The index in currentText where insertion should occur.
 *                         If null or undefined, insertion happens at the end.
 * @returns An object containing:
 *          - newText: The resulting string after insertion.
 *          - newCursorPosition: The calculated cursor position immediately after the inserted text.
 */
export function insertTextAtCursor(
  currentText: string,
  textToInsert: string,
  cursorPosition: number | null | undefined
): { newText: string; newCursorPosition: number } {
  // Handle null/undefined cursor position by defaulting to the end of the text
  const position = cursorPosition ?? currentText.length;

  // Ensure position is within valid bounds
  const validPosition = Math.max(0, Math.min(position, currentText.length));

  // Construct the new text string
  const newText =
    currentText.slice(0, validPosition) +
    textToInsert +
    currentText.slice(validPosition);

  // Calculate the new cursor position (end of the inserted text)
  const newCursorPosition = validPosition + textToInsert.length;

  return { newText, newCursorPosition };
}


/**
 * @description Finds the starting index of the nearest line that exactly matches the separator,
 * searching upwards or downwards from the current cursor position.
 * @param text - The text content to search within.
 * @param currentPosition - The starting cursor position index.
 * @param separator - The exact string that constitutes the separator line.
 * @param direction - The direction to search ('up' or 'down').
 * @returns The starting index of the found line, or null if no such line is found.
 */
export function findNearestSeparatorLine(
    text: string,
    currentPosition: number,
    separator: string,
    direction: 'up' | 'down'
): number | null {
    const lines = text.split('\n');
    // Determine the line index the cursor is currently on or before
    let currentLineIndex = text.substring(0, currentPosition).split('\n').length - 1;

    if (direction === 'up') {
        // Search backwards from the line *before* the current one
        for (let i = currentLineIndex - 1; i >= 0; i--) {
            if (lines[i].trim() === separator) { // Check if the line *exactly* matches the separator (ignoring potential whitespace)
                // Calculate the starting index of this line
                let index = 0;
                for (let j = 0; j < i; j++) {
                    index += lines[j].length + 1; // Add line length + 1 for newline character
                }
                return index;
            }
        }
        return null; // No separator found above
    } else { // direction === 'down'
        // Search forwards from the line *after* the current one
        for (let i = currentLineIndex + 1; i < lines.length; i++) {
             if (lines[i].trim() === separator) { // Check if the line *exactly* matches the separator
                // Calculate the starting index of this line
                let index = 0;
                for (let j = 0; j < i; j++) {
                    index += lines[j].length + 1; // Add line length + 1 for newline character
                }
                return index;
            }
        }
        return null; // No separator found below
    }
}


/**
 * @description Finds the index of the nearest line starting with a specific prefix,
 * searching upwards or downwards from the current cursor position.
 * (To be implemented in Step 21)
 * @param text - The text content to search within.
 * @param currentPosition - The starting cursor position index.
 * @param prefix - The prefix string the line must start with.
 * @param direction - The direction to search ('up' or 'down').
 * @returns The starting index of the found line, or null if no such line is found.
 */
// export function findNearestPrefixedLine(text: string, currentPosition: number, prefix: string, direction: 'up' | 'down'): number | null {
//   // Implementation in Step 21
//   return null;
// }

/**
 * @description Triggers a browser download for the given text content.
 * (To be implemented in Step 19)
 * @param text - The text content to save.
 * @param filename - The desired name for the downloaded file.
 */
// export function saveTextToFile(text: string, filename: string): void {
//  // Implementation in Step 19
// }
'@

# Create/Update src/components/SlideNotesPanel.tsx
# Here's what I did and why:
# - Imported the new findNearestSeparatorLine utility function.
# - Implemented the handleNavigateUp and handleNavigateDown functions.
# - These handlers get the current cursor position.
# - They call findNearestSeparatorLine with the current text, position, separator constant, and direction.
# - If a valid position is found, they update the textarea's selection range using the ref to move the cursor.
# - Connected these handlers to the onClick props of the Up and Down arrow buttons.
# - Removed the placeholder console logs from these handlers.
New-Item -ItemType File -Path "src/components/SlideNotesPanel.tsx" -Force

Set-Content -Path "src/components/SlideNotesPanel.tsx" -Value @'
/**
 * @description
 * Renders the left panel dedicated to Slide/Meeting Notes input.
 * Includes a labeled text area and a vertical stack of action buttons.
 * Connects the text area to the Redux store for state management and persists on blur.
 * Implements the "Copy Text", "Add Line", and separator navigation functionalities.
 *
 * Key features:
 * - Displays a labeled multi-line text area for notes input.
 * - Shows action buttons with icons.
 * - Uses Redux ('useAppSelector', 'useAppDispatch') to manage text area content.
 * - Updates Redux state on text area change ('onChange').
 * - Persists text area content to localStorage on blur ('onBlur').
 * - Implements "Copy Text" button functionality using utility function and toast feedback.
 * - Implements "Add Line" button to insert a separator using a Redux action.
 * - Implements Up/Down arrow buttons to navigate between separator lines.
 * - Uses 'useRef' to hold a reference to the textarea element for cursor manipulation.
 *
 * @dependencies
 * - react: For component creation, 'useRef', 'useEffect', 'useState'.
 * - react-redux: For hooks 'useAppSelector', 'useAppDispatch'.
 * - react-hot-toast: For displaying notifications (used via textUtils).
 * - ~/components/ui/label: Shadcn Label component.
 * - ~/components/ui/textarea: Shadcn Textarea component.
 * - ~/components/ui/button: Shadcn Button component.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/slideNotesSlice: Action creators 'setSlideNotesText', 'persistSlideNotes', 'insertSlideNotesText'.
 * - ~/utils/textUtils: Utility functions 'copyToClipboard', 'findNearestSeparatorLine'.
 * - ~/utils/constants: Constants like 'SLIDE_NOTES_SEPARATOR'.
 * - lucide-react: For icons (Image, Copy, ArrowUp, Plus, ArrowDown).
 *
 * @notes
 * - Cursor position setting after 'Add Line' uses a state variable and useEffect for better reliability.
 * - Navigation uses the findNearestSeparatorLine utility to move the cursor.
 */

import React, { useRef, useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import {
  setSlideNotesText,
  persistSlideNotes,
  insertSlideNotesText,
} from "~/store/slices/slideNotesSlice";
import { copyToClipboard, findNearestSeparatorLine } from "~/utils/textUtils"; // Import navigation util
import { SLIDE_NOTES_SEPARATOR } from "~/utils/constants";
import toast from "react-hot-toast";
import {
  Image as ImageIcon,
  Copy as CopyIcon,
  ArrowUp,
  Plus,
  ArrowDown,
} from "lucide-react";

// BEGIN WRITING FILE CODE

export function SlideNotesPanel() {
  const dispatch = useAppDispatch();
  const slideNotesText = useAppSelector((state) => state.slideNotes.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [nextCursorPosition, setNextCursorPosition] = useState<number | null>(
    null
  );

  /**
   * @description Handles changes in the textarea input.
   * Dispatches the 'setSlideNotesText' action to update the Redux store immediately.
   * @param e - The textarea change event.
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setSlideNotesText(e.target.value));
  };

  /**
   * @description Handles the blur event on the textarea.
   * Dispatches the 'persistSlideNotes' action to save the current text to localStorage.
   */
  const handleBlur = () => {
    const currentText = textareaRef.current?.value ?? slideNotesText;
    dispatch(persistSlideNotes(currentText));
  };

  /**
   * @description Handles the click event for the "Copy Text" button.
   * Calls the copyToClipboard utility with the current notes text.
   */
  const handleCopyText = () => {
    copyToClipboard(slideNotesText);
  };

  /**
   * @description Handles the click event for the "Add Line" button.
   * Gets the current cursor position, constructs the separator string,
   * and dispatches the 'insertSlideNotesText' action.
   * Stores the intended cursor position for the useEffect hook.
   */
  const handleAddLine = () => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const textToInsert = `\n\n${SLIDE_NOTES_SEPARATOR}\n\n`;
      const calculatedNextPosition = cursorPosition + textToInsert.length;

      dispatch(
        insertSlideNotesText({ textToInsert, position: cursorPosition })
      );
      setNextCursorPosition(calculatedNextPosition);
    } else {
      console.warn("Textarea ref not available for Add Line action.");
      const textToInsert = `\n\n${SLIDE_NOTES_SEPARATOR}\n\n`;
      const calculatedNextPosition =
        slideNotesText.length + textToInsert.length;
      dispatch(
        insertSlideNotesText({ textToInsert, position: slideNotesText.length })
      );
      setNextCursorPosition(calculatedNextPosition);
    }
  };

  /**
   * @description Effect to set the cursor position after the text state has updated
   * from an insertion action.
   */
  useEffect(() => {
    if (nextCursorPosition !== null && textareaRef.current) {
      if (textareaRef.current.value.length >= nextCursorPosition) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          nextCursorPosition,
          nextCursorPosition
        );
      } else {
        console.warn("Could not set cursor position, text length mismatch.");
      }
      setNextCursorPosition(null);
    }
  }, [slideNotesText, nextCursorPosition]);

  /**
   * @description Handles the click event for the "Navigate Up" button.
   * Finds the nearest separator line above the cursor and moves the cursor there.
   */
  const handleNavigateUp = () => {
    if (textareaRef.current) {
      const currentPosition = textareaRef.current.selectionStart;
      const text = textareaRef.current.value;
      const newPosition = findNearestSeparatorLine(
        text,
        currentPosition,
        SLIDE_NOTES_SEPARATOR,
        'up'
      );

      if (newPosition !== null) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      } else {
        // Optional: Add feedback if no separator is found above
         toast('No separator found above.', { icon: '🤷', duration: 1500 });
      }
    }
  };

  /**
   * @description Handles the click event for the "Navigate Down" button.
   * Finds the nearest separator line below the cursor and moves the cursor there.
   */
  const handleNavigateDown = () => {
      if (textareaRef.current) {
        const currentPosition = textareaRef.current.selectionStart;
        const text = textareaRef.current.value;
        const newPosition = findNearestSeparatorLine(
          text,
          currentPosition,
          SLIDE_NOTES_SEPARATOR,
          'down'
        );

        if (newPosition !== null) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPosition, newPosition);
        } else {
          // Optional: Add feedback if no separator is found below
           toast('No separator found below.', { icon: '🤷', duration: 1500 });
        }
      }
  };

  // Placeholder handler for Image Extract button
  const handleImageExtract = () =>
    console.log("Image Extract clicked (Placeholder)");


  return (
    <div className="flex gap-2 h-full">
      {/* Text Area Section */}
      <div className="flex flex-col flex-grow h-full">
        <Label
          htmlFor="slide-notes-textarea"
          className="mb-2 text-sm font-medium"
        >
          Slide / Meeting Notes Text Area
        </Label>
        <Textarea
          id="slide-notes-textarea"
          ref={textareaRef}
          value={slideNotesText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder="Paste slide content or enter meeting notes here..."
          className="flex-grow resize-none text-sm"
          // Add spellCheck false if desired
          spellCheck={false}
        />
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleImageExtract}
          title="Img-Txt Extract (Modal)"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only">Img-Txt Extract (Modal)</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyText}
          title="Copy Text"
        >
          <CopyIcon className="h-4 w-4" />
          <span className="sr-only">Copy Text</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateUp} // Connect handler
          title="Navigate Up (Separator)"
        >
          <ArrowUp className="h-4 w-4" />
          <span className="sr-only">Up Arrow (↑)</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddLine}
          title="Add Separator Line"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Line</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateDown} // Connect handler
          title="Navigate Down (Separator)"
        >
          <ArrowDown className="h-4 w-4" />
          <span className="sr-only">Down Arrow (↓)</span>
        </Button>
      </div>
    </div>
  );
}
'@

Write-Host "STEP 14 COMPLETE."
Write-Host "Here's what I did and why:"
Write-Host "- Implemented the 'findNearestSeparatorLine' function in 'src/utils/textUtils.ts' to locate the nearest line matching the exact separator string ('##########') above or below the current cursor position."
Write-Host "- Updated 'src/components/SlideNotesPanel.tsx' to connect the Up and Down arrow buttons."
Write-Host "- The button click handlers now use 'findNearestSeparatorLine' and update the textarea's cursor position using 'setSelectionRange' on the textarea's ref."
Write-Host "- Added optional toast feedback for when no separator is found during navigation."

Write-Host "USER INSTRUCTIONS: Please do the following:"
Write-Host "- No manual steps are required for this step."