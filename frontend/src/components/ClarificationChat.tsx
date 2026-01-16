import { useState } from "react";
import type { Language } from "../types";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function ClarificationChat(props: {
  visible: boolean;
  language: Language;
  serviceIds: string[];
  title: string;
  placeholder: string;
  sendLabel: string;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const text = input.trim();

  // Basic validation: don't send empty, and discourage unrelated prompts.
  // TODO: Improve with service-name matching once we pass service names into this component.
  // NOTE: Keep this light. The backend still strictly enforces scope.
  const looksRelated = (() => {
    if (text.length < 3) return false;
    const en =
      /(service|contact|phone|website|location|where|hours|eligib|cost|price|apply|start|first|which|help)/i;
    const fr =
      /(service|contact|t[ée]l[ée]phone|site|web|adresse|lieu|o[uù]|heures|admiss|co[uû]t|prix|demande|commencer|premier|lequel|aide)/i;
    const so =
      /(adeeg|xiriir|telefoon|goob|halkee|saacado|u-qalm|kharash|qiimo|codsi|bilow|marka hore|kee|caawin)/i;
    if (props.language === "fr") return fr.test(text);
    if (props.language === "so") return so.test(text);
    return en.test(text);
  })();

  const canSend = props.visible && props.serviceIds.length > 0 && looksRelated && !loading;

  async function onSend() {
    if (!canSend) return;
    const question = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: props.language,
          question,
          serviceIds: props.serviceIds
        })
      });
      const data = await res.json();
      const answer = typeof data?.answer === "string" ? data.answer : "Sorry — I couldn’t answer that.";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry — something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!props.visible) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={[
                "max-w-[80%] rounded-2xl border px-4 py-3 text-sm whitespace-pre-wrap",
                m.role === "user" ? "border-accent-200 bg-accent-50" : "border-slate-200 bg-white"
              ].join(" ")}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          value={input}
          placeholder={props.placeholder}
          onChange={(e) => setInput(e.target.value)}
          disabled={!props.visible || loading}
          aria-label={props.title}
        />
        <button
          className="h-10 rounded-xl border border-accent-600 bg-accent-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-700 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          onClick={onSend}
          disabled={!canSend}
          type="button"
        >
          {loading ? "…" : props.sendLabel}
        </button>
      </div>

      {!looksRelated && text.length > 0 ? (
        <div className="text-xs text-slate-600">
          {/* TODO: localize this helper text */}
          Please ask about contacting, choosing, or understanding the services shown above.
        </div>
      ) : null}

      {/* TODO: add “quick question” chips (e.g., “Who do I call first?”) for faster demos */}
    </div>
  );
}

