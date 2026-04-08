// src/app/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LayoutDashboard,
  ShoppingBag,
  UserCircle2,
} from "lucide-react";
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
  description: string | null;
  is_free: boolean;
  price_php: number | null;
};

function getFallbackDescription(course: CourseRow) {
  if (course.is_free) {
    return "A free beginner mini-course to help you publish your first site.";
  }
  return "Step-by-step fundamentals with projects designed for beginners.";
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
const { data } = await supabase.auth.getUser();
const user = data.user;

if (!user) redirect("/auth/login");
if (!user.email_confirmed_at) redirect("/auth/login?message=verify-email");

  /* ── purchases ── */
  const { data: purchases } = await supabase
    .from("purchases")
    .select("status, course_id, created_at")
    .eq("user_id", user.id);

  const typedPurchases = (purchases ?? []) as PurchaseRow[];

  const paidCourseIds = new Set(
    typedPurchases
      .filter((purchase) => purchase.status === "paid")
      .map((purchase) => purchase.course_id)
  );

  /* ── courses ── */
  const { data: courses } = await supabase
    .from("courses")
    .select("id,slug,title,description,is_free,price_php")
    .order("created_at", { ascending: true });

  const typedCourses = (courses ?? []) as CourseRow[];

  const myCourses = typedCourses.filter(
    (course) => course.is_free || paidCourseIds.has(course.id)
  );

  const purchasedCoursesCount = typedCourses.filter((course) =>
    paidCourseIds.has(course.id)
  ).length;

  const freeCoursesCount = myCourses.filter((course) => course.is_free).length;

  const firstName =
    user.user_metadata?.full_name?.split(" ")?.[0] ||
    user.email?.split("@")?.[0] ||
    "there";

  /* ── lesson progress ── */
  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id);

  const completedLessonIds = new Set(
    (progressRows ?? []).map((r: { lesson_id: string }) => r.lesson_id)
  );

  // Get lesson counts per course
  const { data: allLessons } = await supabaseAdmin
    .from("lessons")
    .select("id, course_id")
    .in(
      "course_id",
      myCourses.map((c) => c.id)
    );

  const lessonsByCourse = new Map<string, string[]>();
  for (const l of allLessons ?? []) {
    const arr = lessonsByCourse.get(l.course_id) ?? [];
    arr.push(l.id);
    lessonsByCourse.set(l.course_id, arr);
  }

  const courseProgress = myCourses.map((course) => {
    const lessonIds = lessonsByCourse.get(course.id) ?? [];
    const completedCount = lessonIds.filter((id) =>
      completedLessonIds.has(id)
    ).length;

    return {
      courseTitle: course.title,
      courseSlug: course.slug,
      totalLessons: lessonIds.length,
      completedLessons: completedCount,
      isFree: course.is_free,
    };
  });

  /* ── purchased courses for account tab ── */
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
        {/* Top Welcome */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Student Dashboard
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                Welcome back, {firstName}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep learning at your own pace. Access your courses, continue
                where you left off, and build your skills step by step.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <DashboardStatCard
            icon={<BookOpen className="h-5 w-5 text-blue-600" />}
            title="My Courses"
            value={String(myCourses.length)}
            description="Courses currently available in your account"
          />
          <DashboardStatCard
            icon={<ShoppingBag className="h-5 w-5 text-emerald-600" />}
            title="Purchased"
            value={String(purchasedCoursesCount)}
            description="Paid courses you've unlocked"
          />
          <DashboardStatCard
            icon={<UserCircle2 className="h-5 w-5 text-violet-600" />}
            title="Free Access"
            value={String(freeCoursesCount)}
            description="Free course content available to you"
          />
        </section>

        {/* My Courses */}
        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                My Courses
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Continue learning from the courses you already have access to.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Browse all courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {myCourses.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <BookOpen className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No courses yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                You don&apos;t have any available courses in your dashboard yet.
                Start with the free course or unlock the full fundamentals path.
              </p>
              <Link
                href="/courses"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                View Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {myCourses.map((course) => {
                const description =
                  course.description?.trim() || getFallbackDescription(course);

                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                        <BookOpen className="h-5 w-5 text-slate-700" />
                      </div>
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                          course.is_free
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border border-blue-200 bg-blue-50 text-blue-700",
                        ].join(" ")}
                      >
                        {course.is_free ? (
                          "Free Access"
                        ) : (
                          <>
                            Purchased
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </>
                        )}
                      </span>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
                      {course.title}
                    </h3>
                    <p className="mt-3 min-h-[56px] text-sm leading-7 text-slate-600">
                      {description}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-medium text-slate-700">
                        Continue learning
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition group-hover:text-blue-700">
                        Open course
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Account Settings */}
        {/* <DashboardAccount
          userEmail={user.email ?? ""}
          userName={user.user_metadata?.full_name ?? ""}
          createdAt={user.created_at}
          purchasedCourses={purchasedCourses}
          courseProgress={courseProgress}
        /> */}
      </div>
    </main>
  );
}

function DashboardStatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>
      <div className="mt-4 text-sm font-medium text-slate-600">{title}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}