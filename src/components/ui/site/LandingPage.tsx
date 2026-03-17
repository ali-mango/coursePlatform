import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Code2,
  FileText,
  Infinity as InfinityIcon,
  Layers3,
  Map,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";

type CourseLite = {
  id: string;
  slug: string;
  title: string;
  description: string;
  is_free: boolean;
  price_php: number;
};

function formatPeso(n: number) {
  return `₱${n.toLocaleString("en-PH")}`;
}

export default function LandingPage({ courses }: { courses: CourseLite[] }) {
  const freeCourse = courses.find((c) => c.is_free) ?? courses[0];
  const paidCourse = courses.find((c) => !c.is_free) ?? courses[1];

  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-slate-700">
              <Sparkles className="h-4 w-4" />
              New modules added weekly
            </div>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-slate-900">
              Learn Web Dev Fundamentals{" "}
              <span className="text-blue-600">— Step by step</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              No overwhelm. Just a clear path + projects you&apos;ll actually
              finish. Text-based, beginner-friendly, and built for self-learners.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={paidCourse ? `/courses/${paidCourse.slug}` : "/courses"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Get Web Dev Fundamentals{" "}
                {paidCourse ? `(${formatPeso(paidCourse.price_php)})` : ""}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={freeCourse ? `/courses/${freeCourse.slug}` : "/courses"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Start Free Course
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-slate-600">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border bg-slate-200" />
                <div className="h-8 w-8 rounded-full border bg-slate-200" />
                <div className="h-8 w-8 rounded-full border bg-slate-200" />
              </div>
              <span>Trusted by 500+ beginner devs</span>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <Check className="h-4 w-4" />
                Unlocked
              </div>
              <div className="text-xs text-slate-500">Progress</div>
            </div>

            <div className="mt-5 rounded-2xl border bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Code2 className="h-4 w-4 text-blue-600" />
                Module 2: CSS Fundamentals
              </div>

              <pre className="mt-4 overflow-x-auto rounded-xl bg-white p-4 text-xs text-slate-800">
{`.container {
  display: flex;
  gap: 1rem;
  padding: 2rem;
}`}
              </pre>

              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Box model basics
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Flexbox layout
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border" />
                  Grid fundamentals
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>67%</span>
                  <span>12/18 lessons</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                  <div className="h-2 w-[67%] rounded-full bg-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
            Built for how beginners actually learn
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Everything you need to go from zero to building real websites,
            without the overwhelm.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Map className="h-5 w-5 text-blue-600" />}
            title="Clear Roadmap"
            desc="Know exactly what to learn next. No rabbit holes or decision fatigue."
          />
          <FeatureCard
            icon={<Search className="h-5 w-5 text-violet-600" />}
            title="Searchable Text Lessons"
            desc="No more rewinding videos. Read, search, and reference anytime you need."
          />
          <FeatureCard
            icon={<Layers3 className="h-5 w-5 text-emerald-600" />}
            title="Projects Every Module"
            desc="Build real things as you learn. Each module ends with a hands-on project."
          />
          <FeatureCard
            icon={<InfinityIcon className="h-5 w-5 text-amber-600" />}
            title="Lifetime Access"
            desc="Buy once, learn forever. All future updates included at no extra cost."
          />
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
            What you&apos;ll learn
          </h2>
          <p className="mt-3 text-slate-600">
            6 focused modules taking you from complete beginner to building real
            websites.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <CurriculumItem
            number={1}
            title="Getting Started"
            meta="4 lessons • 45 min"
            open
            bullets={[
              "How websites work",
              "Your first HTML file",
              "Setting up VS Code",
              "Browser DevTools intro",
            ]}
          />
          <CurriculumItem number={2} title="HTML Foundations" meta="6 lessons • 1.5 hrs" />
          <CurriculumItem number={3} title="CSS Fundamentals" meta="8 lessons • 2.5 hrs" />
          <CurriculumItem number={4} title="JavaScript Basics" meta="10 lessons • 3 hrs" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
            Loved by beginners
          </h2>
          <p className="mt-3 text-slate-600">
            Real feedback from real learners.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <TestimonialCard
            quote="I tried YouTube tutorials for months and got nowhere. This course gave me a clear path — I built my first website in 2 weeks!"
            name="Maria Santos"
            role="Career Switcher"
          />
          <TestimonialCard
            quote="The text format is perfect. I can study between classes and easily find specific topics. Way better than scrubbing through hour-long videos."
            name="James Rivera"
            role="College Student"
          />
          <TestimonialCard
            quote="The projects are what sold me. I now have 3 portfolio pieces from this course alone. Already landed my first client!"
            name="Ana Cruz"
            role="Freelancer"
          />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
            Choose your path
          </h2>
          <p className="mt-3 text-slate-600">
            Start free, or dive deep with our comprehensive fundamentals course.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <PricingCard
            variant="free"
            title={freeCourse?.title ?? "Free Course"}
            desc="Get started with HTML & CSS basics. Build your first simple webpage from scratch."
            price="Free"
            meta="one-time"
            bullets={[
              "8 beginner-friendly lessons",
              "HTML & CSS basics",
              "Build your first webpage",
              "Lifetime access",
              "Community support",
            ]}
            ctaText="Start Free"
            href={freeCourse ? `/courses/${freeCourse.slug}` : "/courses"}
          />

          <PricingCard
            variant="paid"
            title={paidCourse?.title ?? "Web Dev Fundamentals"}
            desc="Master HTML, CSS, and JavaScript. Build real projects with hands-on lessons every module."
            price={paidCourse ? formatPeso(paidCourse.price_php) : "₱999"}
            meta="one-time"
            badge="Most Popular"
            bullets={[
              "All text-based lessons",
              "Hands-on projects",
              "HTML, CSS & JavaScript",
              "Lifetime access & updates",
              "Downloadable resources",
            ]}
            ctaText={paidCourse ? `Buy ${formatPeso(paidCourse.price_php)}` : "Buy"}
            href={paidCourse ? `/courses/${paidCourse.slug}` : "/courses"}
          />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-5xl px-6 py-14">
        <div className="text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-slate-600">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="a">
              <AccordionTrigger>Do I need any prior coding experience?</AccordionTrigger>
              <AccordionContent>
                Nope. This is built for complete beginners. We start from zero and build up step-by-step.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="b">
              <AccordionTrigger>Why text-based instead of video?</AccordionTrigger>
              <AccordionContent>
                Text is searchable and easier to review. No rewinding, no skipping around — you can learn faster.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="c">
              <AccordionTrigger>How long do I have access?</AccordionTrigger>
              <AccordionContent>
                Lifetime access. Buy once and keep it forever — including updates.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="d">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                Card and supported wallet/QR methods via PayMongo (available methods depend on what is enabled on our account).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="e">
              <AccordionTrigger>Will I get a certificate?</AccordionTrigger>
              <AccordionContent>
                MVP version: not yet. We can add certificates later once progress tracking is implemented.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                Y
              </div>
              YourBrand
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Learn web development the right way. Clear lessons, real projects, no fluff.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Curriculum", href: "#pricing" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", href: "#" },
              { label: "Blog", href: "#" },
              { label: "Contact", href: "#" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Refunds", href: "#" },
            ]}
          />
        </div>

        <div className="border-t py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} YourBrand. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>
      <div className="mt-4 font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}

function CurriculumItem({
  number,
  title,
  meta,
  bullets,
  open,
}: {
  number: number;
  title: string;
  meta: string;
  bullets?: string[];
  open?: boolean;
}) {
  return (
    <details
      className="group rounded-2xl border bg-white p-6 shadow-sm"
      open={open}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-sm font-semibold text-blue-600">
            {number}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{title}</div>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> lessons
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {meta.split(" • ")[1] ?? meta}
              </span>
            </div>
          </div>
        </div>

        <div className="text-slate-400 transition group-open:rotate-180">⌄</div>
      </summary>

      {bullets?.length ? (
        <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          {bullets.map((b) => (
            <div key={b} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      ) : null}
    </details>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-700">“{quote}”</p>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-200" />
        <div>
          <div className="text-sm font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  variant,
  title,
  desc,
  price,
  meta,
  badge,
  bullets,
  ctaText,
  href,
}: {
  variant: "free" | "paid";
  title: string;
  desc: string;
  price: string;
  meta: string;
  badge?: string;
  bullets: string[];
  ctaText: string;
  href: string;
}) {
  const paid = variant === "paid";

  return (
    <div
      className={[
        "rounded-3xl border p-8 shadow-sm",
        paid ? "bg-blue-600 text-white" : "bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {paid && badge ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-4 w-4" />
              {badge}
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-emerald-700">
              Free
            </div>
          )}

          <div className="mt-4 text-xl font-semibold">{title}</div>
          <p className={["mt-2 text-sm leading-relaxed", paid ? "text-white/80" : "text-slate-600"].join(" ")}>
            {desc}
          </p>
        </div>

        <div className="text-right">
          <div className={["text-4xl font-semibold tracking-tight", paid ? "text-white" : "text-slate-900"].join(" ")}>
            {price}
          </div>
          <div className={["mt-1 text-xs", paid ? "text-white/70" : "text-slate-500"].join(" ")}>
            {meta}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {bullets.map((b) => (
          <div key={b} className="flex items-start gap-2 text-sm">
            <Check className={["mt-0.5 h-4 w-4", paid ? "text-white" : "text-emerald-600"].join(" ")} />
            <span className={paid ? "text-white/90" : "text-slate-700"}>{b}</span>
          </div>
        ))}
      </div>

      <Link
        href={href}
        className={[
          "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium",
          paid
            ? "bg-white text-blue-700 hover:bg-white/90"
            : "bg-emerald-600 text-white hover:bg-emerald-700",
        ].join(" ")}
      >
        {ctaText} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-3 space-y-2 text-sm text-slate-600">
        {links.map((l) => (
          <a key={l.label} href={l.href} className="block hover:underline">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}