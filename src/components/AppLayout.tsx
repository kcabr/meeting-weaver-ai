/**
 * @description
 * Defines the overall layout structure of the MeetingWeaver AI application.
 * It combines the Header and the MainContentLayout into a single cohesive view.
 * Includes logic to dispatch actions for loading persisted state from localStorage on mount.
 * Renders global modal components.
 *
 * Key features:
 * - Uses flexbox to arrange Header and MainContentLayout vertically.
 * - Ensures the layout occupies the full screen height.
 * - Dispatches actions to load persisted context, slide notes, and transcript data on initial render.
 * - Includes modal components (ContextModal, ImageExtractModal, AddContextLineModal, GeneratePromptModal)
 *   that can be shown throughout the application.
 *
 * @dependencies
 * - react: For component creation and useEffect hook.
 * - react-redux: For dispatching actions (useAppDispatch).
 * - ./Header: The application header component.
 * - ./MainContentLayout: The main two-column content area component.
 * - ./ContextModal: The context modal component.
 * - ./ImageExtractModal: The image extraction modal component.
 * - ./AddContextLineModal: The context line modal component.
 * - ./GeneratePromptModal: The prompt generation modal component.
 * - ~/store/hooks: Typed Redux dispatch hook.
 * - ~/store/slices/contextSlice: Action creator for loading context.
 * - ~/store/slices/slideNotesSlice: Action creator for loading slide notes.
 * - ~/store/slices/transcriptSlice: Action creator for loading transcript.
 *
 * @notes
 * - This component acts as the primary container rendered by the main route.
 * - The useEffect hook runs only once when the component mounts.
 * - Modals are placed here so they're available globally when triggered via Redux state.
 */
import React, { useEffect } from "react";
import { Header } from "./Header";
import { MainContentLayout } from "./MainContentLayout";
import { ContextModal } from "./ContextModal";
import { ImageExtractModal } from "./ImageExtractModal";
import { AddContextLineModal } from "./AddContextLineModal";
import { GeneratePromptModal } from "./GeneratePromptModal"; // Import the new modal
import { useAppDispatch } from "~/store/hooks";
import { loadContext } from "~/store/slices/contextSlice";
import { loadSlideNotes } from "~/store/slices/slideNotesSlice";
import { loadTranscript } from "~/store/slices/transcriptSlice";

// BEGIN WRITING FILE CODE
export function AppLayout() {
  const dispatch = useAppDispatch();

  /**
   * @description Effect hook to dispatch loading actions when the component mounts.
   * This triggers the initial population of Redux state from localStorage.
   */
  useEffect(() => {
    dispatch(loadContext());
    dispatch(loadSlideNotes());
    dispatch(loadTranscript());
  }, [dispatch]); // Dependency array ensures this runs only once on mount

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MainContentLayout />

      {/* Global Modals */}
      <ContextModal />
      <ImageExtractModal />
      <AddContextLineModal />
      <GeneratePromptModal /> {/* Render the Generate Prompt Modal */}
      {/* Add other global modals here as needed */}
    </div>
  );
}
// END WRITING FILE CODE
