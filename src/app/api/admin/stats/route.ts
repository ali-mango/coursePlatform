// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.is_admin === true;
  if (!user || !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [signups, learners, completions, purchases, activity] =
    await Promise.all([
      supabaseAdmin.from("v_signup_stats").select("*").single(),
      supabaseAdmin.from("v_active_learners").select("*").single(),
      supabaseAdmin.from("v_lesson_completions").select("*"),
      supabaseAdmin.from("v_purchase_stats").select("*"),
      supabaseAdmin.from("v_recent_activity").select("*").limit(50),
    ]);

  return NextResponse.json({
    signups: signups.data,
    learners: learners.data,
    completions: completions.data ?? [],
    purchases: purchases.data ?? [],
    activity: activity.data ?? [],
  });
}