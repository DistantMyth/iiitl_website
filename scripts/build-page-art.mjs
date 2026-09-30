import fs from "node:fs";
const dir = "assets/images/page-art";
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".svg"))
  .sort();
const entries = files.map((f) => {
  let s = fs.readFileSync(`${dir}/${f}`, "utf8").trim();
  const base = f.replace(/\.svg$/, "");
  // Strip the outer <svg> wrapper; the component supplies viewBox + a11y attrs.
  const vb = s.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 100 100";
  s = s
    .replace(/^[\s\S]*?<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "")
    .trim();
  return `  "${base}": ${JSON.stringify(s)},`;
});
const out = `/**
 * Inline SVG bodies for legacy page artwork, generated from
 * assets/images/page-art/*.svg. Do not edit by hand -- re-run
 * scripts/build-page-art.mjs after changing the source SVGs.
 *
 * Only the shape is stored; the component supplies the <svg> wrapper so it can
 * set viewBox, sizing and colour. Sources are CC0 (The Noun Project via
 * Wikimedia Commons); see assets/images/page-art/SOURCES.md.
 */
export const PAGE_ART_SVG: Record<string, string> = {
${entries.join("\n")}
};

export const PAGE_ART_VIEWBOX: Record<string, string> = {
${files.map((f) => `  "${f.replace(/\.svg$/, "")}": "${fs.readFileSync(`${dir}/${f}`, "utf8").match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 100 100"}",`).join("\n")}
};
`;
fs.writeFileSync("lib/page-art-svg.ts", out);
console.log("generated lib/page-art-svg.ts with", files.length, "icons");
