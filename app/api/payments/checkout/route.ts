import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import DodoPayments from "dodopayments";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = session.user;
    
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Dodo Payments API Key configuration missing on server." },
        { status: 500 }
      );
    }

    // Parse request body for type and optional discount codes
    let paymentType = "subscription";
    let discountCodes: string[] | undefined;
    try {
      const body = await request.json();
      if (body?.type === "topup") {
        paymentType = "topup";
      }
      if (body?.discount_codes && Array.isArray(body.discount_codes)) {
        discountCodes = body.discount_codes;
      } else if (body?.discount_code) {
        discountCodes = [body.discount_code];
      }
    } catch {
      // Body may be empty, which is perfectly fine
    }

    const proProductId = process.env.NEXT_PUBLIC_DODO_PRO_PRODUCT_ID;
    const topupProductId = process.env.NEXT_PUBLIC_DODO_TOPUP_PRODUCT_ID;
    const productId = paymentType === "topup" ? topupProductId : proProductId;

    if (!productId) {
      return NextResponse.json(
        { error: `Dodo Payments Product ID for ${paymentType} configuration is missing on server.` },
        { status: 500 }
      );
    }

    // Determine environment based on API key prefix
    const environment = apiKey.startsWith("dp_test_") ? "test_mode" : "live_mode";
    
    const dodo = new DodoPayments({
      bearerToken: apiKey,
      environment: environment,
    });
    
    // Get request headers for host origin
    const url = new URL(request.url);
    const origin = url.origin;
    
    const checkoutSession = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
      },
      customer: user.email ? {
        email: user.email,
        name: user.user_metadata?.full_name || undefined,
      } : undefined,
      discount_codes: discountCodes,
      feature_flags: {
        allow_discount_code: true, // Enables coupon code entry field in Dodo's checkout page
      },
      return_url: `${origin}/account`,
    });
    
    if (!checkoutSession || !checkoutSession.checkout_url) {
      return NextResponse.json(
        { error: "Failed to create checkout session with Dodo Payments." },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ url: checkoutSession.checkout_url });
  } catch (error: any) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
