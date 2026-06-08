import { createClient } from "@/lib/supabase/server";

export async function hashApiKey(raw: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function generateRawKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [8, 4, 4, 4, 12];
  const rand = segments
    .map(len => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(""))
    .join("-");
  return `dv_live_${rand}`;
}

export interface ValidatedKey {
  id: string;
  userId: string;
  planId: string;
}

export async function validateApiKey(rawKey: string): Promise<ValidatedKey | null> {
  const supabase = await createClient();
  const hash = await hashApiKey(rawKey);

  const { data, error } = await supabase.rpc("validate_api_key", {
    p_key_hash: hash,
  });

  if (error || !data || data.error) return null;

  return {
    id:     data.id,
    userId: data.userId,
    planId: data.planId,
  };
}
