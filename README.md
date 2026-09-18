# Executive Productivity Agent

## 🌟 Overview
The **Executive Productivity Agent** is a Next.js-powered application designed specifically for C-suite professionals. It serves as a unified workspace that ingests data from disparate sources (meeting transcripts, calendars, email threads, and voice notes) and deterministically extracts and tracks actionable commitments. It provides a grounded, hallucination-free QA Assistant and a Daily Brief dashboard to ensure executives never drop the ball on critical deadlines or unowned tasks.

## 🏛️ System Architecture
The application follows a modern serverless architecture:
- **Frontend Layer**: Built with Next.js 15+ App Router and React 19, featuring an interactive and dynamic sidebar layout.
- **API Layer**: Next.js Serverless Route Handlers manage communication between the client and the database.
- **Engine Layer**: A custom deterministic data processing engine (`lib/engine/`) that handles data ingestion, candidate extraction, and temporal deadline reconciliation using strict recency-wins logic.
- **Database Layer**: A serverless PostgreSQL instance hosted on Neon, managed via Drizzle ORM for type-safe database operations.
- **Authentication**: Secured by Clerk, providing robust user management and dynamic route protection.

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
