# CLAUDE.md

This file gives Claude (and any AI assistant) the ground rules for working in
this repo. Read it at the start of every session.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + bespoke CSS variables in `app/globals.css`
- **Runtime libs:** Stripe, React Hook Form, Cloudinary
- **Hosting:** Vercel
- **Node:** 20.x or newer

## Branch + PR rules (hard rules — never break)

- **Never commit directly to `main` or `dev`.** Both are protected. All work
  goes through a feature/fix branch and a pull request.
- **Branch naming:** `feature/issue-{number}-{slug}` or
  `fix/issue-{number}-{slug}`. Example: `feature/issue-12-blog-mdx-pipeline`.
- **PRs always target `dev`, not `main`.** `dev` rolls up to `main` on a
  cadence; nothing lands on `main` outside of a release PR from `dev`.
- **Never force-push** to shared branches (`main`, `dev`, or any branch with
  an open PR). Use `git push --force-with-lease` only on your own branch and
  only when you understand the consequences.
- **Never skip tests** or pre-commit checks to land work. If a check is
  broken, fix the check (or open an issue for it) — don't bypass.

## Change workflow (in order)

1. **format** — `npm run format`
2. **lint** — `npm run lint`
3. **typecheck** — `npm run typecheck`
4. **test** — `npm test` if/when tests exist
5. **commit** using conventional commits (see below)
6. **open PR** into `dev` (not `main`)

## Commit format — conventional commits

`type(scope?): summary`

Allowed types:

- `feat` — new user-facing capability
- `fix` — bug fix
- `chore` — tooling, deps, repo plumbing
- `docs` — documentation only
- `refactor` — code change with no behavior change
- `style` — formatting/whitespace only
- `test` — adding or fixing tests
- `perf` — performance improvement
- `build` / `ci` — build system or CI config

Examples:

- `feat: add MDX-based blog post pipeline`
- `fix(home): correct venture filter active state`
- `chore: bump next to 15.1.7`

## Repository layout

```
app/
  layout.tsx           # Root layout — fonts, metadata
  globals.css          # Design tokens + component styles
  page.tsx             # Home (/)
  ventures/page.tsx    # /ventures
  blog/page.tsx        # /blog
  about/page.tsx       # /about
  contact/page.tsx     # /contact
  components/
    SiteHeader.tsx     # Shared site header + nav
  lib/
    types.ts           # Shared types (Venture, Post, helpers)
    data.ts            # Local arrays for ventures + posts (fill these in)
```

## Design system

Design tokens live in `app/globals.css` as CSS variables (`--bg`, `--accent`,
etc.) and are also exposed to Tailwind via `@theme`. Preserve the minimal
typographic aesthetic: DM Serif Display for headings, Inter for body, warm
cream / terracotta palette. New components should reuse existing classes
(`.venture-card`, `.post-card`, `.tag`, etc.) before introducing new styles.

## Things Claude must NOT do

- Commit directly to `main` or `dev`
- Force-push to a shared branch
- Skip lint, typecheck, or tests to "ship faster"
- Reintroduce a CRLF-noise commit (see `.gitattributes`)
- Add server APIs without an explicit ask — the current site is intentionally
  static
- Hard-code secrets; use `.env.local` (gitignored) and document required
  variables in this file
