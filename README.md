# Kingston Assist (Hackathon MVP)

Guided municipal service assistant for **City of Kingston** + **211 Ontario**.

This is **not a general chatbot**: users complete a short guided flow first, then (optionally) ask a follow‑up question **only about the displayed services**.

## Quick start

### 1) Install

```bash
npm run install:all
```

### 2) Configure AI (required for multilingual service text)

Use the provided template:

- Copy `backend/env.template` to `backend/.env`
- Set `OPENAI_API_KEY` (required for AI summaries + service-card translation)
- Optional: `OPENAI_MODEL` and `OPENAI_TIMEOUT_MS` (default 20000ms)

If you do not configure an API key, the app still runs, but AI text falls back to a safe message and service cards will remain in English.

### 3) Run (dev)

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5174`

Note: `npm run dev` auto-kills stale listeners on 5173/5174 to avoid Windows port collisions.

## What’s included

- **Frontend (React SPA)**: `frontend/`
  - Tailwind UI (inline classes)
  - Landing page + step-based assistant flow
  - Language picker cards (currently labeled **Mandarin / Somali / Arabic** — labels only)
  - Results list + limited clarification chat (hidden until results are shown)
  - Visible disclaimer: “This tool provides information and referrals only. For emergencies, call 911.”

- **Backend (Node + Express)**: `backend/`
  - Dataset: `backend/src/services.json`
  - Endpoints:
    - `GET /api/services` → returns all services (normalized)
    - `POST /api/recommend`
    - Recommendation mode: `{ language, answers }`
    - Clarification mode: `{ language, question, serviceIds }`
  - **AI safety constraints enforced in the system prompt**:
    - municipal service navigation assistant for City of Kingston
    - **ONLY** reference provided services
    - out-of-scope → “don’t know” + suggest 211 Ontario
    - respond in selected language
    - not a general-purpose chatbot

## Editing the service list

Update `backend/src/services.json`, then refresh the app.

## Notes / TODOs (for after demo)

- TODO: Replace placeholder service entries with official City / partner program details and verified contact/location info.
- TODO: Add accessibility pass (ARIA labels, keyboard UX) and content review with settlement partners.
- TODO: Consider adding “quick question” chips in chat for faster demos.

## Impact

- **Faster service discovery**: helps residents (especially newcomers) quickly find relevant municipal/211 services without needing to know program names.
- **Safer AI in civic context**: AI outputs are **grounded in the provided service list** with clear refusal + referral to **211 Ontario** for out-of-scope questions.
- **More accessible entry point**: multilingual UI + guided flow reduces complexity and cognitive load vs. open-ended chat.

## Challenges faced

- **Avoiding “general chatbot” behavior**: enforced strict grounding and out-of-scope refusals in the system prompt, and gated chat until results are shown.
- **Multilingual consistency**: ensured UI strings switch by language; service cards support translation while keeping phone numbers/URLs unchanged.
- **Windows dev reliability**: addressed port collisions (5173/5174) by auto-killing stale listeners and forcing stable dev ports.
