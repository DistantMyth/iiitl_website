#!/usr/bin/env python3
"""Trace the IIIT Lucknow institutional logo into hand-editable SVG paths.

The master artwork (assets/logos/iiitl_main_logo.png) is flat 5-ink colour, so
we split it into one binary mask per ink and trace each mask independently with
vtracer (the Rust port of potrace). Tracing per-ink avoids the colour-priority
artefacts you get from vectorising the whole image in one pass, and gives clean
per-colour groups that can be recoloured or animated from a single CSS class.

Why polygon mode by default: this logo is drawn with straight 45-degree PCB
traces and hard-cornered letterforms, so corner-preserving polygons are both
*smaller and more accurate* than spline fitting -- 25 KB / 0.984 IoU versus
192 KB / 0.977 IoU against the source. Pass --mode spline if you want
smoother curves for artistic treatments.

Usage:
    python3 scripts/vectorize_logo.py
    python3 scripts/vectorize_logo.py --em-only          # 1:1 crest, no wordmark
    python3 scripts/vectorize_logo.py --mode spline      # smoother, much larger
    python3 scripts/vectorize_logo.py --quality low      # extra-small contexts
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

try:
    import vtracer
except ImportError:  # pragma: no cover - dependency guidance
    sys.exit(
        "vtracer is required. Install it with:\n"
        "    python3 -m pip install vtracer"
    )

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "logos" / "iiitl_main_logo.png"
OUT_DIR = ROOT / "public" / "brand"

# The five flat inks in the master artwork, in paint order (back to front).
INKS = {
    "green": (0, 131, 37),    # PCB traces radiating from the dome
    "brown": (121, 46, 14),   # burnt-sienna sun-ray tips
    "orange": (222, 108, 26), # saffron dome arc
    "blue": (0, 95, 153),     # the pillar / "IIITL" letterforms
    "navy": (0, 68, 109),     # Devanagari wordmark
}
PAINT_ORDER = ["green", "brown", "orange", "blue", "navy"]

# The crest artwork ends and the Devanagari wordmark begins at this row.
EMBLEM_END_ROW = 1810

# vtracer tunables. path_precision is the decimal places kept in coordinates.
QUALITY = {
    "high": dict(corner_threshold=60, length_threshold=3.5,
                 max_iterations=10, splice_threshold=45,
                 filter_speckle=2, path_precision=3),
    "med": dict(corner_threshold=90, length_threshold=4.5,
                max_iterations=8, splice_threshold=55,
                filter_speckle=4, path_precision=2),
    "low": dict(corner_threshold=120, length_threshold=6.0,
                max_iterations=6, splice_threshold=65,
                filter_speckle=8, path_precision=1),
}

PATH_RE = re.compile(r"<path\s+([^>]*?)/>")


def load_layers(src: Path):
    """Split the master PNG into one boolean mask per ink."""
    arr = np.array(Image.open(src).convert("RGBA"))
    alpha = arr[..., 3]
    rgb = arr[..., :3].astype(np.int16)

    # Nearest-ink assignment: the artwork is flat, so nearest-neighbour colour
    # matching separates the inks exactly, with antialiased edge pixels going
    # to whichever ink they are closest to.
    dists = np.stack(
        [np.linalg.norm(rgb - np.array(ink, dtype=np.int16), axis=-1) for ink in INKS.values()],
        axis=0,
    )
    nearest = np.argmin(dists, axis=0)
    opaque = alpha > 128

    return {name: (opaque & (nearest == i)) for i, name in enumerate(INKS)}, arr.shape[1], arr.shape[0]


def trace_mask(mask: np.ndarray, width: int, height: int, opts: dict, mode: str) -> str:
    """Trace one ink mask with vtracer, returning <path> markup."""
    rgba = [
        (0, 0, 0, 255) if on else (255, 255, 255, 255)
        for row in mask
        for on in row
    ]
    svg = vtracer.convert_pixels_to_svg(
        rgba,
        (width, height),
        colormode="binary",
        hierarchical="cutout",
        mode=mode,
        **opts,
    )
    return extract_paths(svg)


def extract_paths(svg_text: str) -> str:
    """Re-emit vtracer's <path> elements, preserving their transforms.

    vtracer places every subpath in its own local coordinate space and repositions
    it with transform="translate(...)". The `d` data alone is therefore meaningless:
    keeping only the `d` attributes collapses the whole logo into the top-left
    corner. We keep each element intact and only rewrap it in the ink group.
    """
    out = []
    for attrs in PATH_RE.findall(svg_text):
        d = re.search(r'd="([^"]+)"', attrs)
        if not d:
            continue
        tr = re.search(r'transform="([^"]+)"', attrs)
        el = f'<path d="{d.group(1)}"'
        if tr:
            el += f' transform="{tr.group(1)}"'
        out.append(el + "/>")
    return "".join(out)


def square_framing(layers, width, rows: int, pad_ratio: float):
    """Compute square-canvas framing for 1:1 placements.

    Returns (viewBox, tx, ty). The artwork is 2269x1802 (1.26:1 wide), so its
    bounding box is not square; for 1:1 slots (avatars, app tiles, favicons) we
    build a square canvas sized to the artwork's long edge plus a margin and
    translate the artwork so it is centred inside that canvas.

    The translation is emitted as a wrapper <g transform> rather than folded
    into the viewBox, because vtracer already gives every subpath its own local
    coordinate space plus a translate(); shifting the viewBox origin instead
    would leave the subpath space untouched and mis-frame the mark.
    """
    m = np.zeros((rows, width), dtype=bool)
    for name in PAINT_ORDER:
        m |= layers[name][:rows, :]
    rs = np.where(m.any(axis=1))[0]
    cs = np.where(m.any(axis=0))[0]
    art_top, art_bot = int(rs.min()), int(rs.max()) + 1
    art_left, art_right = int(cs.min()), int(cs.max()) + 1
    art_w, art_h = art_right - art_left, art_bot - art_top

    side = int(round(max(art_w, art_h) * (1 + 2 * pad_ratio)))
    tx = int(round((side - art_w) / 2.0 - art_left))
    ty = int(round((side - art_h) / 2.0 - art_top))
    return f"0 0 {side} {side}", tx, ty, side


def build_svg(layers, width, height, opts, em_only: bool, mode: str,
              square: bool = False, pad_ratio: float = 0.04) -> str:
    height_used = EMBLEM_END_ROW if em_only else height
    # Keep the source coordinate system so the SVG can replace the PNG anywhere.
    if square:
        vb, tx, ty, side = square_framing(layers, width, height_used, pad_ratio)
        w_attr = h_attr = side
        open_tag = f'  <g transform="translate({tx},{ty})">'
        close_tag = "  </g>"
    else:
        vb = f"0 0 {width} {height_used}"
        w_attr, h_attr = width, height_used
        open_tag = close_tag = ""

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
        f'width="{w_attr}" height="{h_attr}" fill="none" role="img" '
        f'aria-labelledby="iiitl-logo-title">',
        '  <title id="iiitl-logo-title">Indian Institute of Information Technology, Lucknow</title>',
    ]
    if open_tag:
        parts.append(open_tag)
    for name in PAINT_ORDER:
        markup = trace_mask(layers[name][:height_used, :], width, height_used, opts, mode)
        if not markup:
            continue
        r, g, b = INKS[name]
        # One <g> per ink: recolour or animate a whole ink with a single rule.
        parts.append(
            f'  <g class="iiitl-ink iiitl-{name}" fill="#{r:02X}{g:02X}{b:02X}">{markup}</g>'
        )
    if close_tag:
        parts.append(close_tag)
    parts.append("</svg>")
    return "\n".join(parts)


def write_sprite(layers, width, height, opts, mode) -> Path:
    """Write iiitl-mark.svg: one <symbol> per ink for <use> references.

    components/logo.tsx draws the mark with <use href="...#ink-green"> so the
    React tree stays small while each ink remains independently addressable.
    Emitting the symbols here keeps the traced path data in exactly one place.

    Every symbol spans the *full* artwork height, including the navy wordmark.
    Each <symbol> carries its own viewBox, and the caller's outer <svg> viewBox
    is what crops: "crest" (0 0 2269 1810) trims the wordmark away, while
    "full" (0 0 2269 2039) keeps it. Emitting one sprite for all three variants
    means a single 26 KB file serves the whole site.
    """
    out = OUT_DIR / "iiitl-mark.svg"
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" style="display:none">']
    for name in PAINT_ORDER:
        markup = trace_mask(layers[name][:height, :], width, height, opts, mode)
        if not markup:
            continue
        # No fill here: the referencing <g> supplies the colour.
        parts.append(f'  <symbol id="ink-{name}" viewBox="0 0 {width} {height}">{markup}</symbol>')
    parts.append("</svg>")
    out.write_text("\n".join(parts), encoding="utf-8")
    return out


def count_paths(svg_text: str) -> int:
    return svg_text.count("<path ")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--em-only", action="store_true",
                    help="crop off the Devanagari wordmark for a 1:1 crest")
    ap.add_argument("--quality", choices=sorted(QUALITY), default="high")
    ap.add_argument("--mode", choices=("polygon", "spline"), default="polygon",
                    help="polygon is smaller+accurate for this art; spline is smoother")
    ap.add_argument("--square", action="store_true",
                    help="emit a square (1:1) viewBox, padded and optically centred")
    ap.add_argument("--pad", type=float, default=0.04,
                    help="padding as a fraction of the art's long edge (default 0.04)")
    ap.add_argument("--out", default=None, help="override output path")
    args = ap.parse_args()

    layers, w, h = load_layers(SOURCE)
    svg = build_svg(layers, w, h, QUALITY[args.quality], args.em_only,
                     args.mode, square=args.square, pad_ratio=args.pad)

    name = "iiitl-logo.svg" if args.em_only else "iiitl-logo-full.svg"
    out = Path(args.out) if args.out else OUT_DIR / name
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(svg, encoding="utf-8")

    sprite = write_sprite(layers, w, h, QUALITY[args.quality], args.mode)
    print(f"wrote {sprite.relative_to(ROOT)}  (sprite for <use> references)")

    inks = svg.count('class="iiitl-ink')
    try:
        shown = out.relative_to(ROOT)
    except ValueError:
        shown = out
    print(
        f"wrote {shown}  "
        f"({inks} ink groups, {count_paths(svg)} subpaths, "
        f"{out.stat().st_size / 1024:.1f} KB, {args.mode}/{args.quality})"
    )


if __name__ == "__main__":
    main()
