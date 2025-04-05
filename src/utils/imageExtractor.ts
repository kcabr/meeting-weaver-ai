/**
 * @description
 * Utility function for extracting text from an image blob using OpenAI's Vision model API.
 * This implementation calls a TanStack server function that securely passes the image to
 * the OpenAI API without exposing the API key to the client.
 *
 * Key features:
 * - Accepts an image Blob as input.
 * - Converts the image to base64 for API transmission.
 * - Calls a server function to handle the actual API request.
 * - Returns a Promise that resolves with the extracted text string.
 *
 * @dependencies
 * - TanStack Server Functions
 *
 * @param imageData - The image file data as a Blob object.
 * @returns A Promise resolving with the extracted text string, or rejecting with an error.
 */

import { extractTextFromImageServer } from "~/server/imageProcessor";

export async function extractTextFromImage(imageData: Blob): Promise<string> {
  try {
    // Convert image to base64
    const base64Data = await blobToBase64(imageData);

    // Call the server function with the base64 image data
    const extractedText = await extractTextFromImageServer(base64Data);

    return extractedText;
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to extract text from image");
  }
}

/**
 * Converts a Blob to a base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract the base64 part after the data URL prefix
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
