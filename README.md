# Kingston Newcomer Pathways (Hackathon MVP)

Guided decision assistant to help newcomers find relevant **City of Kingston** and **211 Ontario** services using a short question flow, plus a constrained clarification chat grounded in the displayed services.

## Quick start

### 1) Install

```bash
npm run install:all
```

### 2) Configure AI (optional, recommended for demo)

This environment blocks `.env.example` files, so use the provided template:

- Copy `backend/env.template` to `backend/.env`
- Set `OPENAI_API_KEY`

If you do not configure an API key, the app still runs, but AI text will be a safe fallback message.

### 3) Run (dev)

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5174`

## What’s included

- **Frontend (React SPA)**: `frontend/`
  - `LanguageSelector` (English / Somali / French)
  - `GuidedQuestionFlow` (4 dropdown questions)
  - `ResultsView` (recommended services + explanation)
  - `ClarificationChat` (hidden until results shown; asks only about these services)
  - Visible disclaimer: “This tool provides information and referrals only. For emergencies, call 911.”

- **Backend (Node + Express)**: `backend/`
  - Single endpoint: `POST /api/recommend`
    - Recommendation mode: `{ language, answers }`
    - Clarification mode: `{ language, question, serviceIds }`
  - Hardcoded dataset: `backend/src/services.json` (8 services)
  - **AI safety constraints enforced in the system prompt**:
    - municipal service navigation assistant for City of Kingston
    - **ONLY** reference provided services
    - out-of-scope → “don’t know” + suggest 211 Ontario
    - respond in selected language
    - not a general-purpose chatbot

## Notes / TODOs

- TODO: Replace placeholder service entries with official City / partner program details and verified contact/location info.
- TODO: Add accessibility pass (ARIA labels, keyboard UX) and content review with settlement partners.
- TODO: Consider adding “quick question” chips in chat for faster demos.

