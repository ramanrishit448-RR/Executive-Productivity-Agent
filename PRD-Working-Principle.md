# PRD: Working Principle
## Executive Productivity Agent — How the System Actually Works

Author: Rishit Raman | Date: September 18, 2026

---

## Purpose of this document

The earlier PRDs cover *why* (ideology), *what's built with* (tech stack), and *what it produces* (outcome). This document covers **the operating logic** — the exact mechanical process the agent follows every time it runs, so it can be explained line-by-line in the 15-minute defense.

---

## Core working principle, in one sentence

**Every output is a filtered view over one reconciled table of commitments — never a fresh read of raw text.**

The agent never answers a question by re-scanning the transcript or emails live. It builds a single structured commitment store once (or on data refresh), and every brief or answer is just a query against that store. This is what keeps answers grounded and consistent instead of re-interpreting the sources differently each time.

---

## Step-by-step working logic

### Step 1 — Ingest
Every source (transcript, calendar, email thread, voice note) is read into a common shape:
```
{ source_type, source_id, timestamp, speaker/sender, recipient, raw_text }
```
Calendar entries with no descriptive content ("Blocked") are ingested but marked non-informative — they're kept for schedule cross-checking, not commitment extraction.

### Step 2 — Extract candidate commitments
Each text-bearing source unit (transcript line, email body, voice note) is passed to the LLM with a strict instruction: *extract only what is explicitly stated, output structured JSON, do not infer.*
```
{ description, made_by, made_to, due_date_hint, source_id, confidence }
```
Voice notes are extracted using the **same logic as Arjun's transcript statements** — they are his own commitments/reminders, never treated as instructions to the system itself.

### Step 3 — Cluster and deduplicate
Candidates are grouped by topic + the two parties involved (e.g., all "vendor list" mentions between Arjun and Raghav become one cluster). Within a cluster:
- Every source_id is retained (for citation).
- The **most recently timestamped statement wins** on any conflicting detail (date, status, owner).
- This is the mechanism that resolves the deck review date (Wed → Thu) and the vendor list's several walk-backs into one final, correct state.

### Step 4 — Classify ownership
Each merged commitment is labeled by checking who the *action* belongs to, not who's talking about it:
- `mine` — Arjun is the actor who must do something
- `waiting_on_others` — someone else owes Arjun the action
- `unowned` — no party has been confirmed as responsible

This classification is **evidence-based, not inferred**. If the sources themselves show disagreement or no acceptance of ownership (Mumbai lease: Facilities → Raghav → Divya, all declining), the system is required to output `unowned` rather than pick the "most likely" party.

### Step 5 — Resolve deadlines
Relative date language ("today," "tomorrow," "this week," "Thursday morning") is resolved against the fixed exercise week (Mon 21–Fri 25 Sep 2026). Each commitment gets a status:
- `overdue` / `due_today` / `upcoming` / `at_risk` (unowned + deadline within 24h)

### Step 6 — Serve outputs from the reconciled store
- **Daily brief** = a formatted read of the store, grouped into the four required sections, each line carrying its source citation.
- **Q&A** = a filtered query against the same store (e.g., "what did I promise Raghav" → `made_by = Arjun AND made_to = Raghav`), never a fresh LLM pass over raw source text. This is what keeps answers consistent with the brief and prevents the agent from "changing its mind" between a brief and a follow-up question.

---

## Why this principle matters for the assignment specifically

The brief explicitly tests three things this working principle is built to satisfy:

| Brief requirement | How the working principle satisfies it |
|---|---|
| "Deduplicate the same action across sources" | Step 3 — clustering + recency-wins merge |
| "Flag unclear ownership rather than inventing it" | Step 4 — ownership is evidence-based, defaults to `unowned` when sources disagree |
| "Detect deadlines and overdue items" | Step 5 — deadline resolution against the fixed week |
| Answering ad hoc questions consistently with the brief | Step 6 — one shared store, not independent re-reads per request |

---

## Failure modes this principle is designed to prevent

- **Hallucinated ownership** — never guessing who owns the Mumbai lease just because someone has to.
- **Stale commitments reported as current** — the vendor list's early "today"/"tomorrow" promises don't linger in the brief once superseded.
- **Inconsistent answers** — because Q&A reads from the same store as the brief, "what needs action today" and the generated brief can never contradict each other.
- **Treating voice notes as commands** — they're parsed as Arjun's own statements, not instructions altering agent behavior.
