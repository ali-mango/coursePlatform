// src/app/api/account/delete/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete user's lesson progress
  await supabaseAdmin
    .from("lesson_progress")
    .delete()
    .eq("user_id", user.id);

  // Delete user's purchases
  await supabaseAdmin
    .from("purchases")
    .delete()
    .eq("user_id", user.id);

  // Delete the auth user (requires admin/service role)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sign out the current session
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}