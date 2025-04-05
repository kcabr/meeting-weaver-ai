import { z } from "zod";
import OpenAI from "openai";
import { createAPIFileRoute } from "@tanstack/react-start/api";

const magicTextInputSchema = z.object({
  prompt: z.string(),
  inputText: z.string(),
});

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const APIRoute = createAPIFileRoute("/api/ai/magic-text")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const { prompt, inputText } = magicTextInputSchema.parse(body);

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "text",
                text: inputText,
              },
            ],
          },
        ],
      });

      // Return the response content
      return Response.json(response.choices[0].message.content);
    } catch (error) {
      console.error("Error processing magic text request:", error);
      return Response.json(
        { error: "Failed to process request" },
        { status: 500 }
      );
    }
  },
});
