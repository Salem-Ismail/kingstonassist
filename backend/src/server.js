require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { normalizeLang, SUPPORTED_LANGS } = require("./i18n");
const { recommendServices } = require("./recommend");
const { groundedServiceResponse, groundedRecommendationSummary, callOpenAIChat, getOpenAiKey } = require("./llm");
const { loadServices, normalizeServiceForClient, normalizeServicesForLLM } = require("./servicesStore");
const { translateServiceCards } = require("./translate");

const app = express();

app.use(cors());
app.use(express.json({ limit: "200kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Simple dataset endpoint so the frontend can confirm it loaded services.json successfully.
app.get("/api/services", (_req, res) => {
  try {
    const allServices = loadServices();
    res.json({
      services: allServices.map(normalizeServiceForClient)
    });
  } catch (err) {
    console.error("Services load error:", err?.message || err);
    res.status(500).json({ error: "Could not load services" });
  }
});

/**
 * Single endpoint for both:
 * - Recommendations: { language, answers }
 * - Clarification chat: { language, question, serviceIds }
 *
 * IMPORTANT: We only ground the AI on the server-side dataset. The client sends serviceIds, not full objects.
 */
app.post("/api/recommend", async (req, res) => {
  try {
    const language = normalizeLang(req.body?.language);
    const answers = req.body?.answers || {};
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
    const serviceIds = Array.isArray(req.body?.serviceIds) ? req.body.serviceIds : null;
    const allServices = loadServices();

    // Clarification mode: requires question + serviceIds
    if (question && serviceIds && serviceIds.length > 0) {
      const contextServices = allServices.filter((s) => serviceIds.includes(s.id));
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
      const apiKey = getOpenAiKey();

      const clientContext = contextServices.map(normalizeServiceForClient);
      const translatedContext =
        apiKey && language !== "en"
          ? await translateServiceCards({ language, services: clientContext, callOpenAIChat, apiKey, model })
          : clientContext;

      const answer = await groundedServiceResponse({
        language,
        services: normalizeServicesForLLM(translatedContext),
        userQuestion: question
      });
      return res.json({
        mode: "clarification",
        language,
        answer,
        serviceIds: contextServices.map((s) => s.id)
      });
    }

    // Recommendation mode
    const recommended = recommendServices(allServices, answers, 4);
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const apiKey = getOpenAiKey();
    const clientServices = recommended.map(normalizeServiceForClient);
    const translatedServices =
      apiKey && language !== "en"
        ? await translateServiceCards({ language, services: clientServices, callOpenAIChat, apiKey, model })
        : clientServices;

    const summary = await groundedRecommendationSummary({
      language,
      services: normalizeServicesForLLM(translatedServices),
      answers
    });

    return res.json({
      mode: "recommendations",
      language,
      supportedLanguages: SUPPORTED_LANGS,
      answers,
      serviceIds: recommended.map((s) => s.id),
      services: translatedServices,
      summary
    });
  } catch (err) {
    // Do not log user input (privacy). Keep logs minimal.
    console.error("API error:", err?.message || err);
    res.status(500).json({
      error: "Server error",
      // TODO: refine user-facing error messages per language if needed
      message: "Something went wrong. Please try again."
    });
  }
});

const port = Number(process.env.PORT || 5174);
let server = null;
let starting = false;

function startServer(attempt = 0) {
  if (starting) return;
  starting = true;

  server = app.listen(port, () => {
    starting = false;
    console.log(`Backend listening on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    starting = false;
    if (err && err.code === "EADDRINUSE" && attempt < 10) {
      // Node --watch restarts can race on Windows; retry shortly to avoid flaky dev behavior.
      const delayMs = 250 + attempt * 150;
      console.warn(`Port ${port} in use. Retrying in ${delayMs}ms...`);
      setTimeout(() => startServer(attempt + 1), delayMs);
      return;
    }
    console.error("Server listen error:", err);
    process.exitCode = 1;
  });
}

function shutdown(signal) {
  if (!server) return;
  console.log(`Shutting down (${signal})...`);
  server.close(() => process.exit(0));
  // If close hangs, force exit.
  setTimeout(() => process.exit(0), 1500).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
