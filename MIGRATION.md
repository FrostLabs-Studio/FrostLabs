# Migration handoff

This file lists everything you (Max) need to do on your machine to land this
migration. The file-level work is already done in your working tree — what's
left is **network-bound** (npm install, git push, GitHub UI, Vercel).

You can delete this file once the migration is merged.

---

## What's already done in your working tree

- Legacy HTML pages + `api/` folder deleted
- Stale `.claude/worktrees/` removed; `.claude/` is now in `.gitignore`
- Stale local branch `claude/strange-feistel-259057` removed
- Next.js 15 + TS + Tailwind 4 scaffold added under `app/`
- `package.json` rewritten with all required deps (Next, React, TS, Tailwind,
  Stripe, React Hook Form, Cloudinary, ESLint, Prettier)
- `.gitignore`, `.gitattributes` (CRLF normalized), `tsconfig.json`,
  `next.config.mjs`, `postcss.config.mjs` added
- `CLAUDE.md` + updated `README.md` at root
- Pages: Home, Ventures, Blog, About, Contact (preserve original styling)
- Data layer stub at `app/lib/data.ts` — add your ventures/posts there

## Sanity check first

```bash
git status
```

You should see deleted HTML files, modified `package.json` + `README.md`, and
a bunch of new files. Nothing else.

---

## Step 1 — Install deps and smoke-test locally

```powershell
# from the repo root
npm install
npm run dev
```

Open http://localhost:3000. Click through Home → Ventures → Blog → About →
Contact. Everything should render with the original aesthetic. The Ventures
and Blog grids will show empty-state cards until you populate
`app/lib/data.ts`.

If `npm run dev` fails, capture the error and **stop here** — fix it before
pushing.

---

## Step 2 — Type-check + lint

```powershell
npm run typecheck
npm run lint
```

Fix any reported issues before continuing. The scaffold should pass cleanly.

---

## Step 3 — Create the backup branch from the current state of `main`

This preserves the pre-migration site exactly so you can always revert.

```powershell
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Capture the pre-migration tip as a backup ref
git checkout -b backup/original-static-site origin/main
git push -u origin backup/original-static-site

# Back to dev for the migration
git checkout dev
git pull origin dev
```

If `dev` and `main` have diverged unexpectedly, stop and reconcile manually
before going further.

---

## Step 4 — Move the migration onto a feature branch (per the new rules)

The CLAUDE.md rule is "never commit directly to dev." So the migration itself
lands as a PR from a feature branch into dev.

```powershell
# Branch off dev
git checkout -b feature/issue-0-nextjs-migration dev

# Stage everything
git add -A

# Verify
git status

# Commit
git commit -m "feat: migrate to Next.js 15 + Tailwind CSS 4"

# Push the feature branch
git push -u origin feature/issue-0-nextjs-migration
```

---

## Step 5 — Branch protection (do this BEFORE opening the PR)

GitHub Settings → Branches → Add branch ruleset. Protect both `main` and
`dev` with:

- Require a pull request before merging
- Require **1** approval
- Block direct pushes (this is the default once "Require pull request" is on)
- (Optional) Require status checks to pass — wait until you have CI before
  enabling this one

If you prefer the API path and have `gh` installed and authenticated:

```powershell
# main
gh api -X PUT "repos/FrostLabs-Studio/FrostLabs/branches/main/protection" `
  --input - <<EOF
{
  "required_pull_request_reviews": { "required_approving_review_count": 1 },
  "required_status_checks": null,
  "enforce_admins": false,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF

# dev
gh api -X PUT "repos/FrostLabs-Studio/FrostLabs/branches/dev/protection" `
  --input - <<EOF
{
  "required_pull_request_reviews": { "required_approving_review_count": 1 },
  "required_status_checks": null,
  "enforce_admins": false,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

The UI path is fine too — just make sure both branches end up protected.

---

## Step 6 — Open the PR (feature branch → dev)

If you have `gh`:

```powershell
gh pr create `
  --base dev `
  --head feature/issue-0-nextjs-migration `
  --title "feat: migrate to Next.js 15 + Tailwind CSS 4" `
  --body "Replaces the static HTML site with a Next.js 15 / TS / Tailwind 4 scaffold. Backup of the original main is on branch `backup/original-static-site`. Pages preserve the original minimal typographic design; data layer is stubbed at `app/lib/data.ts` for hand-filled content."
```

If you don't have `gh`, open the PR via the GitHub UI:
`https://github.com/FrostLabs-Studio/FrostLabs/compare/dev...feature/issue-0-nextjs-migration`

Once the PR is merged into `dev`, open a follow-up PR from `dev` → `main` when
you're ready to ship to production.

---

## Step 7 — Vercel deploy

1. Go to https://vercel.com/new
2. Import `FrostLabs-Studio/FrostLabs`
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: leave as repo root
5. Build command: `next build` (default)
6. Output directory: `.next` (default)
7. Environment variables — you'll add these later as needed:
   - `STRIPE_SECRET_KEY` (when you wire up Stripe)
   - `CLOUDINARY_URL` (when you wire up Cloudinary)
   - any others you introduce
8. Deploy

Vercel will give you a `*.vercel.app` preview URL. Click through all 5 routes
to confirm everything renders.

For automatic preview deploys per PR, the GitHub integration handles this by
default — every PR opened against `dev` or `main` will get its own preview
URL once Vercel is connected.

### CLI alternative

```powershell
npm i -g vercel
vercel login
vercel link        # link to the Vercel project (creates one if needed)
vercel             # deploy to preview
vercel --prod      # promote to production when ready
```

---

## When you're done

- [ ] `feature/issue-0-nextjs-migration` PR merged into `dev`
- [ ] `dev` → `main` PR opened (and eventually merged when ready)
- [ ] `backup/original-static-site` branch exists on origin
- [ ] `main` and `dev` are both branch-protected
- [ ] Vercel preview URL works
- [ ] `app/lib/data.ts` populated with real ventures + posts
- [ ] Delete this file (`MIGRATION.md`) once the above is done
