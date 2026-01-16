import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function Section(props: HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;
  return <section className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...rest} />;
}

