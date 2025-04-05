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
