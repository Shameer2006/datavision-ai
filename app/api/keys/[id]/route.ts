import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify ownership
  const { data: key } = await supabase
    .from("api_keys")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!key) return NextResponse.json({ error: "Key not found" }, { status: 404 });

  // Soft delete — keep for audit trail
  await supabase
    .from("api_keys")
    .update({ revoked: true, revoked_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ ok: true });
}
