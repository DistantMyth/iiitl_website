import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">404 · A SMALL DETOUR</span>
      <h1>
        Let’s get you
        <br />
        back on course.
      </h1>
      <p>This page isn’t in the new campus map.</p>
      <div className="button-row">
        <Link className="btn" href="/">
          Return home ↗
        </Link>
        <Link className="btn secondary" href="/directory">
          Browse all pages
        </Link>
      </div>
    </main>
  );
}
