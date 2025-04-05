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
