"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import type { Components } from "react-markdown";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-xs text-slate-400 transition hover:text-slate-200"
      type="button"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

const langNames: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  jsx: "JSX",
  tsx: "TSX",
  json: "JSON",
  bash: "Bash",
  sh: "Shell",
  sql: "SQL",
  py: "Python",
  python: "Python",
};

const components: Components = {
  pre({ children, ...props }) {
    const codeEl = children as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;

    let lang = "";
    let codeText = "";

    if (codeEl && typeof codeEl === "object" && "props" in codeEl) {
      const className = codeEl.props.className || "";
      const match = className.match(/language-(\w+)/);
      lang = match ? match[1] : "";

      const extractText = (node: React.ReactNode): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractText).join("");
        if (node && typeof node === "object" && "props" in node) {
          return extractText(
            (node as React.ReactElement<{ children?: React.ReactNode }>).props
              .children
          );
        }
        return "";
      };

      codeText = extractText(codeEl.props.children).trim();
    }

    const displayLang = langNames[lang] || lang;

    return (
      <div className="group relative my-6 overflow-hidden rounded-xl border border-slate-200 bg-[#0d1117] shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-700/60 bg-[#161b22] px-4 py-2">
          <span className="text-xs font-medium text-slate-400">
            {displayLang || "Code"}
          </span>
          <CopyButton text={codeText} />
        </div>

        <pre
          className="!m-0 !rounded-none !border-0 !bg-transparent p-4 text-sm leading-relaxed"
          {...props}
        >
          {children}
        </pre>
      </div>
    );
  },

  blockquote({ children }) {
    let isTryIt = false;
    let isTip = false;

    const checkChildren = (node: React.ReactNode): void => {
      if (typeof node === "string") {
        if (node.includes("Try it")) isTryIt = true;
        if (node.includes("Tip")) isTip = true;
      }
      if (Array.isArray(node)) node.forEach(checkChildren);
      if (node && typeof node === "object" && "props" in node) {
        const el = node as React.ReactElement<{ children?: React.ReactNode }>;
        checkChildren(el.props.children);
      }
    };

    checkChildren(children);

    if (isTryIt || isTip) {
      const emoji = isTryIt ? "🚀" : "💡";
      const label = isTryIt ? "Try it" : "Tip";

      return (
        <div className="my-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-800">
            <span>{emoji}</span>
            {label}
          </div>
          <div className="text-[15px] leading-7 text-blue-900/90 [&_p]:m-0 [&_strong]:text-blue-900 [&_code]:bg-blue-100 [&_code]:text-blue-800">
            {children}
          </div>
        </div>
      );
    }

    return (
      <blockquote className="my-6 rounded-r-xl border-l-4 border-l-slate-300 bg-slate-50 py-1 pl-5 pr-4 not-italic [&_p]:text-slate-700">
        {children}
      </blockquote>
    );
  },

  table({ children, ...props }) {
    return (
      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="!m-0 w-full" {...props}>
          {children}
        </table>
      </div>
    );
  },

  th({ children, ...props }) {
    return (
      <th
        className="bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
        {...props}
      >
        {children}
      </th>
    );
  },

  td({ children, ...props }) {
    return (
      <td
        className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700"
        {...props}
      >
        {children}
      </td>
    );
  },

  code({ className, children, ...props }) {
    const isBlock =
      className?.includes("language-") || className?.includes("hljs");

    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code
        className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[0.875em] font-medium text-slate-800"
        {...props}
      >
        {children}
      </code>
    );
  },

  a({ children, href, ...props }) {
    return (
      <a
        href={href}
        className="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 transition hover:decoration-blue-500"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
};

interface LessonContentProps {
  markdown: string;
}

export function LessonContent({ markdown }: LessonContentProps) {
  const normalizedMarkdown = markdown
    .replace(/\r\n/g, "\n")
    .replace(/^#\s+.*\n+/, "");

  return (
    <div
      className={[
        "prose prose-slate max-w-none",
        "prose-headings:tracking-tight prose-headings:text-slate-900",
        "prose-h1:mt-0 prose-h1:mb-6 prose-h1:text-[2.25rem] prose-h1:font-bold",
        "prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-[1.65rem] prose-h2:font-bold",
        "prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-semibold",
        "prose-p:text-[16px] prose-p:leading-[1.8] prose-p:text-slate-600",
        "prose-li:text-[16px] prose-li:leading-[1.8] prose-li:text-slate-600",
        "prose-ul:my-4 prose-ol:my-4",
        "prose-strong:text-slate-800",
        "prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-0 prose-pre:shadow-none",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-blockquote:border-0 prose-blockquote:p-0 prose-blockquote:not-italic",
        "prose-table:my-0",
        "prose-img:rounded-xl prose-img:shadow-sm",
        "prose-hr:my-10 prose-hr:border-slate-200",
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {normalizedMarkdown}
      </ReactMarkdown>
    </div>
  );
}