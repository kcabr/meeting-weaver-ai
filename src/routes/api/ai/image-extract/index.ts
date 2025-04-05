import { z } from "zod";
import OpenAI from "openai";
import { createAPIFileRoute } from "@tanstack/react-start/api";

// Schema for validating request body
const imageExtractRequestSchema = z.object({
  imageData: z.string().min(1, "Image data is required"),
});

// Create OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.VITE_LANGDOCK_API_KEY,
});

export const APIRoute = createAPIFileRoute("/api/ai/image-extract")({
  POST: async ({ request }) => {
    try {
      // Parse and validate the request body
      const body = await request.json();
      const { imageData } = imageExtractRequestSchema.parse(body);

      // Ensure the imageData is properly formatted as a data URL
      const dataUrl = imageData.startsWith("data:")
        ? imageData
        : `data:image/jpeg;base64,${imageData}`;

      // Call OpenAI's Vision model to extract text from the image
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Using the same model as in the C# implementation
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract all the text from the attached image. Include newlines.",
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl,
                },
              },
            ],
          },
        ],
      });

      // Extract the text from the response
      const extractedText = response.choices[0].message.content || "";

      // Return the extracted text
      return Response.json(extractedText);
    } catch (error) {
      console.error("Error extracting text from image:", error);

      // Return a proper error response
      return Response.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to extract text from image",
        },
        { status: 500 }
      );
    }
  },
});
