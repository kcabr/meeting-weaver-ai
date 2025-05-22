/**
 * @description
 * This component renders the modal dialog for inputting Project & Company Context.
 * It uses shadcn/ui Dialog components and is controlled by Redux state for visibility.
 *
 * Key features:
 * - Renders a Dialog from shadcn/ui.
 * - Visibility controlled by `isContextModalOpen` state from `modalSlice`.
 * - Includes a Label and Textarea for user input.
 * - Loads context from Redux state, which is initialized from localStorage.
 * - Populates with template when empty.
 * - Persists updates to localStorage via Redux actions.
 * - Adjusted modal width using className on DialogContent.
 * - Adjusted textarea height.
 *
 * @dependencies
 * - react: For component creation and hooks.
 * - react-redux: For accessing Redux state and dispatching actions.
 * - ~/components/ui/dialog: Shadcn Dialog components.
 * - ~/components/ui/label: Shadcn Label component.
 * - ~/components/ui/textarea: Shadcn Textarea component.
 * - ~/components/ui/button: Shadcn Button component.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/modalSlice: Actions and selectors for modal state.
 * - ~/store/slices/contextSlice: Actions and selectors for context state.
 * - ~/utils/constants: Template constants.
 */
import React, { useEffect, useState } from "react";
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
import { closeContextModal } from "~/store/slices/modalSlice";
import { setContextText } from "~/store/slices/contextSlice";
import { CONTEXT_TEMPLATE } from "~/utils/constants";

export function ContextModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modals.isContextModalOpen);
  const contextText = useAppSelector((state) => state.context.text);

  // Local state to track text changes within the modal
  const [text, setText] = useState(contextText);

  // Update local state when the modal opens or contextText changes
  useEffect(() => {
    if (isOpen) {
      // If opening the modal and there's no text, use the template
      if (!contextText.trim()) {
        setText(CONTEXT_TEMPLATE);
      } else {
        setText(contextText);
      }
    }
  }, [isOpen, contextText]);

  /**
   * @description Handles the change in the textarea value.
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  /**
   * @description Handles saving the context text when closing the modal.
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch(setContextText(text));
      dispatch(closeContextModal());
    }
  };

  /**
   * @description Handles the save and close button click.
   */
  const handleSaveAndClose = () => {
    dispatch(setContextText(text));
    dispatch(closeContextModal());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Increased max-width for wider screens */}
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Project & Company Context</DialogTitle>
          <DialogDescription>
            Provide background information about the project and company.
            Specific meeting details like name, agenda, and attendees will be
            managed separately. This general context helps in generating more
            relevant notes later.
          </DialogDescription>
        </DialogHeader>
        {/* Added flex-grow to allow textarea to fill space */}
        <div className="grid gap-4 py-4 flex-grow">
          <Label htmlFor="context-textarea" className="sr-only">
            Context Input Area
          </Label>
          <Textarea
            id="context-textarea"
            value={text}
            onChange={handleTextChange}
            placeholder="Start typing your project context here... (Use the template)"
            // Increased min-height and added h-full for better vertical sizing
            className="min-h-[300px] h-full resize-y"
          />
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSaveAndClose}>
            Save & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
