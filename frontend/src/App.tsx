import { useMemo, useState } from "react";
import type { Language } from "./types";
import { STRINGS } from "./i18n";
import { LandingPage } from "./pages/LandingPage";
import { AssistantPage } from "./pages/AssistantPage";

type Page = "landing" | "assistant";

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [language, setLanguage] = useState<Language>("en");
  const t = useMemo(() => STRINGS[language], [language]);

  if (page === "landing") {
    return (
      <LandingPage
        language={language}
        t={t}
        onStart={() => {
          setPage("assistant");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return <AssistantPage language={language} onChangeLanguage={setLanguage} />;
}

