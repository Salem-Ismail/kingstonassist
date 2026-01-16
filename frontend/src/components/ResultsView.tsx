import type { Service } from "../types";

export function ResultsView(props: {
  summary: string;
  services: Service[];
  title: string;
  onReset: () => void;
  resetLabel: string;
  labels: {
    whyHelpful: string;
    contact: string;
    location: string;
  };
}) {
  return (
    <div className="stack">
      <div className="row space-between">
        <h2 className="h2">{props.title}</h2>
        <button className="button" onClick={props.onReset}>
          {props.resetLabel}
        </button>
      </div>

      {props.summary ? (
        <div className="card">
          <div className="muted" style={{ whiteSpace: "pre-wrap" }}>
            {props.summary}
          </div>
        </div>
      ) : null}

      <div className="stack">
        {props.services.map((s) => (
          <div key={s.id} className="card">
            <div className="row space-between">
              <div>
                <div className="h3">{s.name}</div>
                <div className="pill">{s.category}</div>
              </div>
            </div>

            <div className="section">
              <div className="muted">{s.description}</div>
            </div>

            <div className="section">
              <div className="label">{props.labels.whyHelpful}</div>
              <div>{s.whyHelpful}</div>
            </div>

            <div className="grid2">
              <div>
                <div className="label">{props.labels.contact}</div>
                <div className="mono">{s.contact}</div>
              </div>
              <div>
                <div className="label">{props.labels.location}</div>
                <div className="mono">{s.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

