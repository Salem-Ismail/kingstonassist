export function StepProgress(props: { current: number; total: number; label: string }) {
  const dots = Array.from({ length: props.total }, (_, i) => i);
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm font-semibold text-slate-900">{props.label}</div>
      <div className="flex items-center gap-2" aria-label={props.label}>
        {dots.map((i) => (
          <span
            key={i}
            className={[
              "h-2.5 w-2.5 rounded-full",
              i < props.current ? "bg-accent-600" : i === props.current ? "bg-accent-300" : "bg-slate-200"
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

