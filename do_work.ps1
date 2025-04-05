# Step 27: Final Styling and Layout Adjustments

# Create necessary directories if they don't exist
New-Item -ItemType Directory -Force -Path "src/hooks"

# Create/Update src/hooks/useTheme.ts
Write-Output "Creating/Updating src/hooks/useTheme.ts..."
Set-Content -Path "src/hooks/useTheme.ts" -Value @'
/**
 * @description
 * Custom hook to manage application theme (light/dark).
 * It provides the current theme and a function to toggle it.
 * It interacts with localStorage to persist the theme preference and applies
 * the 'dark' class to the root element for TailwindCSS dark mode support.
 *
 * Key features:
 * - Reads initial theme from localStorage or system preference.
 * - Applies 'dark' class to the root element based on the theme.
 * - Provides a 'toggleTheme' function to switch between light and dark.
 * - Persists the selected theme to localStorage.
 *
 * @dependencies
 * - react: For useState, useEffect, useCallback hooks.
 *
 * @notes
 * - Assumes TailwindCSS dark mode is configured with the 'class' strategy.
 */

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

const LOCAL_STORAGE_THEME_KEY = 'meetingweaver_theme';

export function useTheme(): { theme: Theme; toggleTheme: () => void; setTheme: (theme: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'system'; // Default for SSR/build time
    }
    const storedTheme = window.localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    return 'system'; // Default preference
  });

  /**
   * @description Applies the theme class to the root element and updates localStorage.
   */
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let effectiveTheme: 'light' | 'dark';
    if (newTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      effectiveTheme = newTheme;
    }

    root.classList.add(effectiveTheme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme); // Store user's preference ('system', 'light', or 'dark')
    setThemeState(newTheme); // Update hook state
  }, []);


  /**
   * @description Effect to apply the theme on initial load and when theme state changes.
   * Also listens for system preference changes if theme is 'system'.
   */
  useEffect(() => {
    applyTheme(theme);

    // Handle system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') { // Only re-apply if tracking system preference
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]); // Re-run if theme preference changes

  /**
   * @description Toggles the theme between light and dark. If currently 'system',
   * it defaults to toggling based on the current *effective* theme.
   */
  const toggleTheme = useCallback(() => {
    let currentEffectiveTheme: 'light' | 'dark';
    if (theme === 'system') {
       currentEffectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
       currentEffectiveTheme = theme;
    }
    const nextTheme = currentEffectiveTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme); // Set explicitly to light/dark, moving away from 'system'
  }, [theme, applyTheme]);

  /**
   * @description Allows setting the theme explicitly (light, dark, or system).
   */
  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
  }


  return { theme, toggleTheme, setTheme };
}
'@

# Create/Update src/components/ThemeProvider.tsx
Write-Output "Creating/Updating src/components/ThemeProvider.tsx..."
Set-Content -Path "src/components/ThemeProvider.tsx" -Value @'
/**
 * @description
 * Provides theme context and applies theme changes using the useTheme hook.
 * This component should wrap the main application layout.
 *
 * @dependencies
 * - react: For component creation and context.
 * - ~/hooks/useTheme: The custom hook for theme management.
 */
import React, { createContext, useContext } from 'react';
import { useTheme } from '~/hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeHook = useTheme();

  return (
    <ThemeContext.Provider value={themeHook}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
'@

# Update src/routes/__root.tsx
Write-Output "Updating src/routes/__root.tsx..."
Set-Content -Path "src/routes/__root.tsx" -Value @'
/**
 * @description
 * This is the root component for the entire application's routing structure.
 * It sets up the basic HTML document structure (html, head, body) and includes
 * global providers like Redux Provider, React Query Provider, and the new ThemeProvider.
 * It also renders the main content area ('<Outlet />') where nested routes will be displayed.
 *
 * Key features:
 * - Defines the root HTML structure.
 * - Includes global meta tags, links (favicon, CSS).
 * - Wraps the application in the Redux Provider ('<Provider>').
 * - Wraps the application in the React Query Provider ('<QueryClientProvider>').
 * - Wraps the application in the ThemeProvider for theme management.
 * - Renders the TanStack Router Devtools for debugging.
 * - Renders the Toaster component for notifications.
 * - Defines default error and not found components.
 *
 * @dependencies
 * - @tanstack/react-router: For routing components ('Outlet', 'createRootRoute', etc.).
 * - @tanstack/react-query: For server state management ('QueryClientProvider').
 * - react-redux: For Redux state management ('Provider').
 * - react-hot-toast: For displaying notifications ('Toaster').
 * - ~/components/DefaultCatchBoundary: Custom component for displaying route errors.
 * - ~/components/NotFound: Custom component for 404 pages.
 * - ~/components/ThemeProvider: Provides theme context and logic.
 * - ~/store: Imports the configured Redux store.
 * - ~/styles/app.css: Imports global application styles.
 *
 * @notes
 * - The 'RootDocument' component provides the basic HTML shell.
 * - The Redux Provider makes the store accessible to all child components.
 * - ClerkProvider and related auth logic were removed during cleanup (Step 3).
 */
/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux"; // Import Redux Provider
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary.js";
import { NotFound } from "~/components/NotFound.js";
import { ThemeProvider } from "~/components/ThemeProvider"; // Import ThemeProvider
import { store } from "~/store"; // Import the configured Redux store
import appCss from "~/styles/app.css?url";

// Create a client for React Query
const queryClient = new QueryClient();

/**
 * @description Configuration for the root route of the application.
 */
export const Route = createRootRoute({
  /**
   * @description Configures the content of the <head> tag for the application.
   */
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "MeetingWeaver AI", // Set a default title
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  /**
   * @description Component to render when an error occurs in this route or its children.
   */
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  /**
   * @description Component to render when no matching route is found.
   */
  notFoundComponent: () => <NotFound />,
  /**
   * @description The main component rendered for the root route.
   */
  component: RootComponent,
});

/**
 * @description The core component that sets up global providers.
 * Now includes ThemeProvider.
 */
function RootComponent() {
  return (
    <ThemeProvider> {/* Wrap with ThemeProvider */}
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RootDocument>
            <Outlet />
          </RootDocument>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}

/**
 * @description Renders the basic HTML document structure (<html>, <head>, <body>).
 * @param children - The content to be rendered within the <body> tag.
 */
function RootDocument({ children }: { children: React.ReactNode }) {
  // Note: The 'dark' class will be managed on the <html> tag by the useTheme hook
  return (
    <html>
      <head>
        <HeadContent />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Prevent flash of unstyled content (FOUC) */
            html { visibility: hidden; }
            html.light, html.dark { visibility: visible; }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
          {/* Removed wrapper div to apply bg directly to body */}
          <main className="min-h-screen flex flex-col">{children}</main>
          <Toaster
             position="bottom-right"
             toastOptions={{
               className: '!bg-background !text-foreground !border !border-border !shadow-lg',
             }}
           />
          <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
'@

# Update src/components/Header.tsx
Write-Output "Updating src/components/Header.tsx..."
Set-Content -Path "src/components/Header.tsx" -Value @'
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

import React from "react";
import { Button } from "~/components/ui/button";
import { useAppDispatch } from "~/store/hooks";
import { openContextModal } from "~/store/slices/modalSlice";
import { cn } from "~/utils/cn";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "~/hooks/useTheme"; // Import useTheme hook

export function Header() {
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme(); // Get theme state and toggle function

  /**
   * @description Handles the click event for the Project Context button.
   */
  const handleOpenContextModal = () => {
    dispatch(openContextModal());
  };

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
           title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
         >
           {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
             <Sun className="h-[1.2rem] w-[1.2rem]" />
           ) : (
             <Moon className="h-[1.2rem] w-[1.2rem]" />
           )}
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
          Project & Company Context (Modal)
        </Button>
      </div>
    </header>
  );
}
'@

# Update src/components/MainContentLayout.tsx
Write-Output "Updating src/components/MainContentLayout.tsx..."
Set-Content -Path "src/components/MainContentLayout.tsx" -Value @'
/**
 * @description
 * Renders the main two-column content area of the application.
 * Establishes the side-by-side layout for the Slide/Notes and Transcript panels.
 * Uses CSS Grid for layout and ensures panels fill available space.
 *
 * Key features:
 * - Uses CSS Grid for a two-column layout with a gap.
 * - Designed to fill the remaining vertical space below the header using flex-grow.
 * - Renders SlideNotesPanel and TranscriptPanel.
 * - Applies consistent styling (border, padding, background, shadow) to panels.
 *
 * @dependencies
 * - react: For component creation.
 * - ./SlideNotesPanel: The component for the left panel.
 * - ./TranscriptPanel: The component for the right panel.
 *
 * @notes
 * - `flex-grow` and `h-0` on the main container ensure proper height filling within a flex parent.
 * - `overflow-hidden` on panels prevents content overflow issues.
 * - Uses `bg-card` and `text-card-foreground` for theme-aware background/text colors.
 */
import React from 'react';
import { SlideNotesPanel } from './SlideNotesPanel';
import { TranscriptPanel } from './TranscriptPanel';

// BEGIN WRITING FILE CODE
export function MainContentLayout() {
  return (
    // Use flex-grow to take available vertical space, grid for columns
    // h-0 is crucial for flex-grow children within a flex container to allow shrinking
    // Increased gap for better visual separation
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6 flex-grow h-0">
      {/* Left Panel: Slide / Meeting Notes */}
      {/* Added overflow-hidden to contain content properly */}
      <div className="flex flex-col h-full border rounded-lg p-4 bg-card text-card-foreground shadow-md overflow-hidden">
        <SlideNotesPanel />
      </div>

      {/* Right Panel: Meeting Transcript */}
      {/* Added overflow-hidden to contain content properly */}
      <div className="flex flex-col h-full border rounded-lg p-4 bg-card text-card-foreground shadow-md overflow-hidden">
        <TranscriptPanel />
      </div>
    </main>
  );
}
// END WRITING FILE CODE
'@

# Update src/components/SlideNotesPanel.tsx
Write-Output "Updating src/components/SlideNotesPanel.tsx..."
Set-Content -Path "src/components/SlideNotesPanel.tsx" -Value @'
/**
 * @description
 * Renders the left panel dedicated to Slide/Meeting Notes input.
 * Includes a labeled text area and a vertical stack of action buttons.
 * Connects the text area to the Redux store for state management and persists on blur.
 * Implements the "Copy Text", "Add Line", and separator navigation functionalities.
 * Dispatches the current cursor position when opening the Image Extract modal.
 *
 * Key features:
 * - Displays a labeled multi-line text area for notes input.
 * - Shows action buttons with icons and tooltips.
 * - Uses Redux ('useAppSelector', 'useAppDispatch') to manage text area content and cursor position state.
 * - Updates Redux state on text area change ('onChange').
 * - Persists text area content to localStorage on blur ('onBlur').
 * - Implements "Copy Text" button functionality using utility function and toast feedback.
 * - Implements "Add Line" button to insert a separator using a Redux action.
 * - Implements Up/Down arrow buttons to navigate between separator lines.
 * - Uses 'useRef' to hold a reference to the textarea element for cursor manipulation.
 * - Dispatches 'setLastKnownCursorPosition' action before opening the image modal.
 *
 * @dependencies
 * - react: For component creation, 'useRef', 'useEffect', 'useState'.
 * - react-redux: For hooks 'useAppSelector', 'useAppDispatch'.
 * - react-hot-toast: For displaying notifications (used via textUtils).
 * - ~/components/ui/label: Shadcn Label component.
 * - ~/components/ui/textarea: Shadcn Textarea component.
 * - ~/components/ui/button: Shadcn Button component.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/slideNotesSlice: Action creators 'setSlideNotesText', 'persistSlideNotes', 'insertSlideNotesText', 'setLastKnownCursorPosition'.
 * - ~/store/slices/modalSlice: Action creator 'openImageExtractModal'.
 * - ~/utils/textUtils: Utility functions 'copyToClipboard', 'findNearestSeparatorLine'.
 * - ~/utils/constants: Constants like 'SLIDE_NOTES_SEPARATOR'.
 * - lucide-react: For icons (Image, Copy, ArrowUp, Plus, ArrowDown).
 *
 * @notes
 * - Cursor position setting after 'Add Line' uses a state variable and useEffect for better reliability.
 * - Navigation uses the findNearestSeparatorLine utility to move the cursor.
 * - Image Extract button now dispatches Redux actions to open the modal and save cursor position.
 * - Textarea now uses flex-grow within its container to fill available vertical space.
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
  setLastKnownCursorPosition, // Import the action
} from "~/store/slices/slideNotesSlice";
import { openImageExtractModal } from "~/store/slices/modalSlice";
import { copyToClipboard, findNearestSeparatorLine } from "~/utils/textUtils";
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
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setSlideNotesText(e.target.value));
  };

  /**
   * @description Handles the blur event on the textarea.
   */
  const handleBlur = () => {
    const currentText = textareaRef.current?.value ?? slideNotesText;
    dispatch(persistSlideNotes(currentText));
  };

  /**
   * @description Handles the click event for the "Copy Text" button.
   */
  const handleCopyText = () => {
    copyToClipboard(slideNotesText);
  };

  /**
   * @description Handles the click event for the "Add Line" button.
   */
  const handleAddLine = () => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      // Insert with surrounding newlines for proper line separation
      const textToInsert = `\n${SLIDE_NOTES_SEPARATOR}\n`;
      const calculatedNextPosition = cursorPosition + textToInsert.length;

      dispatch(
        insertSlideNotesText({ textToInsert, position: cursorPosition })
      );
      setNextCursorPosition(calculatedNextPosition);
    } else {
      console.warn("Textarea ref not available for Add Line action.");
      const textToInsert = `\n${SLIDE_NOTES_SEPARATOR}\n`;
      const cursorPosition = slideNotesText.length;
      const calculatedNextPosition = cursorPosition + textToInsert.length;
      dispatch(
        insertSlideNotesText({ textToInsert, position: cursorPosition })
      );
      setNextCursorPosition(calculatedNextPosition);
    }
  };

  /**
   * @description Effect to set the cursor position after the text state has updated.
   */
  useEffect(() => {
    if (nextCursorPosition !== null && textareaRef.current) {
      const currentLength = textareaRef.current.value.length;
      const targetPosition = Math.min(nextCursorPosition, currentLength);

      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(targetPosition, targetPosition);

      setNextCursorPosition(null);
    }
  }, [slideNotesText, nextCursorPosition]);

  /**
   * @description Handles the click event for the "Navigate Up" button.
   */
  const handleNavigateUp = () => {
    if (textareaRef.current) {
      const currentPosition = textareaRef.current.selectionStart;
      const text = textareaRef.current.value;
      const newPosition = findNearestSeparatorLine(
        text,
        currentPosition,
        SLIDE_NOTES_SEPARATOR,
        "up"
      );

      if (newPosition !== null) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      } else {
        toast("No separator found above.", { icon: "🤷", duration: 1500 });
      }
    }
  };

  /**
   * @description Handles the click event for the "Navigate Down" button.
   */
  const handleNavigateDown = () => {
    if (textareaRef.current) {
      const currentPosition = textareaRef.current.selectionStart;
      const text = textareaRef.current.value;
      const newPosition = findNearestSeparatorLine(
        text,
        currentPosition,
        SLIDE_NOTES_SEPARATOR,
        "down"
      );

      if (newPosition !== null) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      } else {
        toast("No separator found below.", { icon: "🤷", duration: 1500 });
      }
    }
  };

  /**
   * @description Handles the click event for the "Img-Txt Extract (Modal)" button.
   */
  const handleImageExtract = () => {
    const currentPosition =
      textareaRef.current?.selectionStart ?? slideNotesText.length;
    dispatch(setLastKnownCursorPosition(currentPosition));
    dispatch(openImageExtractModal());
  };

  return (
    // Use flex layout, ensure parent container allows growth (h-full)
    <div className="flex gap-4 h-full">
      {/* Text Area Section - Allow this part to grow */}
      <div className="flex flex-col flex-grow h-full">
        <Label
          htmlFor="slide-notes-textarea"
          className="mb-2 text-sm font-medium shrink-0" // Prevent label from shrinking
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
          // Use flex-grow to fill vertical space, ensure min-height if needed
          className="flex-grow resize-none text-sm w-full min-h-[200px] lg:min-h-0"
          spellCheck={false}
        />
      </div>

      {/* Action Buttons Section - Fixed width */}
      <div className="flex flex-col gap-2 shrink-0">
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
          onClick={handleNavigateUp}
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
          onClick={handleNavigateDown}
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

# Update src/components/TranscriptPanel.tsx
Write-Output "Updating src/components/TranscriptPanel.tsx..."
Set-Content -Path "src/components/TranscriptPanel.tsx" -Value @'
/**
 * @description
 * Renders the right panel dedicated to the Meeting Transcript input.
 * Includes a labeled text area and a vertical stack of action buttons.
 * Connects the text area to the Redux store ('transcriptSlice') for state management.
 * Handles 'onChange' to update the displayed text and reset cleaning status.
 * Persists both display and original text to localStorage on blur.
 * Implements "Copy Text", "Save", "Add Context Line", context line navigation,
 * AI cleaning ('Clean ✨'), and 'Undo' functionalities.
 * Enables the "Generate Note Builder Prompt..." button when all inputs have text.
 *
 * Key features:
 * - Displays a labeled multi-line text area for transcript input.
 * - Shows action buttons with icons and tooltips.
 * - Uses Redux ('useAppSelector', 'useAppDispatch') to manage transcript state.
 * - Updates Redux state on text area change ('onChange').
 * - Persists state to localStorage on blur ('onBlur').
 * - Implements "Copy Text" using 'copyToClipboard' utility.
 * - Implements "Save" using 'saveTextToFile' utility.
 * - Implements "Add Context Line" button to save cursor position and open modal.
 * - Implements Up/Down arrow buttons for navigating context lines ("## ").
 * - Implements "Clean ✨" button using 'useTranscriptCleaner' hook.
 * - Implements "Undo" button by dispatching 'revertTranscriptToOriginal'. Includes success toast.
 * - Implements enablement logic for the "Generate Note Builder Prompt..." button.
 * - Uses 'useRef' for the textarea element.
 * - Textarea now uses flex-grow within its container to fill available vertical space.
 *
 * @dependencies
 * - react: For component creation and 'useRef'.
 * - react-redux: For hooks 'useAppSelector', 'useAppDispatch'.
 * - react-hot-toast: For user feedback.
 * - ~/components/ui/*: Shadcn components (Label, Textarea, Button).
 * - ~/hooks/useTranscriptCleaner: Hook for AI cleaning logic.
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/transcriptSlice: Actions and selectors for transcript state.
 * - ~/store/slices/modalSlice: Action creators 'openAddContextLineModal', 'openGeneratePromptModal'.
 * - ~/store/slices/contextSlice: Selector for context text.
 * - ~/store/slices/slideNotesSlice: Selector for slide notes text.
 * - ~/utils/textUtils: Utility functions for text manipulation and navigation.
 * - ~/utils/constants: Constants like 'TRANSCRIPT_CONTEXT_PREFIX'.
 * - lucide-react: For icons.
 *
 * @notes
 * - Generate Prompt button now opens the modal and has enablement logic.
 * - Button disabling logic is implemented for Clean and Undo.
 * - Added success toast for Undo action.
 */
import {
  setTranscriptDisplayText,
  persistTranscript,
  setTranscriptLastKnownCursorPosition,
  revertTranscriptToOriginal,
} from "~/store/slices/transcriptSlice";
import {
  openAddContextLineModal,
  openGeneratePromptModal,
} from "~/store/slices/modalSlice";
import {
  copyToClipboard,
  saveTextToFile,
  findNearestPrefixedLine,
} from "~/utils/textUtils";
import { TRANSCRIPT_CONTEXT_PREFIX } from "~/utils/constants";
import {
  Sparkles,
  Undo2,
  Save,
  Copy,
  ArrowUp,
  MessageSquarePlus,
  ArrowDown,
  Send,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useRef } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useTranscriptCleaner } from "~/hooks/useTranscriptCleaner";

// BEGIN WRITING FILE CODE
export function TranscriptPanel() {
  const dispatch = useAppDispatch();
  const { displayText, originalText, isLoading, isCleaned } = useAppSelector(
    (state) => state.transcript
  );
  const contextText = useAppSelector((state) => state.context.text);
  const slideNotesText = useAppSelector((state) => state.slideNotes.text);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { cleanTranscriptHandler } = useTranscriptCleaner();

  /**
   * @description Determines if the Generate Prompt button should be enabled.
   */
  const isGenerateButtonEnabled =
    contextText.trim().length > 0 &&
    slideNotesText.trim().length > 0 &&
    displayText.trim().length > 0;

  /**
   * @description Handles changes in the textarea input.
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setTranscriptDisplayText(e.target.value));
  };

  /**
   * @description Handles the blur event on the textarea.
   */
  const handleBlur = () => {
    dispatch(persistTranscript({ displayText, originalText }));
  };

  /**
   * @description Handles the click event for the "Copy Text" button.
   */
  const handleCopyText = () => {
    copyToClipboard(displayText);
  };

  /**
   * @description Handles the click event for the "Save" button.
   */
  const handleSave = () => {
    saveTextToFile(displayText, "meeting_transcript.txt");
  };

  /**
   * @description Handles the click event for the "Navigate Up" button.
   */
  const handleNavigateUp = () => {
    if (textareaRef.current) {
      const currentPosition = textareaRef.current.selectionStart;
      const text = textareaRef.current.value;
      const newPosition = findNearestPrefixedLine(
        text,
        currentPosition,
        TRANSCRIPT_CONTEXT_PREFIX,
        "up"
      );

      if (newPosition !== null) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      } else {
        toast("No context line (##) found above.", {
          icon: "🤷",
          duration: 1500,
        });
      }
    }
  };

  /**
   * @description Handles the click event for the "Navigate Down" button.
   */
  const handleNavigateDown = () => {
    if (textareaRef.current) {
      const currentPosition = textareaRef.current.selectionStart;
      const text = textareaRef.current.value;
      const newPosition = findNearestPrefixedLine(
        text,
        currentPosition,
        TRANSCRIPT_CONTEXT_PREFIX,
        "down"
      );

      if (newPosition !== null) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      } else {
        toast("No context line (##) found below.", {
          icon: "🤷",
          duration: 1500,
        });
      }
    }
  };

  /**
   * @description Handles the click event for the "Add Context Line (Modal)" button.
   */
  const handleAddContextLine = () => {
    const currentPosition =
      textareaRef.current?.selectionStart ?? displayText.length;
    dispatch(setTranscriptLastKnownCursorPosition(currentPosition));
    dispatch(openAddContextLineModal());
  };

  /**
   * @description Handles the click event for the "Clean ✨" button.
   */
  const handleClean = () => {
    cleanTranscriptHandler();
  };

  /**
   * @description Handles the click event for the "Undo" button.
   */
  const handleUndo = () => {
    dispatch(revertTranscriptToOriginal());
    toast.success("Reverted to original transcript.");
  };

  /**
   * @description Handles the click event for the "Generate Note Builder Prompt..." button.
   */
  const handleGeneratePrompt = () => {
    dispatch(openGeneratePromptModal());
  };

  return (
    // Use flex layout, ensure parent container allows growth (h-full)
    <div className="flex gap-4 h-full">
      {/* Text Area Section - Allow this part to grow */}
      <div className="flex flex-col flex-grow h-full">
        <Label
          htmlFor="transcript-textarea"
          className="mb-2 text-sm font-medium shrink-0" // Prevent label from shrinking
        >
          Meeting Transcript Text Area
        </Label>
        <Textarea
          id="transcript-textarea"
          ref={textareaRef}
          value={displayText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder="Paste or type the meeting transcript here..."
          // Use flex-grow to fill vertical space, ensure min-height if needed
          className="flex-grow resize-none text-sm w-full min-h-[200px] lg:min-h-0"
          spellCheck={false}
        />
      </div>

      {/* Action Buttons Section - Fixed width */}
      <div className="flex flex-col gap-2 shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={handleClean}
          title="Clean ✨ Transcript (AI)"
          disabled={isLoading || !displayText.trim()} // Disable if loading or no text
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span className="sr-only">Clean ✨</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleUndo}
          title="Undo Clean"
          disabled={!isCleaned || isLoading} // Disable if not cleaned or if loading
        >
          <Undo2 className="h-4 w-4" />
          <span className="sr-only">Undo</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleSave}
          title="Save Transcript"
        >
          <Save className="h-4 w-4" />
          <span className="sr-only">Save</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyText}
          title="Copy Transcript"
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy Text</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateUp}
          title="Navigate Up (Context Line ##)"
        >
          <ArrowUp className="h-4 w-4" />
          <span className="sr-only">Up Arrow (↑)</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddContextLine}
          title="Add Context Line (Modal)"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span className="sr-only">Add Context Line (Modal)</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateDown}
          title="Navigate Down (Context Line ##)"
        >
          <ArrowDown className="h-4 w-4" />
          <span className="sr-only">Down Arrow (↓)</span>
        </Button>
        <Button
          variant="default" // Make Generate button more prominent
          size="icon"
          onClick={handleGeneratePrompt}
          title="Generate Note Builder Prompt..."
          disabled={!isGenerateButtonEnabled} // Enable/disable based on content
          className="mt-auto" // Push to bottom if space allows
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Generate Note Builder Prompt...</span>
        </Button>
      </div>
    </div>
  );
}
// END WRITING FILE CODE
'@

# Update src/components/ContextModal.tsx
Write-Output "Updating src/components/ContextModal.tsx..."
Set-Content -Path "src/components/ContextModal.tsx" -Value @'
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
            Provide background information about the project, company,
            attendees, and meeting goals. This context helps in generating more
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
'@

# Update src/components/ImageExtractModal.tsx
Write-Output "Updating src/components/ImageExtractModal.tsx..."
Set-Content -Path "src/components/ImageExtractModal.tsx" -Value @'
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
'@

# Update src/components/AddContextLineModal.tsx
Write-Output "Updating src/components/AddContextLineModal.tsx..."
Set-Content -Path "src/components/AddContextLineModal.tsx" -Value @'
/**
 * @description
 * Renders the modal dialog for adding a formatted context line to the transcript.
 * Allows the user to input text, which is then formatted and inserted into the
 * transcript text area at the last known cursor position.
 *
 * Key features:
 * - Controlled by 'isAddContextLineModalOpen' state from modalSlice.
 * - Contains an Input field for user-provided context text.
 * - "Add" button inserts the formatted string "\n## [User Input] ##########\n"
 *   into the transcript using the 'insertTranscriptText' action.
 * - Uses the 'lastKnownCursorPosition' from transcriptSlice to determine insertion point.
 * - Resets local input state when the modal closes.
 * - Adjusted modal width.
 *
 * @dependencies
 * - react: For component creation and hooks (useState, useCallback, useEffect).
 * - react-redux: For accessing Redux state and dispatching actions (useAppSelector, useAppDispatch).
 * - ~/components/ui/*: Shadcn UI components (Dialog, Label, Input, Button).
 * - ~/store/hooks: Typed Redux hooks.
 * - ~/store/slices/modalSlice: Action 'closeAddContextLineModal'.
 * - ~/store/slices/transcriptSlice: Action 'insertTranscriptText', selector for cursor position.
 * - ~/utils/constants: Constant 'SLIDE_NOTES_SEPARATOR'.
 * - lucide-react: For Loader2 icon (optional for future async ops).
 *
 * @notes
 * - Assumes 'lastKnownCursorPosition' is set in 'transcriptSlice' before this modal opens.
 * - The formatting `## [User Input] ##########` includes the standard separator.
 */

import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { closeAddContextLineModal } from "~/store/slices/modalSlice";
import { insertTranscriptText } from "~/store/slices/transcriptSlice";
import { SLIDE_NOTES_SEPARATOR } from "~/utils/constants";

// BEGIN WRITING FILE CODE
export function AddContextLineModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.modals.isAddContextLineModalOpen
  );
  const lastKnownCursorPosition = useAppSelector(
    (state) => state.transcript.lastKnownCursorPosition
  );
  const transcriptLength = useAppSelector(
    (state) => state.transcript.displayText.length
  );

  const [contextText, setContextText] = useState("");

  /**
   * @description Resets the local input state.
   */
  const resetLocalState = useCallback(() => {
    setContextText("");
  }, []);

  /**
   * @description Handles closing the dialog and resetting state.
   */
  const handleClose = useCallback(() => {
    dispatch(closeAddContextLineModal());
    resetLocalState();
  }, [dispatch, resetLocalState]);

  /**
   * @description Handles the change event for the input field.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContextText(e.target.value);
  };

  /**
   * @description Handles the "Add" button click.
   */
  const handleAddContext = () => {
    if (!contextText.trim()) {
      return;
    }
    const position = lastKnownCursorPosition ?? transcriptLength;
    // Ensure separator is added with correct newlines
    const textToInsert = `\n## [${contextText.trim()}] ${SLIDE_NOTES_SEPARATOR}\n`;

    dispatch(insertTranscriptText({ textToInsert, position }));
    handleClose();
  };

  // Reset local state if the modal is closed externally
  useEffect(() => {
    if (!isOpen) {
      resetLocalState();
    }
  }, [isOpen, resetLocalState]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      {/* Adjusted width */}
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Transcript Context Line</DialogTitle>
          <DialogDescription>
            Enter the context text you want to add. It will be formatted and
            inserted into the transcript at the current cursor position.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="context-input" className="text-right col-span-1">
              Context
            </Label>
            <Input
              id="context-input"
              value={contextText}
              onChange={handleInputChange}
              placeholder="Enter context text..."
              className="col-span-3"
              aria-label="Context text input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddContext}
            disabled={!contextText.trim()}
          >
            Add Context Line
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
'@

# Update src/components/GeneratePromptModal.tsx
Write-Output "Updating src/components/GeneratePromptModal.tsx..."
Set-Content -Path "src/components/GeneratePromptModal.tsx" -Value @'
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
'@

# Update src/styles/app.css
Write-Output "Updating src/styles/app.css..."
Set-Content -Path "src/styles/app.css" -Value @'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light Theme Colors */
    --background: 0 0% 100%; /* White */
    --foreground: 224 71.4% 4.1%; /* Dark Blue/Black */

    --card: 0 0% 100%; /* White */
    --card-foreground: 224 71.4% 4.1%; /* Dark Blue/Black */

    --popover: 0 0% 100%; /* White */
    --popover-foreground: 224 71.4% 4.1%; /* Dark Blue/Black */

    --primary: 220.9 39.3% 11%; /* Dark Blue */
    --primary-foreground: 210 20% 98%; /* Very Light Gray */

    --secondary: 220 14.3% 95.9%; /* Light Gray */
    --secondary-foreground: 220.9 39.3% 11%; /* Dark Blue */

    --muted: 220 14.3% 95.9%; /* Light Gray */
    --muted-foreground: 220 8.9% 46.1%; /* Mid Gray */

    --accent: 220 14.3% 95.9%; /* Light Gray */
    --accent-foreground: 220.9 39.3% 11%; /* Dark Blue */

    --destructive: 0 84.2% 60.2%; /* Red */
    --destructive-foreground: 210 20% 98%; /* Very Light Gray */

    --border: 220 13% 91%; /* Light Gray Border */
    --input: 220 13% 91%; /* Light Gray Input Border */
    --ring: 224 71.4% 4.1%; /* Dark Blue Ring */

    --radius: 0.5rem;
  }

  .dark {
    /* Dark Theme Colors */
    --background: 224 71.4% 10%; /* Very Dark Blue */
    --foreground: 210 20% 98%; /* Very Light Gray */

    --card: 224 71.4% 11%; /* Slightly Lighter Dark Blue */
    --card-foreground: 210 20% 98%; /* Very Light Gray */

    --popover: 224 71.4% 10%; /* Very Dark Blue */
    --popover-foreground: 210 20% 98%; /* Very Light Gray */

    --primary: 210 20% 98%; /* Very Light Gray */
    --primary-foreground: 220.9 39.3% 11%; /* Dark Blue */

    --secondary: 215 27.9% 16.9%; /* Dark Grayish Blue */
    --secondary-foreground: 210 20% 98%; /* Very Light Gray */

    --muted: 215 27.9% 16.9%; /* Dark Grayish Blue */
    --muted-foreground: 217.9 10.6% 60.6%; /* Lighter Gray */

    --accent: 215 27.9% 16.9%; /* Dark Grayish Blue */
    --accent-foreground: 210 20% 98%; /* Very Light Gray */

    --destructive: 0 62.8% 30.6%; /* Darker Red */
    --destructive-foreground: 210 20% 98%; /* Very Light Gray */

    --border: 215 27.9% 16.9%; /* Dark Grayish Blue Border */
    --input: 215 27.9% 16.9%; /* Dark Grayish Blue Input Border */
    --ring: 216 12.2% 83.9%; /* Lighter Gray Ring */
  }

  /* Base body styles */
  body {
    @apply bg-background text-foreground;
    /* Apply a subtle background pattern */
    /* background-image: linear-gradient(rgba(var(--foreground), 0.02) 1px, transparent 1px), linear-gradient(to right, rgba(var(--foreground), 0.02) 1px, transparent 1px); */
    /* background-size: 20px 20px; */
    min-height: 100vh;
    font-feature-settings: "rlig" 1, "calt" 1; /* Enable common ligatures */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Apply border color to all elements by default */
  * {
    @apply border-border;
  }

  /* Improve focus visibility for accessibility */
  *:focus-visible {
      @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
  }

  /* Remove default outline for mouse users */
  .using-mouse *:focus {
      outline: none !important;
  }

  /* Add smooth scrolling */
  html {
      scroll-behavior: smooth;
  }

  /* Specific styles for textarea to ensure consistent font */
  textarea {
    @apply font-sans;
  }

}
'@

# Update tailwind.config.mjs
Write-Output "Updating tailwind.config.mjs..."
Set-Content -Path "tailwind.config.mjs" -Value @'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Enable class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure content path is correct
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" }, // Changed from 0 to "0"
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }, // Changed from 0 to "0"
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
       fontFamily: {
         sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
         mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
       },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
'@

Write-Output "Step 27 Styling adjustment script execution complete."