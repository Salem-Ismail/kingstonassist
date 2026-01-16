import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { IconCheckCircle, IconGlobe, IconShield } from "../ui/Icons";
import type { Language } from "../types";

export function LandingPage(props: {
  language: Language;
  t: Record<string, string>;
  onStart: () => void;
}) {
  const { t } = props;

  function onHowItWorks() {
    const el = document.getElementById("how-it-works");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <Section className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-accent-100 text-accent-800 flex items-center justify-center">
              <span className="text-sm font-bold">K</span>
            </div>
            <div className="text-base font-semibold">{t.title}</div>
          </div>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" onClick={onHowItWorks}>
              {t.landingSecondaryCta}
            </Button>
            <Button variant="primary" onClick={props.onStart}>
              {t.landingNavStart}
            </Button>
          </nav>
        </Section>
      </header>

      <main>
        <Section className="py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                <span className="inline-block h-2 w-2 rounded-full bg-accent-600" />
                {t.landingBadge}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t.landingHeadline}
              </h1>
              <p className="mt-4 max-w-prose text-lg text-slate-700">{t.landingSubtext}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button variant="primary" size="lg" onClick={props.onStart}>
                  {t.landingPrimaryCta}
                </Button>
                <Button variant="secondary" size="lg" onClick={onHowItWorks}>
                  {t.landingSecondaryCta}
                </Button>
              </div>

              <div className="mt-6 text-sm text-slate-600">{t.privacy}</div>
            </div>

            <Card className="p-6">
              <div className="text-sm font-semibold text-slate-900">{t.howItWorksTitle}</div>
              <ol className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-0.5 h-6 w-6 flex-none rounded-full bg-accent-50 text-accent-800 flex items-center justify-center text-xs font-semibold">
                    1
                  </span>
                  <span>{t.howItWorksStep1}</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-6 w-6 flex-none rounded-full bg-accent-50 text-accent-800 flex items-center justify-center text-xs font-semibold">
                    2
                  </span>
                  <span>{t.howItWorksStep2}</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-6 w-6 flex-none rounded-full bg-accent-50 text-accent-800 flex items-center justify-center text-xs font-semibold">
                    3
                  </span>
                  <span>{t.howItWorksStep3}</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-6 w-6 flex-none rounded-full bg-accent-50 text-accent-800 flex items-center justify-center text-xs font-semibold">
                    4
                  </span>
                  <span>{t.howItWorksStep4}</span>
                </li>
              </ol>
            </Card>
          </div>
        </Section>

        <Section className="pb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-accent-50 p-2 text-accent-800">
                  <IconGlobe className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">{t.landingCard1Title}</div>
                  <div className="mt-1 text-sm text-slate-700">{t.landingCard1Body}</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-accent-50 p-2 text-accent-800">
                  <IconCheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">{t.landingCard2Title}</div>
                  <div className="mt-1 text-sm text-slate-700">{t.landingCard2Body}</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-accent-50 p-2 text-accent-800">
                  <IconShield className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">{t.landingCard3Title}</div>
                  <div className="mt-1 text-sm text-slate-700">{t.landingCard3Body}</div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Section className="py-6" id="how-it-works">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-800">
            <span className="font-semibold text-slate-900">{t.landingA11yBanner}</span>
          </div>
        </Section>

        <Section className="pb-12">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-800">
            <span className="font-semibold text-slate-900">{t.disclaimerLabel}:</span> {t.disclaimer}
          </div>
        </Section>
      </main>
    </div>
  );
}

