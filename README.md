# IIIT Lucknow — website & campus portal

A demonstrable frontend based on `agents/Docs/IIITL_WEBSITE_REBUILD_SPECIFICATION.md`.

## Run locally

Requires Node.js 20.9+ and npm. Node 22 LTS is recommended for deployment.

```sh
npm ci
npm run dev
```

Open the URL printed by Next.js (normally http://localhost:3000). No credentials, API keys, database, or backend configuration is required.

```sh
npm run build
npm start
npm run typecheck
npm test
```

For future container packaging, `NEXT_STANDALONE=1 npm run build` enables standalone output; see the handoff deployment checklist for asset-copy requirements.

The public pages use Next.js App Router, TypeScript, React, Tailwind v4 tokens, custom responsive CSS, Radix dialogs, Lucide icons, and locally served Manrope / Newsreader fonts. ExcelJS is loaded on demand. `public/assets` links to the supplied `assets` directory; retain both in deployments.

## Explore the demonstration

Click **Portal login** to select Student, Faculty, Exam Cell, Accounts, Registrar, Institute Admin, or Super Admin. Data is stored in this browser under `iiitl-demo-v1`. No sign-in or actual permission enforcement exists.

- **Grading:** Faculty → Marks & grading → download/import workbook or edit marks → submit. Exam Cell → Result moderation → approve → publish. Student → My results → grade card / print-to-PDF.
- **Finance and clearance:** Student → No-dues clearance → initiate. Super Admin → Clearance approvals → approve the first six stages in order. Accounts → Student ledgers → reconcile outstanding fees with demo references → Clearance approvals → approve final stage. Student → clearance certificate preview.
- **Publishing:** Institute Admin → Website content → edit homepage or publish a notice → view the public website. Registrar → Tender management → add or update a tender → public Tenders page.
- **Media:** Institute Admin → Media & brochures → upload a small image with alt text → public Gallery. Brochure selection records only a filename.
- **Access:** Super Admin → Roles & permissions → preview permissions. These selections are illustrative and do not enforce access.
- **Reset:** Choose Reset demo data in a portal sidebar and confirm. This resets every role's records in this browser.

See `agents/Docs/ToChangeFinally/DEMO_WALKTHROUGH.md` for the fuller presentation script.

## Browser tests

With the development server running:

```sh
npx playwright install chromium
TEST_BASE_URL=http://localhost:3000 npm run test:browser
```

The current environment uses `PLAYWRIGHT_BROWSERS_PATH=/tmp/iiitl-browsers` and port 3001. The browser script uses an isolated browser context and sample data, and checks cross-role grading, financial clearance, CMS persistence, mobile navigation, and course filters. Screenshots are written to `/tmp/iiitl-*.png`.

## Content and architecture

- `app/`: public home, route dispatcher, metadata, 404, global styling.
- `components/`: public pages, homepage motion, shell and dialogs, portal workflows.
- `lib/catalog.ts`: programs, canonical routes, navigation, role names.
- `lib/demo.ts` / `components/provider.tsx`: typed sample records, GPA utilities, local persistence.
- `lib/legacy.json`: 132 legacy pages, recovered text, images, source links.
- `lib/news.json`: 535 notices from supplied content.
- `lib/faculty.json`: 50 faculty directory entries from supplied HTML.
- `scripts/migrate-content.py`, `scripts/extract-faculty.py`: reproducible snapshot import (Python + Beautiful Soup).
- `agents/Docs/ToChangeFinally/`: production integration requirements, content gaps, verification notes.

The imported snapshots remain historical source material, not a claim that every contact, deadline, external document, or policy is current. The frontend demonstrates new workflows with sample data and explicitly labels simulated services. Production integrations are deliberately deferred.
