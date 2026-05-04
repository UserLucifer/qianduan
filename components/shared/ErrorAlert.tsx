import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export function ErrorAlert({
  message,
  children,
  className,
}: {
  message: string | null | undefined;
  children?: ReactNode;
  className?: string;
}) {
  if (!message) return null;

  return (
    <Alert
      variant="destructive"
      className={cn("border-destructive/20 bg-destructive/10 p-4 text-destructive", className)}
    >
      <AlertDescription className="flex items-center gap-3 font-medium text-current">
        <span>{message}</span>
        {children}
      </AlertDescription>
    </Alert>
  );
}
