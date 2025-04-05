import { getAuth } from '@clerk/tanstack-start/server';
import { o as o$1 } from './index-ujMS-7Qz.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import { getWebRequest } from '@tanstack/start-server-core';
import 'tiny-invariant';

const p = o$1("src_utils_stripe_ts--createCheckoutSession_createServerFn_handler", "/_server", (e, r) => m.__executeServer(e, r)), _ = o$1("src_utils_stripe_ts--createPortalSession_createServerFn_handler", "/_server", (e, r) => b.__executeServer(e, r)), w = o$1("src_utils_stripe_ts--getSubscriptionDetails_createServerFn_handler", "/_server", (e, r) => v.__executeServer(e, r)), S = o$1("src_utils_stripe_ts--checkSubscriptionStatus_createServerFn_handler", "/_server", (e, r) => f.__executeServer(e, r)), o = { MONTHLY: { id: "monthly", name: "Monthly Plan", description: "Perfect for individuals", price: "$9.99", period: "month", features: ["Full access to all features", "Priority support", "Regular updates", "Cancel anytime"], priceId: "price_monthly" }, ANNUAL: { id: "annual", name: "Annual Plan", description: "Best value for committed users", price: "$99.99", period: "year", features: ["Everything in Monthly Plan", "2 months free", "Premium support", "Early access to new features"], priceId: "price_annual", isBestValue: true } }, m = createServerFn({ method: "POST" }).validator((e) => e.object({ priceId: e.string(), successUrl: e.string().optional(), cancelUrl: e.string().optional() })).handler(p, async ({ priceId: e, successUrl: r, cancelUrl: u }) => {
  var _a;
  try {
    const t = getWebRequest();
    if (!t) throw new Error("Web request not available");
    if (!((_a = await getAuth(t)) == null ? void 0 : _a.userId)) throw new Error("User not authenticated");
    const l = "undefined" < "u" ? window.location.origin : "http://localhost:3000", d = `${l}/subscription/success?session_id=mock_session_123`, I = `${l}/subscription?canceled=true`;
    return { url: `${r || d}&price_id=${e}`, sessionId: "mock_session_123" };
  } catch (t) {
    throw console.error("Error creating checkout session:", t), new Error("Failed to create checkout session");
  }
}), b = createServerFn({ method: "POST" }).validator((e) => e.object({ returnUrl: e.string().optional() })).handler(_, async ({ returnUrl: e }) => {
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
}), v = createServerFn({ method: "GET" }).validator((e) => e.object({ sessionId: e.string() })).handler(w, async ({ sessionId: e }) => {
  var _a;
  try {
    const r = getWebRequest();
    if (!r) throw new Error("Web request not available");
    if (!((_a = await getAuth(r)) == null ? void 0 : _a.userId)) throw new Error("User not authenticated");
    const s = new URLSearchParams(e).get("price_id") || "price_monthly";
    return { planName: (Object.values(o).find((d) => d.priceId === s) || o.MONTHLY).name, nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toLocaleDateString(), subscriptionId: "sub_mock123" };
  } catch (r) {
    throw console.error("Error fetching subscription details:", r), new Error("Failed to fetch subscription details");
  }
}), f = createServerFn({ method: "GET" }).handler(S, async () => {
  var _a;
  try {
    const e = getWebRequest();
    if (!e) throw new Error("Web request not available");
    if (!((_a = await getAuth(e)) == null ? void 0 : _a.userId)) throw new Error("User not authenticated");
    const t = false;
    return { isActive: t, planId: t ? o.MONTHLY.priceId : void 0, planName: t ? o.MONTHLY.name : void 0 };
  } catch (e) {
    throw console.error("Error checking subscription status:", e), new Error("Failed to check subscription status");
  }
});

export { S as checkSubscriptionStatus_createServerFn_handler, p as createCheckoutSession_createServerFn_handler, _ as createPortalSession_createServerFn_handler, w as getSubscriptionDetails_createServerFn_handler };
//# sourceMappingURL=stripe-BbML_eyX.mjs.map
