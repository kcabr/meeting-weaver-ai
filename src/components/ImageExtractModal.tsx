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
 * - Uses 'react-hot-toast' for error and success notifications.
 * - "Add" button inserts extracted text + separator into slide notes at the stored cursor position.
 * - Resets local state on close.
 * - Adjusted modal width and textarea height.
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
import { extractTextFromImage } from "~/utils/imageExtractor";
import { SLIDE_NOTES_SEPARATOR } from "~/utils/constants";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// BEGIN WRITING FILE CODE
export function ImageExtractModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.modals.isImageExtractModalOpen
  );
  const lastKnownCursorPosition = useAppSelector(
    (state) => state.slideNotes.lastKnownCursorPosition
  );
  const slideNotesLength = useAppSelector(
    (state) => state.slideNotes.text.length
  );

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
   * @description Handles the closing of the dialog.
   */
  const handleClose = useCallback(() => {
    dispatch(closeImageExtractModal());
    resetLocalState();
  }, [dispatch, resetLocalState]);

  /**
   * @description Processes an image file.
   */
  const processImage = useCallback(async (imageFile: Blob) => {
    setIsLoading(true);
    setError(null);
    setExtractedText("");
    try {
      const text = await extractTextFromImage(imageFile);
      setExtractedText(text);
      toast.success("Image text extracted successfully!");
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
   */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      setError(null);
      const items = e.clipboardData.items;
      let imageFound = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            imageFound = true;
            processImage(file);
            break;
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
   */
  const handleAddText = () => {
    if (!extractedText.trim()) {
      toast.error("No extracted text to add.");
      return;
    }
    const position = lastKnownCursorPosition ?? slideNotesLength;
    // Ensure separator is added with correct newlines
    const textToInsert = `${extractedText.trim()}\n${SLIDE_NOTES_SEPARATOR}\n`;

    dispatch(insertSlideNotesText({ textToInsert, position }));
    toast.success("Extracted text added to notes.");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      {/* Adjusted width */}
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Image-to-Text Extraction</DialogTitle>
          <DialogDescription>
            Paste an image below to extract text. Review the extracted text
            before adding it to your notes.
          </DialogDescription>
        </DialogHeader>

        {/* Added flex-grow */}
        <div className="grid gap-4 py-4 flex-grow">
          {/* Paste Area */}
          <div className="grid gap-2">
            <Label htmlFor="paste-area">Paste Image Here</Label>
            <div
              id="paste-area"
              className="border-2 border-dashed rounded-md p-4 text-center min-h-[100px] flex items-center justify-center text-muted-foreground bg-secondary/30 cursor-copy focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onPaste={handlePaste}
              tabIndex={0}
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
                "Paste Image Here"
              )}
            </div>
          </div>

          {/* Review Area */}
          <div className="grid gap-2 flex-grow"> {/* Added flex-grow */}
            <Label htmlFor="extracted-text-review">
              Extracted Text (Review)
            </Label>
            <Textarea
              id="extracted-text-review"
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Extracted text will appear here..."
              // Adjusted height
              className="min-h-[200px] h-full resize-y bg-background"
              aria-live="polite"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddText}
            disabled={isLoading || !extractedText.trim()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add to Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
