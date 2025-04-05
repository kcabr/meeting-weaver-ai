import React, { useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { submitFeedback } from "~/utils/feedback";
import { postAiGetCizzleMagicText } from "~/services/ai";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [title, setTitle] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageAreaRef = useRef<HTMLDivElement>(null);

  // For drag-and-drop image handling
  const [isDragging, setIsDragging] = useState(false);

  // Handle image file processing
  const processImageFile = (file: File) => {
    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image file is too large. Maximum size is 5MB.");
      return;
    }

    // Check file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      toast.error(
        "Unsupported file format. Please use JPG, PNG, GIF, or WEBP."
      );
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageData(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle paste event for images
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processImageFile(file);
          break;
        }
      }
    }
  }, []);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processImageFile(file);
    }
  }, []);

  // Generate AI title based on feedback text
  const generateTitle = async () => {
    if (!feedbackText.trim()) {
      toast.error("Please enter feedback text before generating a title");
      return;
    }

    setIsGeneratingTitle(true);
    try {
      const generatedTitle = await postAiGetCizzleMagicText({
        prompt:
          "Please generate a concise title based on the following end user software platform feedback: ",
        inputText: feedbackText,
      });

      setTitle(generatedTitle);
    } catch (error) {
      console.error("Error generating title:", error);
      toast.error(
        "Failed to generate title. Please try again or enter one manually."
      );
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  // Setup the mutation for feedback submission
  const feedbackMutation = useMutation({
    mutationFn: useServerFn(submitFeedback),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Feedback submitted successfully!");
        // Reset form and close modal
        setTitle("");
        setFeedbackText("");
        setImageData(null);
        onOpenChange(false);
      } else {
        toast.error(data.error || "Failed to submit feedback");
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred. Please try again.");
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    setIsSubmitting(true);
    feedbackMutation.mutate({
      data: {
        title,
        feedback: feedbackText,
        image_data: imageData,
      },
    });
  };

  // Reset form when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Only reset if we're closing and not in the middle of submitting
      if (!isSubmitting) {
        setTitle("");
        setFeedbackText("");
        setImageData(null);
      }
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title*</Label>
            <div className="flex items-center gap-2">
              <Input
                id="title"
                placeholder="Enter a title for your feedback"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1"
                disabled={isGeneratingTitle}
              />
              <Button
                onClick={generateTitle}
                size="sm"
                variant="outline"
                className="whitespace-nowrap"
                disabled={isGeneratingTitle || !feedbackText.trim()}
              >
                {isGeneratingTitle ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="feedback">Feedback*</Label>
            <Textarea
              id="feedback"
              placeholder="Please provide your feedback or bug report..."
              className="min-h-[200px] resize-y"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              onPaste={handlePaste}
            />
          </div>

          <div className="grid gap-2">
            <Label>Attach Screenshot (Optional)</Label>
            <div
              ref={imageAreaRef}
              className={`border-2 border-dashed rounded-md p-4 text-center h-32 flex items-center justify-center cursor-pointer ${
                isDragging ? "border-primary bg-primary/10" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onPaste={handlePaste}
              tabIndex={0}
            >
              {imageData ? (
                <div className="relative w-full h-full">
                  <img
                    src={imageData}
                    alt="Preview"
                    className="max-h-full max-w-full mx-auto object-contain"
                  />
                  <button
                    onClick={() => setImageData(null)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="text-gray-500">
                  <p>Paste or drag & drop an image here</p>
                  <p className="text-xs mt-1">
                    (PNG, JPG, GIF, WEBP - max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !feedbackText.trim()}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
