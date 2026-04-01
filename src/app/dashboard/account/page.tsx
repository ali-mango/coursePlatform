// src/app/dashboard/account/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DashboardAccount } from "@/components/ui/dashboard-account";

type PurchaseRow = {
  status: string;
  course_id: string;
  created_at: string;
};

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  is_free: boolean;
  price_php: number | null;
};

export default async function AccountPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/auth/login");

  /* ── purchases ── */
  const { data: purchases } = await supabase
    .from("purchases")
    .select("status, course_id, created_at")
    .eq("user_id", user.id);

  const typedPurchases = (purchases ?? []) as PurchaseRow[];
  const paidCourseIds = new Set(
    typedPurchases
      .filter((p) => p.status === "paid")
      .map((p) => p.course_id)
  );

  /* ── courses ── */
  const { data: courses } = await supabase
    .from("courses")
    .select("id,slug,title,is_free,price_php")
    .order("created_at", { ascending: true });

  const typedCourses = (courses ?? []) as CourseRow[];
  const myCourses = typedCourses.filter(
    (c) => c.is_free || paidCourseIds.has(c.id)
  );

  /* ── lesson progress ── */
  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id);

  const completedLessonIds = new Set(
    (progressRows ?? []).map((r: { lesson_id: string }) => r.lesson_id)
  );

  const { data: allLessons } = await supabaseAdmin
    .from("lessons")
    .select("id, course_id")
    .in("course_id", myCourses.map((c) => c.id));

  const lessonsByCourse = new Map<string, string[]>();
  for (const l of allLessons ?? []) {
    const arr = lessonsByCourse.get(l.course_id) ?? [];
    arr.push(l.id);
    lessonsByCourse.set(l.course_id, arr);
  }

  const courseProgress = myCourses.map((course) => {
    const lessonIds = lessonsByCourse.get(course.id) ?? [];
    const completedCount = lessonIds.filter((id) => completedLessonIds.has(id)).length;
    return {
      courseTitle: course.title,
      courseSlug: course.slug,
      totalLessons: lessonIds.length,
      completedLessons: completedCount,
      isFree: course.is_free,
    };
  });

  /* ── purchased courses ── */
  const purchasedCourses = typedCourses
    .filter((c) => paidCourseIds.has(c.id))
    .map((c) => {
      const purchase = typedPurchases.find(
        (p) => p.course_id === c.id && p.status === "paid"
      );
      return {
        title: c.title,
        slug: c.slug,
        pricePHP: c.price_php,
        purchasedAt: purchase?.created_at ?? "",
      };
    });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <DashboardAccount
          userEmail={user.email ?? ""}
          userName={user.user_metadata?.full_name ?? ""}
          createdAt={user.created_at}
          purchasedCourses={purchasedCourses}
          courseProgress={courseProgress}
        />
      </div>
    </main>
  );
}