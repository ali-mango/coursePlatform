import { createSupabaseServer } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}