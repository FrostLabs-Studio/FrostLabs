# FrostLabs

Main website for FrostLabs — a studio of experiments and companies.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- Stripe, React Hook Form, Cloudinary (installed; wire in as needed)
- Hosted on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start the local dev server                         |
| `npm run build`     | Production build                                   |
| `npm run start`     | Serve the production build                         |
| `npm run lint`      | Run Next.js / ESLint checks                        |
| `npm run typecheck` | `tsc --noEmit` — TypeScript type-check only        |
| `npm run format`    | Format the repo with Prettier                      |

## Content

Ventures and blog posts are loaded from `app/lib/data.ts`. Drop new entries in
there — the home page and `/ventures` + `/blog` routes read straight from
those arrays.

## Working in this repo

See [CLAUDE.md](./CLAUDE.md) for branch and PR rules, the change workflow, and
the commit conventions. The short version:

- Work on a `feature/...` or `fix/...` branch
- Open PRs into `dev`, not `main`
- Use conventional commits
- Run `format → lint → typecheck` before committing
