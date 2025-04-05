/**
 * @description
 * Configures the main Redux Toolkit store for the application.
 * It combines all the different state slices into a single store instance.
 * Also exports the RootState and AppDispatch types for use with typed hooks.
 *
 * Key features:
 * - Combines reducers from context, slideNotes, transcript, and modal slices.
 * - Includes the user slice (retained from template cleanup).
 * - Exports RootState and AppDispatch for type safety.
 *
 * @dependencies
 * - @reduxjs/toolkit: For store configuration.
 * - ./slices/*: Imports the individual slice reducers.
 *
 * @notes
 * - Middleware (like thunks for async actions or logging) can be added here if needed in the future.
 */

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import contextReducer from './slices/contextSlice';
import slideNotesReducer from './slices/slideNotesSlice';
import transcriptReducer from './slices/transcriptSlice';
import modalReducer from './slices/modalSlice';

/**
 * @description The main Redux store configuration.
 */
export const store = configureStore({
  reducer: {
    user: userReducer, // Kept from template cleanup, may or may not be used directly by MeetingWeaver features
    context: contextReducer,
    slideNotes: slideNotesReducer,
    transcript: transcriptReducer,
    modals: modalReducer,
  },
  // Middleware can be added here if needed, e.g., for async thunks
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myMiddleware),
});

/**
 * @description Type representing the entire Redux state tree.
 */
export type RootState = ReturnType<typeof store.getState>;
/**
 * @description Type representing the dispatch function, useful for typing async actions (thunks).
 */
export type AppDispatch = typeof store.dispatch;
