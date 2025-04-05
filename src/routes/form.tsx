import { createFileRoute } from "@tanstack/react-router";
import { TestForm } from "~/components/forms/TestForm";

export const Route = createFileRoute("/form")({
  component: FormPage,
  head: () => ({
    title: "Form Showcase | TanStack Form Demo",
    meta: [
      {
        name: "description",
        content: "A comprehensive showcase of TanStack Form's features",
      },
    ],
  }),
});

function FormPage() {
  return (
    <div className="container py-8">
      <TestForm />
    </div>
  );
}
