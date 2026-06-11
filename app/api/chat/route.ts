import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import { validateApiKey } from "@/lib/api-key-validator";
import { createAdminClient } from "@/lib/supabase/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function getUserIdFromRequest(request: Request): Promise<{ userId: string | null; apiKeyId?: string }> {
  // 1. Check Bearer token (API key auth)
  const authHeader = request.headers.get("Authorization") ?? "";
  if (authHeader.startsWith("Bearer dv_live_")) {
    const raw = authHeader.replace("Bearer ", "").trim();
    const validated = await validateApiKey(raw);
    if (validated) return { userId: validated.userId, apiKeyId: validated.id };
    return { userId: null };
  }

  // 2. Session cookie auth — getSession() reads from cookie, no network call
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );
    const { data: { session } } = await supabase.auth.getSession();
    return { userId: session?.user?.id ?? null };
  } catch {
    return { userId: null };
  }
}

export async function POST(request: Request) {
  const { userId, apiKeyId } = await getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const modelName = formData.get("model") as string | null;

  // Restrict Pro model to Pro / Enterprise subscription plans
  if (modelName === "DataVision Pro") {
    const adminDb = createAdminClient();
    const { data: userPlan } = await adminDb
      .from("user_plans")
      .select("plan_id")
      .eq("user_id", userId)
      .single();

    if (userPlan?.plan_id !== "pro" && userPlan?.plan_id !== "enterprise") {
      return NextResponse.json(
        { error: "DataVision Pro requires a Pro Plan subscription. Please upgrade in your account settings." },
        { status: 403 }
      );
    }
  }

  const file = formData.get("file") as File | null;
  const hasFile = !!file && file.size > 0;
  const action = hasFile ? "chat_with_file" as const : "chat_followup" as const;
  const cost = CREDIT_COSTS[action];

  // Atomic credit deduction + rate limit check
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

  // Rebuild FormData for backend (re-read file bytes to avoid 0-byte issues)
  const backendFormData = new FormData();
  backendFormData.append("message", (formData.get("message") as string) || "");
  backendFormData.append("model", modelName || "DataVision Flash");

  if (file && hasFile) {
    const buf = await file.arrayBuffer();
    backendFormData.append("file", new Blob([buf], { type: file.type || "text/csv" }), file.name);
  } else {
    const cachedSchema = (formData.get("cached_schema") as string) || "";
    const cachedDfJson = (formData.get("cached_df_json") as string) || "";
    if (cachedSchema) {
      backendFormData.append("cached_schema", cachedSchema);
      backendFormData.append("cached_df_json", cachedDfJson);
    }
  }

  // Forward to Python backend
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      body: backendFormData,
      signal: AbortSignal.timeout(60000),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      // Refund on backend error — best effort, don't await
      deductCredits(userId, action === "chat_with_file" ? "chat_followup" : "chat_with_file").catch(() => {});
      return NextResponse.json({ error: data.detail || "Backend error" }, { status: backendRes.status });
    }

    return NextResponse.json({ ...data, creditsRemaining: result.balance });
  } catch (err) {
    const msg = err instanceof Error && err.name === "TimeoutError"
      ? "The request timed out. The AI engine may be warming up — please try again."
      : "Backend unavailable. Please try again in a moment.";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
