# Image-to-Text Extraction

This module provides functionality to extract text from images using OpenAI's Vision model (GPT-4o).

## How It Works

1. The client-side `extractTextFromImage` function in `imageExtractor.ts` takes an image Blob, converts it to base64, and sends it to the server.

2. The server-side function `extractTextFromImageServer` in `server/imageProcessor.ts` handles the request securely and calls our API endpoint.

3. The API endpoint at `/api/ai/image-extract/index.ts` uses the OpenAI API to perform the actual text extraction.

## Setup

1. Create a `.env` file based on `.env.example` and add your OpenAI API key:

   ```
   VITE_LANGDOCK_API_KEY=your_openai_api_key_here
   ```

2. Make sure the OpenAI npm package is installed:
   ```
   npm install openai
   ```

## Usage

```typescript
import { extractTextFromImage } from "~/utils/imageExtractor";

// In an event handler:
const handleImageBlob = async (imageBlob: Blob) => {
  try {
    const extractedText = await extractTextFromImage(imageBlob);
    console.log("Extracted text:", extractedText);
  } catch (error) {
    console.error("Error extracting text:", error);
  }
};
```

## Notes

- The implementation uses the OpenAI Vision model (GPT-4o) which is capable of processing images and extracting text.
- The API key is stored server-side for security reasons.
- Images are converted to base64 strings before being sent to the API.
