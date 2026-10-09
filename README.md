# Sparkwings website

Marketing site for Sparkwings Enterprises OPC Pvt. Ltd. Next.js 16 (App Router, Cache Components), Tailwind CSS v4 and next-intl (English `/en`, Arabic `/ar`).

> A full setup and deploy guide is written in Iteration 8. This covers what exists so far.

## Local development

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and ADMIN_SESSION_SECRET
npm run dev
```

- Site: http://localhost:3000/en and http://localhost:3000/ar
- Design system: http://localhost:3000/en/styleguide
- Admin console: http://localhost:3000/admin

Without `DATABASE_URL`, `next dev` uses an embedded Postgres (PGlite) stored in `./.data/pglite`. Delete that folder to reset local data.

## Leads

Every form posts to `POST /api/lead`, which:

1. validates the payload with Zod, drops honeypot submissions silently, and rate-limits each IP to 5 leads per 10 minutes;
2. saves the lead to Postgres (with country from Vercel geo and a salted IP hash; raw IPs are never stored);
3. after responding, creates a `crm.lead` in Odoo over JSON-RPC, tagged with `Country: …`, `Service: …` and `Source: …`.

If Odoo is down or misconfigured, the lead stays in the database marked **Sync failed**, and you can resend it from the admin console. With no database and no Odoo configured, the lead is logged and the visitor still sees success (local dev). A broken database returns an error, so leads are never silently lost.

## Admin console (`/admin`)

Password-protected (`ADMIN_PASSWORD`), with a signed 12-hour session cookie and 5 failed logins per 15 minutes per IP.

- **Dashboard:** leads over 7 and 30 days, open leads, Odoo sync failures, a leads-per-day chart, and breakdowns by service, country, source page and status.
- **Leads:** search and filter, change status, add internal notes, chat on WhatsApp, resend to Odoo, delete, and export CSV (respects the current filters).
- **Site content:** homepage stat numbers, testimonials (EN and AR, with a publish switch) and past-project pills. Saving updates the live site on the next visit; pages stay static.

## Environment variables

See [.env.example](.env.example). On Vercel:

1. **Storage → Neon (Marketplace) → Connect.** This sets `DATABASE_URL`. Tables are created automatically on first use.
2. Add `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (32+ random characters) and the four `ODOO_*` values. For `ODOO_API_KEY`, create a key in Odoo under *Preferences → Account Security → New API Key* for the user in `ODOO_USER`.
3. Optional: `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_CLARITY_ID`. They load only after a visitor accepts cookies.

## Analytics events

`demo_click` (any element with `data-track="demo_click"`), `whatsapp_click` (any `wa.me` link), `lead_submit` (successful form submission) and `fit_finder_complete` (Iteration 5).
