# Integration checklist

## Identity and authorization

Current: `components/shell.tsx` links directly to seven role workspaces. `components/portal.tsx` hides modules by a hardcoded presentation matrix. Users may open any demo role. Permission checkboxes are a saved preview only.

Replace role selection with institution-approved Google Workspace SSO. Validate issuer, audience, verified email, and the actual `iiitl.ac.in` domain server-side; a hosted-domain hint alone is insufficient. Use an approved staff roster and student identity mapping. Do not grant staff roles solely from an email name pattern. Use secure server sessions, logout, expiration, session invalidation after role changes, and server-side authorization on every read and mutation.

Implement the specification's User, Role, Permission, UserRole, RolePermission, and AuditLog models. Scope students to their own records and faculty to assigned offerings. Add department approvers for library, hostel, mess, sports, and academic sections. Institute Admin must not gain finance write access or grade publishing from presentation controls. Dynamic custom roles must actually alter authorization after backend integration; the current checkboxes intentionally do not.

## Data and API boundary

Current persistence: `components/provider.tsx`, localStorage key `iiitl-demo-v1`. Sample data and calculations: `lib/demo.ts`. Treat all browser values as untrusted. Do not migrate sample records into production.

Introduce typed service functions and server actions/route handlers backed by PostgreSQL + Prisma. Use transactions, schema validation, database constraints, optimistic versioning, pagination, and error responses. Suggested contracts:

| Operation                 | Input                                | Output / invariant                            |
| ------------------------- | ------------------------------------ | --------------------------------------------- |
| Read session              | Secure session                       | User, scoped roles, permissions               |
| List programs / offerings | Program, batch, semester             | Approved versioned curriculum                 |
| Generate marks workbook   | Assigned offering ID                 | Signed roster/version and protected XLSX      |
| Import marks              | Offering ID + workbook               | Row validation report; no partial publish     |
| Submit for moderation     | Draft version                        | Submitted state, immutable audit event        |
| Return / approve grades   | Submission ID, review note           | Authorized state transition                   |
| Publish results           | Approved submission version          | Transactional publication + outbox jobs       |
| Reconcile fees            | Verified bank import / transaction   | Idempotent ledger entries and receipt         |
| Request clearance         | Student, reason, verified bank token | Ordered departmental workflow                 |
| Approve department        | Request + scoped department          | Prior approvals and relevant balances checked |
| Save CMS / tender         | Validated content and version        | Draft/review/publish and stable public URL    |
| Submit service request    | Type, data, attachment references    | Persisted ticket with authorized tracking     |

## Academic records and examinations

The demo workbook has three students and quiz/midsem/endsem fields (20/30/50). The file import validates count, roll order, bounds, and finite numbers. It is not a tamper-proof institutional template. Add signed metadata/checksums, locked identity cells, configurable assessment components including lab and attendance, XLSX limits, scanning, and complete row-level error reporting. Never trust formula cells or browser-computed totals.

Confirm the institute's grade boundaries, relative grading procedure, pass rules, attendance rules, repeat courses, and GPA precision with Exam Cell. The current absolute grade scale is illustrative. SGPA is credit-weighted; the student CGPA preview includes an explicitly labelled synthetic prior 40-credit record. Replace these with actual, approved historical results.

Use a transaction-backed state machine (draft → submitted → returned/approved → published), concurrency protection, review history, and policy for correcting published results. Publication must atomically persist results and enqueue PDF/email jobs. Use Redis/BullMQ with retry/backoff and idempotency. Store student documents privately; add signed URLs and retention rules.

Current PDF actions use the browser print dialog and are labelled demonstrations. Replace with official branded PDF generation, approved signatures, QR verification, transcript identifiers, and accessibility tagging. Printing a demo is not issuing a credential.

## Finance and refunds

Current ledger contains four sample categories for one student. Pending and partial amounts are treated as entirely outstanding; production must store charges, payments, allocations, reversals, adjustments, fines, and partial balances as exact decimal/currency values.

Integrate authorized payment providers or verified bank scroll uploads. Validate unique transaction references, prevent duplicate reconciliation, provide reconciliation preview/error rows, and never accept a client-side 'paid' flag as proof. Add scholarships, amenity/exam fees, hostel deposits, mess adjustments, and policy versions.

No payment is initiated in the preview. Demo receipts are plain text; real receipts need immutable transaction IDs, numbering, official PDFs, accounting entries, and access control.

The no-dues demo enforces ordered stages and a zero fee balance for final approval. Production must verify each department's source records and authorized approver. Model holds, corrections, revocation, disputes, re-approval, notifications, and a complete audit trail. Bank details must be validated and handled securely. The sample ₹10,000 refund is only a preview: calculate actual deposit less approved deductions, require finance controls, execute NEFT through an approved process, reconcile settlement, and issue the certificate separately from refund status.

## CMS, files, and tenders

Current homepage, notices, and tenders are browser-local. Store drafts and published revisions server-side, with approvals, attribution, safe rendering, preview, and cache revalidation. Add program CRUD, multi-semester mappings, subject credit editing, and approval workflows. The syllabus editor currently saves an isolated draft, deliberately separate from the public sample curriculum.

Media uploads use size-limited data URLs in localStorage. Replace with direct signed object-store uploads, file type/size validation, malware scans, image processing, alt text, responsive variants, retention, and deletion. Small image reordering is demonstrated; implement accessible drag/drop or move controls against stored gallery IDs.

The brochure picker stores a filename only. Implement actual PDF upload, persistent document IDs, stable download redirects, document versions, approval metadata, and CDN cache policy.

Tenders need approved reference uniqueness, bid dates with timezone, closing validation, computed lifecycle states, technical opening dates, attachments (NIT, BOQ, corrigenda), GeM references, publication audit, and archive rules. Current examples and text downloads are clearly labelled demo records.

## Search

Current global search covers curated destinations and programs; directory search covers imported page titles. No AI or LLM integration is present in the frontend, and none is planned — an earlier "Ask IIITL" chatbot and its planned OpenRouter integration have been removed by decision. Keep it that way: search stays deterministic and index-backed (server-side full-text over published content, with role-aware filtering for staff/student areas, faceted filters, and cited result snippets). Any future retrieval-augmented answering must be a separately approved, server-only feature with budgets, rate limits, timeouts/fallbacks, citations, and strict rules that a generated answer is never an official decision.

## Public content, bilingual support, and accessibility

Complete institutional sign-off on all source snapshots. See CONTENT_AND_PARITY.md. Replace sample calendar, courses, tender records, dates, statistics, and contacts. NIRF content intentionally awaits approved submissions; do not invent ranking or compliance documents.

The Hindi button currently switches branding only. Implement complete reviewed Hindi content, route/locale strategy, language tags, translated controls, and persistence. Accessibility controls currently offer high contrast and text size; motion follows the OS preference. Complete keyboard, screen reader, zoom/reflow, accessible document, contrast, and manual WCAG 2.1 AA audits before claiming conformance.

## Brand and design tokens

The specification asks for orange to be removed entirely from the palette. The
current frontend introduces saffron `#de6c1a` as a small accent because the
brief asked for hints of it and the colour is present in the institute's own
emblem (`assets/logos/iiitl_main_logo.png`, which also supplies the green
`#007a16`). Both are used only as hairlines, pills, short rules, and text
accents; blue remains the dominant surface colour.

Before launch, confirm with the institute's brand owner whether saffron is
approved. If it is not, delete the `--saffron*` and `--saffron-pale` tokens and
the selectors that reference them (tricolour hairlines on `.utility` and
`footer`, `.eyebrow::before`, `.little-line`, `.stats-grid strong:after`,
`.stats-grid > div::before`, `.stat-card::before`, `.hero-eyebrow` motto words,
`.news-card:hover .news-category`, and the footer/banner saffron washes) and
fall back to the green-only or blue-only treatment. Keep the token names in one
place so this is a single edit.

The header and portal use the full-colour crest lockup on a white plate rather
than a white knockout, because the emblem's green circuitry and saffron arch
are lost when the artwork is forced to white. If a single-colour white crest is
ever required, commission or export one rather than applying a CSS filter.

## Deployment and operations

Next.js standalone output is available with `NEXT_STANDALONE=1 npm run build`; the default build supports `npm start`. No live deployment was attempted. Add a reviewed multi-stage Docker build and production Cloud Build pipeline. Include real tests, dependency scanning, artifact registry, secret manager references, staging, migration jobs, rollout/rollback, and health checks. Do not copy the specification's example secret placeholder as a literal database password or expose secrets through build arguments.

For standalone deployments copy `.next/static`, `public`, and the source `assets` directory (or materialize `public/assets`) alongside the server. `public/assets` is currently a relative symlink. Configure the deployment platform to resolve it or replace it during packaging.

Provision Cloud SQL, backups and restore tests, Redis workers, object storage, mail delivery, monitoring, alerting, logs, and incident ownership. Configure Cloudflare DNS/CDN/WAF with private dashboards excluded from shared caching. Add CSP and security headers tested with the app. Use TLS, rate limits, input validation, CSRF protections where appropriate, and least-privilege service accounts.

Map every old URL to its approved canonical route; validate attachment URLs, remove legacy IP links, repair subdomains, and preserve SEO through redirects, sitemap, robots, social cards, and canonical metadata. The current route dispatcher provides source pages at `/legacy/[slug]`; it is not a complete legacy URL redirect deployment.

Before launch: disable all demo login and local-state fallback paths, remove sample records, validate permissions independently of the UI, approve content, test backup restoration, and rehearse rollback.

## Third-party components (21st.dev)

The campus depth stage is built on two components adapted from 21st.dev
sources: **parallax-scrolling** (GSAP ScrollTrigger scrub over four layers) and
**vapour-text-effect** (canvas particle text with a sweeping dispersal front).
Both live in `components/` as `parallax-layers.tsx` and `vapour-text.tsx`.

Attribution and licence: these were obtained from 21st.dev's community registry,
where components are published by individual contributors under their own terms.
**Confirm the licence and attribution requirements for both before launch**, and
record the contributor handles. The parallax source credits "Osmo"
(osmo.supply) in its own demo wrapper.

One runtime dependency was added: `gsap` (ScrollTrigger ships inside it). The
upstream parallax imports Lenis for smooth scrolling; that was deliberately not
adopted, because it takes over document-level scrolling and conflicts with the
sticky header and Next navigation.

If either component is replaced in future, the things worth preserving are: the
scroll value must be a pure function of position so scrubbing backwards is
reversible, particle randomness must be seeded rather than `Math.random()`, and
GSAP timelines must be scoped with `gsap.context()` / `ctx.revert()` rather than
`ScrollTrigger.getAll().forEach(kill)`, which would destroy unrelated triggers
elsewhere on the page.

Other components worth reusing later, not yet adopted: Magic UI's
`number-ticker`, `animated-list`, `border-beam`, and `bento-grid`, and the
`elastic-gallery` horizontal accordion. Several 21st.dev components declare
`framer-motion`/`motion`, which this project does not install. Magic UI is an
independent community library by Dillion Verma, unrelated to the older
"Magic MCP"/"Magic Chat" products now named 21st MCP and 21st AI.

21st.dev was surveyed as a source of ready-made components (registry of
community React/Tailwind components, copied in per-component via the shadcn
CLI rather than installed as a library). Several patterns there are worth
reusing later, notably Magic UI's `number-ticker`, `animated-list`,
`border-beam`, and `bento-grid`, and the `elastic-gallery` horizontal accordion
for the media gallery. Before adopting any of them, note that several declare
`framer-motion`/`motion` as a dependency, which this project does not currently
install, and that Magic UI is an independent community library by Dillion Verma
— unrelated to the older "Magic MCP"/"Magic Chat" products now named 21st MCP
and 21st AI.
