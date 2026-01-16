import type { Language } from "../types";

export function LanguageSelector(props: {
  value: Language;
  onChange: (lang: Language) => void;
  label: string;
}) {
  return (
    <label className="field">
      <span className="label">{props.label}</span>
      <select
        className="select"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value as Language)}
      >
        <option value="en">English</option>
        <option value="so">Somali</option>
        <option value="fr">French</option>
      </select>
    </label>
  );
}

