// src/components/ui/admin-dashboard-client.tsx
"use client";

import {
  Users,
  BookOpen,
  CheckCircle2,
  CreditCard,
  TrendingUp,
  UserPlus,
  ShoppingCart,
} from "lucide-react";

/* ── types ── */
type SignupStats = {
  total_signups: number;
  signups_last_7d: number;
  signups_last_30d: number;
  signups_today: number;
} | null;

type LearnerStats = {
  total_active_learners: number;
  active_last_7d: number;
  active_last_30d: number;
} | null;

type CompletionRow = {
  course_title: string;
  course_slug: string;
  total_completions: number;
  unique_learners: number;
  completions_last_7d: number;
};

type PurchaseRow = {
  course_title: string;
  course_slug: string;
  total_purchases: number;
  total_revenue_php: number;
  purchases_last_7d: number;
  revenue_last_7d: number;
  purchases_last_30d: number;
  revenue_last_30d: number;
};

type ActivityRow = {
  event_type: "signup" | "lesson_completed" | "purchase";
  user_id: string;
  user_email: string;
  detail: string | null;
  event_at: string;
};

interface AdminDashboardProps {
  signups: SignupStats;
  learners: LearnerStats;
  completions: CompletionRow[];
  purchases: PurchaseRow[];
  activity: ActivityRow[];
}

/* ── helpers ── */
function peso(n: number) {
  return `₱${Number(n || 0).toLocaleString("en-PH")}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const masked = local.length > 3 ? local.slice(0, 3) + "***" : local[0] + "***";
  return `${masked}@${domain}`;
}

/* ── stat card ── */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: "blue" | "emerald" | "violet" | "amber";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500">{label}</div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </div>
        </div>
      </div>
      {sub && (
        <div className="mt-3 text-xs text-slate-500">{sub}</div>
      )}
    </div>
  );
}

/* ── activity event ── */
function ActivityEvent({ event }: { event: ActivityRow }) {
  const config = {
    signup: {
      icon: UserPlus,
      color: "bg-blue-100 text-blue-600",
      label: "signed up",
    },
    lesson_completed: {
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
      label: "completed",
    },
    purchase: {
      icon: ShoppingCart,
      color: "bg-amber-100 text-amber-600",
      label: "purchased",
    },
  };

  const c = config[event.event_type];
  const Icon = c.icon;

  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${c.color}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-slate-700">
          <span className="font-medium">{maskEmail(event.user_email)}</span>{" "}
          {c.label}
          {event.detail && (
            <span className="text-slate-500"> &ldquo;{event.detail}&rdquo;</span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-slate-400">
          {timeAgo(event.event_at)}
        </div>
      </div>
    </div>
  );
}

/* ── main dashboard ── */
export function AdminDashboardClient({
  signups,
  learners,
  completions,
  purchases,
  activity,
}: AdminDashboardProps) {
  const totalRevenue = purchases.reduce(
    (sum, p) => sum + (p.total_revenue_php || 0),
    0
  );
  const totalPurchases = purchases.reduce(
    (sum, p) => sum + (p.total_purchases || 0),
    0
  );
  const totalCompletions = completions.reduce(
    (sum, c) => sum + (c.total_completions || 0),
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor signups, engagement, and revenue
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Signups"
          value={signups?.total_signups ?? 0}
          sub={`${signups?.signups_today ?? 0} today · ${signups?.signups_last_7d ?? 0} this week`}
          icon={Users}
          accent="blue"
        />
        <StatCard
          label="Active Learners"
          value={learners?.total_active_learners ?? 0}
          sub={`${learners?.active_last_7d ?? 0} active this week`}
          icon={BookOpen}
          accent="emerald"
        />
        <StatCard
          label="Lessons Completed"
          value={totalCompletions}
          sub={`Across ${completions.length} courses`}
          icon={CheckCircle2}
          accent="violet"
        />
        <StatCard
          label="Total Revenue"
          value={peso(totalRevenue)}
          sub={`${totalPurchases} purchases`}
          icon={CreditCard}
          accent="amber"
        />
      </div>

      {/* Two-column layout */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: Tables */}
        <div className="space-y-6">
          {/* Course completions */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Lesson Completions by Course
              </h2>
            </div>
            {completions.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                No lesson completions yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3">Course</th>
                      <th className="px-5 py-3 text-right">Learners</th>
                      <th className="px-5 py-3 text-right">Completions</th>
                      <th className="px-5 py-3 text-right">Last 7d</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completions.map((c) => (
                      <tr
                        key={c.course_slug}
                        className="border-b last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-slate-800">
                          {c.course_title}
                        </td>
                        <td className="px-5 py-3 text-right text-slate-600">
                          {c.unique_learners}
                        </td>
                        <td className="px-5 py-3 text-right text-slate-600">
                          {c.total_completions}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <TrendingUp className="h-3 w-3" />
                            {c.completions_last_7d}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Revenue */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Revenue by Course
              </h2>
            </div>
            {purchases.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                No purchases yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3">Course</th>
                      <th className="px-5 py-3 text-right">Purchases</th>
                      <th className="px-5 py-3 text-right">Revenue</th>
                      <th className="px-5 py-3 text-right">Last 7d</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((p) => (
                      <tr
                        key={p.course_slug}
                        className="border-b last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-slate-800">
                          {p.course_title}
                        </td>
                        <td className="px-5 py-3 text-right text-slate-600">
                          {p.total_purchases}
                        </td>
                        <td className="px-5 py-3 text-right font-medium text-slate-800">
                          {peso(p.total_revenue_php)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            <TrendingUp className="h-3 w-3" />
                            {peso(p.revenue_last_7d)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Activity feed */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
          </div>
          <div className="max-h-[600px] overflow-y-auto px-5">
            {activity.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No activity yet
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activity.map((event, i) => (
                  <ActivityEvent key={`${event.event_type}-${event.user_id}-${i}`} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}