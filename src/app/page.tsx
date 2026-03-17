import LandingPage from "../components/ui/site/LandingPage";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createSupabaseServer();

  const { data: courses } = await supabase
    .from("courses")
    .select("id,slug,title,description,is_free,price_php")
    .order("created_at", { ascending: true });

  return <LandingPage courses={courses ?? []} />;
}