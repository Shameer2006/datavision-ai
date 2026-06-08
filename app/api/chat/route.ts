import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import { validateApiKey } from "@/lib/api-key-validator";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: Request) {
  let userId: string | null = null;
  let apiKeyId: string | undefined = undefined;

  // 1. Check for API Key in Authorization header
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer dv_live_")) {
    const rawKey = authHeader.replace("Bearer ", "").trim();
    const validatedKey = await validateApiKey(rawKey);
    
    if (!validatedKey) {
      return NextResponse.json({ error: "Invalid or expired API Key" }, { status: 401 });
    }
    
    userId = validatedKey.userId;
    apiKeyId = validatedKey.id;
  } else {
    // 2. Fallback to Supabase Session Cookie Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const hasFile = !!file && file.size > 0;
  const action = hasFile ? "chat_with_file" as const : "chat_followup" as const;
  const cost = CREDIT_COSTS[action];

  // Atomic credit deduction + rate limit check via Supabase RPC
  const result = await deductCredits(userId, action, apiKeyId);

  if (!result.ok) {
    const messages: Record<string, string> = {
      insufficient_credits: "You have run out of credits. Please upgrade your plan to continue.",
      rate_limit_minute:    "You are sending messages too fast. Please wait a moment and try again.",
      rate_limit_day:       "You have reached your daily request limit. Please upgrade your plan.",
    };
    const status = result.error === "insufficient_credits" ? 402 : 429;
    return NextResponse.json({ error: messages[result.error!] ?? "Request denied" }, { status });
  }

  // Forward to Python backend
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      body: formData,
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      // Refund credits if backend failed
      const supabase = await createClient();
      await supabase.rpc("deduct_credits", {
        p_user_id:     userId,
        p_amount:      -cost, // negative = refund
        p_action_type: action, // Used original action to prevent enum mismatch
        p_api_key_id:  apiKeyId ?? null,
      });
      return NextResponse.json({ error: data.detail || "Backend error" }, { status: backendRes.status });
    }

    return NextResponse.json({ ...data, creditsRemaining: result.balance });
  } catch {
    return NextResponse.json({ error: "Backend unavailable. Please try again." }, { status: 503 });
  }
}
