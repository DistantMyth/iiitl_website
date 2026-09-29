# Content coverage and remaining editorial work

## Imported content

The supplied `data/` snapshots are the primary migration input. `scripts/migrate-content.py` extracts 132 WordPress pages into `lib/legacy.json`, plus the 535 supplied posts into `lib/news.json`. `scripts/extract-faculty.py` extracts 50 directory entries into `lib/faculty.json`. These are reproducible using Python with Beautiful Soup.

The directory at `/directory` exposes imported page titles. Each record is available at `/legacy/[slug]`. Selected specification routes map onto source records through `lib/catalog.ts`. Legacy content is rendered as text and source-document links, without executing scraped HTML or scripts. Source headings/tables are not fully reconstructed as structured semantic blocks; this remains editorial migration work. All imported text is snapshot material and needs review for currency and layout.

Faculty entries have local portraits where mappings exist, qualifications, source descriptions, email links, and internal profile pages. Full publication feeds and detailed original profiles remain external official resources. Profiles must be checked for current designations before launch.

## Public feature coverage

- Home: bilingual brand lockup, program tabs, supplied campus depth photograph, research motion graphic, campus photography, source notices, portal entry, institutional footer.
- Navigation: expandable menus, mobile menu, global destination search, directory search, keyboard-accessible dialogs.
- Academics: ten program pages, sample course explorer, semester and type filters, syllabus details, text download, print-to-PDF, calendar and iCal export, original fee resources.
- Admissions: undergraduate/postgraduate/doctoral pathways, FAQs, official counselling links, fees and contact routes.
- Governance: canonical source pages, committees, local grievance submission, RTI source resources and illustrative calculator, NIRF awaiting approved data.
- Research: source CDSAI content and designed WCARL, CREATE, and publication gateways.
- Campus: clubs and individual club pages, hostel/support/sports pages, photo gallery/lightbox, student service previews.
- People: searchable faculty directory and profiles, source staff/scholar/alumni resources.
- Opportunities: placement gateway, careers source links, filterable demo tender browser and details, imported news detail pages.
- Portal: seven presentation roles and connected local-state workflows as described in DEMO_WALKTHROUGH.md.

## Explicit limitations to replace

1. No claim of verified 100% live-content parity. The source snapshot has empty pages and old external references. Missing content is labelled instead of fabricated. NIRF publications, current laboratory rosters, leadership video, official annual reports, campus master plan, live grants, and patent portfolios need approved data.
2. All 535 supplied WordPress posts are available through the searchable news archive with incremental loading. Categories and archival retention still require editorial review.
3. Imported document links remain hosted on the original domain. Check every PDF and form, download to managed storage where permitted, index metadata, and preserve stable URLs. Confirm that all 26 official forms and versions are present; the app does not assert this from a raw link count.
4. Program descriptions are original general-purpose frontend copy. Admission dates, duration variants, fees, seat matrices, eligibility details, and PhD rules require review. Official portals remain the source of application truth.
5. The curriculum explorer uses an explicitly labelled shared illustrative course set for all selected programs/semesters. It demonstrates filters and presentation, not actual offering data. Replace it with program/batch/semester-specific records and policy-driven assessment weights.
6. Calendar entries, grading thresholds, financial records, hostel assignment, meal menus, bank references, users, requests, refund amount, and tenders are demonstrative. They must not be published as operational institute records.
7. Language switching covers branding only; brochure selection records the filename only; permission selection does not enforce access. Curriculum editing is an isolated draft preview pending approval.
8. Campus media uses supplied photos. Verify image rights, subjects, cropping, captions, and alt text. Original crest colors are rendered white in the blue header. The building foreground is a CSS polygon layer over the original image, not a newly generated or edited asset. Fine-tune the silhouette if the photo changes.
9. Contact/grievance/service forms store local sample tickets. They send nothing and provide no real institutional tracking, anonymity guarantees, or emergency service. Backend request status updates, official contact ownership, attachments, and notifications remain to implement.
10. Browser print-to-PDF is a demonstration export, not an official transcript, digitally signed certificate, or accessible institutional PDF.
11. Frontend palettes use the specified blue, light blue, gray, white, and restrained green tokens. Fonts are self-hosted Manrope and Newsreader. Reduced-motion and mobile layout are implemented; formal accessibility certification is not claimed.

## Canonical route review

The source often uses different slugs than the plan. Examples: staff maps to `officer-staff`, scholarships to `scholarships-offered`, non-teaching recruitment to `advertisement-for-non-teaching`. Canonical public routes should be authoritative after content approval; old slugs need redirect rules. External club/research sites require separate ownership and DNS review.
