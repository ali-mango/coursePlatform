// src/app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUserAndHasPaid } from "@/lib/entitlements";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;

  const supabase = await createSupabaseServer();

  const { data: course } = await supabase
    .from("courses")
    .select("id,slug,title,is_free,price_php")
    .eq("slug", courseSlug)
    .single();

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p>Course not found.</p>
      </div>
    );
  }

  const { data: lesson } = await supabaseAdmin
    .from("lessons")
    .select("title,content_md,is_preview")
    .eq("course_id", course.id)
    .eq("slug", lessonSlug)
    .single();

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p>Lesson not found.</p>
      </div>
    );
  }

  const { user, hasPaid } = await getUserAndHasPaid(course.id);
  const unlocked = course.is_free || lesson.is_preview || hasPaid;

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Link
          className="text-sm text-slate-600 hover:underline"
          href={`/courses/${course.slug}`}
        >
          ← Back to outline
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">{lesson.title}</h1>
        <p className="mt-2 text-slate-600">This lesson is locked.</p>

        <div className="mt-6 rounded-2xl border bg-white p-5">
          <h3 className="text-lg font-semibold">Unlock {course.title}</h3>
          <p className="mt-1 text-sm text-slate-600">
            ₱{course.price_php} • lifetime access
          </p>

          {!user ? (
            <Link
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white"
              href="/auth/login"
            >
              Login to purchase
            </Link>
          ) : (
  <form action="/api/paymongo/checkout" method="POST">
    <input type="hidden" name="courseId" value={course.id} />
    <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white">
      Buy ₱{course.price_php}
    </button>
  </form>
)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link
        className="text-sm text-slate-600 hover:underline"
        href={`/courses/${course.slug}`}
      >
        ← Back to outline
      </Link>

      <h1 className="mt-4 text-3xl font-semibold">{lesson.title}</h1>

      <div className="prose mt-6 max-w-none">
        <ReactMarkdown>{lesson.content_md.replace(/\\n/g, "\n")}</ReactMarkdown>
      </div>
    </div>
  );
}