import { createClient } from "@/lib/supabase/server";

export const CREDIT_COSTS = {
  chat_with_file:  8,
  chat_followup:   4,
  api_analyze:     6,
  api_chart:       4,
} as const;

export type ActionType = keyof typeof CREDIT_COSTS;

export interface CreditResult {
  ok: boolean;
  error?: "insufficient_credits" | "rate_limit_minute" | "rate_limit_day";
  balance?: number;
}

export async function deductCredits(
  userId: string,
  action: ActionType,
  apiKeyId?: string
): Promise<CreditResult> {
  const supabase = await createClient();
  const amount = CREDIT_COSTS[action];

  const { data, error } = await supabase.rpc("deduct_credits", {
    p_user_id:     userId,
    p_amount:      amount,
    p_action_type: action,
    p_api_key_id:  apiKeyId ?? null,
  });

  if (error) return { ok: false, error: "insufficient_credits" };
  return data as CreditResult;
}

export async function getCredits(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("credits")
    .select("balance, total_used, resets_at")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function getUserPlan(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_plans")
    .select("plan_id, resets_at, plans(name, credits, rate_limit_per_minute, rate_limit_per_day, max_api_keys)")
    .eq("user_id", userId)
    .single();
  return data;
}
