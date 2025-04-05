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

export * from './app-types';
