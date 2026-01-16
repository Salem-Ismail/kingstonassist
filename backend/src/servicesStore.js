const fs = require("node:fs");
const path = require("node:path");

const SERVICES_PATH = path.join(__dirname, "services.json");

function loadServices() {
  // Hackathon-friendly: load from disk each request so edits to services.json apply immediately.
  // TODO: For production, cache with a file watcher and validate schema.
  const raw = fs.readFileSync(SERVICES_PATH, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function formatContact(contact) {
  if (!contact) return "";
  if (typeof contact === "string") return contact;
  if (typeof contact === "object") {
    const phone = contact.phone ? `Phone: ${contact.phone}` : "";
    const website = contact.website ? `Website: ${contact.website}` : "";
    return [phone, website].filter(Boolean).join(" | ");
  }
  return String(contact);
}

function normalizeServiceForClient(svc) {
  // Support both schemas:
  // - Original MVP schema: description/whyHelpful/contact(string)/location
  // - City schema: summary/details/contact(object)/whoFor/source
  const description = svc.description ?? svc.summary ?? "";
  const whyHelpful = svc.whyHelpful ?? svc.details ?? "";
  const location = svc.location ?? "Kingston";
  const contact = formatContact(svc.contact);
  const source =
    svc.source ??
    (svc.id === "211-ontario"
      ? "211 Ontario"
      : // Many entries are City or City/community partners in this MVP dataset.
        "City of Kingston / Partner");

  return {
    id: svc.id,
    name: svc.name,
    category: svc.category ?? "Service",
    description,
    whyHelpful,
    contact,
    location,
    source
  };
}

function normalizeServicesForLLM(svcs) {
  // Keep only safe, relevant fields to reduce prompt size and avoid accidental invention.
  return svcs.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category ?? "Service",
    description: s.description ?? s.summary ?? "",
    whyHelpful: s.whyHelpful ?? s.details ?? "",
    contact: formatContact(s.contact),
    location: s.location ?? "Kingston",
    whoFor: s.whoFor ?? "",
    source:
      s.source ??
      (s.id === "211-ontario"
        ? "211 Ontario"
        : // Keep consistent with client fallback to avoid confusion.
          "City of Kingston / Partner")
  }));
}

module.exports = { loadServices, normalizeServiceForClient, normalizeServicesForLLM };

