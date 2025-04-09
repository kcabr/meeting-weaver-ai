/**
 * @description
 * Renders the header section of the MeetingWeaver AI application.
 * Displays the application logo, a button to open the Project Context modal,
 * and a new theme toggle button.
 *
 * Key features:
 * - Displays application logo.
 * - Contains a circular button to trigger the Project Context modal.
 * - Includes a button to toggle between light and dark themes.
 * - Uses TailwindCSS for layout and shadcn/ui components.
 *
 * @dependencies
 * - react: For component creation.
 * - react-redux: For dispatching actions (useAppDispatch).
 * - ~/components/ui/button: Shadcn Button component.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/modalSlice: Action creator for opening the context modal.
 * - ~/utils/cn: Utility for combining class names.
 * - ~/hooks/useTheme: Hook for theme management.
 * - lucide-react: For Moon and Sun icons.
 *
 * @notes
 * - The context button is styled to be circular.
 * - Theme toggle button swaps icon based on current theme.
 */

import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useAppDispatch } from "~/store/hooks";
import { openContextModal } from "~/store/slices/modalSlice";
import { cn } from "~/utils/cn";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "~/hooks/useTheme"; // Import useTheme hook

export function Header() {
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme(); // Get theme state and toggle function
  // Start with null to avoid rendering the icon on server
  const [mounted, setMounted] = useState(false);

  // Run after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * @description Handles the click event for the Project Context button.
   */
  const handleOpenContextModal = () => {
    dispatch(openContextModal());
  };

  // Determine which icon to show based on theme
  const isDarkTheme = mounted && theme === "dark";

  return (
    <header className="flex justify-between items-center p-3 border-b shrink-0 bg-card shadow-sm">
      {/* Left Side: Banner Image */}
      <img
        src="/img/meeting-weaver-header.png"
        alt="MeetingWeaver AI"
        className="h-12 sm:h-16" // Responsive height
      />

      {/* Right Side: Buttons */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {mounted ? (
            isDarkTheme ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )
          ) : null}
        </Button>

        {/* Context Modal Button */}
        <Button
          variant="outline" // Keep outline for distinction
          size="sm"
          className={cn(
            "rounded-full", // Circular
            "h-10 w-auto px-4 text-xs sm:text-sm" // Adjusted padding/text size
          )}
          onClick={handleOpenContextModal}
        >
          Project & Company Context
        </Button>
      </div>
    </header>
  );
}
