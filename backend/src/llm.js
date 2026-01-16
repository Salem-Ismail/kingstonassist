const { uiStrings } = require("./i18n");

function getOpenAiKey() {
  const key = String(process.env.OPENAI_API_KEY || "").trim();
  if (!key) return null;
  // Treat template placeholders as "not configured" to avoid hanging demo requests.
  if (key.toLowerCase() === "your_key_here") return null;
  if (key.toLowerCase().includes("replace") && key.toLowerCase().includes("key")) return null;
  return key;
}

async function callOpenAIChat({ apiKey, model, system, messages, temperature = 0.2, maxTokens = 500 }) {
  const controller = new AbortController();
  // Slightly higher default timeout because we sometimes do translation + grounding in demo flows.
  const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS || 20000);
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [{ role: "system", content: system }, ...messages]
      })
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`OpenAI error: ${res.status} ${res.statusText}: ${text}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : "";
}

function isAiConfigured() {
  return Boolean(getOpenAiKey());
}

async function groundedServiceResponse({ language, services, userQuestion }) {
  const strings = uiStrings(language);

  if (!isAiConfigured()) {
    return strings.aiNotConfigured;
  }

  const apiKey = getOpenAiKey();
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const system = [
    "You are a municipal service navigation assistant for the City of Kingston.",
    "This is NOT a general-purpose chatbot.",
    "You may ONLY reference the provided services. Do not invent services, addresses, phone numbers, eligibility rules, or policies.",
    "If the user asks something outside the scope of the provided services, say you don’t know and recommend contacting 211 Ontario.",
    "Respond in plain language and in the selected language.",
    "Keep responses brief, practical, and focused on next steps.",
    "",
    "Provided services (ground truth; you must stay within this data):",
    JSON.stringify(services, null, 2)
  ].join("\n");

  try {
    return await callOpenAIChat({
      apiKey,
      model,
      system,
      messages: [
        {
          role: "user",
          content: [
            `Selected language: ${language}`,
            "",
            "User question (must be answered using ONLY the provided services):",
            userQuestion
          ].join("\n")
        }
      ],
      temperature: 0.2,
      maxTokens: 500
    });
  } catch (_err) {
    // Safe fallback: keep the product responsive even if the AI call fails/times out.
    // TODO: add structured error logging without user text.
    return strings.aiNotConfigured;
  }
}

async function groundedRecommendationSummary({ language, services, answers }) {
  const strings = uiStrings(language);

  if (!isAiConfigured()) {
    return strings.aiNotConfigured;
  }

  const apiKey = getOpenAiKey();
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const system = [
    "You are a municipal service navigation assistant for the City of Kingston.",
    "This is NOT a general-purpose chatbot.",
    "You may ONLY reference the provided services. Do not invent services, addresses, phone numbers, eligibility rules, or policies.",
    "If asked about something outside the scope of the provided services, say you don’t know and recommend contacting 211 Ontario.",
    "Respond in plain language and in the selected language.",
    "Goal: explain (briefly) why each recommended service is relevant based on the user’s guided answers.",
    "",
    "Provided services (ground truth; you must stay within this data):",
    JSON.stringify(services, null, 2)
  ].join("\n");

  try {
    return await callOpenAIChat({
      apiKey,
      model,
      system,
      messages: [
        {
          role: "user",
          content: [
            `Selected language: ${language}`,
            "",
            "Guided answers:",
            JSON.stringify(answers, null, 2),
            "",
            "Please produce:",
            "- A short 2–4 sentence overall summary of the recommendations",
            "- Then a bullet list where each bullet starts with the exact service name and a one-sentence reason"
          ].join("\n")
        }
      ],
      temperature: 0.2,
      maxTokens: 650
    });
  } catch (_err) {
    // Safe fallback: keep the product responsive even if the AI call fails/times out.
    // TODO: add structured error logging without user text.
    return strings.aiNotConfigured;
  }
}

module.exports = {
  groundedServiceResponse,
  groundedRecommendationSummary,
  isAiConfigured,
  // Exported for safe, constrained translation of service card fields.
  callOpenAIChat,
  getOpenAiKey
};

