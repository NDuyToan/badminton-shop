import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-zinc-900 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500",
          hasError
            ? "border-red-500 text-red-900 placeholder:text-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20 dark:border-red-500 dark:text-red-200 dark:placeholder-zinc-600 dark:focus-visible:ring-red-500/30"
            : "border-zinc-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-zinc-700 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-500/20",
          className
        )}
        ref={ref}
        aria-invalid={hasError ? "true" : undefined}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
