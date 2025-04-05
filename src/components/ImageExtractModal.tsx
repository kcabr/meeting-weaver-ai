/**
 * @description
 * Renders the modal dialog for extracting text from a pasted image.
 * Handles image pasting, calls an external extraction function, displays results,
 * and allows adding the extracted text (with separator) to the Slide Notes panel
 * at the previously stored cursor position.
 *
 * Key features:
 * - Controlled by 'isImageExtractModalOpen' state.
 * - Handles image pasting via 'onPaste'.
 * - Calls 'extractTextFromImage' utility.
 * - Manages local state for loading status, extracted text, and errors.
 * - Displays loading indicators and error messages.
 * - Uses 'react-hot-toast' for error notifications.
 * - "Add" button inserts extracted text + separator into slide notes at the stored cursor position.
 * - Resets local state on close.
 *
 * @dependencies
 * - react: For component creation and hooks (useState, useCallback).
 * - react-redux: For accessing Redux state (useAppSelector) and dispatching actions (useAppDispatch).
 * - react-hot-toast: For displaying notifications.
 * - ~/components/ui/*: Shadcn UI components (Dialog, Label, Textarea, Button).
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/modalSlice: Action 'closeImageExtractModal'.
 * - ~/store/slices/slideNotesSlice: Action 'insertSlideNotesText'.
 * - ~/utils/imageExtractor: The function (placeholder or real) to call for OCR.
 * - ~/utils/constants: Constant 'SLIDE_NOTES_SEPARATOR'.
 * - lucide-react: For 'Loader2' icon.
 *
 * @notes
 * - The actual image extraction logic resides in 'utils/imageExtractor.ts'.
 * - Cursor position for insertion is retrieved from Redux state ('slideNotes.lastKnownCursorPosition').
 */
import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { closeImageExtractModal } from "~/store/slices/modalSlice";
import { insertSlideNotesText } from "~/store/slices/slideNotesSlice";
import { extractTextFromImage } from "~/utils/imageExtractor"; // Import the extractor function
import { SLIDE_NOTES_SEPARATOR } from "~/utils/constants"; // Import separator constant
import { Loader2 } from "lucide-react"; // Import Loader icon
import toast from "react-hot-toast"; // Import toast

// BEGIN WRITING FILE CODE
export function ImageExtractModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.modals.isImageExtractModalOpen
  );
  // Get the cursor position stored in Redux state
  const lastKnownCursorPosition = useAppSelector(
    (state) => state.slideNotes.lastKnownCursorPosition
  );
  // Fallback position if Redux state is null (e.g., append to end)
  const slideNotesLength = useAppSelector(
    (state) => state.slideNotes.text.length
  );

  // Local state for managing extracted text, loading, and errors
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * @description Resets local state variables.
   */
  const resetLocalState = useCallback(() => {
    setExtractedText("");
    setIsLoading(false);
    setError(null);
  }, []);

  /**
   * @description Handles the closing of the dialog, dispatched via onOpenChange or Cancel button.
   * Also resets the local component state.
   */
  const handleClose = useCallback(() => {
    dispatch(closeImageExtractModal());
    resetLocalState();
  }, [dispatch, resetLocalState]);

  /**
   * @description Processes an image file: calls extraction and updates state.
   * @param imageFile - The image file blob to process.
   */
  const processImage = useCallback(async (imageFile: Blob) => {
    setIsLoading(true);
    setError(null);
    setExtractedText(""); // Clear previous text
    try {
      const text = await extractTextFromImage(imageFile);
      setExtractedText(text);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error extracting text.";
      setError(errorMessage);
      toast.error(`Image Extraction Failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * @description Handles the paste event on the designated paste area.
   * Checks for image data in the clipboard and initiates processing.
   * @param e - The React ClipboardEvent.
   */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      setError(null); // Clear previous errors on new paste
      const items = e.clipboardData.items;
      let imageFound = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            imageFound = true;
            processImage(file);
            break; // Process only the first image found
          }
        }
      }
      if (!imageFound) {
        setError("No image found in clipboard data.");
        toast.error("Paste operation didn't contain a recognizable image.");
      }
    },
    [processImage]
  );

  /**
   * @description Handles the "Add" button click.
   * Constructs the text to insert (extracted text + separator) and dispatches
   * the 'insertSlideNotesText' action with the correct position from Redux state.
   */
  const handleAddText = () => {
    if (!extractedText.trim()) {
      toast.error("No extracted text to add.");
      return;
    }

    // Use the stored cursor position, fallback to end of text if null
    const position = lastKnownCursorPosition ?? slideNotesLength;

    // Construct the text to insert, ensuring separators are added correctly
    const textToInsert = `${extractedText.trim()}\n\n${SLIDE_NOTES_SEPARATOR}\n\n`;

    // Dispatch action to insert text into the slide notes
    dispatch(insertSlideNotesText({ textToInsert, position }));

    handleClose(); // Close modal after adding
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Image-to-Text Extraction</DialogTitle>
          <DialogDescription>
            Paste an image below to extract text. Review the extracted text
            before adding it to your notes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Paste Area */}
          <div className="grid gap-2">
            <Label htmlFor="paste-area">Paste Image Here</Label>
            <div
              id="paste-area"
              className="border-2 border-dashed rounded-md p-4 text-center min-h-[100px] flex items-center justify-center text-muted-foreground bg-secondary/30 cursor-copy focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onPaste={handlePaste} // Attach paste handler
              tabIndex={0} // Make it focusable for paste
              role="button"
              aria-label="Paste image area"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Processing image...</span>
                </div>
              ) : error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                "Paste Image Here" // Keep simple instructions
              )}
            </div>
          </div>

          {/* Review Area */}
          <div className="grid gap-2">
            <Label htmlFor="extracted-text-review">
              Extracted Text (Review)
            </Label>
            <Textarea
              id="extracted-text-review"
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)} // Allow editing of extracted text
              placeholder="Extracted text will appear here..."
              className="min-h-[200px] resize-y bg-background" // Use standard background
              aria-live="polite" // Announce changes for screen readers
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddText}
            disabled={isLoading || !extractedText.trim()} // Disable if loading or no text
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add to Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
