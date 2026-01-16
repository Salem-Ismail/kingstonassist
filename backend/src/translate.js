const { isAiConfigured } = require("./llm");

// Simple in-memory cache for demo performance.
// Keyed by `${language}|${jsonInput}`.
const cache = new Map();

function languageName(lang) {
  if (lang === "fr") return "French";
  if (lang === "so") return "Somali";
  return "English";
}

function extractJsonArray(text) {
  if (typeof text !== "string") return null;

  // Strip common markdown fences if present.
  const unfenced = text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  // Try direct parse first.
  try {
    const parsed = JSON.parse(unfenced);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    // Fall through to substring extraction.
  }

  const start = unfenced.indexOf("[");
  const end = unfenced.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;

  const slice = unfenced.slice(start, end + 1);
  try {
    const parsed = JSON.parse(slice);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function translateServiceCards({ language, services, callOpenAIChat, apiKey, model }) {
  if (!language || language === "en") return services;
  if (!isAiConfigured()) return services;

  const input = services.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.description,
    whyHelpful: s.whyHelpful,
    location: s.location,
    // Must remain unchanged:
    contact: s.contact,
    source: s.source
  }));

  const jsonInput = JSON.stringify(input);
  const cacheKey = `${language}|${jsonInput}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const target = languageName(language);

  const system = [
    "You translate municipal service card text for a City of Kingston service assistant.",
    "Translate ONLY the following fields: name, category, description, whyHelpful, location.",
    "Do NOT change: id, contact, source. Keep any phone numbers and URLs EXACTLY unchanged.",
    "Do not add, remove, reorder, or merge services.",
    "Do not invent new details. Preserve meaning.",
    "If an organization name is a proper noun, you may keep it in English.",
    `Output ONLY valid JSON (an array of objects), in ${target}.`
  ].join("\n");

  let content = "";
  try {
    content = await callOpenAIChat({
      apiKey,
      model,
      system,
      messages: [
        {
          role: "user",
          content: [
            `Target language: ${target}`,
            "",
            "Input JSON array:",
            jsonInput,
            "",
            "Return ONLY JSON."
          ].join("\n")
        }
      ],
      temperature: 0,
      maxTokens: 1800
    });
  } catch {
    // If translation fails/times out, fall back to the original (English) services
    // rather than breaking the recommendations endpoint.
    return services;
  }

  try {
    const parsed = extractJsonArray(content);
    if (!Array.isArray(parsed)) throw new Error("Not an array");

    // Merge back contact/source/id safety and preserve ordering.
    const byId = new Map(input.map((s) => [s.id, s]));
    const out = input.map((orig) => {
      const t = parsed.find((p) => p && p.id === orig.id) || {};
      return {
        ...orig,
        name: typeof t.name === "string" ? t.name : orig.name,
        category: typeof t.category === "string" ? t.category : orig.category,
        description: typeof t.description === "string" ? t.description : orig.description,
        whyHelpful: typeof t.whyHelpful === "string" ? t.whyHelpful : orig.whyHelpful,
        location: typeof t.location === "string" ? t.location : orig.location,
        contact: byId.get(orig.id).contact,
        source: byId.get(orig.id).source
      };
    });

    cache.set(cacheKey, out);
    return out;
  } catch {
    // If parsing fails, fall back to English (do not break the UI).
    return services;
  }
}

module.exports = { translateServiceCards };

