import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Shell } from "@/components/shell";
import { Portal } from "@/components/portal";
import {
  ProgramBrowser,
  Curriculum,
  Admissions,
  Calendar,
  Tenders,
  Contact,
  LegacyPage,
  NewsPage,
  Landing,
  Clubs,
  Directory,
  PageHero,
} from "@/components/public-pages";
import {
  StudentServices,
  RtiExtras,
  ResearchDetail,
} from "@/components/services";
import { People } from "@/components/people";
import faculty from "@/lib/faculty.json";
import { Gallery } from "@/components/gallery";
import { aliases, roles, programs, committees, slugify } from "@/lib/catalog";
import legacy from "@/lib/legacy.json";
import news from "@/lib/news.json";
import type { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug
      .at(-1)!
      .split("-")
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(" "),
    robots:
      slug[0] === "dashboard" ? { index: false, follow: false } : undefined,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  if (path === "/dashboard/requests") redirect("/dashboard/student/requests");
  if (slug[0] === "dashboard") {
    if (!roles.some((r) => r.toLowerCase().replaceAll(" ", "-") === slug[1]))
      notFound();
    return <Portal roleSlug={slug[1]} module={slug[2]} />;
  }
  let content: React.ReactNode;
  if (path === "/academics") content = <ProgramBrowser />;
  else if (path === "/academics/course-structure") content = <Curriculum />;
  else if (path === "/academics/calendar") content = <Calendar />;
  else if (
    slug[0] === "academics" &&
    (slug[1] === "undergraduate" ||
      slug[1] === "postgraduate" ||
      slug[1] === "phd")
  ) {
    const code = slug[1] === "phd" ? "phd" : slug[2];
    if (!programs.some((p) => p.code === code)) notFound();
    content = <ProgramBrowser code={code} />;
  } else if (slug[0] === "admissions") content = <Admissions />;
  else if (path === "/tenders") content = <Tenders />;
  else if (path === "/people/faculty" || path.startsWith("/people/faculty/")) {
    if (slug[2] && !faculty.some((f) => f.slug === slug[2])) notFound();
    content = <People slug={slug[2]} />;
  } else if (path === "/contact") content = <Contact />;
  else if (path === "/directory")
    content = (
      <Directory
        pages={legacy.map((p) => ({ slug: p.slug, title: p.title }))}
      />
    );
  else if (path === "/news") content = <NewsPage items={news} />;
  else if (slug[0] === "news") {
    const n = news.find(
      (n) => decodeURIComponent(n.slug) === decodeURIComponent(slug[1]),
    );
    if (!n) notFound();
    content = (
      <>
        <PageHero
          title={n.title}
          kicker="NEWS & ANNOUNCEMENTS"
          description={n.date}
        />
        <article className="section prose">
          <p>
            {n.text ||
              "Read the full announcement and its attachments on the original institute website."}
          </p>
          <a
            className="btn secondary"
            href={n.source}
            target="_blank"
            rel="noreferrer"
          >
            Official notice & attachments ↗
          </a>
        </article>
      </>
    );
  } else if (
    [
      "/campus-life/hostels",
      "/campus-life/sports",
      "/campus-life/counselling",
    ].includes(path)
  )
    content = <StudentServices kind={slug[1]} />;
  else if (
    ["/research/wcarl", "/research/create", "/research/publications"].includes(
      path,
    )
  )
    content = <ResearchDetail kind={slug[1]} />;
  else if (path === "/campus-life/gallery") content = <Gallery />;
  else if (slug[0] === "campus-life" && ["clubs", "cultural"].includes(slug[1]))
    content = <Clubs club={slug[2]} />;
  else if (
    [
      "research",
      "campus-life",
      "governance",
      "placements",
      "careers",
      "about",
    ].includes(slug[0]) &&
    slug.length === 1
  )
    content = <Landing type={slug[0]} />;
  else if (path === "/about/demo")
    content = (
      <>
        <PageHero
          title="A preview of a connected campus."
          kicker="ABOUT THIS DEMONSTRATION"
        />
        <article className="section prose">
          <h2>Built to explore.</h2>
          <p>
            This frontend demonstrates the public website and seven role-based
            workspaces. Public legacy content was imported from the supplied
            website snapshot. Academic records, fee amounts, tender records,
            calendars, users, and workflow states are illustrative.
          </p>
          <p>
            Demo changes are saved in this browser. There is no real
            authentication, payment processing, email dispatch, AI service, or
            official document certification. The Hindi control demonstrates
            bilingual branding; full content translation is pending.
          </p>
          <h3>Try a connected workflow</h3>
          <p>
            Login as Faculty, submit marks, switch to Exam Cell to approve and
            publish, then switch to Student to view results. Start a no-dues
            request as Student, approve department stages as Super Admin,
            reconcile fees as Accounts, and complete clearance.
          </p>
          <Link href="/" className="text-link">
            Explore the website →
          </Link>
        </article>
      </>
    );
  else {
    const explicit = aliases[path];
    const s = slug[0] === "legacy" ? slug[1] : explicit || slug.at(-1);
    let p =
      legacy.find(
        (p) => decodeURIComponent(p.slug) === decodeURIComponent(s || ""),
      ) || null;
    if (path === "/people/faculty")
      p = legacy.find((p) => p.slug === "faculty") || null;
    if (path === "/academics/fees")
      p = legacy.find((p) => p.slug === "fee-structure") || null;
    const known =
      explicit ||
      [
        "/statutory/nirf",
        "/research/wcarl",
        "/research/create",
        "/research/publications",
        "/campus-life/counselling",
        "/campus-life/sports",
        "/people/staff",
        "/people/alumni",
      ].includes(path);
    if (!p && !known) notFound();
    const title =
      path === "/statutory/nirf"
        ? "NIRF disclosures"
        : slug
            .at(-1)!
            .split("-")
            .map((s) => s[0].toUpperCase() + s.slice(1))
            .join(" ");
    content = (
      <>
        <LegacyPage page={p} title={title} />
        {path === "/statutory/rti" && <RtiExtras />}
      </>
    );
  }
  return (
    <Shell>
      <main id="main">{content}</main>
    </Shell>
  );
}
