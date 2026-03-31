"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import image1 from "@/assests/images/image1.png";
import image2 from "@/assests/images/image2.png";
import image3 from "@/assests/images/image3.png";
import logo from "@/assests/images/codeclover.png";
import type { Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
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

type CurriculumTopic = {
  title: string;
  details: string[];
};

type CurriculumModule = {
  number: number;
  title: string;
  lessons: number;
  duration: string;
  description: string;
  topics: CurriculumTopic[];
};

const curriculumModules: CurriculumModule[] = [
  {
    number: 1,
    title: "Getting Started",
    lessons: 2,
    duration: "20 min",
    description:
      "Set up your tools properly and understand how to begin building your first site.",
    topics: [
      {
        title: "Setup and tools",
        details: [
          "Install VS Code and prepare your workspace",
          "Understand what tools you actually need as a beginner",
          "Avoid overwhelm by starting simple",
        ],
      },
      {
        title: "Your first project folder",
        details: [
          "Create your first website folder correctly",
          "Open it in VS Code",
          "Get ready to write your first HTML page",
        ],
      },
    ],
  },
  {
    number: 2,
    title: "HTML Basics",
    lessons: 5,
    duration: "50 min",
    description:
      "Learn the structure of a webpage and build clean HTML from scratch.",
    topics: [
      {
        title: "Page structure",
        details: [
          "Understand the HTML skeleton",
          "Use headings, paragraphs, and text properly",
          "Build pages with clear structure",
        ],
      },
      {
        title: "Links, images, and content",
        details: [
          "Add links and images correctly",
          "Use lists and simple sections",
          "Create pages that feel like real websites",
        ],
      },
      {
        title: "Semantic HTML",
        details: [
          "Use meaningful tags like header, nav, main, and footer",
          "Write cleaner and more readable markup",
          "Build habits that scale as you improve",
        ],
      },
    ],
  },
  {
    number: 3,
    title: "CSS Basics",
    lessons: 5,
    duration: "1 hr",
    description:
      "Make your site look polished with colors, spacing, layout, and typography.",
    topics: [
      {
        title: "How CSS works",
        details: [
          "Connect CSS to your HTML",
          "Style text, backgrounds, and spacing",
          "Understand selectors and simple styling rules",
        ],
      },
      {
        title: "Box model and layout",
        details: [
          "Use padding, margin, and borders with confidence",
          "Understand how spacing affects layout",
          "Avoid common beginner layout mistakes",
        ],
      },
      {
        title: "Flexbox and styling",
        details: [
          "Create navbars and card layouts",
          "Use Flexbox for simple responsive structure",
          "Make your site look more modern and organized",
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Responsive Design",
    lessons: 2,
    duration: "25 min",
    description:
      "Make your website work better on mobile and different screen sizes.",
    topics: [
      {
        title: "Responsive basics",
        details: [
          "Use the viewport meta tag properly",
          "Understand how layouts change across screens",
          "Make your pages easier to view on phones",
        ],
      },
      {
        title: "Simple media queries",
        details: [
          "Adjust layouts for mobile and desktop",
          "Make text and sections adapt better",
          "Build a more usable beginner project",
        ],
      },
    ],
  },
  {
    number: 5,
    title: "Build Your Website",
    lessons: 2,
    duration: "40 min",
    description:
      "Put everything together into a real beginner website project.",
    topics: [
      {
        title: "Your final website build",
        details: [
          "Create a simple multi-section website",
          "Combine HTML and CSS into one clean project",
          "Practice building something complete from scratch",
        ],
      },
      {
        title: "Make it your own",
        details: [
          "Edit your text, colors, and sections",
          "Personalize your page with your own content",
          "Finish with a result you can actually show",
        ],
      },
    ],
  },
  {
    number: 6,
    title: "Go Live",
    lessons: 1,
    duration: "15 min",
    description:
      "Learn how to put your finished website online and share it with others.",
    topics: [
      {
        title: "Publishing your site",
        details: [
          "Understand basic hosting for beginners",
          "Upload your site online simply",
          "Share your first real website with confidence",
        ],
      },
    ],
  },
];

function formatPeso(n: number) {
  return `₱${n.toLocaleString("en-PH")}`;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function LandingPage({ courses }: { courses: CourseLite[] }) {
  const freeCourse = courses.find((c) => c.is_free) ?? courses[0];
  const paidCourse = courses.find((c) => !c.is_free) ?? courses[1];

  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="pb-10 pt-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="grid items-center gap-10 lg:grid-cols-2"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-slate-700">
                <Sparkles className="h-4 w-4" />
                Beginner-friendly • Text-based • Self-paced
              </div>

              <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
                Learn to Build Your First Website{" "}
                <span className="text-blue-600">— Step by step</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                No overwhelm. Just a simple, beginner-friendly path to learning
                HTML, CSS, responsive design, and building a real website from
                scratch.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={paidCourse ? `/courses/${paidCourse.slug}` : "/courses"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  Get Full Course{" "}
                  {paidCourse ? `(${formatPeso(paidCourse.price_php)})` : "(₱49)"}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={freeCourse ? `/courses/${freeCourse.slug}` : "/courses"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                >
                  Start Free Course
                </Link>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Start with the free mini-course, then unlock the full beginner
                course for only{" "}
                <span className="font-semibold text-slate-900">₱49</span>.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <Check className="h-4 w-4" />
                    Beginner Progress
                  </div>
                  <div className="text-xs text-slate-500">Example path</div>
                </div>

                <div className="mt-5 rounded-2xl border bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Code2 className="h-4 w-4 text-blue-600" />
                    Building Your First Styled Section
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
                      HTML structure
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      CSS spacing and layout
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border" />
                      Final website build
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Beginner friendly</span>
                      <span>Step by step</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                      <div className="h-2 w-[67%] rounded-full bg-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                Built for how beginners actually learn
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                Clear lessons, simple explanations, and a real beginner project
                you can actually finish.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <FeatureCard
                icon={<Map className="h-5 w-5 text-blue-600" />}
                title="Clear Roadmap"
                desc="Know what to learn next without getting lost in random tutorials."
              />
              <FeatureCard
                icon={<Search className="h-5 w-5 text-violet-600" />}
                title="Text-Based Lessons"
                desc="Read at your own pace, review anytime, and quickly find what you need."
              />
              <FeatureCard
                icon={<Layers3 className="h-5 w-5 text-emerald-600" />}
                title="Real Beginner Project"
                desc="Apply what you learn by building a real website from scratch."
              />
              <FeatureCard
                icon={<InfinityIcon className="h-5 w-5 text-amber-600" />}
                title="Lifetime Access"
                desc="Pay once and come back whenever you want to review the lessons."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                What you&apos;ll learn
              </h2>
              <p className="mt-3 text-slate-600">
                A simple step-by-step path from complete beginner to your first
                real website.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 space-y-4">
              {curriculumModules.map((module, index) => (
                <CurriculumItem
                  key={module.number}
                  number={module.number}
                  title={module.title}
                  lessons={module.lessons}
                  duration={module.duration}
                  description={module.description}
                  topics={module.topics}
                  open={index === 0}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                Beginner-friendly from start to finish
              </h2>
              <p className="mt-3 text-slate-600">
                The kind of feedback we want from first-time learners.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="mt-10 grid gap-4 md:grid-cols-3"
            >
              <TestimonialCard
                image={image1}
                quote="I liked that everything was explained in a simple way. I usually get lost with coding tutorials, but this one felt easy to follow."
                name="Maria Santos"
                role="Complete Beginner"
              />
              <TestimonialCard
                image={image2}
                quote="The text-based lessons helped me learn faster because I could read at my own pace and go back anytime I needed."
                name="James Rivera"
                role="Student"
              />
              <TestimonialCard
                image={image3}
                quote="For the price, it was super worth it. I finally understood how HTML and CSS work together and built a simple page on my own."
                name="Ana Cruz"
                role="Beginner Learner"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                Start free, then go deeper
              </h2>
              <p className="mt-3 text-slate-600">
                Try the free mini-course first, then unlock the full beginner
                course for only ₱49.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="mt-10 grid gap-4 md:grid-cols-2"
            >
              <PricingCard
                variant="free"
                title={freeCourse?.title ?? "Free Mini Course"}
                desc="A quick beginner mini-course to help you set up your tools and create your first simple webpage."
                price="Free"
                meta="start here"
                bullets={[
                  "Beginner-friendly lessons",
                  "Set up VS Code",
                  "Write your first HTML page",
                  "Simple HTML & CSS basics",
                  "Try before upgrading",
                ]}
                ctaText="Start Free"
                href={freeCourse ? `/courses/${freeCourse.slug}` : "/courses"}
              />

              <PricingCard
                variant="paid"
                title={paidCourse?.title ?? "Zero to First Website"}
                desc="A beginner-friendly course that teaches you how to build a real website using HTML, CSS, responsive design, and a simple final project."
                price={paidCourse ? formatPeso(paidCourse.price_php) : "₱49"}
                meta="one-time payment"
                badge="Best for beginners"
                bullets={[
                  "Step-by-step text lessons",
                  "Learn HTML and CSS clearly",
                  "Responsive design basics",
                  "Build a real website project",
                  "Lifetime access",
                ]}
                ctaText={
                  paidCourse
                    ? `Get Access for ${formatPeso(paidCourse.price_php)}`
                    : "Get Access for ₱49"
                }
                href={paidCourse ? `/courses/${paidCourse.slug}` : "/courses"}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-slate-600">
                Got questions? We&apos;ve got answers.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-8 max-w-4xl rounded-2xl border bg-white p-2"
            >
              <Accordion type="single" collapsible>
                <AccordionItem value="a">
                  <AccordionTrigger>
                    Do I need any prior coding experience?
                  </AccordionTrigger>
                  <AccordionContent>
                    No. This course is built for complete beginners. We start
                    with the basics and guide you step by step.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="b">
                  <AccordionTrigger>
                    Why text-based instead of video?
                  </AccordionTrigger>
                  <AccordionContent>
                    Text lessons are easier to review, search, and go back to at
                    your own pace. You can learn faster without scrubbing
                    through long videos.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="c">
                  <AccordionTrigger>How long do I have access?</AccordionTrigger>
                  <AccordionContent>
                    Lifetime access. Once you get the course, you can come back
                    to it anytime.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="d">
                  <AccordionTrigger>
                    Is the full course really only ₱49?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It&apos;s a simple, affordable beginner course designed
                    to help you build your first real website without spending
                    much.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="e">
                  <AccordionTrigger>What will I build?</AccordionTrigger>
                  <AccordionContent>
                    You&apos;ll build a simple real website using HTML and CSS,
                    then learn how to make it look better across different
                    screen sizes and publish it online.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
                <Image
                  src={logo}
                  alt="CodeClover logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="text-base font-semibold text-slate-900">
                CodeClover
              </span>
            </Link>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Beginner-friendly web development lessons focused on helping you
              build your first real website step by step.
            </p>
          </div>

          <FooterCol
            title="Learn"
            links={[
              { label: "Courses", href: "/courses" },
              { label: "Pricing", href: "/#pricing" },
              { label: "FAQ", href: "/#faq" },
            ]}
          />

          <FooterCol
            title="Courses"
            links={[
              {
                label: "Free Mini Course",
                href: freeCourse ? `/courses/${freeCourse.slug}` : "/courses",
              },
              {
                label: "Full Course",
                href: paidCourse ? `/courses/${paidCourse.slug}` : "/courses",
              },
              { label: "Start Learning", href: "/courses" },
            ]}
          />

          <FooterCol
            title="Account"
            links={[
              { label: "Login", href: "/auth/login" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "FAQ", href: "/#faq" },
            ]}
          />
        </div>

        <div className="border-t py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} CodeClover. All rights reserved.
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
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>
      <div className="mt-4 font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
    </motion.div>
  );
}

function CurriculumItem({
  number,
  title,
  lessons,
  duration,
  description,
  topics,
  open,
}: {
  number: number;
  title: string;
  lessons: number;
  duration: string;
  description: string;
  topics: CurriculumTopic[];
  open?: boolean;
}) {
  return (
    <details
      className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
      open={open}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-sm font-semibold text-blue-600">
            {number}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                Module {number}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {lessons} lessons
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {duration}
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-1 shrink-0 rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition duration-200 group-open:rotate-180 group-open:text-blue-600">
          <ChevronDown className="h-4 w-4" />
        </div>
      </summary>

      <div className="border-t bg-slate-50/70 px-6 py-5">
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <h4 className="text-sm font-semibold text-slate-900">
                  {topic.title}
                </h4>
              </div>

              <div className="mt-3 space-y-2.5 pl-6">
                {topic.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <p className="text-sm leading-relaxed text-slate-600">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

function TestimonialCard({
  image,
  quote,
  name,
  role,
}: {
  image: any;
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">“{quote}”</p>

      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>
    </motion.div>
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
    <motion.div
      variants={fadeUp}
      className={[
        "rounded-3xl border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md",
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
          <p
            className={[
              "mt-2 text-sm leading-relaxed",
              paid ? "text-white/80" : "text-slate-600",
            ].join(" ")}
          >
            {desc}
          </p>
        </div>

        <div className="text-right">
          <div
            className={[
              "text-4xl font-semibold tracking-tight",
              paid ? "text-white" : "text-slate-900",
            ].join(" ")}
          >
            {price}
          </div>
          <div
            className={[
              "mt-1 text-xs",
              paid ? "text-white/70" : "text-slate-500",
            ].join(" ")}
          >
            {meta}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {bullets.map((b) => (
          <div key={b} className="flex items-start gap-2 text-sm">
            <Check
              className={[
                "mt-0.5 h-4 w-4",
                paid ? "text-white" : "text-emerald-600",
              ].join(" ")}
            />
            <span className={paid ? "text-white/90" : "text-slate-700"}>
              {b}
            </span>
          </div>
        ))}
      </div>

      <Link
        href={href}
        className={[
          "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition",
          paid
            ? "bg-white text-blue-700 hover:bg-white/90"
            : "bg-emerald-600 text-white hover:bg-emerald-700",
        ].join(" ")}
      >
        {ctaText} <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
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
          <Link
            key={l.label}
            href={l.href}
            className="block transition hover:text-slate-900 hover:underline"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}