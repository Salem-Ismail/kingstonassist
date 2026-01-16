import type { Language } from "../types";

export function LandingPage(props: {
  language: Language;
  t: Record<string, string>;
  onStart: () => void;
}) {
  const { t } = props;

  return (
    <div className="landing">
      <div className="landingHero">
        <div className="badge">{t.landingBadge}</div>
        <h1 className="landingTitle">{t.title}</h1>
        <p className="landingSubtitle">{t.landingSubtitle}</p>

        <div className="landingCtas">
          <button className="button primary large" onClick={props.onStart}>
            {t.landingStart}
          </button>
          <div className="landingHint muted">{t.landingHint}</div>
        </div>
      </div>

      <div className="landingGrid">
        <div className="landingCard">
          <div className="landingCardTitle">{t.landingCard1Title}</div>
          <div className="muted">{t.landingCard1Body}</div>
        </div>
        <div className="landingCard">
          <div className="landingCardTitle">{t.landingCard2Title}</div>
          <div className="muted">{t.landingCard2Body}</div>
        </div>
        <div className="landingCard">
          <div className="landingCardTitle">{t.landingCard3Title}</div>
          <div className="muted">{t.landingCard3Body}</div>
        </div>
      </div>

      <div className="landingFooter">
        <div className="banner">
          <strong>{t.disclaimerLabel}:</strong> {t.disclaimer}
        </div>
      </div>
    </div>
  );
}

