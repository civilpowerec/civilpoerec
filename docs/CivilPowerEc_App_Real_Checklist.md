# CivilPowerEc — Real-World App Checklist

> **Living document.** Updated after every sprint or significant architectural decision.
> Status: `[x]` Completed · `[~]` In progress / partial · `[ ]` Pending
>
> Reference: See `CLAUDE.md` for process rules, double-confirmation requirements, and the recommended execution order.

---

## A. Project foundation and control

| # | Status | Item | Purpose |
|---|---|---|---|
| A1 | `[x]` | CONTINUAR DREAM preflight command | Ensures every Claude session starts with a safe, verified state before touching any file |
| A2 | `[x]` | GitHub / PR workflow | All changes via scoped branches and PRs; no direct pushes to main |
| A3 | `[x]` | CLAUDE.md workflow document | Permanent Claude Code instructions, guardrails, and process rules for this repo |
| A4 | `[ ]` | Architecture Decision Records (ADRs) | Document why key decisions were made (e.g. multi-tenant by empresa_id, Supabase vs. custom API, SECURITY DEFINER vs. service role) so they can be revisited intentionally |
| A5 | `[ ]` | Roadmap by phase | Written product phases (Sprint 1–N) with goals, dependencies, and entry/exit criteria — prevents scope creep and guides sprint planning |

---

## B. Frontend, build and deployment

| # | Status | Item | Purpose |
|---|---|---|---|
| B1 | `[x]` | Frontend minified, no public source maps | Production bundle is minified by Vite; `dist/` confirmed to contain zero `.map` files — source code not exposed |
| B2 | `[x]` | Tailwind CSS v4 / UI base | `@tailwindcss/vite` registered; light-theme baseline applied across all screens (PR #4, #5) |
| B3 | `[x]` | Vercel deployment | Static SPA deployed to Vercel with SPA rewrite in `vercel.json` (PR #6) |
| B4 | `[x]` | SPA rewrite (`vercel.json`) | `/(.*) → /index.html` ensures deep-link routes work without 404 on refresh or direct navigation |
| B5 | `[ ]` | Production / Preview / Local environment separation | Formal policy: which env vars differ per environment, which Supabase project each environment points to, and how preview deploys are gated |
| B6 | `[ ]` | CI/CD build + lint checks | Automated GitHub Actions (or Vercel checks) to run `npm run build` and `eslint` on every PR — currently all manual |
| B7 | `[ ]` | Bundle size budget | Set a performance budget (e.g. JS < 600 KB gzip); alert when exceeded; add `rollupOptions.output.manualChunks` before Sprint 3 adds the budget module |
| B8 | `[ ]` | React ErrorBoundary | Catch runtime JS errors gracefully and show a user-friendly fallback instead of a blank screen; required before opening to real users |

---

## C. Database, RLS and multi-tenant

| # | Status | Item | Purpose |
|---|---|---|---|
| C1 | `[x]` | RLS enabled on all tenant tables | Migrations 002–005 enable RLS and define policies for empresas, miembros, suscripciones, clientes, contactos_cliente, proyectos, proyecto_miembros, audit_logs, invitaciones |
| C2 | `[ ]` | QA adversarial RLS | Cross-tenant INSERT from an authenticated SDK session (not SQL Editor superuser) must fail with PostgreSQL error 42501; must be tested manually and documented |
| C3 | `[x]` | Tenant isolation helper functions | `user_belongs_to_empresa`, `user_has_role`, `empresa_can_write` — SECURITY DEFINER, `search_path = public` (migration 002) |
| C4 | `[x]` | Roles and permissions matrix | `src/lib/permissions/permissions.ts` — `MATRIZ_PERMISOS` with 30+ actions mapped to roles; `can()` / `canAny()` used at UI level |
| C5 | `[~]` | RPC SECURITY DEFINER audit | `get_invitation_by_token` and `accept_invitation` reviewed and correct; no explicit GRANT in migrations — relies on Supabase PostgREST default exposure; must be formalized with explicit GRANT statements |
| C6 | `[~]` | Migrations applied to live Supabase | Migrations 001–005 exist locally; confirmation that all five are applied to the live project is required; migration 005 (miembros_insert hardening) is critical |
| C7 | `[~]` | Critical indexes | Main indexes exist (empresa_id, user_id, token, estado); `clientes(empresa_id)` and `contactos_cliente(cliente_id)` indexes missing; Sprint 3 tables will need indexes defined at creation time |
| C8 | `[ ]` | Backup / restore tested | Supabase automated backups confirmed active on paid plan; a manual restore test must be performed and documented before the first real-user launch |

---

## D. Auth, security and secrets

| # | Status | Item | Purpose |
|---|---|---|---|
| D1 | `[~]` | Basic Supabase Auth | Email/password auth working for register, login, and invitation acceptance; no email confirmation policy documented or enforced |
| D2 | `[ ]` | Email verification policy | Decide whether unverified emails can invite others, create projects, or write data — currently no restriction; must be documented and enforced before launch |
| D3 | `[ ]` | MFA (future) | Multi-factor authentication for Admin roles — required before enterprise or financial-sensitive tenants are onboarded |
| D4 | `[~]` | Secrets management | `VITE_SUPABASE_ANON_KEY` is the only key in frontend; service role key never in browser code; Vercel env vars store production secrets; `VITE_APP_URL` not yet configured in Vercel |
| D5 | `[x]` | Service role key protection | Service role key is never referenced in `src/`; all frontend operations use anon key under RLS |
| D6 | `[ ]` | Dependency security audit | `npm audit` has never been run formally; no automated dependency scanning in CI; must be added before launch |
| D7 | `[ ]` | Privacy policy and terms of service | Legal documents required before onboarding real customers in Ecuador/LATAM; affects data handling, retention, and breach response obligations |
| D8 | `[ ]` | Data export and deletion (right to erasure) | Tenant must be able to export their data and request deletion; required for GDPR-adjacent compliance and trust |

---

## E. APIs, services and validation

| # | Status | Item | Purpose |
|---|---|---|---|
| E1 | `[~]` | Services inventory | All Supabase operations are in `src/modules/**/services/`; no direct queries from components; `empresa_id` always passed explicitly — good for MVP; missing `.limit()` and specific column selects in several list queries |
| E2 | `[x]` | Secure RPC strategy | Public operations (`get_invitation_by_token`, `accept_invitation`) use SECURITY DEFINER RPCs, not direct table access from unauthenticated clients |
| E3 | `[ ]` | Input validation (frontend) | No Zod or validation library; forms rely on HTML `required` and TypeScript types; server-side RLS is the real gate, but frontend validation improves UX and reduces bad requests |
| E4 | `[ ]` | Error normalization | Error messages from Supabase are passed through inconsistently; some return `error.message`, others return mapped strings — a shared error normalization layer prevents leaking internal DB errors to users |
| E5 | `[ ]` | API versioning strategy (future) | Before Sprint 3 ships, define whether RPCs follow a versioned naming convention — prevents breaking changes when RPC signatures evolve |
| E6 | `[x]` | TypeScript data contracts | `src/types/` defines `Invitacion`, `Empresa`, `Proyecto`, `MiembroEquipo`, `RolEmpresa`, etc.; all service functions are typed |
| E7 | `[ ]` | Edge Functions for sensitive operations | Operations that require service role (e.g. billing transitions, forced tenant lock) should move to Supabase Edge Functions — currently blocked because no billing is implemented yet |

---

## F. Cost protection, rate limiting and abuse prevention

| # | Status | Item | Purpose |
|---|---|---|---|
| F1 | `[ ]` | Frontend rate limiting / debounce | No throttle or debounce on any button — a user can spam "Regenerar link", "Invitar", or "Crear proyecto" and generate hundreds of DB writes per second; minimum fix: debounce critical buttons |
| F2 | `[ ]` | Anti-spam: max pending invitations per company | No limit on how many `pendiente` invitations can exist; a compromised Admin could create thousands; add a server-side check in `crearInvitacion` |
| F3 | `[~]` | Supabase cost protection | `empresa_can_write` blocks writes when trial expires; no budget alerts configured in Supabase Dashboard; no row-count limits on tenant data |
| F4 | `[ ]` | Vercel cost protection | No spending limits configured in Vercel Dashboard; static hosting is free-tier safe today but function invocations (if Edge Functions are added) can scale unexpectedly |
| F5 | `[ ]` | Budget alerts (Supabase + Vercel) | Set up email alerts at 50% and 90% of monthly budget in both Supabase and Vercel dashboards — prevents surprise bills |
| F6 | `[ ]` | WAF / firewall (future) | For production at scale, a Web Application Firewall in front of Vercel + Supabase; not required for MVP but must be planned before enterprise launch |
| F7 | `[ ]` | Selective captcha | Add hCaptcha or Cloudflare Turnstile on register and invitation acceptance to prevent bot account creation; evaluate after first 100 real users |

---

## G. Performance, cache and scalability

| # | Status | Item | Purpose |
|---|---|---|---|
| G1 | `[ ]` | Frontend cache layer (React Query or SWR) | No cache exists; every component mount fetches fresh from Supabase; required before Sprint 3 adds large data sets (rubros, actividades, presupuesto) |
| G2 | `[ ]` | Pagination and limits on all list queries | `getMiembros`, `getProyectosActivos`, `getInvitacionesPendientes` have no `.limit()`; will degrade with data growth; add pagination or hard limits |
| G3 | `[ ]` | Query optimization (specific columns, not `select('*')`) | Several queries use `select('*')` — transfers unused columns and prevents query planner optimization; switch to specific column lists in high-frequency queries |
| G4 | `[ ]` | Static/reference data cache | Roles list, provinces, tipos de obra, construction standards — currently hardcoded or fetched fresh; candidate for build-time constants or 24h cache |
| G5 | `[ ]` | Load test: 100 simultaneous users | Run a load test with 100 concurrent sessions doing typical flows (login → equipo → crear proyecto); measure query latency and error rate; must pass before inviting real users |
| G6 | `[ ]` | Load test: 1000 simultaneous users | Run a load test with 1000 concurrent sessions; requires cache layer and Supabase Pro plan first; establishes the scaling ceiling before paid marketing |
| G7 | `[ ]` | Scalability plan | Document: at what user count does each layer need upgrading (Supabase plan, connection pooler, Edge Functions, CDN config, read replicas); must be written before launch |
| G8 | `[ ]` | Offline / PWA support (future) | For field workers with poor connectivity — service worker cache for read-only views; not MVP, but architecture must not block it later |

---

## H. Observability, logs and support

| # | Status | Item | Purpose |
|---|---|---|---|
| H1 | `[ ]` | Error monitoring (Sentry or equivalent) | No error monitoring exists; unhandled JS errors go to console only; required before real users — one invisible crash loop can lose a customer |
| H2 | `[x]` | Audit logs | `audit_logs` table captures create/update/cancel actions; `registrarAudit` helper used in all critical service functions |
| H3 | `[ ]` | Internal support admin panel | No admin view to look up tenants, check subscription state, or debug a customer issue; required before first paid customer |
| H4 | `[ ]` | Incident response plan | No documented runbook for: DB down, RLS breach, data leak, billing failure, Vercel deploy failure; must exist before launch |
| H5 | `[ ]` | Status page | Public status page (Betterstack, Instatus, or similar) so customers can check if an outage is their problem or ours; required before paid customers |
| H6 | `[ ]` | Product metrics (analytics) | No event tracking; cannot measure activation, retention, or feature usage; add privacy-friendly analytics (Plausible, PostHog) before launch to validate product decisions |

---

## I. QA and testing

| # | Status | Item | Purpose |
|---|---|---|---|
| I1 | `[~]` | Full desktop functional QA | Flow: register → create company → Admin → onboarding → create project → invite → accept invitation; blocked by invitation link bug; must complete before Sprint 3 |
| I2 | `[ ]` | Mobile UI R2 | Responsive and mobile layout audit; deferred after QA functional desktop |
| I3 | `[ ]` | Unit tests | No test suite exists; at minimum: permissions matrix, RPC result parsing, token generation, date calculations |
| I4 | `[ ]` | Integration tests | Service layer tests against a test Supabase project; verifies RLS, tenant isolation, and RPC behavior under real auth |
| I5 | `[ ]` | E2E tests (Playwright or Cypress) | Automated browser flows for the critical path; prevents regressions during Sprint 3 and beyond |
| I6 | `[ ]` | Manual security QA | Attempt cross-tenant reads, forged `empresa_id` inserts, expired token reuse, and role escalation from the browser; document results |

---

## J. Construction product — field modules

| # | Status | Item | Purpose |
|---|---|---|---|
| J1 | `[ ]` | Daily field log (Diario de obra) | Daily activity record by project, date, and worker; core field module — feeds into progress reporting |
| J2 | `[ ]` | Photos and field evidence | Photo capture with geotagging, timestamp, and project/activity tagging; required for dispute resolution and client reporting |
| J3 | `[ ]` | Documents, plans and version control | Upload and version control for drawings, specs, and permits; enables traceability |
| J4 | `[ ]` | RFIs (Requests for Information) | Formal question/response workflow between field, office, and client; critical for commercial and institutional projects |
| J5 | `[ ]` | Issues and punch list | Defect tracking per project; links to photos and responsible parties |
| J6 | `[ ]` | Submittals and approvals | Material sample submissions, approval chain, and status tracking |
| J7 | `[ ]` | Sprint 3: initial budget module | Presupuesto referencial — line items, quantities, unit costs; entry point for financial control |
| J8 | `[ ]` | Budget vs. actual progress | Compare planned budget to executed quantities; core financial health indicator for construction |
| J9 | `[ ]` | Purchase orders (POs) | Generate, track, and receive purchase orders linked to budget line items |
| J10 | `[ ]` | Workforce and attendance | Daily worker attendance per project; feeds into labor cost tracking |

---

## K. LATAM, Ecuador and future integrations

| # | Status | Item | Purpose |
|---|---|---|---|
| K1 | `[ ]` | WhatsApp integration (future) | Field notifications, daily report sharing, and RFI alerts via WhatsApp Business API — dominant communication channel in Ecuador/LATAM construction |
| K2 | `[ ]` | Transactional email | Password reset and invitation emails work via Supabase Auth defaults; custom transactional email (Resend, Postmark) needed for project notifications, reports, and billing |
| K3 | `[ ]` | Payments and subscriptions | Stripe or local payment gateway for trial-to-paid conversion; required before revenue; must integrate with `suscripciones` table |
| K4 | `[ ]` | Ecuador electronic invoicing (SRI) (future) | Ecuador requires electronic invoicing via SRI for B2B transactions; needed when CivilPowerEc invoices customers or when POs require official documents |
| K5 | `[ ]` | Marketplace / materials catalog (future) | Shared price list or supplier marketplace for Ecuador construction materials; long-term network effect feature |
| K6 | `[ ]` | Maps and location (future) | Google Maps or Mapbox integration for project site location, crew tracking, and material delivery |
| K7 | `[ ]` | AI-ready architecture | Data model and API structure should support future AI features (cost prediction, delay detection, document parsing) without requiring a rewrite |

---

## L. Governance and growth

| # | Status | Item | Purpose |
|---|---|---|---|
| L1 | `[ ]` | Feature flags | Control which features are visible per tenant plan (trial vs. paid vs. enterprise); prevents half-built features from reaching customers |
| L2 | `[ ]` | Plan and feature limits per subscription tier | Enforce limits at the service layer: max projects, max members, max invitations, max storage per plan level |
| L3 | `[ ]` | Tenant data export and backup | Admin can export all company data as JSON or CSV; required for portability, GDPR-adjacent requests, and customer trust |
| L4 | `[ ]` | Data retention policy | Define how long deleted records are kept, when audit logs rotate, and when inactive tenants are archived |
| L5 | `[ ]` | Accessibility (WCAG 2.1 AA) | Screen reader support, keyboard navigation, color contrast compliance; required for institutional and government clients in Ecuador |
| L6 | `[ ]` | Multi-language support (future) | Spanish is the primary language; English secondary for international clients; architecture must support i18n keys before hardcoding grows |
| L7 | `[ ]` | Operations manual | Runbook for: deploying a new version, rolling back, applying a migration, resetting a user's password, and handling a tenant support request |
| L8 | `[ ]` | Legal and commercial review | Terms of service, privacy policy, data processing agreements, and commercial contract templates reviewed by a lawyer before first paid customer |
| L9 | `[ ]` | Customer support plan | Support channel (email, WhatsApp, in-app), SLA, escalation path, and knowledge base before onboarding paid customers |
| L10 | `[ ]` | Executive pre-launch review | Final go/no-go checklist review covering security, QA, cost controls, legal, support, and monitoring — signed off before opening to the public |

---

## Summary counts

| Section | Completed | Partial | Pending | Total |
|---|---|---|---|---|
| A. Foundation | 3 | 0 | 2 | 5 |
| B. Frontend / Build | 4 | 0 | 4 | 8 |
| C. Database / RLS | 3 | 3 | 2 | 8 |
| D. Auth / Security | 2 | 2 | 4 | 8 |
| E. APIs / Services | 2 | 1 | 4 | 7 |
| F. Cost / Rate limits | 0 | 1 | 6 | 7 |
| G. Performance / Cache | 0 | 0 | 8 | 8 |
| H. Observability | 1 | 0 | 5 | 6 |
| I. QA / Testing | 0 | 1 | 5 | 6 |
| J. Construction modules | 0 | 0 | 10 | 10 |
| K. LATAM / Integrations | 0 | 0 | 7 | 7 |
| L. Governance | 0 | 0 | 10 | 10 |
| **Total** | **15** | **8** | **67** | **90** |

---

*Last updated: 2026-06-23. Maintained by Claude Code with Steban's approval.*
