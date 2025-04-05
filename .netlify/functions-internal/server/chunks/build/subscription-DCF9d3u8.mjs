import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/tanstack-start';
import { r as ro, a as Zr } from '../_/nitro.mjs';
import { CheckCircle2 } from 'lucide-react';
import { t, c, i, m, l, n as n$1 } from './card-0DekqH9F.mjs';
import { g } from './button-B3FJhynQ.mjs';
import { n, v } from './alert-B939vdC4.mjs';
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
import '@tanstack/react-router';
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
  const { isSignedIn: i$1, user: m$1 } = useUser(), { isActive: l$1, planName: c$1, refetch: u } = ro(), [d, p] = useState(null), h = "https://buy.stripe.com/test_5kAdTyg6R6QWbq86op", f = "https://buy.stripe.com/test_3cs16M8Ep4IO2TC4gg", x = false;
  useEffect(() => {
    u();
  }, []);
  const g$1 = Object.values(Zr);
  return jsxs("div", { className: "container py-10 mx-auto", children: [jsxs("header", { className: "mb-12 text-center", children: [jsx("h1", { className: "text-3xl font-bold tracking-tight text-foreground mb-4", children: "Choose Your Subscription Plan" }), jsx("p", { className: "text-muted-foreground max-w-xl mx-auto", children: "Select the subscription that best fits your needs and unlock premium features" }), !i$1 && jsx(n, { variant: "default", className: "mt-6 max-w-lg mx-auto bg-secondary/50", children: jsx(v, { children: "Please sign in to purchase a subscription" }) }), x, l$1 && jsx(n, { variant: "default", className: "mt-6 max-w-lg mx-auto bg-primary/20", children: jsxs(v, { className: "text-primary", children: ["You already have an active subscription to the ", c$1, " plan."] }) }), d && jsx(n, { variant: "destructive", className: "mt-6 max-w-lg mx-auto", children: jsx(v, { children: d }) })] }), jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto", children: g$1.map((t$1) => {
    var _a;
    const a = l$1 && c$1 === t$1.name;
    let s = t$1.period.toLowerCase().includes("annual") ? h : f;
    return s = `${s}?prefilled_email=${(_a = m$1 == null ? void 0 : m$1.primaryEmailAddress) == null ? void 0 : _a.emailAddress}&client_reference_id=${m$1 == null ? void 0 : m$1.id}`, jsxs(t, { className: `relative overflow-visible h-full transition-all ${"isBestValue" in t$1 && t$1.isBestValue ? "border-primary shadow-md" : ""} ${a ? "border-2 border-green-500" : ""}`, children: ["isBestValue" in t$1 && t$1.isBestValue && jsx("div", { className: "absolute -top-3 right-6 bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-md", children: "Best Value" }), a && jsx("div", { className: "absolute top-4 right-4 text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm font-medium", children: "Current Plan" }), jsxs(c, { children: [jsx(i, { className: "text-xl md:text-2xl", children: t$1.name }), jsx(m, { children: t$1.description }), jsxs("div", { className: "mt-4", children: [jsx("span", { className: "text-3xl font-bold", children: t$1.price }), jsxs("span", { className: "text-muted-foreground ml-1", children: ["/ ", t$1.period] })] })] }), jsx(l, { children: jsx("div", { className: "space-y-2", children: t$1.features.map((b, y) => jsxs("div", { className: "flex items-start", children: [jsx(CheckCircle2, { className: "mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" }), jsx("span", { children: b })] }, y)) }) }), jsx(n$1, { children: jsx(g, { className: "w-full", disabled: !i$1 || a, onClick: () => {
      i$1 && !a && s ? window.location.href = s : i$1 || p("You must be logged in to subscribe");
    }, variant: "isBestValue" in t$1 && t$1.isBestValue ? "default" : "outline", children: a ? "Current Plan" : "Subscribe" }) })] }, t$1.id);
  }) })] });
}
const le = function() {
  return jsx(Y, {});
};

export { le as component };
//# sourceMappingURL=subscription-DCF9d3u8.mjs.map
