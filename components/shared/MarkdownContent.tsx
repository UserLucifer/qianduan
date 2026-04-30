import ReactMarkdown, { type Components } from "react-markdown";
import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-8 mt-12 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-6 mt-10 text-2xl font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mb-6 leading-relaxed text-muted-foreground">
      {children}
    </p>
  ),
  pre({ children, className, ...props }) {
    return (
      <div className="relative my-10 group/code">
        <pre
          className={cn(
            "overflow-x-auto rounded-xl border border-border bg-[#090a0b]/90 dark:bg-[#050505] p-6 text-sm leading-relaxed text-foreground/90 shadow-2xl",
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
            : "rounded-md bg-muted/50 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
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
    <div className="blog-markdown prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
}

