import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Lazy reset check
  await supabase.rpc("check_and_reset_credits", { p_user_id: user.id });

  const [{ data: credits }, { data: userPlan }] = await Promise.all([
    supabase
      .from("credits")
      .select("balance, total_used, resets_at")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("user_plans")
      .select("plan_id, resets_at, plans(name, credits, rate_limit_per_minute, rate_limit_per_day, max_api_keys)")
      .eq("user_id", user.id)
      .single(),
  ]);

  return NextResponse.json({ credits, plan: userPlan });
}
