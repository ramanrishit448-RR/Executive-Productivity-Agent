# PRD: Executive Productivity Agent
**Assignment 1 — Agentic AI Factory | AIONOS**
Author: Rishit Raman | Date: September 18, 2026

---

## 1. Ideology

**The problem isn't information — it's fragmentation.**

Arjun Malhotra (VP Sales) doesn't lack data about his commitments. He has a meeting transcript, five calendars, 25 emails across 5 threads, and two voice notes to himself — all containing pieces of the same picture. The problem is that no single one of these sources is complete or final: the same commitment gets restated, revised, and sometimes reversed across channels (a deck review that moves from Wednesday to Thursday; a vendor list promised "today," then "tomorrow," then "whenever"). And some things — like the Mumbai lease sign-off — get talked about by everyone and owned by no one.

So the agent's job isn't "summarize the inputs." It's **reconciliation**: find every commitment, collapse duplicates into one true version using the most recent authoritative statement, correctly attribute ownership, and — critically — say "I don't know who owns this" instead of guessing when the sources themselves are unclear.

**Three principles drive every design decision:**

1. **Grounding over generation.** Every fact in the brief must trace back to a specific source message. If it's not in the data pack, the agent doesn't say it — no inference, no filling gaps with plausible-sounding detail.
2. **Recency resolves conflict.** When two sources disagree, the most recently timestamped one wins. Arjun's own voice note isn't automatically authoritative just because it's "from the horse's mouth" — a later email can supersede it.
3. **Unclear stays unclear.** Ownership ambiguity is a first-class output, not a bug to paper over. The agent's value is partly in what it *refuses* to assume.

This is what separates "a working agent" from "a chatbot that read the files" — the brief tests exactly this distinction.

---

## 2. Tech Stack

**Framework: Next.js (App Router, TypeScript)**
Chosen over a Python/FastAPI split because it collapses frontend + backend into one deployable project, and gives a one-click hosted demo via Vercel — directly satisfying the "shareable link / hosted demo" submission requirement with near-zero deployment overhead.

| Layer | Choice | Why |
|---|---|---|
| App framework | Next.js 14+ (App Router) | Single project for UI + API routes; fast to build in 6 hours |
| Language | TypeScript | Type safety on the commitment schema flowing through the pipeline |
| API routes | `/app/api/brief`, `/app/api/ask` | Serve the daily brief and handle ad hoc Q&A |
| LLM provider | Groq (Llama 3.x) — fast, free-tier inference for demo responsiveness | Structured JSON extraction + Q&A generation, called server-side (keeps API key off client) |
| Schema validation | Zod | Validates LLM JSON output against the commitment schema before it enters the pipeline — rejects malformed/hallucinated fields |
| Data source | `/data/source-pack.json` | Transcript, calendars, 5 email threads, 2 voice notes manually transcribed once into structured JSON — the single source of truth the pipeline reads from |
| State/storage | In-memory (no DB) | Data pack is static and small; a database adds no value for a one-week, single-user exercise |
| UI | Single page: "Generate brief" button + chat-style Q&A input | Matches the "clickable prototype" requirement without over-building |
| Deployment | Vercel | One-command deploy, public link, satisfies hosted-demo submission note |

**Pipeline (runs inside the API routes, per PRD architecture):**
```
Ingestion → Commitment Extraction (Groq, JSON mode) → Dedup (recency-wins merge)
→ Ownership Classification (mine / waiting_on_others / unowned)
→ Deadline Resolution → Brief Generator / Q&A Retrieval
```

**AI tools disclosed per assignment requirement #4:**
- *Development assistance:* Claude — architecture design, PRD drafting, code scaffolding/debugging.
- *Runtime (in-agent):* Groq (Llama 3.x) — commitment extraction, deduplication support, and Q&A response generation, constrained to the provided data pack only.

---

## 3. Outcome

**What the working prototype delivers:**

1. **A daily action brief**, generated on demand, split into four sections — *My actions today*, *Waiting on others*, *Overdue/at-risk*, *Unowned — needs assignment* — each line citing its source message(s).
2. **A Q&A interface** where Arjun can ask things like *"What did I promise Raghav?"* or *"What needs action today?"* and get a grounded, cited answer pulled from the reconciled commitment store — not a raw text search.
3. **Correct handling of the data pack's three deliberate stress tests:**
   - Vendor list promise resolves to its final confirmed state (Wed), not any of the earlier walked-back versions.
   - Campaign deck review resolves to **Thursday 9:30 AM** (the latest email), correctly overriding both the original Wednesday plan and Arjun's own voice-note guess.
   - Mumbai lease renewal is surfaced as **unowned and overdue**, not silently assigned to Facilities, Raghav, or Divya.
4. **A hosted, one-click-shareable demo** (Vercel link) plus a documented local run (`npm install && npm run dev`), satisfying the GitHub/prototype-access requirements without extra packaging work.
5. **A transparent AI-tool disclosure** distinguishing development-time assistance (Claude) from runtime intelligence (Groq), so the submission is defensible in the 15-minute review.

**What "success" looks like in the demo:** a reviewer can open the link, click "Generate brief," see a correct, source-cited summary of Arjun's week, then ask a follow-up question live and get an answer that's obviously grounded in the data pack rather than generically plausible.
