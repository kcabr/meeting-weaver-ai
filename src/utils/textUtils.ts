/**
 * @description
 * This file provides utility functions for common text manipulations required
 * across the MeetingWeaver AI application. This includes tasks like copying text
 * to the clipboard, saving text to a file, inserting text at specific positions,
 * and navigating within text areas based on separators or prefixes.
 *
 * Key features:
 * - Copying text to the clipboard with user feedback.
 * - Saving text content as a downloadable file.
 * - Inserting text at a given cursor position.
 * - Finding nearest separator/prefix lines for navigation.
 *
 * @dependencies
 * - react-hot-toast: For providing user feedback on clipboard and save operations.
 *
 * @notes
 * - Error handling for clipboard and save operations is included.
 * - saveTextToFile uses Blob and Object URL for client-side file generation.
 */

// BEGIN WRITING FILE CODE
import toast from "react-hot-toast";

/**
 * @description Copies the provided text to the user's clipboard using the
 * navigator.clipboard API. Shows toast notifications for success or failure.
 * @param text - The string to be copied to the clipboard.
 * @returns Promise<void> - Resolves when the copy operation is attempted.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    toast.error("Clipboard API not available in this browser.");
    console.error("Clipboard API not supported");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  } catch (err) {
    toast.error("Failed to copy text to clipboard.");
    console.error("Failed to copy text: ", err);
  }
}

/**
 * @description Inserts text at a specific cursor position within a given string.
 * Calculates the new text content and the expected cursor position after insertion.
 * @param currentText - The original text string.
 * @param textToInsert - The string to insert into the currentText.
 * @param cursorPosition - The index in currentText where insertion should occur.
 *                         If null or undefined, insertion happens at the end.
 * @returns An object containing:
 *          - newText: The resulting string after insertion.
 *          - newCursorPosition: The calculated cursor position immediately after the inserted text.
 */
export function insertTextAtCursor(
  currentText: string,
  textToInsert: string,
  cursorPosition: number | null | undefined
): { newText: string; newCursorPosition: number } {
  // Handle null/undefined cursor position by defaulting to the end of the text
  const position = cursorPosition ?? currentText.length;

  // Ensure position is within valid bounds
  const validPosition = Math.max(0, Math.min(position, currentText.length));

  // Construct the new text string
  const newText =
    currentText.slice(0, validPosition) +
    textToInsert +
    currentText.slice(validPosition);

  // Calculate the new cursor position (end of the inserted text)
  const newCursorPosition = validPosition + textToInsert.length;

  return { newText, newCursorPosition };
}

/**
 * @description Finds the starting index of the nearest line that exactly matches the separator,
 * searching upwards or downwards from the current cursor position.
 * @param text - The text content to search within.
 * @param currentPosition - The starting cursor position index.
 * @param separator - The exact string that constitutes the separator line.
 * @param direction - The direction to search ('up' or 'down').
 * @returns The starting index of the found line, or null if no such line is found.
 */
export function findNearestSeparatorLine(
  text: string,
  currentPosition: number,
  separator: string,
  direction: "up" | "down"
): number | null {
  const lines = text.split("\n");
  // Determine the line index the cursor is currently on or before
  let currentLineIndex =
    text.substring(0, currentPosition).split("\n").length - 1;

  if (direction === "up") {
    // Search backwards from the line *before* the current one
    for (let i = currentLineIndex - 1; i >= 0; i--) {
      if (lines[i].trim() === separator) {
        // Check if the line *exactly* matches the separator (ignoring potential whitespace)
        // Calculate the starting index of this line
        let index = 0;
        for (let j = 0; j < i; j++) {
          index += lines[j].length + 1; // Add line length + 1 for newline character
        }
        return index;
      }
    }
    return null; // No separator found above
  } else {
    // direction === 'down'
    // Search forwards from the line *after* the current one
    for (let i = currentLineIndex + 1; i < lines.length; i++) {
      if (lines[i].trim() === separator) {
        // Check if the line *exactly* matches the separator
        // Calculate the starting index of this line
        let index = 0;
        for (let j = 0; j < i; j++) {
          index += lines[j].length + 1; // Add line length + 1 for newline character
        }
        return index;
      }
    }
    return null; // No separator found below
  }
}

/**
 * @description Finds the index of the nearest line starting with a specific prefix,
 * searching upwards or downwards from the current cursor position.
 * (To be implemented in Step 21)
 * @param text - The text content to search within.
 * @param currentPosition - The starting cursor position index.
 * @param prefix - The prefix string the line must start with.
 * @param direction - The direction to search ('up' or 'down').
 * @returns The starting index of the found line, or null if no such line is found.
 */
// export function findNearestPrefixedLine(text: string, currentPosition: number, prefix: string, direction: 'up' | 'down'): number | null {
//   // Implementation in Step 21
//   return null;
// }

/**
 * @description Triggers a browser download for the given text content.
 * Creates a Blob, generates an object URL, simulates a click on a hidden link,
 * and then revokes the object URL.
 * @param text - The text content to save.
 * @param filename - The desired name for the downloaded file.
 */
export function saveTextToFile(text: string, filename: string): void {
  try {
    // Create a Blob from the text content
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

    // Create an object URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(url);

    toast.success(`File "${filename}" download started.`);
  } catch (error) {
    console.error("Error saving text to file:", error);
    toast.error("Failed to save file. See console for details.");
  }
}
