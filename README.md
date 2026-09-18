# Executive Productivity Agent

## 🌟 Overview
The **Executive Productivity Agent** is a Next.js-powered application designed specifically for C-suite professionals. It serves as a unified workspace that ingests data from disparate sources (meeting transcripts, calendars, email threads, and voice notes) and deterministically extracts and tracks actionable commitments. It provides a grounded, hallucination-free QA Assistant and a Daily Brief dashboard to ensure executives never drop the ball on critical deadlines or unowned tasks.

## 🔗 Working Agent / Clickable Prototype
The agent is designed to run locally. Once the setup steps are complete, the fully working prototype is accessible at:
- **live at**: `http://localhost:3000`
*(Note: Requires valid Clerk and Neon Database environment variables to function properly.)*

## 🏛️ Architecture and Process Flow
The application follows a modern serverless architecture with a deterministic engine prioritizing accuracy over hallucination:
1. **Frontend Layer**: Built with Next.js 15+ App Router and React 19, featuring an interactive sidebar layout and a chat interface.
2. **API Layer**: Next.js Serverless Route Handlers manage communication between the client and the database.
3. **Engine Layer**: 
   - **Ingestion & Normalization**: Transforms meeting transcripts, calendars, emails, and voice notes into uniform `SourceItem` objects.
   - **Candidate Extraction & Validation**: Extracts explicit commitments using strict deterministic logic.
   - **Reconciliation & Classification**: Clusters items by topic, resolves conflicting deadlines using a "recency-wins" rule, and strictly classifies ownership (mine, waiting on others, unowned).
4. **Database Layer**: A serverless PostgreSQL instance hosted on Neon, managed via Drizzle ORM for storing commitments and chat sessions.
5. **Authentication**: Secured by Clerk, providing robust user management and route protection.

## 🤖 AI Tools & Integrations
1. **Groq SDK (Llama 3 120B / GPT OSS 120B)**: Used as a fallback LLM. When the user asks a question that does not match a hardcoded deterministic commitment, the agent queries the Groq API. It passes the raw JSON data pack and the user's conversation history to generate a contextual, natural language response.
2. **Deepmind Antigravity IDE**: AI coding assistant used to rapidly prototype, refactor, and fix UI/UX elements, backend API routes, and database schemas.

## 📥 Inputs, Sources, and Assumptions
**Inputs & Sources:**
- **Transcripts**: Board meeting transcripts detailing discussions on Q3 campaigns, leases, etc.
- **Emails**: Multi-thread emails resolving conflicting deadlines (e.g., vendor lists, expense reports).
- **Calendars**: Executive scheduling data.
- **Voice Notes**: Transcribed self-memos.
All sources are structured in `data/source-pack.json`.

**Assumptions:**
- **Recency-Wins**: If a deadline is mentioned in a transcript on Monday, but an email on Wednesday proposes a new deadline, the newer source takes absolute precedence.
- **Strict Ownership**: If a task is explicitly ambiguous or passed between team members without final resolution (like the Mumbai Lease), the system marks it as `unowned`. It will never hallucinate an owner.
- **Determinism First**: The system assumes LLMs can hallucinate. Therefore, core task extraction and scheduling rely on deterministic TypeScript logic rather than an LLM prompt. The LLM is strictly reserved for conversational fallbacks.

## 🛠️ Deep-Dive Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Version 15+)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Neon Postgres](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Language**: TypeScript

## 📂 Detailed Project Structure
```text
├── app/
│   ├── api/               # Serverless API endpoints (chats, ask, brief)
│   ├── globals.css        # Global Tailwind styles
│   ├── layout.tsx         # Root application layout (ClerkProvider)
│   └── page.tsx           # Main application entry point
├── components/
│   ├── dashboard/         # Sidebar, navigation, and connection panels
│   ├── CitationDrawer.tsx # UI for displaying source citations
│   ├── DailyBriefQuadrant # 4-quadrant Eisenhower-style dashboard
│   ├── Navbar.tsx         # Top navigation bar
│   └── QAAssistant.tsx    # Interactive chat assistant UI
├── lib/
│   ├── db/                # Drizzle ORM configurations and schemas
│   ├── engine/            # Core deterministic extraction logic (reconciliation, store)
│   ├── schemas.ts         # Zod schemas for API validation
│   └── types.ts           # Global TypeScript interfaces
├── data/
│   └── source-pack.json   # Base data set (Transcripts, Calendars, Emails)
├── middleware.ts          # Clerk authentication middleware
└── drizzle.config.ts      # Drizzle Kit configuration
```

## 🔐 Environment Setup (.env)
To run this project locally, create a `.env` file in the root directory and populate it with the following required environment variables:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon Database Connection String
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require

# (Optional) Groq API Key for live dynamic LLM extraction
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```

## 🚀 Getting Started & Local Execution

1. **Install Dependencies**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Database Initialization**
   Push the Drizzle schema to your Neon PostgreSQL database to create the required tables:
   ```bash
   npx drizzle-kit push
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## 📜 License
This project is licensed under the MIT License.
