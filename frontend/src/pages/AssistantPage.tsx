import { useEffect, useMemo, useState } from "react";
import type { Answers, Language, RecommendResponse, Service } from "../types";
import { STRINGS } from "../i18n";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { LanguageCards } from "../components/LanguageCards";
import { StepProgress } from "../components/StepProgress";
import { ClarificationChat } from "../components/ClarificationChat";

const EMPTY_ANSWERS: Answers = { need: "", urgency: "", mode: "", household: "" };

type Step = "language" | "q1" | "q2" | "q3" | "q4" | "results";

function stepIndex(step: Step) {
  const order: Step[] = ["language", "q1", "q2", "q3", "q4", "results"];
  return order.indexOf(step);
}

function parseContact(contact: string) {
  const urlMatch = contact.match(/https?:\/\/\S+/);
  const url = urlMatch ? urlMatch[0] : null;
  const phoneMatch = contact.match(/(\+?\d[\d\s().-]{6,}\d)/);
  const phone = phoneMatch ? phoneMatch[1] : null;
  return { url, phone };
}

export function AssistantPage(props: { language: Language; onChangeLanguage: (l: Language) => void }) {
  const t = useMemo(() => STRINGS[props.language], [props.language]);

  const [step, setStep] = useState<Step>("language");
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [servicesCatalog, setServicesCatalog] = useState<Service[] | null>(null);
  const [catalogError, setCatalogError] = useState("");

  const [summary, setSummary] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [serviceIds, setServiceIds] = useState<string[]>([]);

  const hasResults = services.length > 0;

  useEffect(() => {
    let cancelled = false;
    async function loadCatalog() {
      setCatalogError("");
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        const list = Array.isArray(data?.services) ? (data.services as Service[]) : [];
        if (!cancelled) setServicesCatalog(list);
      } catch {
        if (!cancelled) setCatalogError(t.errorLoadResults);
      }
    }
    loadCatalog();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchResults() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: props.language, answers })
      });
      if (!res.ok) throw new Error("Request failed");
      const data: RecommendResponse = await res.json();
      if (data.mode !== "recommendations") throw new Error("Unexpected response");
      setSummary(data.summary || "");
      setServices(data.services || []);
      setServiceIds(data.serviceIds || []);
      setStep("results");
    } catch {
      setError(t.errorLoadResults);
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setStep("language");
    setAnswers(EMPTY_ANSWERS);
    setSummary("");
    setServices([]);
    setServiceIds([]);
    setLoading(false);
    setError("");
  }

  const totalDots = 6;
  const dot = Math.max(0, stepIndex(step));

  function QuestionCard(propsQ: {
    title: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onPick: (v: string) => void;
    onBack?: () => void;
    onNext?: () => void;
    nextDisabled?: boolean;
  }) {
    return (
      <Card className="p-5">
        <StepProgress current={dot} total={totalDots} label={`${t.step} ${dot + 1} / ${totalDots}`} />
        <div className="mt-4 text-lg font-semibold text-slate-900">{propsQ.title}</div>
        <div className="mt-4 grid gap-2">
          {propsQ.options.map((o) => {
            const active = propsQ.value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => propsQ.onPick(o.value)}
                className={[
                  "w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  active ? "border-accent-600 bg-accent-50" : "border-slate-200 bg-white hover:bg-slate-50"
                ].join(" ")}
              >
                {o.label}
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <Button variant="ghost" onClick={propsQ.onBack}>
            {t.back}
          </Button>
          <Button variant="primary" onClick={propsQ.onNext} disabled={propsQ.nextDisabled}>
            {t.next}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <Section className="flex h-16 items-center justify-between">
          <div>
            <div className="text-base font-semibold">{t.title}</div>
            <div className="text-sm text-slate-600">{t.subtitle}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={resetAll}>
              {t.reset}
            </Button>
          </div>
        </Section>
      </header>

      <main>
        <Section className="py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <aside
              className={[
                "w-full lg:sticky lg:top-6 lg:h-[calc(100vh-120px)] lg:overflow-auto",
                "transition-all duration-200",
                hasResults ? "lg:w-64" : "lg:w-[420px]"
              ].join(" ")}
            >
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-800">
                <span className="font-semibold text-slate-900">{t.disclaimerLabel}:</span> {t.disclaimer}
              </div>

              <div className="mt-4 space-y-4">
                <LanguageCards
                  value={props.language}
                  onChange={props.onChangeLanguage}
                  title={t.chooseLanguage}
                  compact={hasResults}
                />

                {step === "language" ? (
                  <Card className="p-5">
                    <div className="text-sm text-slate-700">{t.assistantIntroLocked}</div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="primary" onClick={() => setStep("q1")}>
                        {t.next}
                      </Button>
                    </div>
                  </Card>
                ) : null}

                {step === "q1" ? (
                  <QuestionCard
                    title={t.q1}
                    value={answers.need}
                    onPick={(v) => setAnswers((a) => ({ ...a, need: v as Answers["need"] }))}
                    options={[
                      { value: "housing", label: t.need_housing },
                      { value: "employment", label: t.need_employment },
                      { value: "health", label: t.need_health },
                      { value: "legal", label: t.need_legal },
                      { value: "immigration", label: t.need_immigration },
                      { value: "settlement", label: t.need_settlement },
                      { value: "community", label: t.need_community }
                    ]}
                    onBack={() => setStep("language")}
                    onNext={() => setStep("q2")}
                    nextDisabled={!answers.need}
                  />
                ) : null}

                {step === "q2" ? (
                  <QuestionCard
                    title={t.q2}
                    value={answers.urgency}
                    onPick={(v) => setAnswers((a) => ({ ...a, urgency: v as Answers["urgency"] }))}
                    options={[
                      { value: "today", label: t.urgency_today },
                      { value: "this-week", label: t.urgency_this_week },
                      { value: "this-month", label: t.urgency_this_month },
                      { value: "exploring", label: t.urgency_exploring }
                    ]}
                    onBack={() => setStep("q1")}
                    onNext={() => setStep("q3")}
                    nextDisabled={!answers.urgency}
                  />
                ) : null}

                {step === "q3" ? (
                  <QuestionCard
                    title={t.q3}
                    value={answers.mode}
                    onPick={(v) => setAnswers((a) => ({ ...a, mode: v as Answers["mode"] }))}
                    options={[
                      { value: "phone", label: t.mode_phone },
                      { value: "online", label: t.mode_online },
                      { value: "in-person", label: t.mode_in_person }
                    ]}
                    onBack={() => setStep("q2")}
                    onNext={() => setStep("q4")}
                    nextDisabled={!answers.mode}
                  />
                ) : null}

                {step === "q4" ? (
                  <QuestionCard
                    title={t.q4}
                    value={answers.household}
                    onPick={(v) => setAnswers((a) => ({ ...a, household: v as Answers["household"] }))}
                    options={[
                      { value: "single", label: t.household_single },
                      { value: "family", label: t.household_family },
                      { value: "unsure", label: t.household_unsure }
                    ]}
                    onBack={() => setStep("q3")}
                    onNext={fetchResults}
                    nextDisabled={!answers.household || loading}
                  />
                ) : null}
              </div>

              <div className="mt-6 text-sm text-slate-600">{t.privacy}</div>
            </aside>

            <div className="min-w-0 flex-1 space-y-4">
              <Card className="p-5">
                <div className="text-sm font-semibold text-slate-900">Assistant</div>
                <div className="mt-2 text-sm text-slate-700">
                  {hasResults ? t.assistantIntroReady : t.assistantIntroLocked}
                </div>
                <div className="mt-3 text-xs text-slate-600">
                  {catalogError ? (
                    <span className="text-red-700">{catalogError}</span>
                  ) : servicesCatalog ? (
                    <span>
                      {t.servicesLoaded}: {servicesCatalog.length}
                    </span>
                  ) : (
                    <span>{t.servicesLoading}</span>
                  )}
                </div>
              </Card>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                  {error}
                </div>
              ) : null}

              {step === "results" && hasResults ? (
                <>
                  <Card className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-slate-900">{t.resultsTitle}</div>
                        {summary ? <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{summary}</div> : null}
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-3">
                    {services.map((s) => {
                      const c = parseContact(s.contact || "");
                      return (
                        <Card key={s.id} className="p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-base font-semibold text-slate-900">{s.name}</div>
                              <div className="mt-1 flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                  {s.category}
                                </span>
                                {s.source ? (
                                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                                    {t.resultsSource}: {s.source}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 text-sm text-slate-700">{s.description}</div>

                          <div className="mt-4">
                            <div className="text-xs font-semibold text-slate-600">{t.resultsWhyHelpful}</div>
                            <div className="mt-1 text-sm text-slate-800">{s.whyHelpful}</div>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div>
                              <div className="text-xs font-semibold text-slate-600">{t.resultsContact}</div>
                              <div className="mt-1 text-sm text-slate-800">
                                {c.url ? (
                                  <a
                                    className="text-accent-700 underline underline-offset-4 hover:text-accent-800"
                                    href={c.url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {c.url}
                                  </a>
                                ) : (
                                  <span>{s.contact}</span>
                                )}
                                {c.phone ? (
                                  <div className="mt-1">
                                    <a
                                      className="text-accent-700 underline underline-offset-4 hover:text-accent-800"
                                      href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}
                                    >
                                      {c.phone}
                                    </a>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-600">{t.resultsLocation}</div>
                              <div className="mt-1 text-sm text-slate-800">{s.location}</div>
                            </div>
                          </div>

                          {/* TODO: add "Listen" affordance for future voice output */}
                        </Card>
                      );
                    })}
                  </div>

                  <Card className="p-5">
                    <div className="text-sm font-semibold text-slate-900">{t.chatTitle}</div>
                    {t.stepChatTitle ? (
                      <div className="mt-2 text-sm text-slate-700">
                        {/* Chat should feel secondary */}
                        {t.stepChatTitle}
                      </div>
                    ) : null}
                    <div className="mt-4">
                      <ClarificationChat
                        visible={hasResults}
                        language={props.language}
                        serviceIds={serviceIds}
                        title={t.chatTitle}
                        placeholder={t.chatPlaceholder}
                        sendLabel={t.send}
                      />
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="p-5">
                  <div className="text-sm text-slate-700">{loading ? t.loading : t.stepQuestionsTitle}</div>
                </Card>
              )}
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}

