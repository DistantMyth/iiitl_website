# Page artwork

Illustrations used as the lead image on migrated legacy pages. They replace a
single generic animated "NEW" starburst (`new-badge.svg`, from
`new-icon-animation.gif` on the original site) that the scrape had attached to
all 16 of those pages, which conveyed nothing about any individual page.

All artwork is CC0 / public domain, so it can be redistributed with the site.

| File | Subject | Source | Licence |
| --- | --- | --- | --- |
| `cap.svg` | Graduation cap | [Graduate Cap (1051) — The Noun Project](https://commons.wikimedia.org/wiki/File:Graduate_Cap_(1051)_-_The_Noun_Project.svg) | CC0 |
| `case1.svg` | Briefcase | [Briefcase (728234) — The Noun Project](https://commons.wikimedia.org/wiki/File:Briefcase_(728234)_-_The_Noun_Project.svg) | CC0 |
| `gov.svg` | Government building | [Government Building icon](https://commons.wikimedia.org/wiki/File:Government_Building_icon.svg) | CC0 |
| `micro.svg` | Microscope | [Microscope — The Noun Project](https://commons.wikimedia.org/wiki/File:Microscope_-_The_Noun_Project.svg) | CC0 |
| `idea.svg` | Lightbulb | [Idea (89401) — The Noun Project](https://commons.wikimedia.org/wiki/File:Idea_(89401)_-_The_Noun_Project.svg) | CC0 |
| `analytics.svg` | Analytics on a device | [Analytics (1510698) — The Noun Project](https://commons.wikimedia.org/wiki/File:Analytics_(1510698)_-_The_Noun_Project.svg) | CC0 |
| `scientist.svg` | Scientist at a microscope | [Scientist — The Noun Project](https://commons.wikimedia.org/wiki/File:Scientist_-_The_Noun_Project.svg) | CC0 |
| `notebook.svg` | Notebook | [Notebook (169670) — The Noun Project](https://commons.wikimedia.org/wiki/File:Notebook_(169670)_-_The_Noun_Project.svg) | CC0 |
| `pencil.svg` | Pencil | [Pencil — The Noun Project](https://commons.wikimedia.org/wiki/File:Pencil_-_The_Noun_Project.svg) | CC0 |
| `award.svg` | Award ribbon | [Award (89037) — The Noun Project](https://commons.wikimedia.org/wiki/File:Award_(89037)_-_The_Noun_Project.svg) | CC0 |
| `chart.svg` | Bar chart | [Chart — The Noun Project](https://commons.wikimedia.org/wiki/File:Chart_-_The_Noun_Project.svg) | CC0 |
| `rti-logo.gif` | Right to Information mark | `https://rtionline.gov.in/images/logo/rti-logo.gif` — the national RTI portal run by the Ministry of Personnel, Public Grievances and Pensions, Government of India | Government of India |

The Government of India RTI mark is retained in its official colours and is not
recoloured. The CC0 marks use `fill="currentColor"` so the page can tint them
with the brand blue.

Which page gets which file is mapped in `lib/page-art.ts`. The inline SVG
bodies in `lib/page-art-svg.ts` are generated from these files by
`scripts/build-page-art.mjs`; edit the SVGs here, not the generated module.
