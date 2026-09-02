# Gradmire

**Study abroad, organized by subject — not by flag.**

Course-first study-abroad platform. V1 covers the **United Kingdom**; the US,
Canada and Australia render as coming-soon destinations.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Styling | Tailwind CSS, design tokens in `globals.css` |
| Database | Supabase Postgres, accessed with Drizzle ORM |
| Auth | Supabase Auth, passwordless magic link |
| Hosting | Vercel |

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in Supabase credentials
npm run db:push                # apply the schema
npm run db:seed                # load UK content from src/data
npm run dev
```

Then apply row-level security once:

```bash
psql "$DIRECT_URL" -f drizzle/rls.sql
```

`DATABASE_URL` is required — the app fails loudly rather than building an
empty site if it is missing.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build (type + lint errors fail it) |
| `npm run db:generate` | Generate a migration from `src/db/schema.ts` |
| `npm run db:push` | Apply schema to the database |
| `npm run db:seed` | Seed destinations and course hubs (idempotent) |
| `npm run db:studio` | Browse data in Drizzle Studio |
| `npm run verify:schema` | Apply migrations to in-process Postgres and assert relations |
| `npm run verify:redirect` | Assert the auth `next` parameter cannot redirect off-origin |

## Architecture

```
src/
├── app/
│   ├── page.tsx                       Homepage — departures board hero
│   ├── [country]/                     Destination; coming-soon if not live
│   │   └── courses/[slug]/            Course hub (ISR, 1h)
│   ├── tools/                         Finder, ROI, Comparator, Deadlines
│   ├── portal/                        Applicant status view (auth)
│   ├── admin/                         Staff: leads, applications, content
│   └── auth/callback/                 Magic-link exchange
├── components/brand/                  Departure board, boarding pass, chrome
├── db/schema.ts                       Drizzle schema — 10 tables
└── lib/
    ├── queries.ts                     Cached content reads (tagged)
    ├── actions/                       Server actions (forms, admin writes)
    └── rate-limit.ts                  Fixed-window limiter for public forms
```

### Access control

Two authed areas, both gated in `middleware.ts` and re-checked server-side:

- **`/portal`** — an applicant signs in with a magic link and sees the status
  of their own applications. Read-only.
- **`/admin`** — requires a row in `staff`. Manages leads, application stages
  and course content.

Applications are created by staff, not self-served: `signInWithOtp` is called
with `shouldCreateUser: false`, so an unknown email cannot create an account.

The post-login `next` parameter is constrained by `lib/safe-redirect.ts`.
Interpolating it directly is an open redirect — `origin` has no trailing
slash, so `?next=@evil.com` resolves to host `evil.com` and `?next=.evil.com`
to `gradmire.com.evil.com`, both of which authenticate the victim before
handing them to an attacker. `npm run verify:redirect` asserts this stays
closed.

### Caching

Content reads are wrapped in `unstable_cache` under the `content` tag and
served from cache under load. Admin writes call `revalidateTag("content")`, so
edits appear on the next request rather than after the TTL.

### Content provenance

`course_hubs.sources` and `data_verified_at` record where a figure came from
and when it was last checked. **The seeded ranking data is placeholder** — the
original content spec flags it for replacement from a live subject table. The
admin overview surfaces a count of live hubs still carrying unverified figures.

## Known gaps

- Deadline Tracker stores shortlists in `localStorage`; email reminders are not
  built, so the copy does not promise them.
- Five of eight UK subject hubs are stubs pending researched content.
- Transactional email (lead notifications) is not wired; leads land in the
  database and the admin, not an inbox.
