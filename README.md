# Byzantine Unravel

Company site for Byzantine Unravel. The public pages introduce the firm and the five products. The desk at `/admin` edits the copy, the catalogue, and the enquiries.

HIMS and LIMS stay in their own applications. This repository is only the company site.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS 4, PostgreSQL, and Prisma. The site runs as a Node server.

## Decisions locked before the schema

- **Online and on-premises** are two deployment modes. Each product has a flag and its own summary and detail for each mode. All five ship with both modes on.
- **Redirects.** Changing a product address writes a permanent redirect from `/products/old-slug` to `/products/new-slug`. Next.js sends this as HTTP 308, which crawlers treat as a permanent move.
- **Images.** Social cards are generated. A product may also carry an optional `https` image address. There is no file upload.
- **Copy** is Markdown. It is sanitized when rendered. Raw HTML is not stored.
- **Preview.** An unpublished product is absent from the public site, the catalogue, and the sitemap. The desk opens it at `/admin/preview/products/[id]`.

## Run locally

PostgreSQL 16, Node 22.

```bash
cp .env.example .env
# Set DATABASE_URL, SESSION_SECRET (32+ characters), ADMIN_EMAIL, ADMIN_PASSWORD

npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

The site is at http://127.0.0.1:3847. The desk is at http://127.0.0.1:3847/admin/login.

`npm run db:seed` creates the company, the five products, and the three pages only when the site row is missing. It creates the admin user only when `ADMIN_EMAIL` does not exist yet. It does not overwrite later edits.

## Docker

The image does not prerender during `docker build`. On first start it migrates, seeds, then builds the public pages from the database and serves them with `next start` on port 3847.

Set `POSTGRES_PASSWORD`, `SESSION_SECRET`, and the admin pair in the environment, then:

```bash
docker compose up --build
```

A later restart keeps the built pages. Saving in the desk republishes the pages that changed. Slug changes are stored as permanent redirects (HTTP 308).

## What the desk edits

- Company name, caption, introduction, and contact details
- Home, products, and contact pages: heading, body, title, description, canonical path
- Products, features, sort order, published state, online copy, on-premises copy
- Enquiries, including deletion and a purge of anything older than the retention period (24 months unless you change it)
- A record of who changed what

Login is email and password. Passwords are hashed. Sessions live in the database. The session cookie is `Secure` when `COOKIE_SECURE=true` or the proxy sends `X-Forwarded-Proto: https`. Login and the contact form are rate limited. The contact form has a honeypot; Turnstile is used when both Turnstile keys are set. Enquiry mail is sent when SMTP is configured. The enquiry is saved either way.

`/admin` is marked `noindex` and left out of `sitemap.xml` and `robots.txt`.

## SEO

Public pages are prerendered. Saving in the desk republishes the pages that changed. Titles and descriptions come from the page and product records. The home page emits `Organization` structured data. Each product page emits `SoftwareApplication`. The sitemap lists published products only.
