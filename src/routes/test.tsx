import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import CizzleMagicText from "~/components/CizzleMagicText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";

export const Route = createFileRoute("/test")({
  component: AiTest,
  head: () => ({
    title: "AI Magic Text Demo",
    meta: [
      {
        name: "description",
        content: "Test the AI magic text functionality",
      },
    ],
  }),
});

function AiTest() {
  const [text, setText] = useState<string>("");
  const [prompt, setPrompt] = useState<string>(
    "Rewrite this text to make it more professional and concise"
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">AI Magic Text Demo</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Customize Prompt</CardTitle>
          <CardDescription>
            Edit the prompt that will be sent to the AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter an instruction for the AI"
            className="w-full"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Magic Text Input</CardTitle>
          <CardDescription>
            Enter text below, then click the lightbulb icon to apply AI magic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CizzleMagicText prompt={prompt} value={text} setValue={setText}>
            <Textarea
              placeholder="Enter your text here..."
              className="min-h-[200px]"
            />
          </CizzleMagicText>
        </CardContent>
      </Card>
    </div>
  );
}
