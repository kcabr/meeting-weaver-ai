/**
 * @description
 * Renders the modal dialog for displaying the final generated prompt.
 * It fetches the required text content from Redux, constructs the prompt using
 * a template, displays it in a read-only textarea, and provides a button to copy the prompt.
 *
 * Key features:
 * - Controlled by 'isGeneratePromptModalOpen' state from modalSlice.
 * - Fetches context, slide notes, and transcript text from Redux using 'useAppSelector'.
 * - Constructs the final prompt using 'PROMPT_TEMPLATE' and replacing placeholders.
 * - Uses 'useMemo' to efficiently compute the prompt string.
 * - Displays the generated prompt in a read-only Textarea.
 * - Provides a "Copy to Clipboard" button using the 'copyToClipboard' utility.
 * - Adjusted modal width and textarea height.
 *
 * @dependencies
 * - react: For component creation and hooks (useRef, useMemo).
 * - react-redux: For accessing Redux state (useAppSelector) and dispatching actions (useAppDispatch).
 * - react-hot-toast: Used indirectly via 'copyToClipboard'.
 * - ~/components/ui/*: Shadcn UI components (Dialog, Textarea, Button).
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/modalSlice: Action 'closeGeneratePromptModal'.
 * - ~/store/slices/contextSlice: Selector for context text.
 * - ~/store/slices/slideNotesSlice: Selector for slide notes text.
 * - ~/store/slices/transcriptSlice: Selector for transcript display text.
 * - ~/utils/textUtils: Utility function 'copyToClipboard'.
 * - ~/utils/constants: Constant 'PROMPT_TEMPLATE'.
 * - lucide-react: For 'Copy' icon.
 *
 * @notes
 * - The prompt generation logic uses 'useMemo' and Redux selectors.
 * - Copy functionality calls the 'copyToClipboard' utility.
 */

import React, { useMemo } from "react"; // Removed useRef as it's not strictly needed for copy
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { closeGeneratePromptModal } from "~/store/slices/modalSlice";
import { copyToClipboard } from "~/utils/textUtils";
import { PROMPT_TEMPLATE } from "~/utils/constants";
import { Copy as CopyIcon } from "lucide-react";

// BEGIN WRITING FILE CODE
export function GeneratePromptModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.modals.isGeneratePromptModalOpen
  );

  const contextText = useAppSelector((state) => state.context.text);
  const slideNotesText = useAppSelector((state) => state.slideNotes.text);
  const transcriptDisplayText = useAppSelector(
    (state) => state.transcript.displayText
  );

  /**
   * @description Computes the final prompt string.
   */
  const finalPrompt = useMemo(() => {
    let prompt = PROMPT_TEMPLATE;
    prompt = prompt.replace("<PROJECT_COMPANY_CONTEXT>", contextText.trim());
    prompt = prompt.replace("<SLIDE_NOTES>", slideNotesText.trim());
    prompt = prompt.replace("<MEETING_TRANSCRIPT>", transcriptDisplayText.trim());
    return prompt;
  }, [contextText, slideNotesText, transcriptDisplayText]);

  /**
   * @description Handles closing the dialog.
   */
  const handleClose = () => {
    dispatch(closeGeneratePromptModal());
  };

  /**
   * @description Handles the "Copy to Clipboard" button click.
   */
  const handleCopyPrompt = () => {
    copyToClipboard(finalPrompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      {/* Adjusted width for better prompt visibility */}
      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generated Note Builder Prompt</DialogTitle>
          <DialogDescription>
            Review the generated prompt below. Copy it to use with your desired
            Large Language Model (LLM).
          </DialogDescription>
        </DialogHeader>
        {/* Use flex-grow on the container to push footer down */}
        <div className="grid gap-4 py-4 flex-grow">
          <Textarea
            id="generated-prompt-textarea"
            value={finalPrompt}
            readOnly
            // Adjusted min-height and added h-full
            className="min-h-[400px] h-full resize-y font-mono text-xs bg-muted/50"
            aria-label="Generated Prompt"
          />
        </div>
        <DialogFooter className="sm:justify-between mt-auto"> {/* Pushed footer */}
          <Button
            variant="outline"
            onClick={handleCopyPrompt}
            className="flex items-center gap-2"
          >
            <CopyIcon className="h-4 w-4" />
            Copy to Clipboard
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// END WRITING FILE CODE
