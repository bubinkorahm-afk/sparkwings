# Content TODO

Every placeholder on the site that needs real content before launch. Updated each iteration.

## Global

- [ ] **Arabic copy — native review.** Every string in `messages/ar.json` (and later `content/ar/`) was seeded from the English copy. A native speaker must review it before launch.
- [ ] **Logo.** Header/footer use an SVG tile (blue rounded square + white spark) with a gradient wordmark, per the brief. Confirm with the owner, or supply an SVG of the official mark.

## Homepage

Edit figures in `content/home.ts`, copy in `messages/{en,ar}.json`.

- [ ] **Stats band:** `[X]+` Years in business, `[X]+` Projects delivered, `[X]` Odoo apps deployed. Set the real number in `content/home.ts` (`value`) and it renders with a count-up. "2 Countries served" is real (India, Saudi Arabia).
- [ ] **Testimonials (×3):** `[Client quote]`, `[Client name]`, `[Company]`. Only use quotes the client has approved in writing. Avatars are coloured placeholder circles; add real photos (with permission) or keep the circles.
- [ ] **Past projects:** pills link to `/work/samkume`, `/work/gym-management-system`, `/work/boxing-academy-management`, `/work/van-sales-solution`. These case-study pages come in Iteration 6 and will need problem / solution / result write-ups and screenshots.
- [ ] **Service and product descriptions:** short marketing copy written from the brief. Owner to confirm the wording.

## Before launch (Iteration 3)

- [ ] **Neon database:** connect Neon Postgres to the Vercel project (sets `DATABASE_URL`).
- [ ] **Admin access:** set a strong `ADMIN_PASSWORD` and a random `ADMIN_SESSION_SECRET` in Vercel.
- [ ] **Odoo:** set `ODOO_URL`, `ODOO_DB`, `ODOO_USER`, `ODOO_API_KEY`, then send a test lead and confirm it appears in Odoo CRM with its tags.
- [ ] **Analytics:** GA4 measurement ID and Microsoft Clarity project ID.
- [ ] **Privacy policy:** the cookie banner links to `/privacy` (page built in a later iteration). It must describe GA4, Clarity, lead storage and Odoo.

## Hero carousel

- [ ] **Slide images (optional):** the 5 slides (Odoo, ZATCA, Routewings, Billing, Web) use code-built illustrations. To show real screenshots or project photos instead, put them in `public/images/slides/` and set `image` in `content/hero-slides.ts`. Use real Sparkwings work only, at 1600×1000 (16:10).
