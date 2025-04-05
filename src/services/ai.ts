interface MagicTextInput {
  prompt: string;
  inputText: string;
}

/**
 * Sends text to OpenAI to process according to the given prompt
 * and returns the enhanced/modified text
 */
export async function postAiGetCizzleMagicText({
  prompt,
  inputText,
}: MagicTextInput): Promise<string> {
  try {
    const response = await fetch("/api/ai/magic-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        inputText,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in postAiGetCizzleMagicText:", error);
    throw error;
  }
}
