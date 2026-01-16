import type { Answers } from "../types";

export function GuidedQuestionFlow(props: {
  answers: Answers;
  onChange: (next: Answers) => void;
  onSubmit: () => void;
  submitLabel: string;
  disabled?: boolean;
  t: Record<string, string>;
}) {
  const a = props.answers;
  const t = props.t;

  return (
    <div className="card">
      <div className="grid">
        <label className="field">
          <span className="label">{t.q1}</span>
          <select
            className="select"
            value={a.need}
            onChange={(e) => props.onChange({ ...a, need: e.target.value as Answers["need"] })}
          >
            <option value="">{t.select}</option>
            <option value="housing">{t.need_housing}</option>
            <option value="employment">{t.need_employment}</option>
            <option value="health">{t.need_health}</option>
            <option value="legal">{t.need_legal}</option>
            <option value="immigration">{t.need_immigration}</option>
            <option value="settlement">{t.need_settlement}</option>
            <option value="community">{t.need_community}</option>
          </select>
        </label>

        <label className="field">
          <span className="label">{t.q2}</span>
          <select
            className="select"
            value={a.urgency}
            onChange={(e) => props.onChange({ ...a, urgency: e.target.value as Answers["urgency"] })}
          >
            <option value="">{t.select}</option>
            <option value="today">{t.urgency_today}</option>
            <option value="this-week">{t.urgency_this_week}</option>
            <option value="this-month">{t.urgency_this_month}</option>
            <option value="exploring">{t.urgency_exploring}</option>
          </select>
        </label>

        <label className="field">
          <span className="label">{t.q3}</span>
          <select
            className="select"
            value={a.mode}
            onChange={(e) => props.onChange({ ...a, mode: e.target.value as Answers["mode"] })}
          >
            <option value="">{t.select}</option>
            <option value="phone">{t.mode_phone}</option>
            <option value="online">{t.mode_online}</option>
            <option value="in-person">{t.mode_in_person}</option>
          </select>
        </label>

        <label className="field">
          <span className="label">{t.q4}</span>
          <select
            className="select"
            value={a.household}
            onChange={(e) => props.onChange({ ...a, household: e.target.value as Answers["household"] })}
          >
            <option value="">{t.select}</option>
            <option value="single">{t.household_single}</option>
            <option value="family">{t.household_family}</option>
            <option value="unsure">{t.household_unsure}</option>
          </select>
        </label>
      </div>

      <div className="row">
        <button
          className="button primary"
          onClick={props.onSubmit}
          disabled={props.disabled || !a.need || !a.urgency || !a.mode || !a.household}
        >
          {props.submitLabel}
        </button>
      </div>

      {/* TODO: refine question wording with municipal partners; keep dropdowns short for hackathon demos */}
    </div>
  );
}

