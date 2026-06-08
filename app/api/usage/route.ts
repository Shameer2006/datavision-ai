import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const { data: logs } = await supabase
    .from("usage_logs")
    .select("action_type, credits_used, created_at")
    .eq("user_id", user.id)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  // Group by day
  const byDay: Record<string, { credits: number; requests: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    byDay[key] = { credits: 0, requests: 0 };
  }

  for (const log of logs ?? []) {
    const day = log.created_at.slice(0, 10);
    if (byDay[day]) {
      byDay[day].credits  += log.credits_used ?? 0;
      byDay[day].requests += 1;
    }
  }

  return NextResponse.json({ usage: byDay });
}
