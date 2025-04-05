import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useUser } from '@clerk/tanstack-start';
import { r as ro, f as eo, t as to } from '../_/nitro.mjs';
import { t, c, l } from './card-0DekqH9F.mjs';
import { g } from './button-B3FJhynQ.mjs';
import { n, v } from './alert-B939vdC4.mjs';
import { Home, CheckCircle2, BadgeCheck, CalendarDays, CreditCard, ArrowRight } from 'lucide-react';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import '@tanstack/router-core';
import 'tiny-invariant';
import '@tanstack/start-server-core';
import '@tanstack/start-client-core';
import '@clerk/tanstack-start/server';
import '@tanstack/react-router-devtools';
import '@tanstack/react-query-devtools';
import '@tanstack/react-query';
import 'react-hot-toast';
import 'react-redux';
import 'stripe';
import '@reduxjs/toolkit';
import 'zod';
import 'node:stream';
import 'isbot';
import 'react-dom/server';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

function Y() {
  const { isSignedIn: s } = useUser(), { refetch: b } = ro(), [c$1, i] = useState(true), [p, a] = useState(null), [n$1, N] = useState(null);
  useEffect(() => {
    const t = (new URLSearchParams("")).get("session_id");
    t && s ? g$1(t) : s ? (a("No subscription information found"), i(false)) : (a("You need to be signed in to view subscription details"), i(false));
  }, [s]);
  const g$1 = async (o) => {
    try {
      const t = await eo({ data: { sessionId: o } });
      N(t), b();
    } catch (t) {
      console.error("Error fetching subscription details:", t), a("Could not load subscription details");
    } finally {
      i(false);
    }
  }, y = async () => {
    if (!s) {
      a("You must be logged in to manage your subscription");
      return;
    }
    try {
      i(true), await to.createPortal();
    } catch (o) {
      console.error("Error creating portal session:", o), a("Could not access billing portal"), i(false);
    }
  };
  return c$1 ? jsxs("div", { className: "container py-16 mx-auto text-center", children: [jsx("div", { className: "animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" }), jsx("p", { className: "mt-5 text-muted-foreground", children: "Loading your subscription details..." })] }) : p ? jsxs("div", { className: "container py-12 mx-auto max-w-md", children: [jsx(n, { variant: "destructive", className: "mb-6", children: jsx(v, { className: "text-center py-2", children: p }) }), jsx(g, { asChild: true, className: "w-full", children: jsxs(Link, { to: "/", children: [jsx(Home, { className: "mr-2 h-4 w-4" }), "Return to Home"] }) })] }) : jsx("div", { className: "container py-16 mx-auto max-w-2xl", children: jsxs(t, { className: "overflow-hidden shadow-lg border-2 border-primary/10", children: [jsxs(c, { className: "bg-primary text-primary-foreground text-center py-10", children: [jsx("div", { className: "mx-auto rounded-full bg-primary-foreground/20 p-4 w-24 h-24 flex items-center justify-center mb-5", children: jsx(CheckCircle2, { className: "h-14 w-14" }) }), jsx("h1", { className: "text-3xl font-bold", children: "Payment Successful!" }), jsx("p", { className: "text-primary-foreground/80 mt-2", children: "Your subscription has been activated" })] }), jsx(l, { className: "pt-8 pb-10 px-8", children: n$1 ? jsxs(Fragment, { children: [jsxs("div", { className: "text-center mb-8", children: [jsxs("div", { className: "inline-flex items-center rounded-full border border-primary/20 px-3 py-1 text-sm bg-primary/5 mb-3", children: [jsx(BadgeCheck, { className: "mr-1 h-4 w-4 text-primary" }), jsx("span", { children: "Active Subscription" })] }), jsx("h2", { className: "text-2xl font-bold mb-2", children: "Thank you for subscribing!" }), jsxs("p", { className: "text-muted-foreground", children: ["You now have access to all premium features included in the", " ", jsx("span", { className: "font-medium text-primary", children: n$1.planName })] })] }), jsxs("div", { className: "bg-muted rounded-lg p-5 mb-8 space-y-4", children: [jsxs("div", { className: "flex items-center", children: [jsx(CalendarDays, { className: "h-5 w-5 text-muted-foreground mr-3" }), jsxs("div", { children: [jsx("p", { className: "text-sm text-muted-foreground", children: "Next billing date" }), jsx("p", { className: "font-medium", children: n$1.nextBillingDate })] })] }), jsxs("div", { className: "flex items-center", children: [jsx(CreditCard, { className: "h-5 w-5 text-muted-foreground mr-3" }), jsxs("div", { children: [jsx("p", { className: "text-sm text-muted-foreground", children: "Subscription ID" }), jsx("p", { className: "font-mono text-sm", children: n$1.subscriptionId })] })] })] }), jsxs("div", { className: "space-y-4 mb-8", children: [jsx("h3", { className: "font-medium", children: "What's next?" }), jsxs("ul", { className: "space-y-2", children: [jsxs("li", { className: "flex items-start", children: [jsx(ArrowRight, { className: "h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" }), jsx("span", { children: "Explore your new premium features in the dashboard" })] }), jsxs("li", { className: "flex items-start", children: [jsx(ArrowRight, { className: "h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" }), jsx("span", { children: "You can manage your subscription details at any time" })] }), jsxs("li", { className: "flex items-start", children: [jsx(ArrowRight, { className: "h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" }), jsx("span", { children: "Need help? Contact our support team for assistance" })] })] })] }), jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-between", children: [jsx(g, { asChild: true, variant: "outline", className: "sm:flex-1", children: jsxs(Link, { to: "/", children: [jsx(Home, { className: "mr-2 h-4 w-4" }), "Return to Dashboard"] }) }), jsx(g, { onClick: y, disabled: c$1, className: "sm:flex-1", children: c$1 ? "Loading..." : jsxs(Fragment, { children: [jsx(CreditCard, { className: "mr-2 h-4 w-4" }), "Manage Billing"] }) })] })] }) : jsxs("div", { className: "text-center py-4", children: [jsx("p", { className: "text-muted-foreground", children: "Subscription information not available." }), jsx(g, { asChild: true, className: "mt-4", children: jsx(Link, { to: "/", children: "Return to Home" }) })] }) })] }) });
}
const me = function() {
  return jsx(Y, {});
};

export { me as component };
//# sourceMappingURL=subscription.success-Ci4atYtc.mjs.map
