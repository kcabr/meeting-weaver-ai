import { getAuth } from '@clerk/tanstack-start/server';
import He from 'stripe';
import { createServerFn } from '@tanstack/start-client-core';
import { getWebRequest } from '@tanstack/start-server-core';
import { PrismaClient } from '@prisma/client';
import { _ as _$1 } from '../_/nitro.mjs';
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
import 'react/jsx-runtime';
import '@tanstack/react-router';
import '@clerk/tanstack-start';
import '@tanstack/react-router-devtools';
import '@tanstack/react-query-devtools';
import '@tanstack/react-query';
import 'react-hot-toast';
import 'react-redux';
import 'react';
import '@reduxjs/toolkit';
import 'zod';
import 'node:stream';
import 'isbot';
import 'react-dom/server';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const c = process.env.STRIPE_SECRET_KEY ? new He(process.env.STRIPE_SECRET_KEY || void 0 || "", { apiVersion: "2025-02-24.acacia" }) : null, u = { MONTHLY: { id: "monthly", name: "Monthly Plan", description: "Perfect for individuals", price: "$9.99", period: "month", features: ["Full access to all features", "Priority support", "Regular updates", "Cancel anytime"], priceId: "price_monthly" }, ANNUAL: { id: "annual", name: "Annual Plan", description: "Best value for committed users", price: "$99.99", period: "year", features: ["Everything in Monthly Plan", "2 months free", "Premium support", "Early access to new features"], priceId: "price_annual", isBestValue: true } };
createServerFn({ method: "POST" }).validator((e) => e.object({ priceId: e.string(), successUrl: e.string().optional(), cancelUrl: e.string().optional() })).handler(async ({ priceId: e, successUrl: r, cancelUrl: o }) => {
  var _a;
  try {
    const t = getWebRequest();
    if (!t) throw new Error("Web request not available");
    if (!((_a = await getAuth(t)) == null ? void 0 : _a.userId)) throw new Error("User not authenticated");
    const i = "undefined" < "u" ? window.location.origin : "http://localhost:3000", a = `${i}/subscription/success?session_id=mock_session_123`, w = `${i}/subscription?canceled=true`;
    return { url: `${r || a}&price_id=${e}`, sessionId: "mock_session_123" };
  } catch (t) {
    throw console.error("Error creating checkout session:", t), new Error("Failed to create checkout session");
  }
});
createServerFn({ method: "POST" }).validator((e) => e.object({ returnUrl: e.string().optional() })).handler(async ({ returnUrl: e }) => {
  var _a;
  try {
    const r = getWebRequest();
    if (!r) throw new Error("Web request not available");
    if (!((_a = await getAuth(r)) == null ? void 0 : _a.userId)) throw new Error("User not authenticated");
    const s = `${"undefined" < "u" ? window.location.origin : "http://localhost:3000"}/subscription`;
    return { url: e || s };
  } catch (r) {
    throw console.error("Error creating portal session:", r), new Error("Failed to create portal session");
  }
});
createServerFn({ method: "GET" }).validator((e) => e.object({ sessionId: e.string() })).handler(async ({ sessionId: e }) => {
  var _a;
  try {
    const r = getWebRequest();
    if (!r) throw new Error("Web request not available");
    if (!((_a = await getAuth(r)) == null ? void 0 : _a.userId)) throw new Error("User not authenticated");
    const s = new URLSearchParams(e).get("price_id") || "price_monthly";
    return { planName: (Object.values(u).find((a) => a.priceId === s) || u.MONTHLY).name, nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toLocaleDateString(), subscriptionId: "sub_mock123" };
  } catch (r) {
    throw console.error("Error fetching subscription details:", r), new Error("Failed to fetch subscription details");
  }
});
createServerFn({ method: "GET" }).handler(async () => {
  var _a;
  try {
    const e = getWebRequest();
    if (!e) throw new Error("Web request not available");
    if (!((_a = await getAuth(e)) == null ? void 0 : _a.userId)) throw new Error("User not authenticated");
    const t = false;
    return { isActive: t, planId: t ? u.MONTHLY.priceId : void 0, planName: t ? u.MONTHLY.name : void 0 };
  } catch (e) {
    throw console.error("Error checking subscription status:", e), new Error("Failed to check subscription status");
  }
});
const g = global, d = g.prisma || new PrismaClient({ log: ["error"] }), y = (e, r) => {
  switch (e) {
    case "active":
    case "trialing":
      return r;
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "past_due":
    case "paused":
    case "unpaid":
      return "free";
    default:
      return "free";
  }
}, m = async (e) => {
  if (!c) throw new Error("Stripe client not initialized");
  return c.subscriptions.retrieve(e, { expand: ["default_payment_method"] });
};
async function v(e, r, o) {
  console.error(`TEST-updateStripeCustomer: ${e} ${r} ${o}`);
  try {
    if (!e || !r || !o) throw new Error("Missing required parameters for updateStripeCustomer");
    const t = await m(r), n = await d.user.update({ where: { id: e }, data: { stripeCustomerId: o, stripeSubscriptionId: t.id } });
    return await d.$transaction(async (s) => {
      await s.subscription.findUnique({ where: { stripeSubscriptionId: r } }) && await s.subscription.update({ where: { stripeSubscriptionId: r }, data: { userId: e } });
    }), console.log(`Updated Stripe customer info for user: ${e}`), n;
  } catch (t) {
    throw console.error("Error in updateStripeCustomer:", t), t instanceof Error ? t : new Error("Failed to update Stripe customer");
  }
}
async function f(e, r, o) {
  console.error(`TEST-manageSubscriptionStatusChange: ${e} ${r} ${o}`);
  try {
    if (!e || !r || !o) throw new Error("Missing required parameters for manageSubscriptionStatusChange");
    const t = await d.user.findFirst({ where: { stripeCustomerId: r } });
    if (!t) return console.log(`No user found with Stripe customer ID: ${r}`), null;
    const n = await m(e);
    if (!c) throw new Error("Stripe client not initialized");
    const i = (await c.products.retrieve(o)).metadata.membership || "free";
    ["free", "pro"].includes(i) || console.warn(`Invalid membership type in product metadata: ${i}, defaulting to free`);
    const a = y(n.status, i), w = n.current_period_end ? new Date(n.current_period_end * 1e3) : null, U = await d.user.update({ where: { id: t.id }, data: { stripeSubscriptionId: n.id, subscriptionStatus: a, subscriptionPeriodEnd: w, stripePriceId: n.items.data[0].price.id } });
    return console.log(`Updated subscription for user: ${t.id}`), a;
  } catch (t) {
    throw console.error("Error in manageSubscriptionStatusChange:", t), t instanceof Error ? t : new Error("Failed to update subscription status");
  }
}
function _(e, r, o) {
  try {
    return c == null ? void 0 : c.webhooks.constructEvent(e, r, o);
  } catch (t) {
    throw console.error("Error verifying Stripe webhook:", t), t;
  }
}
const k = /* @__PURE__ */ new Set(["checkout.session.completed", "customer.subscription.updated", "customer.subscription.deleted", "payment_link.created"]), N = _$1("/api/stripe/webhooks")({ POST: async ({ request: e }) => {
  const r = await e.text(), o = e.headers.get("Stripe-Signature"), t = process.env.STRIPE_WEBHOOK_SECRET;
  let n;
  try {
    if (!o || !t) throw new Error("Webhook secret or signature missing");
    n = _(r, o, t);
  } catch (s) {
    return console.error(`Webhook Error: ${s.message}`), new Response(`Webhook Error: ${s.message}`, { status: 400 });
  }
  if (k.has(n.type)) try {
    switch (n.type) {
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await P(n);
        break;
      case "checkout.session.completed":
        await I(n);
        break;
      case "payment_link.created":
        break;
      default:
        throw new Error("Unhandled relevant event!");
    }
  } catch (s) {
    return console.error("Webhook handler failed:", s), new Response("Webhook handler failed. View server logs for details.", { status: 400 });
  }
  return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
} });
async function P(e) {
  const r = e.data.object, o = r.items.data[0].price.product;
  await f(r.id, r.customer, o);
}
async function I(e) {
  var _a, _b, _c;
  const r = e.data.object;
  if (r.mode === "subscription") {
    const o = r.subscription;
    await v(r.client_reference_id, o, r.customer);
    const t = (_a = await (c == null ? void 0 : c.subscriptions.retrieve(o, { expand: ["default_payment_method"] }))) != null ? _a : null, n = t == null ? void 0 : t.items.data[0].price.product;
    await f((_b = t == null ? void 0 : t.id) != null ? _b : "", (_c = t == null ? void 0 : t.customer) != null ? _c : "", n);
  }
}

export { N as APIRoute };
//# sourceMappingURL=webhooks.mjs.map
