import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function Card(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-soft",
        "transition-shadow hover:shadow-md",
        className
      )}
      {...rest}
    />
  );
}

