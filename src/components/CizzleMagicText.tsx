import { postAiGetCizzleMagicText } from "~/services/ai";
import { Lightbulb } from "lucide-react";
import React, { ChangeEvent, ReactElement, useState } from "react";
import { AccentButton } from "./AccentButton";
import { Loader2 } from "lucide-react";

interface InputElementProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

interface CizzleMagicTextProps {
  prompt: string;
  children: ReactElement<InputElementProps>;
  value: string;
  setValue: (value: string) => void;
}

const CizzleMagicText: React.FC<CizzleMagicTextProps> = ({
  prompt,
  value,
  setValue,
  children,
}) => {
  //const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastSubmittedText, setLastSubmittedText] = useState<string>("");

  // Determine whether the text has been modified since the last successful cleaning.
  const isModified = value !== lastSubmittedText;

  // Handle input changes from either an Input or a TextArea.
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  // Execute the prompt by calling the backend API.
  const executePrompt = async () => {
    if (!isModified) return;

    if (!value) return;

    setLoading(true);
    try {
      const response = await postAiGetCizzleMagicText({
        prompt: prompt,
        inputText: value,
      });

      //   if (!response.ok) {
      //     throw new Error('API call failed');
      //   }

      // Assume the API returns the cleaned text in a property called "cleanedText".
      setValue(response);
      setLastSubmittedText(response);
    } catch (error) {
      console.error("Error cleaning text:", error);
      // Optionally, implement user-facing error handling.
    } finally {
      setLoading(false);
    }
  };

  // Clone the passed child and inject controlled props.
  const clonedInput = React.cloneElement(children, {
    value: value,
    onChange: handleChange,
    disabled: loading || (children.props as InputElementProps).disabled,
  });

  return (
    <div className="flex items-center">
      {clonedInput}
      <AccentButton
        onClick={executePrompt}
        disabled={loading || !isModified}
        size="icon"
        className="ml-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lightbulb className="h-4 w-4" />
        )}
      </AccentButton>
    </div>
  );
};

export default CizzleMagicText;
