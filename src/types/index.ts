/**
 * @description
 * Barrel file for exporting all core application types.
 * This makes importing types more convenient elsewhere in the application.
 *
 * @dependencies
 * - ./app-types: Contains the actual type definitions.
 *
 * @notes
 * - Simplifies import statements, e.g., import type { ContextState } from '~/types';
 */

export * from "./app-types";

// Interface for the state managed by contextSlice.ts
export interface ContextState {
  text: string;
}

// Interface for the state managed by meetingDetailsSlice.ts
export interface MeetingDetailsState {
  meetingName: string;
  meetingAgenda: string;
  ourTeam: string;
  clientTeam: string;
}

// Interface for the state managed by modalSlice.ts
// ... existing code ...
