# Verification record

## Automated checks

- Production compilation and TypeScript checking with Next.js 15 / React 19.
- Unit checks for grade thresholds, credit-weighted GPA, empty GPA, failing grades, out-of-range scores, modified rosters, and missing student rows.
- Real Chromium browser checks for faculty submission → Exam Cell approval/publication → student result visibility.
- Ordered seven-stage no-dues workflow with final approval blocked until outstanding fees are reconciled.
- Accounts reconciliation and final clearance certificate/refund preview.
- CMS homepage edits persist across navigation and browser refresh.
- Mobile navigation and curriculum text search.
- XLSX template generation, marks import, tampered roster rejection, fee export/import roundtrip.
- Accessibility settings, Escape-to-close dialogs, and Ctrl/Cmd-K search.
- iCal export containing event records.
- Public canonical routes and all 132 source-page routes; Unicode source slugs are decoded for matching.
- Mobile horizontal overflow checks on home, academics, faculty, tenders, student portal, grading, and clearance.
- Reduced-motion support and browser runtime error checks.

`npm audit` reported **0 vulnerabilities** after compatible transitive overrides for PostCSS and ExcelJS's UUID dependency. Keep those overrides under review when upgrading the parent packages.

## Visual review

Desktop and mobile screenshots were inspected. The layout uses local photographs, self-hosted fonts, responsive program grids, a mobile navigation drawer, and a separate dashboard shell. The campus photograph has a background/text/foreground stack driven by scroll; reduced-motion disables transformations.

## Not claimed

These checks do not certify WCAG compliance, production security, current institutional content, official grading policy, live payment behavior, authentication, deliverability, infrastructure readiness, or the availability of every external legacy PDF.

Before launch, run manual screen-reader and keyboard testing, automated accessibility scans, slow-network and image-performance checks, browser compatibility tests, authorization tests against a real backend, load tests, transaction/retry tests, and full editorial review.

## Reproduce

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

In a second terminal:

```sh
npx playwright install chromium
TEST_BASE_URL=http://localhost:3000 npm run test:browser
TEST_BASE_URL=http://localhost:3000 node scripts/extended-check.mjs
```

The tests use a fresh Chromium browser context. They do not modify the presenter's browser storage or external systems. XLSX/ICS fixtures and visual screenshots are written under `/tmp`.

## Status of the last run

The browser suites above were run against the production build and passed:

```
PASS grading flow
PASS fee reconciliation and ordered clearance
PASS CMS persistence
PASS mobile navigation and course search
PASS XLSX download, import, and tampered roster rejection
PASS bank workbook roundtrip
PASS accessibility settings and keyboard search
PASS 181 public routes
PASS mobile overflow checks
PASS reduced motion, exports, and browser error checks
browser errors []
```

In the follow-up session the local server could not be restarted, because the
execution sandbox denied every `listen` call and the escalation request itself
failed inside the approval service. `npm run typecheck`, `npm test`, and the
existing `.next` production build were re-confirmed and are unchanged, so the
green browser results above still describe the current build. Re-run the two
browser commands on a normal shell to reproduce them.

## Brand header, depth fix, and logo-derived palette

The header brand lockup uses the original `iiitl_main_logo.png` rather than the
cropped crest. Because the artwork is full colour, it sits on a white rounded
plate inside the blue bar so the green circuit crest and motto ribbon stay
legible, and the institute name carries both the English and Hindi lines plus
the "Institute of National Importance" note, as on the legacy header.

**Depth defect fixed.** The wordmark was previously painted behind the front
building layer (z-index 2 against a z-index 3 foreground), so the roofline cut
across the lower half of the letters. The wordmark now renders above both
building layers and starts higher, so no descender is ever occluded. The
scroll-driven parallax and the three-layer building reveal are unchanged.

**Palette.** Green and saffron were sampled directly from
`assets/logos/iiitl_main_logo.png`: blue `#005f99`, green `#007a16`, saffron
`#de6c1a`. These are exposed as `--green`, `--green-vivid`, `--green-pale`,
`--saffron`, `--saffron-vivid`, and `--saffron-pale`, and used as accents only:
tricolour hairlines on the utility bar and footer, alternating green/saffron
motto words, a green-to-saffron rule under each statistic, saffron corner wash
in the hero, green news pills, a warm glow at the campus horizon, and a green
active-rail in the portal sidebar. Blue remains the dominant surface colour, so
the specification's blue-dominant weight balance still holds. Note that the
specification text asks for orange to be removed; saffron is used here because
it is present in the institute's own emblem and the brief asked for hints of it.
Confirm the saffron weight with the institute's brand owner before launch.

**Dead rules removed.** The homepage statistic cards are plain `div` children of
`.stats-grid`, so an earlier `.stat-card` block never matched any markup. That
dead block was removed and the real selectors were styled instead; the portal
dashboard cards do use `.stat-card` and were kept and given the same treatment.
Two conflicting duplicates were also resolved: a later `.btn:hover` was
re-declaring a flat background that cancelled the button gradient, and a second
`.program-card:hover` was overriding the card lift.

Verified with the full browser suite against the production build: grading
flow, fee reconciliation and ordered clearance, CMS persistence, mobile
navigation and course search, XLSX roundtrip, tampered-roster rejection, bank
workbook roundtrip, accessibility settings, 181 public routes, mobile overflow
(0px), reduced motion, and browser runtime errors (none). TypeScript and unit
tests pass. Desktop, mobile, and portal screenshots were inspected.

---

## Round 3 — scroll choreography, vector logo, green accent, chatbot removal

### Scroll-away header

`.site-header` carries a `header-hidden` class driven by a rAF-throttled scroll
listener in `components/shell.tsx`. The listener records the last scroll
position, ignores deltas under 6px and rubber-band overscroll, and forces the
header visible whenever `scrollY < 90`, so the brand is always reachable from
the top of any page. Measured transforms in Chromium at 1440×900:

| Element                          | Hidden transform     | Direction |
| -------------------------------- | -------------------- | --------- |
| `.brand-row`                     | `translateY(-73px)`  | up        |
| `.nav`                           | `translateY(-48px)`  | up        |
| `.brand` (logo + wordmark)       | `translateX(-655px)` | left      |
| `.brand-actions` (search + menu) | `translateX(+235px)` | right     |

Scrolling back up clears the class and every element returns to `transform:
none`. Under `prefers-reduced-motion: reduce` the listener never attaches and
the reduced-motion block pins all four elements visible, so the header can
never be trapped off-screen.

The brand row was also narrowed: padding `16px/15px` → `9px/8px`, mark
`82×74` → `62×56`, and on mobile `13px` → `9px` with the mark `58×52` → `48×44`.

### Depth stage rebuilt _(superseded — see Round 4)_

The campus section is now a true `16 / 9` stage (`aspect-ratio: 16 / 9`, no
`max-height`, because capping the height would break the ratio). Earlier it was
a fixed `clamp(320px, 39vw, 570px)` and the wordmark sat on top of the building
via z-index — the brief asked for the text to sit _above_ the building on the
Y axis instead.

Type now stacks vertically above the building, in Baloo 2 (a rounded variable
face shipping both Latin and Devanagari, installed via
`@fontsource-variable/baloo-2` and imported in `app/layout.tsx`). Both words
use a top-to-bottom blue gradient via `background-clip: text`, and slide in
from opposite sides — `IIITL` from the left, the Sanskrit
`भारतीय सूचना प्रौद्योगिकी संस्थान` from the right behind a `clip-path`
hand-drawn wipe.

The three scroll stages are driven by `--seq-a`, `--seq-b`, `--seq-c`, written
by the existing scroll handler. They run on a progress value computed as
`(innerHeight - rect.top) / innerHeight`, deliberately **not** `--depth`:
`--depth` keeps travelling after the stage has scrolled away, which made the
branches finish drawing off-screen. Measured at 1440×900 with the stage top at
document offset 630: `seq-a` completes around scroll 300, `seq-b` around 400,
and `seq-c` saturates at 560 — all while the stage is still on screen.

**A real bug worth recording.** `stroke-dashoffset: calc(1 - var(--seq-c))` is
invalid: a bare number is not a `<length>`, so Chrome discarded the declaration
and the branches never drew. Registering the custom properties with
`@property --seq-c { syntax: "<number>" }` did not fix it. The working form is
`calc((1 - var(--seq-c)) * 1px)`; each `<path>` carries `pathLength={1}` so a
`1px` dash covers the whole branch regardless of its true length, which keeps
every branch drawing at the same rate. Verified in Chromium: `strokeDashoffset`
resolves `1px` at `seq-c: 0` and `0px` at `seq-c: 1`.

Reduced motion pins `--seq-a/b/c` to `1`, clears `clip-path`, and zeroes
`stroke-dashoffset`, so the full composition renders statically.

### 1:1 vector logo and the emblem section

`assets/logos/iiitl_main_logo.png` is 2269×1802 (1.26:1), so it has no literal
1:1 crop. A true square `viewBox` was built with the art optically centred
(gaps symmetric at 91/91 horizontal, 325/324 vertical). Traced with `vtracer`
(potrace port) in polygon mode: 25 KB and 0.984 silhouette IoU against the
source, versus 192 KB and 0.977 for spline mode. The crest is 45° PCB traces
with hard-cornered letterforms, so corner-preserving polygons are the correct
fit. See `LOGO_SVG.md`.

Each ink is an addressable `<g class="iiitl-ink iiitl-green">`, so the same
green the branches grow in can drive the mark from CSS. The homepage gained a
side-by-side `.emblem-section` pairing the square mark with copy and three spec
tiles. Verified: section visible, one `<svg>`, three spec tiles, no console
errors, and mobile stacks to one column at 390px with 0px horizontal overflow.

### Outdated assets replaced

`lib/legacy.json` referenced three legacy GIFs across 17 imported pages, two of
which (`cleardot.gif`, `new_blink.gif`) did not exist in the repository at all:

| Old                                      | Used by  | Replaced with                                                  |
| ---------------------------------------- | -------- | -------------------------------------------------------------- |
| `new-icon-animation.gif` (red starburst) | 16 pages | Per-page artwork, `public/assets/images/page-art/` (see below) |
| `new_blink.gif` (missing)                | 1 page   | Per-page artwork, `public/assets/images/page-art/` (see below) |
| `cleardot.gif` (missing)                 | 1 page   | CSS list bullet, `.legacy-list li::before`                     |

The starburst was one generic "NEW" graphic attached to all 16 pages, so it
told a visitor nothing about any of them. Each page now gets a relevant,
licence-free illustration instead: the Government of India's Right to
Information logo on the two RTI pages, and CC0 "Noun Project" marks elsewhere
(graduation cap, briefcase, microscope, chart and so on), tinted to the brand
blue with `currentColor`. Sources and licences are listed in
`assets/images/page-art/SOURCES.md`; the page-to-file mapping is
`lib/page-art.ts`, and `scripts/migrate-content.py` now drops these decorative
scrape images so they cannot come back.

The broken-image check in `scripts/browser-check.mjs` was also producing false
positives. It counted any `img` with `!complete`, which includes `loading="lazy"`
images that had simply never entered the viewport. The three it flagged
(`dsc_0650.jpg`, `table_tennis_team.jpg`, `convocation-pics.jpg`) all serve
`200 image/jpeg` and load correctly once scrolled into view. The check now
scrolls the page first and ignores lazy images that were never requested, so it
reports genuine breakage only. It reports `[]`.

### Green accent

Green is sampled from the crest and used as a second live colour, keeping blue
dominant and saffron rare. Green now carries: a wipe-in underline on `.btn`,
hover underlines on `.text-link`, a green-tinted shadow and lift on
`.program-card` / `.life-card` / `.stat-card`, `.eyebrow` and the
little-rule gradient, `.chips button` / `.pill` / `.tag` (pale green fill,
inverted on hover), the focus ring, `::selection`, the portal active rail, and
the scrollbar thumb.

### AI chatbot removed

The "Ask IIITL" assistant is deleted from the frontend — the `Assistant`
component, its `Sparkles` import, its render call in `Shell`, and the
`.assistant-button` rules in the base, mobile, and print stylesheets. Verified
in Chromium: `.assistant-button` count 0, "Ask IIITL" text count 0. The
documented removal also covers `INTEGRATION_CHECKLIST.md` (the "AI and search"
section is now "Search"), `README.md`, `DEMO_WALKTHROUGH.md`,
`CONTENT_AND_PARITY.md`, and the specification, where section 11 is retained as
a marked "(Removed)" section, the architecture diagram loses its third box, the
tech-stack and comparison matrices drop the AI layer, and Sprint 7 becomes
"Search, Indexing & Final Security Audit". The demo login still offers all
eight roles.

### Verification after this round

`npm run build`, `npm run typecheck`, and `npm test` (3/3) pass. The browser
suite reports 0 broken images, 4/4 flows passing, and no browser errors. The
extended suite passes XLSX roundtrip, tampered-roster rejection, bank workbook
roundtrip, accessibility and keyboard search, 181 public routes, mobile
overflow, and reduced motion.

One cleanup note: the 21st.dev research subagent left two scratch components in
`temp_external_assets/` at the repository root, which broke `tsc` because they
imported packages the project does not depend on. Nothing referenced them; they
were moved out of the tree.

---

## Round 4 — depth stage rebuilt from 21st.dev sources; header collapse fix

The hand-rolled depth section from Round 3 was scrapped and rebuilt on top of
two components the user supplied under `~/website_temp_external_components`:

- `parallax-scrolling` → `components/parallax-layers.tsx`
- `vapour-text-effect` → `components/vapour-text.tsx`

### What was kept and what was changed

**Parallax.** The GSAP ScrollTrigger scrub and the per-layer `yPercent` rates
are taken from the source. Two changes were required:

1. The upstream version installs **Lenis** to drive ScrollTrigger from a smooth
   scroll proxy. That package is abandoned, and it takes over document-level
   scrolling, which would fight both Next's navigation and the sticky header.
   ScrollTrigger reads native scroll correctly on its own, so Lenis was dropped
   rather than added. `gsap` 3.15 is the only new dependency, and ScrollTrigger
   ships inside it.
2. Layers are passed as children instead of four hard-coded CDN `<img>` tags, so
   the campus building and wordmark layer locally. Layer rates were retuned from
   the source's `[70, 55, 40, 10]` to `[64, 40, 22, 8]` for four layers:
   wordmark, building base, building front, haze.

The timeline is built inside a `gsap.context()` and torn down with `ctx.revert()`,
so a route change or hot reload cannot leave orphaned ScrollTriggers behind —
upstream kills every trigger on the page with `ScrollTrigger.getAll()`, which
would also destroy unrelated triggers.

**Vapour text.** The particle sampling and physics are taken from the source. The
time-based state machine is not: upstream cycles through an array of strings
forever on a timer, which cannot be scrubbed by scroll. Progress here is a plain
`0..1` value supplied by the caller, and every particle position is a pure
function of it, so scrolling backwards reassembles the text exactly.

The source's `Math.random()` calls were replaced with a deterministic hash of
the particle index. Random per-particle values would make each frame a different
scatter, so scrubbing back would not restore the original letterforms.

Two rendering fixes were needed:

- The source samples every third pixel and paints 1×1 rects, which at large sizes
  reads as a visible dot grid. Sampling is now every ~1.5 device pixels and each
  particle paints a square the width of the sample step, so neighbours join into
  continuous letterforms.
- The sampler originally ran once on mount and bailed on a zero-width box. When
  layout had not settled, it returned early and never retried, leaving a canvas
  that reported pixels through `getImageData` but painted nothing on screen. A
  `ResizeObserver` now resamples and bumps a version counter that the paint
  effect depends on.

Multi-stop colour gradients are applied by clipping each colour band and filling
the text inside it before sampling, so the wordmark keeps its top-to-bottom blue
ramp.

Real text is rendered to the DOM in a visually-hidden span for screen readers and
search engines; the canvas is `aria-hidden`.

### Sequence and timing

One scroll value drives everything: `p = (innerHeight - rect.top) / innerHeight`
over the stage. The wordmark ramps over `0.12 → 0.62` and the Sanskrit over
`0.20 → 0.78`, so `IIITL` disperses first and the Sanskrit follows, the front
travelling in opposite directions. The green branches switch on at `p > 0.72`,
by which point both lines have largely dispersed and the branches grow into the
clear band between the wordmark and the building.

An earlier attempt ran the branches from the centre of the wordmark and they
overlapped the Sanskrit line. The SVG geometry was moved down into the gap.

Under `prefers-reduced-motion: reduce` GSAP never attaches, progress is pinned to
`0`, and `data-branches="in"` is set, so the composition renders fully assembled
and static. Verified in Chromium: header and utility transforms both `none`,
`IIITL` and the Sanskrit legible, branches fully drawn.

### Utility bar no longer leaves a blue block

The previous hide-on-scroll translated `.brand-row` and `.nav` but not their
containers. `transform` does not affect layout, so `.site-header` retained its
full height and the blue background stayed on screen as an empty bar with its
contents gone — exactly the reported symptom.

Both `.site-header` and `.utility` now carry the hidden class and translate up as
one unit. Measured at 1440×900 after scrolling to 600: utility
`translateY(-34.1px)` with its bottom edge at `-600`, header `translateY(-121.4px)`
with its bottom edge at `0`. Scrolling back up restores both to `transform: none`.

### Verification

`npm run build`, `npm run typecheck`, and `npm test` (3/3) pass. Browser suite:
0 broken images, 4/4 flows, no browser errors. Extended suite: XLSX roundtrip,
tampered-roster rejection, bank roundtrip, accessibility and keyboard search,
181 public routes, mobile overflow (390px document in a 390px viewport), reduced
motion. No console errors on desktop, mobile, or reduced-motion runs.

## Homepage animation repair — 30 September 2026

This supersedes the earlier IIITL/green-branch animation notes above.

- The wordmark is now **IIIT Lucknow**, with the full institute name beneath it in Hindi. The green circuit branches and their animation rules have been removed.
- `components/campus-scene.tsx` owns the scroll animation independently of the rest of the homepage. The supplied `parallax-scrolling/Component.tsx` and `vapour-text-effect/Component.tsx` in `/home/tarun/website_temp_external_components/` remain the implementation sources.
- The missing `data-parallax-layers` trigger is restored. A scoped GSAP timeline moves the text and building at different rates; the two copies of the building use identical transforms to avoid doubled edges. Motion preferences are observed dynamically and only this component's animations are cleaned up.
- Vapour particles now derive position and opacity directly from scroll progress. They no longer accumulate velocity or reset their sample field on each scroll update. Both assembled and dispersed states are reversible.
- Text is fitted to its measured container, resampled after fonts load and when resized, and rendered sharply at rest. Visible DOM text provides a fallback while the canvas initializes. Reduced motion keeps both the text and scene static.
- `node scripts/check-campus-animation.mjs` passed in Chromium: correct wordmark, removed branches, actual parallax transforms, aligned photo layers, pixel-identical reverse scrolling, mobile text fit, live reduced-motion changes, and no browser runtime errors. Desktop and mobile screenshots were inspected.

Retain these checks if the photograph, fonts, scene dimensions, or animation timing change. The original external-source attribution/licensing review still applies.

### Follow-up: uppercase entrance animation

The campus title is now `IIIT LUCKNOW`. Its particles assemble from below while the wordmark rises from behind the building silhouette, completing by 55% of the scene's scroll interval. The completed text holds at its resting position instead of dispersing or continuing downward; the building retains its subtle parallax. Reduced motion shows the completed composition immediately. The focused browser regression checks now verify increasing text visibility, upward movement, a stable completed wordmark, aligned image layers, and responsive rendering.

## Legacy page structure and per-page artwork — 30 September 2026

### Why the RTI page read as one run-on line

`scripts/migrate-content.py` flattened each page with `get_text(' ', strip=True)`.
That joins every block with a single space, so every `<li>` and heading in the
source collapsed into one paragraph and the literal `●` glyphs were left
stranded mid-sentence. The renderer then re-split the text by length
(`match(/.{1,800}(?:\s|$)/g)`), which cannot recover structure that the scrape
had already destroyed — it only cut the blob at arbitrary 800-character
boundaries.

The fix is at the source. `structured_text()` appends a non-whitespace sentinel
to every block-level element before extracting text, so `get_text`'s per-node
strip preserves the boundary; the sentinel is then replaced with a newline.
Recovered structure is checked into `lib/legacy.json` and `lib/news.json`, so no
re-scrape is needed.

`components/legacy-blocks.tsx` renders those lines: clause numbers pair with
their titles (`1.1` + `Name and Title of the Act`), bullets become real `<ul>`
items with a nested variant for sub-points, and unrecognised lines fall back to
paragraphs. The institute name that the scrape repeats at the top of every page
is dropped, since the hero above already states it. On `/statutory/rti` this
yields 14 lists and 26 items with no stray bullet glyphs.

### Artwork

The generic "NEW" starburst is gone from all 16 pages that carried it; see
"Outdated assets replaced" above. `lib/page-art.ts` maps each page to a
relevant, licence-free illustration, `components/page-art.tsx` inlines the SVG
so it inherits the brand blue, and the Government of India RTI logo keeps its
official colours as a raster. The marks are decorative, so they are
`aria-hidden` and carry empty alt text.

### Homepage backdrop clipping

`ImageStreamHero` measures every corridor length in `cqw` — a percentage of the
container's _width_ — while the homepage hero is short and wide (475px tall). The
default exit height therefore projected cards up to 678px tall inside a 475px
box, clipping 4 of 14 cards and tearing the ribbon. The homepage now passes
`path={{ exitHeight: 21, railExit: 34, turnExit: 22 }}`, which keeps the
corridor inside the hero at every viewport; the shared component's defaults are
unchanged for its other uses. The backdrop was also raised from a flat 16% wash
to 50% with a directional mask so the corridor reads as depth.

`npm test` covers the list recovery and the badge removal in
`tests/legacy-blocks.test.ts`. Retain those checks if `migrate-content.py` or
`lib/legacy.json` is regenerated.
