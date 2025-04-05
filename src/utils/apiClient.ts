/**
 * @description
 * This module provides functions for interacting with external APIs,
 * specifically the Langdock API for cleaning transcripts.
 *
 * Key features:
 * - cleanTranscript: Sends transcript text to the Langdock API for cleaning.
 *
 * @dependencies
 * - None directly, but uses browser 'fetch' API and environment variables.
 *
 * @notes
 * - Requires VITE_LANGDOCK_CLEAN_ENDPOINT and VITE_LANGDOCK_API_KEY environment variables to be set.
 * - Assumes the Langdock API expects a JSON body with 'text' and 'prompt' fields
 *   and returns a JSON body with a 'cleaned_text' field on success.
 * - Handles potential API errors and network issues.
 */

// BEGIN WRITING FILE CODE

/**
 * @description Sends the provided transcript text to the configured Langdock API endpoint for cleaning.
 * @param text - The raw transcript text to be cleaned.
 * @returns A Promise resolving with the cleaned text string.
 * @throws An error if the API call fails or returns an error status.
 */
export async function cleanTranscript(text: string): Promise<string> {
  const endpoint = import.meta.env.VITE_LANGDOCK_CLEAN_ENDPOINT;
  const apiKey = import.meta.env.VITE_LANGDOCK_API_KEY;

  if (!endpoint || !apiKey) {
    const errorMessage =
      "Langdock API endpoint or API key is not configured in environment variables.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const prompt =
    "Remove filler words, correct grammar, format turns, maintain speaker identity if present.";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text,
        prompt,
      }),
    });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        // Ignore if response body is not JSON
        errorBody = await response.text();
      }
      const errorMessage = `Langdock API error: ${errorBody}`;
      console.error("API Error Details:", errorBody);
      throw new Error(errorMessage.trim());
    }

    const data = await response.json();

    // Assuming the API returns the cleaned text in a 'cleaned_text' field
    // Adjust this field name if the actual API response is different
    if (typeof data.cleaned_text !== "string") {
      console.error("Unexpected API response format:", data);
      throw new Error("Received unexpected format from Langdock API.");
    }

    return data.cleaned_text;
  } catch (error) {
    console.error("Error during cleanTranscript API call:", error);
    // Rethrow the error to be caught by the calling hook/component
    throw error instanceof Error
      ? error
      : new Error("An unknown network error occurred.");
  }
}
// END WRITING FILE CODE
