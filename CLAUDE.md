# CivilPowerEc — Claude Code Workflow

## Project identity

CivilPowerEc is a SaaS multi-tenant construction management platform for Ecuador and LATAM.

Stack:

- React + Vite + TypeScript
- Tailwind CSS v4 with `@tailwindcss/vite`
- Supabase PostgreSQL / Auth / RLS
- Vercel / GitHub
- Multi-tenant by `empresa_id` as tenant key

This repository is **CivilPowerEc only**.

Never mix this repository with:

- HMS-V2
- VHK Contractors
- any repo, Supabase project, Vercel project, SSH key, GitHub account, credential or environment belonging to another project

CivilPowerEc uses its own SSH key (`id_civilpowerec`), GitHub remote (`github-civilpowerec`), Vercel project and Supabase project. Never cross-contaminate resources.

---

## Critical command: CONTINUAR DREAM

When the user writes:

```
CONTINUAR DREAM
```

Claude must run a **read-only continuation preflight** before editing anything.

Required actions:

1. Verify current folder and repository.
2. Confirm the remote belongs to `civilpowerec/civilpoerec`.
3. Confirm it is **NOT** HMS-V2.
4. Confirm it is **NOT** VHK.
5. Show current branch (`git branch --show-current`).
6. Show working tree status (`git status --short`).
7. Show last 8–10 commits (`git log --oneline --decorate -10`).
8. Check `package.json` scripts.
9. Check whether `CLAUDE.md` exists.
10. Check whether `.env.local` exists.
11. List env variable **names only** — never values.
12. Confirm `.env.local` is ignored by Git (`.gitignore`).
13. Confirm Supabase project ref if derivable without printing secrets.
14. Confirm `supabase/migrations/` folder exists.
15. Confirm `vercel.json` present and contains SPA rewrite.
16. Run `npm run build`.
17. Check whether a local dev server is running (`npm run dev` / port 5173).
18. If possible, report:
    - PC local URL: `http://localhost:5173`
    - LAN/mobile URL
19. Report safe/unsafe status.
20. Ask for the exact ticket or task before editing anything.

If anything is unsafe (wrong repo, wrong remote, dirty tree on wrong branch, build failing), Claude must **stop and report before touching files**.

---

## Current stable state (as of Sprint 2 close)

Stable baseline after recovery and UI baseline:

- PR #1 — S0A RLS hotfix merged and applied in Supabase
- PR #2 — Sprint 1/2 app baseline restored
- PR #3 — Auth screens styled (light theme)
- PR #4 — Tailwind v4 utilities enabled via `@tailwindcss/vite`
- PR #5 — UI R1 form/readability baseline merged (all dark inline styles converted)
- PR #6 — Vercel SPA rewrite + optional `.single()` → `.maybeSingle()`
- Build passing
- Production loading
- Console clean (404 and 406 resolved)

Deferred / pending work:

- Full desktop functional QA:
  - register → create company → Admin member → onboarding → create project → invite → accept invitation
- QA adversarial RLS: cross-tenant insert from authenticated SDK session must return error 42501
- UI R2: mobile layout and responsive cleanup
- Sprint 3: budget module — **only after QA baseline is closed**

---

## Workflow rules

Always apply HMS-V2-style discipline:

- **Audit before patch** — read the file before editing
- **Plan before implementation** — describe scope and risk
- **Small scoped patches** — minimum change that achieves the goal
- **Never mix tickets** — one concern per branch
- **No full rewrites** if a local patch is enough
- **No opportunistic cleanup** outside the approved scope
- **No direct work on main**
- **One branch per ticket**
- **Build before report** — `npm run build` must pass
- **Review Agent Report before commit/push**
- **QA before merge**
- **Merge Agent only after explicit user approval**
- **Sync main after merge**
- **Report exact files changed**

---

## Branch rules

Never work directly on `main`.

Use scoped branch prefixes:

| Prefix | Use |
|---|---|
| `ui/` | Visual and layout work |
| `fix/` | Bug fixes, runtime errors |
| `security/` | RLS, auth, permission hardening |
| `chore/` | Docs, tooling, workflow, config |
| `recovery/` | Code restoration or rollback |
| `feature/` | New application features |

Before creating a branch:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
# confirm working tree clean
git switch -c <prefix>/<name>
```

---

## Protected areas

The following require **read-only audit first** and **explicit user approval** before any change:

- Supabase schema
- `supabase/migrations/`
- RLS policies
- tenant isolation (`empresa_id` filtering)
- company/tenant data paths
- auth handlers
- roles and permissions (`src/lib/permissions/`)
- RPCs and database functions
- storage policies
- billing and subscriptions (`suscripciones` table)
- financial totals
- server/API logic
- `.env*` files
- `vercel.json`
- Supabase client (`src/lib/supabase/`)
- `src/lib/tenant/`
- any multi-tenant data path

**Never modify RLS, schema, migrations or tenant isolation without explicit approval per ticket.**

---

## Supabase and multi-tenant security rules

CivilPowerEc is multi-tenant. Tenant isolation is critical.

Claude must **never**:

- expose service role keys or secret keys
- print `.env` values
- bypass RLS
- use SQL Editor results as a proxy for authenticated user behavior (SQL Editor runs as superuser; authenticated SDK sessions run under RLS)
- run SQL without explicit approval per ticket
- change policies without audit
- change RPCs without audit
- weaken tenant checks
- mix tenant data
- allow one company to read another company's data

Frontend must use only the public/anon key (`VITE_SUPABASE_ANON_KEY`). Service role key must never appear in browser code.

---

## Vercel and env var rules

Never print environment variable values.

Allowed: list variable names only.

Expected Vite public env names for CivilPowerEc:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL`

**Vite env vars are build-time.** If a Vercel env var changes, a new deploy is required for it to take effect. Adding a var to Vercel after an existing build does not patch that build.

---

## Review Agent Report

Before marking any patch as ready, Claude must run:

```bash
git branch --show-current
git status --short
git diff --check
git diff --stat
git diff --name-only
npm run build
```

Then report:

```
## Review Agent Report

- Branch:
- Working tree:
- Changed files:
- Build:
- Diff check:
- Scope match:
- Forbidden files touched:
- Protected logic touched:
- Multi-tenant/RLS risk:
- Auth/permission risk:
- Financial/billing risk:
- User-facing text language:
- QA required:
- Commit allowed:
```

For UI/design work, also include:

```
- Design skill / UI standard used:
- Readability risk:
- Mobile risk:
- Horizontal scroll risk:
```

---

## Merge Agent

Claude may only merge when the user writes an explicit approval such as:

```
QA APROBADO — MERGE PR #<number>
```

Before merge, Claude must verify:

- correct PR number
- correct branch and target (`main`)
- files changed match approved scope
- checks and build pass
- no conflicts
- no forbidden files touched
- no protected logic changed without approval

After merge, Claude must sync local main:

```bash
git switch main
git pull --ff-only origin main
git status --short
git log --oneline --decorate -8
npm run build
```

Then report:

- PR merged
- merge commit hash
- main clean
- latest commits
- next recommended ticket

---

## UI/design skill rules

For UI work, use the same visual standard as HMS-V2 (professional, calm, clean, slate/blue palette).

If a UI/design skill or agent is available, use it **only under strict guardrails**:

**Allowed:**

- readability and contrast improvements
- spacing and typography
- responsive layout review
- horizontal overflow prevention
- component-level visual improvements
- replacing dark hardcoded colors with Tailwind tokens

**Not allowed without separate explicit approval:**

- deep redesign
- navigation changes
- business logic changes
- Supabase or service layer changes
- installing new packages
- theme architecture rewrite
- dashboard or screen restructuring mixed into unrelated tickets

Do **not** use `overflow-x-hidden` globally to hide a local overflow defect. Fix the overflowing component.

---

## Error monitoring and debugging

CivilPowerEc is React + Vite (not Next.js). Dev tooling:

- Browser Console — primary runtime error source
- Vercel Deployments / Build logs — preview and production errors
- Supabase Dashboard → Logs — RLS rejections, query errors
- Local `npm run build` — TypeScript and bundler errors
- Future: ErrorBoundary / Sentry-style monitoring (dedicated ticket required)

Do not add monitoring tools without a dedicated approved ticket.

---

## Security posture

Layers of defense for CivilPowerEc:

- RLS by `empresa_id` on every tenant table
- Least-privilege frontend: anon key only
- No service role key in browser code
- Protected migrations — never run without explicit approval
- Audit logs for critical write actions (`audit_logs` table)
- Vercel / Supabase secrets management
- Review Agent on every patch
- QA adversarial RLS tests
- Dependency review before installing packages
- Rollback-ready PR workflow on `main`

---

## Immediate backlog (pre-Sprint 3)

Do **not** start Sprint 3 until these are closed in order:

1. **Full desktop functional QA**
   - register → create company → Admin member → onboarding → create project → invite → accept invitation
2. **QA adversarial RLS** — cross-tenant insert from authenticated SDK session must fail with 42501
3. **This CLAUDE.md workflow** — close after PR merge
4. **UI R2 (optional)** — mobile layout and responsive cleanup
5. **Sprint 3 planning** — budget module, only after items 1–2 are confirmed closed
