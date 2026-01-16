function scoreService(service, answers) {
  const need = String(answers?.need || "").toLowerCase();
  const urgency = String(answers?.urgency || "").toLowerCase();
  const mode = String(answers?.mode || "").toLowerCase();
  const household = String(answers?.household || "").toLowerCase();

  const tags = (service.tags || []).map((t) => String(t).toLowerCase());
  const cat = String(service.category || "").toLowerCase();
  const summary = service.summary || "";
  const details = service.details || "";
  const whoFor = service.whoFor || "";
  const hay = `${service.name} ${service.description || ""} ${service.whyHelpful || ""} ${summary} ${details} ${whoFor} ${cat} ${tags.join(" ")}`.toLowerCase();

  let score = 0;
  if (need && hay.includes(need)) score += 3;
  if (need === "housing" && (cat.includes("housing") || tags.includes("housing"))) score += 4;
  if (need === "employment" && (cat.includes("employment") || tags.includes("employment"))) score += 4;
  if (need === "health" && (cat.includes("health") || tags.includes("health"))) score += 4;
  if (need === "legal" && (cat.includes("legal") || tags.includes("legal"))) score += 4;
  if (need === "immigration" && (cat.includes("immigration") || tags.includes("immigration"))) score += 4;
  if (need === "settlement" && (cat.includes("settlement") || tags.includes("settlement"))) score += 4;
  if (need === "community" && (cat.includes("community") || tags.includes("community"))) score += 3;

  // Always keep 211 discoverable as a safe fallback.
  if (service.id === "211-ontario") score += 2;

  // Slight preference if urgent and service is referral/phone/online oriented.
  if (urgency === "today" || urgency === "this-week") {
    if (service.id === "211-ontario") score += 2;
    if (tags.includes("referrals") || tags.includes("official-info")) score += 1;
  }

  // Mode: lightweight heuristic
  const contactStr =
    typeof service.contact === "string"
      ? service.contact
      : typeof service.contact === "object" && service.contact
        ? `${service.contact.phone || ""} ${service.contact.website || ""}`
        : String(service.contact || "");
  if (mode === "phone" && String(contactStr).toLowerCase().includes("phone")) score += 1;
  if (mode === "online" && String(contactStr).toLowerCase().includes("http")) score += 1;
  if (mode === "in-person" && String(service.location || "").toLowerCase().includes("kingston")) score += 1;

  // Household: if family, community/settlement/library can be helpful
  if (household === "family" && (tags.includes("community") || tags.includes("settlement") || service.id === "libraries")) score += 1;

  return score;
}

function recommendServices(allServices, answers, limit = 4) {
  const scored = allServices
    .map((s) => ({ s, score: scoreService(s, answers) }))
    .sort((a, b) => b.score - a.score);

  // Ensure we always have at least 211 in the set for safety.
  const top = scored.slice(0, Math.max(limit, 3)).map((x) => x.s);
  const has211 = top.some((s) => s.id === "211-ontario");
  if (!has211) {
    const svc211 = allServices.find((s) => s.id === "211-ontario");
    if (svc211) top[top.length - 1] = svc211;
  }
  return top.slice(0, limit);
}

module.exports = { recommendServices };

