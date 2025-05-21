import React from "react";
import { Badge } from "~/components/ui/badge";

interface TokenPillProps {
  text: string;
  className?: string;
}

// A very rough approximation of token count.
// Real tokenization depends on the specific LLM's vocabulary and algorithm.
const estimateTokens = (text: string): number => {
  if (!text) return 0;
  // Split by spaces and common punctuation marks
  const words = text.split(/[\s.,;!?()[\]{}-]+/);
  // Filter out empty strings that may result from multiple separators
  return words.filter(Boolean).length;
};

export function TokenPill({ text, className }: TokenPillProps) {
  const tokenCount = estimateTokens(text);

  return (
    <Badge variant="secondary" className={className}>
      Estimated Tokens: {tokenCount}
    </Badge>
  );
}
