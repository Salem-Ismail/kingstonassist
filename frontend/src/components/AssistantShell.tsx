import type { ReactNode } from "react";

export function AssistantShell(props: {
  header: ReactNode;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="shell">
      <header className="shellHeader">{props.header}</header>
      <div className="shellBody">
        <aside className="shellLeft">{props.left}</aside>
        <section className="shellRight">{props.right}</section>
      </div>
    </div>
  );
}

