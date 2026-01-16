import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
  }
) {
  const { className, variant = "secondary", size = "md", ...rest } = props;

  const base =
    "inline-flex items-center justify-center rounded-xl border text-sm font-semibold transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-white disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "h-9 px-3",
    md: "h-10 px-4",
    lg: "h-11 px-5 text-base rounded-2xl"
  } as const;

  const variants = {
    primary: "border-accent-600 bg-accent-600 text-white hover:bg-accent-700",
    secondary: "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    ghost: "border-transparent bg-transparent text-slate-900 hover:bg-slate-100"
  } as const;

  return <button className={cn(base, sizes[size], variants[variant], className)} {...rest} />;
}

