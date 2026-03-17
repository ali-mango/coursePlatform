import { createSupabaseServer } from "@/lib/supabase/server";

export async function getUserAndHasPaid(courseId: string) {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) return { user: null, hasPaid: false };

  const { data: purchase } = await supabase
    .from("purchases")
    .select("status")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  return { user, hasPaid: purchase?.status === "paid" };
}