import ReactMarkdown, { type Components } from "react-markdown";
import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  pre({ children, className, ...props }) {
    return (
      <pre
        className={cn(
          "overflow-x-auto rounded-xl border border-white/10 bg-[#0f1011] p-4 text-sm leading-6 text-[#d0d6e0]",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    );
  },
  code({ children, className, ...props }) {
    const isBlockCode = typeof className === "string" && className.startsWith("language-");

    return (
      <code
        className={cn(
          isBlockCode
            ? "block bg-transparent p-0 font-mono text-sm text-inherit"
            : "rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.9em] text-[#d0d6e0]",
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
    <div className="blog-markdown max-w-3xl mx-auto prose prose-invert">
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
}
