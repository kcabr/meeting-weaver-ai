/**
 * @description
 * Renders the main two-column content area of the application.
 * This component establishes the side-by-side layout for the Slide/Notes panel
 * and the Transcript panel.
 *
 * Key features:
 * - Uses CSS Grid for a two-column layout with a gap.
 * - Designed to fill the remaining vertical space below the header.
 * - Renders the SlideNotesPanel and the TranscriptPanel components.
 *
 * @dependencies
 * - react: For component creation.
 * - ./SlideNotesPanel: The component for the left panel.
 * - ./TranscriptPanel: The component for the right panel.
 *
 * @notes
 * - The 'flex-grow' class ensures this component expands vertically within its flex container.
 * - Each panel is wrapped in a div to apply consistent styling (border, padding, background, shadow) and internal flex layout.
 */
import React from 'react';
import { SlideNotesPanel } from './SlideNotesPanel';
import { TranscriptPanel } from './TranscriptPanel'; // Import the TranscriptPanel

// BEGIN WRITING FILE CODE
export function MainContentLayout() {
  return (
    // Use flex-grow to take available vertical space, grid for columns
    // h-0 is important for flex-grow children within a flex container to allow shrinking
    <main className="grid grid-cols-2 gap-4 p-4 flex-grow h-0">
      {/* Left Panel: Slide / Meeting Notes */}
      <div className="flex flex-col h-full border rounded p-4 bg-card text-card-foreground shadow-sm overflow-hidden">
        {/* overflow-hidden prevents content from breaking out */}
        <SlideNotesPanel />
      </div>

      {/* Right Panel: Meeting Transcript */}
      <div className="flex flex-col h-full border rounded p-4 bg-card text-card-foreground shadow-sm overflow-hidden">
        {/* overflow-hidden prevents content from breaking out */}
        <TranscriptPanel />
      </div>
    </main>
  );
}
