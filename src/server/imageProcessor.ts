/**
 * @description
 * Server function for extracting text from an image using OpenAI's Vision model.
 *
 * Key features:
 * - Takes a base64-encoded image as input.
 * - Uses TanStack server functions to make the API call server-side.
 * - Returns the extracted text as a string.
 *
 * @dependencies
 * - TanStack Server Functions
 */

import { createServerFn } from "@tanstack/react-start";

export const extractTextFromImageServer = createServerFn({
  method: "POST",
}).handler(async ({ data: imageBase64 }) => {
  try {
    // Make a fetch request to our API route
    const response = await fetch(
      `${window.location.origin}/api/ai/image-extract`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: imageBase64,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    // Return the extracted text
    return await response.json();
  } catch (error) {
    console.error("Error in extractTextFromImageServer:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to extract text from image");
  }
});
