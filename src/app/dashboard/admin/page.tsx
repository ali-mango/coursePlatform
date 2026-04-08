// src/app/dashboard/admin/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminDashboardClient } from "@/components/ui/admin-dashboard-client";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServer();
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  redirect("/auth/login");
}

if (!user.email_confirmed_at) {
  redirect("/auth/login?message=verify-email");
}

const isAdmin = user?.app_metadata?.is_admin === true;
if (!isAdmin) {
  redirect("/");
}
  // Fetch all stats server-side
  const [signups, learners, completions, purchases, activity] =
    await Promise.all([
      supabaseAdmin.from("v_signup_stats").select("*").single(),
      supabaseAdmin.from("v_active_learners").select("*").single(),
      supabaseAdmin.from("v_lesson_completions").select("*"),
      supabaseAdmin.from("v_purchase_stats").select("*"),
      supabaseAdmin
        .from("v_recent_activity")
        .select("*")
        .order("event_at", { ascending: false })
        .limit(50),
    ]);

  return (
    <AdminDashboardClient
      signups={signups.data}
      learners={learners.data}
      completions={completions.data ?? []}
      purchases={purchases.data ?? []}
      activity={activity.data ?? []}
    />
  );
}