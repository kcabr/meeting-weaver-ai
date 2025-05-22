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
 * - ~/components/ui/input: Input component.
 * - ~/components/ui/label: Label component.
 * - ~/components/ui/textarea: Textarea component.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/modalSlice: Action creator for opening the context modal.
 * - ~/store/slices/meetingDetailsSlice: Action creators for meeting details.
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { openContextModal } from "~/store/slices/modalSlice";
import {
  setMeetingName,
  setMeetingAgenda,
  setOurTeam,
  setClientTeam,
} from "~/store/slices/meetingDetailsSlice";
import { cn } from "~/utils/cn";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";

export function Header() {
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fetch meeting details from Redux
  const { meetingName, meetingAgenda, ourTeam, clientTeam } = useAppSelector(
    (state) => state.meetingDetails
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenContextModal = () => {
    dispatch(openContextModal());
  };

  const isDarkTheme = mounted && theme === "dark";

  return (
    <header className="flex justify-between items-start p-4 border-b shrink-0 bg-card shadow-sm min-h-[120px]">
      {/* Left Side: Banner Image */}
      <img
        src="/img/meeting-weaver-header.png"
        alt="MeetingWeaver AI"
        className="h-12 sm:h-16 flex-shrink-0 mt-1"
      />

      {/* Middle Section: Meeting Detail Inputs */}
      <div className="flex-grow flex justify-center items-start gap-x-3 px-2">
        <div className="flex flex-col gap-1 w-1/4 max-w-xs">
          <Label
            htmlFor="header-meeting-name"
            className="text-xs sm:text-sm whitespace-nowrap font-medium"
          >
            Meeting Name:
          </Label>
          <Textarea
            id="header-meeting-name"
            value={meetingName}
            onChange={(e) => dispatch(setMeetingName(e.target.value))}
            placeholder="E.g., Q3 Strategy Review"
            className="text-xs sm:text-sm min-h-[80px] resize-y"
            rows={5}
          />
        </div>
        <div className="flex flex-col gap-1 w-1/4 max-w-xs">
          <Label
            htmlFor="header-meeting-agenda"
            className="text-xs sm:text-sm whitespace-nowrap font-medium"
          >
            Agenda:
          </Label>
          <Textarea
            id="header-meeting-agenda"
            value={meetingAgenda}
            onChange={(e) => dispatch(setMeetingAgenda(e.target.value))}
            placeholder="Key topics..."
            className="text-xs sm:text-sm min-h-[80px] resize-y"
            rows={5}
          />
        </div>
        <div className="flex flex-col gap-1 w-1/4 max-w-xs">
          <Label
            htmlFor="header-our-team"
            className="text-xs sm:text-sm whitespace-nowrap font-medium"
          >
            Our Team:
          </Label>
          <Textarea
            id="header-our-team"
            value={ourTeam}
            onChange={(e) => dispatch(setOurTeam(e.target.value))}
            placeholder="Attendees from your org..."
            className="text-xs sm:text-sm min-h-[80px] resize-y"
            rows={5}
          />
        </div>
        <div className="flex flex-col gap-1 w-1/4 max-w-xs">
          <Label
            htmlFor="header-client-team"
            className="text-xs sm:text-sm whitespace-nowrap font-medium"
          >
            Client Team:
          </Label>
          <Textarea
            id="header-client-team"
            value={clientTeam}
            onChange={(e) => dispatch(setClientTeam(e.target.value))}
            placeholder="Attendees from client org..."
            className="text-xs sm:text-sm min-h-[80px] resize-y"
            rows={5}
          />
        </div>
      </div>

      {/* Right Side: Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0 mt-1">
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
          variant="outline"
          size="sm"
          className={cn("rounded-full", "h-10 w-auto px-4 text-xs sm:text-sm")}
          onClick={handleOpenContextModal}
        >
          Project & Company Context
        </Button>
      </div>
    </header>
  );
}
