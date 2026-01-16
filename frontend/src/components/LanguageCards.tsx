import type { Language } from "../types";
import { Card } from "../ui/Card";
import { cn } from "../ui/cn";

const LANGS: Array<{ id: Language; label: string; native: string }> = [
  { id: "en", label: "Mandarin", native: "Mandarin" },
  { id: "so", label: "Somali", native: "Soomaali" },
  { id: "fr", label: "Arabic", native: "Arabic" }
];

export function LanguageCards(props: {
  value: Language;
  onChange: (lang: Language) => void;
  title: string;
  compact?: boolean;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-900">{props.title}</div>
      <div className={props.compact ? "mt-3 grid gap-2" : "mt-3 grid gap-3 md:grid-cols-3"}>
        {LANGS.map((l) => {
          const active = props.value === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => props.onChange(l.id)}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-2xl"
            >
              <Card
                className={cn(
                  props.compact ? "p-3" : "p-4",
                  active ? "border-accent-600 ring-1 ring-accent-600" : "border-slate-200"
                )}
              >
                <div className={props.compact ? "text-sm font-semibold text-slate-900" : "text-base font-semibold text-slate-900"}>
                  {l.label}
                </div>
                <div className={props.compact ? "mt-0.5 text-xs text-slate-600" : "mt-1 text-sm text-slate-600"}>
                  {l.native}
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}

