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

import React, { useMemo, useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { closeGeneratePromptModal } from "~/store/slices/modalSlice";
import {
  PROMPT_TEMPLATE_DESIGN,
  PROMPT_TEMPLATE_TRAINING,
  PROMPT_TEMPLATE_GENERAL_CLIENT,
} from "~/utils/constants";
import { TextareaWithCopy } from "~/components/TextareaWithCopy";
import { TokenPill } from "~/components/TokenPill";

export function GeneratePromptModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.modals.isGeneratePromptModalOpen
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>("Design");

  // Fetch meeting details from Redux store
  const { meetingName, meetingAgenda, ourTeam, clientTeam } = useAppSelector(
    (state) => state.meetingDetails
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
    let prompt: string;
    switch (selectedTemplate) {
      case "Design":
        prompt = PROMPT_TEMPLATE_DESIGN;
        break;
      case "Training":
        prompt = PROMPT_TEMPLATE_TRAINING;
        break;
      case "General Client Meeting":
        prompt = PROMPT_TEMPLATE_GENERAL_CLIENT;
        break;
      default:
        prompt = PROMPT_TEMPLATE_DESIGN; // Default to Design
        break;
    }
    // Replace new placeholders
    prompt = prompt.replace("<MEETING_NAME>", meetingName.trim());
    prompt = prompt.replace("<MEETING_AGENDA>", meetingAgenda.trim());
    prompt = prompt.replace("<OUR_TEAM>", ourTeam.trim());
    prompt = prompt.replace("<CLIENT_TEAM>", clientTeam.trim());
    // Existing replacements
    prompt = prompt.replace("<PROJECT_COMPANY_CONTEXT>", contextText.trim());
    prompt = prompt.replace("<SLIDE_NOTES>", slideNotesText.trim());
    prompt = prompt.replace(
      "<MEETING_TRANSCRIPT>",
      transcriptDisplayText.trim()
    );
    return prompt;
  }, [
    contextText,
    slideNotesText,
    transcriptDisplayText,
    selectedTemplate,
    meetingName,
    meetingAgenda,
    ourTeam,
    clientTeam,
  ]);

  /**
   * @description Handles closing the dialog.
   */
  const handleClose = () => {
    dispatch(closeGeneratePromptModal());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generated Note Builder Prompt</DialogTitle>
          <DialogDescription>
            Review the generated prompt below. Copy it to use with your desired
            Large Language Model (LLM).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 flex-grow">
          <div className="flex justify-between items-center">
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="General Client Meeting">
                  General Client Meeting
                </SelectItem>
              </SelectContent>
            </Select>
            <TokenPill text={finalPrompt} />
          </div>
          <TextareaWithCopy
            id="generated-prompt-textarea"
            value={finalPrompt}
            readOnly
            className="min-h-[400px] h-full resize-y font-mono text-xs bg-muted/50"
            aria-label="Generated Prompt"
          />
        </div>
        <DialogFooter className="sm:justify-end mt-auto">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
