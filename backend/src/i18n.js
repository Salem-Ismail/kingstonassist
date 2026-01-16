const SUPPORTED_LANGS = ["en", "fr", "so"];

function normalizeLang(lang) {
  if (!lang) return "en";
  const lc = String(lang).toLowerCase();
  if (SUPPORTED_LANGS.includes(lc)) return lc;
  return "en";
}

function uiStrings(lang) {
  const l = normalizeLang(lang);
  const strings = {
    en: {
      outOfScope: "I don’t know. For help beyond these services, please contact 211 Ontario (dial 2-1-1).",
      aiNotConfigured: "AI is not configured on the server. For questions beyond this list, please contact 211 Ontario (dial 2-1-1)."
    },
    fr: {
      outOfScope: "Je ne sais pas. Pour une aide au-delà de ces services, veuillez contacter 211 Ontario (composez le 2-1-1).",
      aiNotConfigured: "L’IA n’est pas configurée sur le serveur. Pour des questions au-delà de cette liste, veuillez contacter 211 Ontario (composez le 2-1-1)."
    },
    so: {
      outOfScope: "Ma hubo. Haddii aad u baahan tahay caawimaad ka baxsan adeegyadan, fadlan la xiriir 211 Ontario (garaac 2-1-1).",
      aiNotConfigured: "AI lama habeeynin server-ka. Su’aalaha ka baxsan liiskan, fadlan la xiriir 211 Ontario (garaac 2-1-1)."
    }
  };
  return strings[l];
}

module.exports = { normalizeLang, uiStrings, SUPPORTED_LANGS };

