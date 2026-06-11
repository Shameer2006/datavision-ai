import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "standardwebhooks";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    if (!webhookKey) {
      console.error("DODO_PAYMENTS_WEBHOOK_KEY is missing on server.");
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
    }

    const body = await request.text();
    const headersList = await headers();

    const webhookId = headersList.get("webhook-id") || "";
    const webhookSignature = headersList.get("webhook-signature") || "";
    const webhookTimestamp = headersList.get("webhook-timestamp") || "";

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      console.error("Missing webhook signature headers.");
      return NextResponse.json({ error: "Missing signature headers" }, { status: 400 });
    }

    // Verify webhook signature
    const wh = new Webhook(webhookKey);
    let event: any;
    try {
      event = wh.verify(body, {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      });
    } catch (err: any) {
      console.error("Webhook verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { type, data } = event;
    console.log(`Received Dodo Payments webhook: ${type}`, data);

    const userId = data?.metadata?.user_id;
    if (!userId) {
      console.error("No user_id found in metadata for event:", type);
      return NextResponse.json({ error: "No user_id in metadata" }, { status: 400 });
    }

    const supabase = createAdminClient();

    if (type === "subscription.active" || type === "subscription.renewed") {
      // 1. Upgrade user plan to pro
      const { error: planError } = await supabase
        .from("user_plans")
        .upsert({
          user_id: userId,
          plan_id: "pro",
          started_at: new Date().toISOString(),
          resets_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // resets in 24 hours
        });

      if (planError) {
        console.error("Error upgrading user plan:", planError);
        return NextResponse.json({ error: "Database error updating plan" }, { status: 500 });
      }

      // 2. Set user credits to 1,000 for Pro plan
      const { error: creditsError } = await supabase
        .from("credits")
        .upsert({
          user_id: userId,
          balance: 1000,
          resets_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // resets in 24 hours
          updated_at: new Date().toISOString(),
        });

      if (creditsError) {
        console.error("Error setting credits:", creditsError);
        return NextResponse.json({ error: "Database error updating credits" }, { status: 500 });
      }

      console.log(`Successfully upgraded user ${userId} to Pro plan (1,000 credits)`);

    } else if (type === "subscription.cancelled" || type === "subscription.failed") {
      // Revert user to free plan
      const { error: planError } = await supabase
        .from("user_plans")
        .upsert({
          user_id: userId,
          plan_id: "free",
          started_at: new Date().toISOString(),
          resets_at: null, // Free plan does not refresh
        });

      if (planError) {
        console.error("Error downgrading user plan:", planError);
        return NextResponse.json({ error: "Database error downgrading plan" }, { status: 500 });
      }

      // Reset balance to Free tier level (100) and resets_at = null
      const { error: creditsError } = await supabase
        .from("credits")
        .upsert({
          user_id: userId,
          balance: 100,
          resets_at: null, // Free plan does not refresh
          updated_at: new Date().toISOString(),
        });

      if (creditsError) {
        console.error("Error resetting credits:", creditsError);
        return NextResponse.json({ error: "Database error updating credits" }, { status: 500 });
      }

      console.log(`Successfully downgraded user ${userId} to Free plan`);
    } else if (type === "payment.succeeded") {
      const topupProductId = process.env.NEXT_PUBLIC_DODO_TOPUP_PRODUCT_ID;
      if (!topupProductId) {
        console.error("NEXT_PUBLIC_DODO_TOPUP_PRODUCT_ID is missing on the server.");
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
      }

      const cart = data?.product_cart || [];
      const topupItem = cart.find((item: any) => item.product_id === topupProductId);

      if (topupItem) {
        const quantity = topupItem.quantity || 1;
        const creditsToAdd = quantity * 200;

        const { error: creditsError } = await supabase.rpc("add_credits", {
          p_user_id: userId,
          p_amount: creditsToAdd,
        });

        if (creditsError) {
          console.error("Error adding top-up credits:", creditsError);
          return NextResponse.json({ error: "Database error adding credits" }, { status: 500 });
        }

        console.log(`Successfully added ${creditsToAdd} credits to user ${userId} via Top-up`);
      } else {
        console.log(`payment.succeeded event received, but topup product was not in cart:`, cart);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handling internal error" },
      { status: 500 }
    );
  }
}
