/**
 * @description
 * This is the root component for the entire application's routing structure.
 * It sets up the basic HTML document structure (html, head, body) and includes
 * global providers like Redux Provider and React Query Provider.
 * It also renders the main content area ('<Outlet />') where nested routes will be displayed.
 *
 * Key features:
 * - Defines the root HTML structure.
 * - Includes global meta tags, links (favicon, CSS).
 * - Wraps the application in the Redux Provider ('<Provider>').
 * - Wraps the application in the React Query Provider ('<QueryClientProvider>').
 * - Renders the TanStack Router Devtools for debugging.
 * - Renders the Toaster component for notifications.
 * - Defines default error and not found components.
 *
 * @dependencies
 * - @tanstack/react-router: For routing components ('Outlet', 'createRootRoute', etc.).
 * - @tanstack/react-query: For server state management ('QueryClientProvider').
 * - react-redux: For Redux state management ('Provider').
 * - react-hot-toast: For displaying notifications ('Toaster').
 * - ~/components/DefaultCatchBoundary: Custom component for displaying route errors.
 * - ~/components/NotFound: Custom component for 404 pages.
 * - ~/store: Imports the configured Redux store.
 * - ~/styles/app.css: Imports global application styles.
 *
 * @notes
 * - The 'RootDocument' component provides the basic HTML shell.
 * - The Redux Provider makes the store accessible to all child components.
 * - ClerkProvider and related auth logic were removed during cleanup (Step 3).
 */
/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux"; // Import Redux Provider
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary.js";
import { NotFound } from "~/components/NotFound.js";
import { store } from "~/store"; // Import the configured Redux store
import appCss from "~/styles/app.css?url";

// Create a client for React Query
const queryClient = new QueryClient();

/**
 * @description Configuration for the root route of the application.
 */
export const Route = createRootRoute({
  /**
   * @description Configures the content of the <head> tag for the application.
   */
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      // Note: Title might be better managed per-route
      {
        title: "MeetingWeaver AI", // Set a default title
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  /**
   * @description Component to render when an error occurs in this route or its children.
   */
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  /**
   * @description Component to render when no matching route is found.
   */
  notFoundComponent: () => <NotFound />,
  /**
   * @description The main component rendered for the root route.
   */
  component: RootComponent,
});

/**
 * @description The core component that sets up global providers.
 */
function RootComponent() {
  return (
    // Wrap the entire application with the Redux Provider
    <Provider store={store}>
      {/* React Query Provider is kept from template */}
      <QueryClientProvider client={queryClient}>
        <RootDocument>
          {/* Outlet renders the matched child route component */}
          <Outlet />
        </RootDocument>
      </QueryClientProvider>
    </Provider>
  );
}

/**
 * @description Renders the basic HTML document structure (<html>, <head>, <body>).
 * @param children - The content to be rendered within the <body> tag.
 */
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        {/* Renders meta tags, links defined in Route.head */}
        <HeadContent />
        {/* Optional: Include inline styles or additional head elements */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .bg-pattern {
            /* background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='currentColor' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E"); */
            min-height: 100vh; /* Ensure body takes at least full viewport height */
          }

          /* Optional: Dark mode pattern styling */
          /* .dark .bg-pattern {
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='currentColor' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
          } */
          `,
          }}
        />
      </head>
      <body className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 min-h-screen">
        {/* bg-pattern class can be removed if not desired */}
        <div className="bg-pattern">
          {/* Removed max-width for full-width layout based on spec */}
          <main className="min-h-screen flex flex-col">{children}</main>
          {/* Toaster for notifications */}
          <Toaster position="top-right" />
          {/* Router Devtools */}
          <TanStackRouterDevtools position="bottom-right" />
        </div>
        {/* Renders script tags for the client bundle */}
        <Scripts />
      </body>
    </html>
  );
}
