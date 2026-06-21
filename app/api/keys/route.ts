import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRawKey, hashApiKey } from "@/lib/api-key-validator";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: keys } = await supabase
    .from("api_keys")
    .select("id, name, key_preview, label, created_at, last_used_at, total_requests, expires_at, revoked")
    .eq("user_id", user.id)
    .eq("revoked", false)
    .order("created_at", { ascending: false });

  return NextResponse.json({ keys: keys ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await request.json().catch(() => ({ name: "Default" }));

  // Generate and hash key
  const raw = generateRawKey();
  const hash = await hashApiKey(raw);
  const preview = raw.slice(0, 12) + "••••••••••••" + raw.slice(-4);

  const { data: result, error } = await supabase.rpc("generate_api_key", {
    p_user_id:     user.id,
    p_key_hash:    hash,
    p_key_preview: preview,
    p_name:        name || "Default",
    p_label:       name || "Default",
  });

  if (error) {
    console.error("RPC Error:", error);
    return NextResponse.json({ error: `Failed to create key: ${error.message || JSON.stringify(error)}` }, { status: 500 });
  }

  if (result && result.error) {
    return NextResponse.json(
      { error: "Your plan limit for API keys has been reached. Upgrade to create more." },
      { status: 403 }
    );
  }

  const newKey = result.key;

  // Return raw key ONCE — never stored
  return NextResponse.json({ key: newKey, rawKey: raw });
}
