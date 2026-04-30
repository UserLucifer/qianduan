import ReactMarkdown, { type Components } from "react-markdown";
import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-8 mt-12 text-3xl font-bold tracking-tight text-[#f7f8f8] md:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-6 mt-10 text-2xl font-semibold tracking-tight text-[#f7f8f8]">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mb-6 leading-relaxed text-[#8a8f98]">
      {children}
    </p>
  ),
  pre({ children, className, ...props }) {
    return (
      <div className="relative my-8 group/code">
        <pre
          className={cn(
            "overflow-x-auto rounded-xl border border-white/10 bg-[#0f1011] p-5 text-sm leading-relaxed text-[#d0d6e0] shadow-2xl",
            className,
          )}
          {...props}
        >
          {children}
        </pre>
      </div>
    );
  },
  code({ children, className, ...props }) {
    const isBlockCode = typeof className === "string" && className.startsWith("language-");

    return (
      <code
        className={cn(
          isBlockCode
            ? "block font-mono text-sm text-inherit"
            : "rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.85em] text-[#9aa2ff]",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="blog-markdown prose prose-invert prose-slate max-w-none prose-headings:scroll-mt-20 prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
}
