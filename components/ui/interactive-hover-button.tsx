import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, text = "Button", className, ...props }, ref) => {
  const label = children ?? text;

  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-background px-6 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors duration-300 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-4 h-2 w-2 rounded-full bg-primary transition-all duration-300 ease-out group-hover:scale-[100.8]" />
      <span className="relative z-10 ml-4 flex items-center gap-2 transition-all duration-300 ease-out group-hover:translate-x-10 group-hover:opacity-0">
        {label}
      </span>
      <span className="absolute inset-0 z-10 flex translate-x-10 items-center justify-center gap-1.5 text-primary-foreground opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
        <span>{label}</span>
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
