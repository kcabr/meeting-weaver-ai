import { jsxs, jsx } from 'react/jsx-runtime';
import { t as t$1, c, i, m, n } from './card-0DekqH9F.mjs';
import { i as i$1 } from './AccentButton-L3kOol_A.mjs';
import 'react';
import './button-B3FJhynQ.mjs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '@tanstack/react-router';

function t({ title: r, description: s, link: l, onClick: o, isHighlighted: n$1 = false }) {
  const a = jsxs(t$1, { className: `h-full transition-all hover:shadow-md ${n$1 ? "border-primary" : ""}`, children: [jsxs(c, { children: [jsx(i, { children: r }), jsx(m, { children: s })] }), jsx(n, { children: jsx(i$1, { to: l, isHighlighted: n$1, children: "Explore" }) })] });
  return o ? jsx("button", { onClick: o, className: "text-left block w-full", children: a }) : jsx("div", { className: "block w-full", children: a });
}
const y = function() {
  return jsxs("div", { className: "container py-10 mx-auto", children: [jsx("header", { children: jsx("div", { className: "mx-auto max-w-7xl", children: jsx("h1", { className: "text-3xl font-bold tracking-tight text-foreground", children: "Welcome to Cizzle's TanStack Starter App Template" }) }) }), jsx("main", { children: jsx("div", { className: "mx-auto max-w-7xl mt-8", children: jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: [jsx(t, { title: "Todos", description: "Manage your todos with a simple CRUD interface. Uses Prisma ORM with Supabase.", link: "/todos" }), jsx(t, { title: "Notes", description: "Create and manage your notes. Demonstrates RSC (React Server Components).", link: "/notes" }), jsx(t, { title: "Counter", description: "Simple counter example. Shows Redux Toolkit for state management.", link: "/counter" }), jsx(t, { title: "Posts", description: "Post list from API. Uses React Query for data fetching.", link: "/posts" }), jsx(t, { title: "Profile", description: "Authenticated user profile. Shows integration with Clerk authentication.", link: "/profile" }), jsx(t, { title: "News", description: "Browse and search news articles. Shows React Query and external API integration.", link: "/news" }), jsx(t, { title: "UI Components", description: "Explore the shadcn UI components available in this template.", link: "/ui-showcase", isHighlighted: true }), jsx(t, { title: "Subscription", description: "Manage your subscription with Stripe. Shows Stripe integration for payments.", link: "/subscription", isHighlighted: true })] }) }) })] });
};

export { y as component };
//# sourceMappingURL=index-D50cUs0C.mjs.map
