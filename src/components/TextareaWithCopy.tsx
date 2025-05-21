import React from "react";
import { Textarea, type TextareaProps } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { copyToClipboard } from "~/utils/textUtils";
import { Copy as CopyIcon } from "lucide-react";

interface TextareaWithCopyProps extends TextareaProps {
  value: string;
  copyButtonTooltip?: string;
}

export function TextareaWithCopy({
  value,
  copyButtonTooltip = "Copy to Clipboard",
  ...textareaProps
}: TextareaWithCopyProps) {
  const handleCopy = () => {
    copyToClipboard(value);
  };

  return (
    <div className="relative">
      <Textarea value={value} {...textareaProps} />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={handleCopy}
        title={copyButtonTooltip}
      >
        <CopyIcon className="h-4 w-4" />
        <span className="sr-only">Copy content</span>
      </Button>
    </div>
  );
}
