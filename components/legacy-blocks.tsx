import * as React from "react";

/**
 * Renders the flat-but-newline-delimited text that `scripts/migrate-content.py`
 * produces from the institute's legacy pages.
 *
 * The scrape keeps one line per source block, so structure can be recovered
 * from the line itself rather than from tags. Anything unrecognised falls back
 * to a paragraph, which is why this is safe for arbitrary pages.
 */

/** "1.2", "3." — a numbered clause of the Act, so a heading. */
const CLAUSE = /^(\d+(?:\.\d+)*)\.?\s+(.{3,120})$/;
/** "1 About RTI Act 2005" — a bare number followed by a short title. */
const BARE_SECTION = /^(\d{1,2})\s+([A-Z][^.]{3,80})$/;
/** "RTI manual (2024-25) as on 31 July 2025" — a document heading. */
const DOC_HEADING = /^(.{4,90}?)\s+(\(\d{4}[-–]\d{2,4}\).{0,40}|as on .+)$/i;

const BULLET = /^[•●▪◦‣⁃]\s*/;
/** Leading whitespace the source used to nest sub-bullets. */
const NEST = /^[\s ]{2,}/;

type Block =
  | { kind: "h2" | "h3" | "p" | "lead" | "skip"; text: string }
  | { kind: "li"; text: string; depth: number };

function classify(line: string): Block {
  const raw = line.trim();
  if (!raw) return { kind: "p", text: "" };

  const nested = NEST.test(line);
  const withoutBullet = raw.replace(BULLET, "").trim();
  if (BULLET.test(raw)) {
    return { kind: "li", text: withoutBullet, depth: nested ? 1 : 0 };
  }

  // A lone clause number ("1", "1.1") is a marker for the heading that follows
  // it in the source, not content of its own -- drop it and let the next line
  // become the heading.
  if (/^\d+(?:\.\d+)*\.?$/.test(raw)) return { kind: "skip", text: "" };

  const clause = raw.match(CLAUSE);
  if (clause) return { kind: "h3", text: `${clause[1]} ${clause[2]}` };

  const section = raw.match(BARE_SECTION);
  if (section) return { kind: "h2", text: `${section[1]} ${section[2]}` };

  if (DOC_HEADING.test(raw) && raw.length < 120) {
    return { kind: "h3", text: raw };
  }

  // A short, title-ish line right after the page's first line.
  if (raw.length <= 70 && !/[.;:]$/.test(raw) && /[A-Z]/.test(raw[0])) {
    return { kind: "h2", text: raw };
  }

  return { kind: "p", text: raw };
}

export function legacyBlocks(text: string): Block[] {
  const lines = text
    .split("\n")
    .filter((l) => l.trim())
    // The source writes a clause number on its own line, then the title on the
    // next: "1.1" / "Name and Title of the Act". Pair them back up here so the
    // heading reads the way the Act is actually numbered.
    .reduce<string[]>((acc, line) => {
      const prev = acc[acc.length - 1];
      if (prev !== undefined && /^\d+(?:\.\d+)*\.?$/.test(prev.trim())) {
        acc[acc.length - 1] = `${prev.trim()} ${line.trim()}`;
      } else {
        acc.push(line);
      }
      return acc;
    }, []);

  const blocks: Block[] = [];
  let first = true;

  for (const line of lines) {
    const block = classify(line);

    if (first) {
      // The scrape leads with the institute name on every page, and the hero
      // above already states it. Drop it rather than repeat it.
      if (/^Indian Institute of Information Technology/i.test(block.text)) {
        first = false;
        continue;
      }
      first = false;
      blocks.push({ kind: "lead", text: block.text });
      continue;
    }

    // Merge a wrapped continuation back onto the block it belongs to: a
    // sentence split by the source's own line breaks should stay one <p>.
    const prev = blocks[blocks.length - 1];
    if (
      prev &&
      (prev.kind === "h2" || prev.kind === "h3") &&
      block.kind === "p" &&
      block.text.length <= 80 &&
      !/[.;:]$/.test(block.text) &&
      /^[A-Z]/.test(block.text)
    ) {
      // The source put the clause number and its title on separate lines.
      prev.text = `${prev.text} ${block.text}`;
      continue;
    }
    if (
      prev &&
      (prev.kind === "p" || prev.kind === "lead") &&
      !/[.!?:;]$/.test(prev.text) &&
      block.kind === "p" &&
      /^[a-z(]/.test(block.text)
    ) {
      prev.text = `${prev.text} ${block.text}`;
      continue;
    }

    blocks.push(block);
  }

  return blocks;
}

/** Groups consecutive list items so they render as real <ul>s. */
export function LegacyBody({ text }: { text: string }) {
  const blocks = React.useMemo(() => legacyBlocks(text), [text]);
  const out: React.ReactNode[] = [];
  let run: Extract<Block, { kind: "li" }>[] = [];

  const flush = (key: number) => {
    if (!run.length) return;
    out.push(
      <ul key={`ul-${key}`} className="legacy-list">
        {run.map((item, i) => (
          <li key={i} className={item.depth ? "legacy-sub" : undefined}>
            {item.text}
          </li>
        ))}
      </ul>,
    );
    run = [];
  };

  blocks.forEach((block, i) => {
    if (block.kind === "skip") return;
    if (block.kind === "li") {
      run.push(block);
      return;
    }
    flush(i);
    if (block.kind === "h2") out.push(<h2 key={i}>{block.text}</h2>);
    else if (block.kind === "h3") out.push(<h3 key={i}>{block.text}</h3>);
    else if (block.kind === "lead")
      out.push(
        <p key={i} className="legacy-lead">
          {block.text}
        </p>,
      );
    else out.push(<p key={i}>{block.text}</p>);
  });
  flush(blocks.length);

  return <>{out}</>;
}
