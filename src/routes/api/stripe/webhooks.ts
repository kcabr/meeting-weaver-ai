/*
<ai_context>
This webhook handler processes Stripe payment gateway events. It verifies 
incoming webhook signatures and handles subscription-related events including:

- checkout.session.completed: When a customer completes payment
- customer.subscription.updated: When subscription details change
- customer.subscription.deleted: When a subscription is canceled

The handler updates the application database with subscription status changes
and customer information to keep payment records in sync with Stripe.
</ai_context>
*/

import { createAPIFileRoute } from "@tanstack/react-start/api";
import Stripe from "stripe";
import { stripe } from "~/utils/stripe";
import {
  manageSubscriptionStatusChange,
  updateStripeCustomer,
  verifyStripeWebhook,
} from "~/utils/stripe-webhooks";

// These are the Stripe webhook events we want to handle
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "payment_link.created",
  "customer.subscription.created",
]);

export const APIRoute = createAPIFileRoute("/api/stripe/webhooks")({
  POST: async ({ request }) => {
    const body = await request.text();
    const signature = request.headers.get("Stripe-Signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // TESTING
    //console.error(`Webhook TEST: ${webhookSecret}`);
    //return;

    let event: Stripe.Event;

    try {
      if (!signature || !webhookSecret) {
        throw new Error("Webhook secret or signature missing");
      }

      // Verify the webhook signature
      event = verifyStripeWebhook(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event if it's one we care about
    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            await handleSubscriptionChange(event);
            break;

          case "checkout.session.completed":
            await handleCheckoutSession(event);
            break;

          case "payment_link.created":
            // DONOTHING: Handle payment link created event
            break;

          default:
            throw new Error("Unhandled relevant event!");
        }
      } catch (error) {
        console.error("Webhook handler failed:", error);
        return new Response(
          "Webhook handler failed. View server logs for details.",
          {
            status: 400,
          }
        );
      }
    }

    // Return a success response
    return new Response(JSON.stringify({ received: true }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
});

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const productId = subscription.items.data[0].price.product as string;

  // Update database with subscription status
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  );
}

async function handleCheckoutSession(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session;

  //console.error(`TEST-handleCheckoutSession: ${checkoutSession}`);

  if (checkoutSession.mode === "subscription") {
    const subscriptionId = checkoutSession.subscription as string;

    // Update customer with subscription info
    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    );

    // Get subscription details
    const subscription =
      (await stripe?.subscriptions.retrieve(subscriptionId, {
        expand: ["default_payment_method"],
      })) ?? null;

    // Update subscription status
    const productId = subscription?.items.data[0].price.product as string;
    await manageSubscriptionStatusChange(
      subscription?.id ?? "",
      (subscription?.customer as string) ?? "",
      productId
    );
  }
}
