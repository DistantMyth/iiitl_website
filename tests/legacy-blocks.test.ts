import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { legacyBlocks } from "../components/legacy-blocks";

const legacy = JSON.parse(
  readFileSync(new URL("../lib/legacy.json", import.meta.url), "utf8"),
) as { slug: string; text: string; images: string[] }[];

const rti = legacy.find((p) => p.slug === "rti")!;

test("the scrape's bullets become list items, not one run-on paragraph", () => {
  const blocks = legacyBlocks(rti.text);
  const items = blocks.filter((b) => b.kind === "li");
  assert.ok(items.length > 20, `expected many list items, got ${items.length}`);
  // The source text carries literal bullet glyphs; none may survive into copy.
  assert.equal(
    blocks.filter((b) => /[●•]/.test(b.text)).length,
    0,
    "no stray bullet glyphs in rendered text",
  );
});

test("clause numbers pair with their titles", () => {
  const blocks = legacyBlocks(rti.text);
  const heads = blocks
    .filter((b) => b.kind === "h2" || b.kind === "h3")
    .map((b) => b.text);
  assert.ok(
    heads.some((h) => /^1\.1 Name and Title of the Act$/.test(h)),
    "clause 1.1 keeps its number and title on one heading",
  );
  // A bare number is a marker for the next line, never a heading of its own.
  assert.equal(
    blocks.filter((b) => /^\d+(\.\d+)*\.?$/.test(b.text)).length,
    0,
    "no orphan clause-number blocks",
  );
});

test("the institute name is not repeated above the hero", () => {
  const first = legacyBlocks(rti.text)[0];
  assert.ok(first);
  assert.doesNotMatch(
    first.text,
    /^Indian Institute of Information Technology/i,
  );
});

test("no migrated page still carries the generic NEW badge", () => {
  const offenders = legacy.filter((p) =>
    (p.images ?? []).some((i) => /new-badge/.test(i)),
  );
  assert.deepEqual(
    offenders.map((p) => p.slug),
    [],
  );
});
