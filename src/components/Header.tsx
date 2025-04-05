/**
 * @description
 * Renders the header section of the MeetingWeaver AI application.
 * Displays the application title and a button to open the Project Context modal.
 *
 * Key features:
 * - Displays static application title "MeetingWeaver AI".
 * - Contains a circular button to trigger the Project Context modal.
 * - Uses TailwindCSS for layout and shadcn/ui Button component.
 *
 * @dependencies
 * - react: For component creation.
 * - react-redux: For dispatching actions (useAppDispatch).
 * - ~/components/ui/button: Shadcn Button component.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/modalSlice: Action creator for opening the context modal.
 * - ~/utils/cn: Utility for combining class names.
 *
 * @notes
 * - The button is styled to be circular using Tailwind utilities.
 * - Clicking the button dispatches the 'openContextModal' action.
 */

import React from "react";
import { Button } from "~/components/ui/button";
import { useAppDispatch } from "~/store/hooks";
import { openContextModal } from "~/store/slices/modalSlice"; // Import the action
import { cn } from "~/utils/cn"; // Ensure cn utility is correctly imported

export function Header() {
  const dispatch = useAppDispatch();

  /**
   * @description Handles the click event for the Project Context button.
   * Dispatches an action to open the context modal.
   */
  const handleOpenContextModal = () => {
    dispatch(openContextModal()); // Dispatch the action to open the modal
  };

  return (
    <header className="flex justify-between items-center p-4 border-b shrink-0">
      {/* Left Side: Banner Image */}
      <img
        src="/img/meeting-weaver-header.png"
        alt="MeetingWeaver AI"
        className="h-16"
      />

      {/* Right Side: Context Modal Button */}
      <Button
        variant="outline" // Using outline variant for distinction
        size="sm" // Using small size
        className={cn(
          "rounded-full", // Make it circular
          "h-10 w-auto px-4" // Specific height, auto width, horizontal padding
          // Consider 'size-10 p-0 flex items-center justify-center' for a fixed size circle if text is short or icon is used
        )}
        onClick={handleOpenContextModal} // Attach the click handler
      >
        Project & Company Context (Modal)
      </Button>
    </header>
  );
}
