/**
 * @description
 * Renders the main two-column content area of the application.
 * This component establishes the side-by-side layout for the Slide/Notes panel
 * and the Transcript panel.
 *
 * Key features:
 * - Uses CSS Grid for a two-column layout with a gap.
 * - Designed to fill the remaining vertical space below the header.
 * - Renders the SlideNotesPanel and a placeholder for the TranscriptPanel.
 *
 * @dependencies
 * - react: For component creation.
 * - ./SlideNotesPanel: The component for the left panel.
 *
 * @notes
 * - The 'flex-grow' class ensures this component expands vertically.
 * - TranscriptPanel placeholder will be replaced later.
 */
import React from "react";
import { SlideNotesPanel } from "./SlideNotesPanel"; // Import the SlideNotesPanel

export function MainContentLayout() {
  return (
    // Use flex-grow to take available vertical space, grid for columns
    // Set an explicit height or min-height on the parent container if needed
    // Adding h-0 to flex-grow allows it to shrink correctly if content overflows
    <main className="grid grid-cols-2 gap-4 p-4 flex-grow h-0">
      {/* Left Panel: Slide / Meeting Notes */}
      {/* Wrap panel in a div that allows internal flex-grow */}
      <div className="flex flex-col h-full border rounded p-4 bg-card text-card-foreground shadow-sm">
        <SlideNotesPanel />
      </div>

      {/* Right Panel Placeholder */}
      <div className="border rounded p-4 bg-card text-card-foreground shadow-sm">
        {/* Placeholder for TranscriptPanel */}
        Right Panel: Meeting Transcript (Placeholder)
      </div>
    </main>
  );
}
