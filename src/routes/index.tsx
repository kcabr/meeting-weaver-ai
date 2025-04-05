/**
 * @description
 * Defines the component for the root route ("/") of the application.
 * This component now renders the main application layout (AppLayout).
 *
 * Key features:
 * - Serves as the entry point component for the application UI.
 * - Renders the AppLayout which includes the Header and main content area.
 *
 * @dependencies
 * - @tanstack/react-router: For creating the file route.
 * - ~/components/AppLayout: The main layout component.
 *
 * @notes
 * - Previous landing page content has been removed.
 * - The 'seo' utility import and usage were removed as the landing page content is gone.
 *   SEO handling might be added back globally or per-route later if needed.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "~/components/AppLayout"; // Import the main layout

export const Route = createFileRoute("/")({
  component: Index,
  // Removed head function from previous example as it was specific to the landing page.
  // Global head settings are in __root.tsx. Route-specific head can be added if needed.
});

/**
 * @description The component rendered for the index route ("/").
 * It simply renders the main application layout.
 */
function Index() {
  return <AppLayout />;
}
