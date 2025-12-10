# Demo Q&A Cheat Sheet

## Architecture Questions

**"Why Next.js App Router?"**
> Server components = less JavaScript sent to browser. Server actions = no API routes needed, forms submit directly to server functions. Built-in caching handles query memoization.

**"Why Supabase?"**
> PostgreSQL with Row-Level Security. Security enforced at database level—even buggy code can't leak data because the database itself rejects unauthorized queries.

**"How does auth work with RLS?"**
> NextAuth creates JWT with user ID → we pass it as HTTP header → RLS policies read header via `get_user_id()` function → database auto-filters results. No WHERE clauses needed.

---

## Code Structure Questions

**"Why feature-based folders?"**
> Everything for a feature lives together (queries, actions, components, types). Need to understand applications? It's all in `/features/applications/`. Easy to find, modify, or extract.

**"How do you handle validation?"**
> Zod schemas define data shape, TypeScript types inferred automatically. Server actions validate FormData, return field-specific errors. One schema, both client and server.

---

## Database Questions

**"What's the stage progression?"**
> Linear: Applied → OA → Phone → Onsite → Offer. Each stage has status (in progress/successful/rejected). Terminal states (offer accepted, rejection, withdrawal) lock the application—database trigger enforces this.

**"What tables do you have?"**
> `users`, `companies`, `jobs`, `applications`, `application_stages`, `stages` (master list). Applications link to jobs, jobs link to companies. Stages track pipeline progression.

---

## UI Questions

**"What's glassmorphism?"**
> Semi-transparent backgrounds with backdrop blur. Creates depth without heavy shadows. The frosted glass effect—popular since iOS/macOS adopted it.

**"What's the design system?"**
> MUI components wrapped with semantic props + Tailwind for layout. Design tokens (colors, spacing) centralized in one file. Dark mode only.

---

## Feature Questions

**"What can each role do?"**
> Applicant: track own applications. Recruiter: post jobs + manage candidates. Admin: manage users. TestPowerUser: all of the above + advance stages on applications.

**"What's SQL Mode?"**
> Dev feature—toggle shows actual queries being executed. Demonstrates the Supabase integration. Left visible for demo purposes.
