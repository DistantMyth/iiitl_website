# Logo SVG: traced vector assets

`assets/logos/iiitl_main_logo.png` is a 2269 x 2039 raster. It is now also
available as traced SVG, built by `scripts/vectorize_logo.py` with
[vtracer](https://github.com/visioncortex/vtracer) (the Rust port of potrace).
The SVG is what the site should ship; the PNG stays as the archival master.

## Files

| File | Purpose | Size |
| :--- | :--- | :--- |
| `public/brand/iiitl-mark.svg` | `<symbol>` sprite, one per ink. Backing file for the React `<Logo>` component. | 32 KB |
| `public/brand/iiitl-logo.svg` | Crest only, tight crop, transparent edges. Direct `<img>` replacement. | 26 KB |
| `public/brand/iiitl-logo-square.svg` | Crest on a padded **1:1** canvas. Avatars, app tiles, favicons, `og:image`. | 26 KB |
| `public/brand/iiitl-logo-full.svg` | Crest + Devanagari wordmark lockup. Footer, splash, print. | 32 KB |

Regenerate everything:

```bash
python3 -m pip install vtracer          # one-time
python3 scripts/vectorize_logo.py --em-only --square --out public/brand/iiitl-logo-square.svg
python3 scripts/vectorize_logo.py --em-only          # -> iiitl-logo.svg
python3 scripts/vectorize_logo.py                    # -> iiitl-logo-full.svg
```

## Verified fidelity

Measured by rasterising each SVG at the source resolution and differencing
against the PNG (`scripts/vectorize_logo.py` reproduces the same masks):

| Metric | Result |
| :--- | :--- |
| Silhouette IoU vs source | **0.984** |
| Mean RGB delta | **0.02** |
| Pixels within dE < 12 | **99.98%** |
| Error > 3 px from a source edge | **0 px** |

Every remaining difference is anti-aliasing within 1-2 px of an edge. Geometry
and colour are exact.

## Why polygon mode, not splines

The logo is drawn as 45-degree PCB traces and hard-cornered letterforms, so
corner-preserving polygons are both smaller *and* more accurate:

| Mode | Size | IoU |
| :--- | --- | --- |
| `polygon` (default) | 25 KB | 0.984 |
| `spline` | 192 KB | 0.977 |

Use `--mode spline` only for artistic treatments that want smooth curves. The
dome arc and the circular trace terminals are the only genuinely curved parts;
`polygon` renders them with short facets that are invisible below ~40 px.

## Recolouring and animation

Every ink is a separate addressable group, so CSS can recolour or animate the
mark without touching the path data:

```html
<svg><g class="iiitl-ink iiitl-green"><!-- paths --></g></svg>
```

```css
/* recolour an ink */
.brand-mark .iiitl-green { fill: var(--green-vivid); }

/* the "green branches spread" scroll effect the brief asks for */
.brand-mark .iiitl-green path {
  stroke-dasharray: var(--len);
  stroke-dashoffset: var(--len);
  animation: trace 1.2s ease-out forwards;
}
```

Because the inks are grouped, you can also drive them independently from React:

```tsx
<Logo variant="square" className="brand-mark" />
```

## Production notes

- **Ship the SVG, not the PNG.** The traced SVG is ~8x smaller than the
  2269 x 2039 PNG and stays crisp at any size. Keep the PNG only as the master
  that the tracer reads from.
- **`width`/`height` attributes are set** to the source pixel size. Override
  with CSS (`width: 100%; height: auto`) so the mark scales fluidly.
- **The wordmark is text-as-outlines.** The Devanagari is traced geometry, so it
  is not selectable, translatable, or screen-reader readable. The React
  component sets an accessible name on the `<svg>`; if you also render the
  institute name as real text nearby, pass `title={null}` to avoid a duplicate
  announcement.
- **Clearspace.** The `square` variant carries 4% padding baked into its
  viewBox, which is the minimum clearspace. Do not add CSS padding on top of it.
- **Do not re-colour the saffron dome or the green traces to the same hue.**
  They are the only warm/cool contrast in the mark; collapsing them flattens
  the emblem at small sizes.
