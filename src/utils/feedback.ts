import { prisma } from "./prisma";
import { getAuth } from "@clerk/tanstack-start/server";
import { z } from "zod";
import { getWebRequest } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";

// Define validation schema for feedback submission
export const feedbackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  feedback: z.string().min(1, "Feedback is required"),
  image_data: z.string().nullable().optional(),
});

// Type for feedback submission
export type FeedbackInput = z.infer<typeof feedbackSchema>;

// Create serverFn for submitting feedback
export const submitFeedback = createServerFn({ method: 'POST' })
  .validator((input: FeedbackInput) => feedbackSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      // Get auth data from Clerk
      const req = getWebRequest();
      if (!req) {
        throw new Error("No request object available");
      }
      
      const auth = await getAuth(req);
      if (!auth.userId) {
        throw new Error("User not authenticated");
      }
      
      // Create feedback in database
      const feedback = await prisma.feedback.create({
        data: {
          title: data.title,
          feedback: data.feedback,
          image_data: data.image_data || null,
          userId: auth.userId,
        },
      });
      
      return { success: true, feedbackId: feedback.id };
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      };
    }
  });