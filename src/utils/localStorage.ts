/**
 * @description
 * Provides utility functions for interacting with the browser's localStorage.
 * Includes basic error handling for common issues like quota limits.
 *
 * Key features:
 * - getItem: Safely retrieves an item from localStorage.
 * - setItem: Safely saves an item to localStorage.
 *
 * @dependencies
 * - react-hot-toast: For displaying error messages to the user.
 *
 * @notes
 * - Errors during localStorage access (e.g., storage disabled, quota exceeded)
 *   are caught, logged, and optionally shown as a toast notification.
 * - These functions assume string values are stored. JSON parsing/stringifying
 *   should happen before calling setItem or after calling getItem if storing objects.
 */
import toast from "react-hot-toast";

/**
 * @description Safely retrieves an item from localStorage by key.
 * @param key - The key of the item to retrieve.
 * @returns The stored string value, or null if the key doesn't exist or localStorage is unavailable/errors occur.
 */
export function getItem(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null; // Indicate localStorage not available
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    // Optional: Show a less intrusive error, as reading failure might be less critical initially
    // toast.error(`Failed to load data for ${key}. Storage might be unavailable.`);
    return null; // Return null on error
  }
}

/**
 * @description Safely saves an item to localStorage.
 * @param key - The key under which to store the value.
 * @param value - The string value to store.
 * @returns void
 */
export function setItem(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    } else {
      console.warn("localStorage not available, skipping setItem.");
    }
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    // Show a toast notification as saving failure is usually more important for the user
    toast.error(
      `Failed to save data for ${key}. Storage might be full or unavailable.`
    );
  }
}
