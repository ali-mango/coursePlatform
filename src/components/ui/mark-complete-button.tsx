// src/components/ui/mark-complete-button.tsx
"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface MarkCompleteButtonProps {
  lessonId: string;
  initialCompleted: boolean;
}

export function MarkCompleteButton({
  lessonId,
  initialCompleted,
}: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const newState = !completed;

    startTransition(async () => {
      try {
        const res = await fetch("/api/lesson-progress", {
          method: newState ? "POST" : "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });

        if (res.ok) {
          setCompleted(newState);
          router.refresh(); // refresh server components (sidebar progress)
        }
      } catch {
        // silently fail — user can retry
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`inline-flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-medium transition ${
        completed
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
      }`}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : completed ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {completed ? "Completed" : "Mark as complete"}
    </button>
  );
}