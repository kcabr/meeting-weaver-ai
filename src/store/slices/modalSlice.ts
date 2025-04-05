/**
 * @description
 * Redux slice for managing the visibility state of all modals within the application.
 * Each modal's open/closed status is controlled by a boolean flag in this slice.
 *
 * Key features:
 * - Tracks visibility for Context, ImageExtract, AddContextLine, and GeneratePrompt modals.
 * - Provides individual actions to open and close each modal.
 * - Initializes with all modals closed.
 *
 * @dependencies
 * - @reduxjs/toolkit: For creating the slice and reducers.
 * - ~/types: Imports the ModalState interface for type safety.
 *
 * @notes
 * - This centralizes modal state management, making it easy to control modal visibility from anywhere in the app.
 */

import { createSlice } from '@reduxjs/toolkit';
import type { ModalState } from '~/types';

/**
 * @description Initial state for the modal slice. All modals start closed.
 */
const initialState: ModalState = {
  isContextModalOpen: false,
  isImageExtractModalOpen: false,
  isAddContextLineModalOpen: false,
  isGeneratePromptModalOpen: false,
};

/**
 * @description Redux slice definition for modal visibility state.
 */
export const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    // Context Modal Actions
    openContextModal: (state) => {
      state.isContextModalOpen = true;
    },
    closeContextModal: (state) => {
      state.isContextModalOpen = false;
    },
    // Image Extract Modal Actions
    openImageExtractModal: (state) => {
      state.isImageExtractModalOpen = true;
    },
    closeImageExtractModal: (state) => {
      state.isImageExtractModalOpen = false;
    },
    // Add Context Line Modal Actions
    openAddContextLineModal: (state) => {
      state.isAddContextLineModalOpen = true;
    },
    closeAddContextLineModal: (state) => {
      state.isAddContextLineModalOpen = false;
    },
    // Generate Prompt Modal Actions
    openGeneratePromptModal: (state) => {
      state.isGeneratePromptModalOpen = true;
    },
    closeGeneratePromptModal: (state) => {
      state.isGeneratePromptModalOpen = false;
    },
  },
});

// Export action creators
export const {
  openContextModal,
  closeContextModal,
  openImageExtractModal,
  closeImageExtractModal,
  openAddContextLineModal,
  closeAddContextLineModal,
  openGeneratePromptModal,
  closeGeneratePromptModal,
} = modalSlice.actions;

// Export the reducer
export default modalSlice.reducer;
