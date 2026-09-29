"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Code2,
  BrainCircuit,
  Network,
  Briefcase,
  MoveUpRight,
  CalendarDays,
} from "lucide-react";
import { programs, programPath } from "@/lib/catalog";
import { Logo } from "./logo";
import { LandingBody } from "./public-pages";
import { CampusScene } from "./campus-scene";
import { ImageStreamHero } from "./image-stream-hero";
import { useDemo } from "./provider";
// Backdrop only, so a small, varied set is enough for the corridor to read.
const STREAM_IMAGES = [
  { src: "/assets/images/landing-inner-campustour.jpg", alt: "" },
  { src: "/assets/images/lab2_1.jpg", alt: "" },
  { src: "/assets/images/convocation-pics.jpg", alt: "" },
  { src: "/assets/images/equinox1.jpg", alt: "" },
  { src: "/assets/images/reception_area.jpg", alt: "" },
  { src: "/assets/images/lab1.jpg", alt: "" },
  { src: "/assets/images/girls_hostel_galary_2.jpg", alt: "" },
  { src: "/assets/images/table_tennis_team.jpg", alt: "" },
];
export function Motion() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, []);
  return null;
}
export function Home({
  news,
}: {
  news: { title: string; date: string; slug: string }[];
}) {
  const { data } = useDemo();
  const [tab, setTab] = useState("Undergraduate");

  return (
    <main id="main">
      <Motion />
      <ImageStreamHero
        className="home-hero is-backdrop"
        images={STREAM_IMAGES}
        cards={7}
        speed={30}
        axis={62}
      >
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="little-line" />
            <span>LEARN</span>
            <i />
            <span>INNOVATE</span>
            <i />
            <span>BUILD</span>
            <i />
            <span>IMPACT</span>
          </div>
          <h1>
            {data.hero.includes("tomorrow") ? (
              <>
                {data.hero.split("tomorrow")[0]}
                <em>tomorrow.</em>
              </>
            ) : (
              data.hero
            )}
          </h1>
          <div className="hero-bottom">
            <p>
              A place for curious minds.
              <br />A community building what comes next.
            </p>
            <div className="button-row">
              <Link className="btn" href="/academics">
                Find your program <ArrowUpRight size={18} />
              </Link>
              <Link className="btn secondary" href="/admissions">
                Admissions <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <a className="scroll-cue" href="#campus">
            A new perspective <ArrowDown size={15} />
          </a>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
          <b>
            ज्ञानम्
            <br />
            अनन्तम्
          </b>
          <i>KNOWLEDGE IS INFINITE</i>
        </div>
      </ImageStreamHero>
      <CampusScene />
      <div className="announcement-strip">
        <span className="live-dot" />
        <strong>On the noticeboard</strong>
        <Link href={`/news/${news[0]?.slug}`}>
          {news[0]?.title || "Discover the latest from IIIT Lucknow"}
        </Link>
        <Link className="notice-all" href="/news">
          All notices <ArrowRight size={17} />
        </Link>
      </div>
      <section className="section intro-section" data-reveal>
        <div>
          <span className="eyebrow">
            SMALL ENOUGH TO BELONG. BOLD ENOUGH TO LEAD.
          </span>
          <h2>
            Big ideas.
            <br />
            Real-world <em>impact.</em>
          </h2>
        </div>
        <div>
          <p className="large-copy">
            Technology changes the world.
            <br />
            We prepare the people who change technology.
          </p>
          <p>
            At IIIT Lucknow, strong foundations meet fearless exploration.
            Discover a community where learning goes beyond the classroom,
            research asks bigger questions, and your next idea has room to grow.
          </p>
          <Link className="text-link" href="/about/at-a-glance">
            Meet your institute <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section emblem-section" data-reveal>
        <div className="emblem-art">
          <span className="emblem-plate" aria-hidden="true" />
          <Logo
            variant="square"
            title="The IIIT Lucknow emblem"
            className="emblem-logo"
          />
        </div>
        <div className="emblem-copy">
          <span className="eyebrow">THE MARK</span>
          <h2>
            Knowledge, drawn
            <br />
            as <em>circuitry.</em>
          </h2>
          <p className="large-copy">
            The institute seal maps a printed circuit board — the paths a signal
            takes from input to answer.
          </p>
          <p>
            Traced directly from the crest artwork, the emblem is now vector
            geometry rather than a bitmap. It stays razor sharp from a phone
            lock screen to a projector wall, scales to any favicon, and its
            green details echo the colours of the original institute crest.
          </p>
          <ul className="emblem-specs">
            <li>
              <strong>Vector</strong>
              <span>Scales without pixelation</span>
            </li>
            <li>
              <strong>1:1</strong>
              <span>Square mark for avatars &amp; app tiles</span>
            </li>
            <li>
              <strong>5 inks</strong>
              <span>Each colour individually addressable</span>
            </li>
          </ul>
          <Link className="text-link" href="/about">
            Read about the institute identity <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="stats-grid section" data-reveal>
        {[
          [
            data.stats[0],
            "Academic programs",
            "Across computing & allied disciplines",
          ],
          [data.stats[1], "B.Tech pathways", "Find your own direction"],
          [data.stats[2], "Our beginning", "A growing community of innovators"],
          ["∞", "Possibilities ahead", "Knowledge has no finish line"],
        ].map(([n, t, d]) => (
          <div key={t}>
            <strong>{n}</strong>
            <h3>{t}</h3>
            <span>{d}</span>
          </div>
        ))}
      </section>
      <section className="program-section section" data-reveal>
        <div className="section-heading">
          <div>
            <span className="eyebrow">MAKE CURIOSITY YOUR CALLING</span>
            <h2>
              Find your <em>direction.</em>
            </h2>
          </div>
          <Link className="text-link" href="/academics">
            All programs <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="tabs" role="tablist" aria-label="Program levels">
          {["Undergraduate", "Postgraduate", "Doctoral"].map((t) => (
            <button
              role="tab"
              aria-selected={t === tab}
              key={t}
              onClick={() => setTab(t)}
            >
              {t}
              <span>{programs.filter((p) => p.level === t).length}</span>
            </button>
          ))}
        </div>
        <div className="program-grid">
          {programs
            .filter((p) => p.level === tab)
            .map((p, i) => {
              const Icon = [Code2, BrainCircuit, Network, Briefcase][i % 4];
              return (
                <Link
                  href={programPath(p)}
                  className="program-card"
                  key={p.code}
                >
                  <div className="card-top">
                    <Icon size={29} strokeWidth={1.3} />
                    <ArrowUpRight size={21} />
                  </div>
                  <span className="eyebrow">
                    {p.degree} · {p.duration} YEARS
                  </span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <span className="card-link">
                    Explore program <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
        </div>
      </section>
      <section className="section research-section" data-reveal>
        <div className="research-art" aria-hidden="true">
          <div className="research-grid" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className={`research-ring ring-${i}`} />
          ))}
          <span>WHAT IF?</span>
          <small>Questions worth pursuing.</small>
        </div>
        <div>
          <span className="eyebrow">RESEARCH WITHOUT LIMITS</span>
          <h2>
            The next breakthrough
            <br />
            starts with <em>a question.</em>
          </h2>
          <p>
            From intelligent systems to wireless communication, our researchers
            connect deep expertise with problems that matter.
          </p>
          <div className="research-links">
            {[
              ["Artificial intelligence", "/research/cdsai"],
              ["Wireless communication", "/research/wcarl"],
              ["Ideas into enterprises", "/research/create"],
            ].map(([n, p]) => (
              <Link href={p} key={p}>
                {n}
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </div>
          <Link className="text-link" href="/research">
            Explore research at IIITL <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      {/* The same campus-life content the /campus-life page shows, so the
          two never drift apart. LandingBody is that page minus its
          <PageHero>, which the homepage already has. */}
      <LandingBody type="campus-life" />
      <section className="section news-section" data-reveal>
        <div className="section-heading">
          <div>
            <span className="eyebrow">IN THE LOOP</span>
            <h2>
              Happening <em>here.</em>
            </h2>
          </div>
          <Link className="text-link" href="/news">
            News & announcements <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="news-grid">
          {news.slice(0, 3).map((n, i) => (
            <Link className="news-card" key={n.slug} href={`/news/${n.slug}`}>
              <span className="news-category">
                {["ON CAMPUS", "LEARNING", "ANNOUNCEMENT"][i]}
              </span>
              <h3>{n.title}</h3>
              <div>
                <span>
                  <CalendarDays size={14} />
                  {new Date(n.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <ArrowUpRight size={21} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="vision-banner">
        <span className="eyebrow">YOUR NEXT CHAPTER</span>
        <h2>
          Somewhere between
          <br />
          <em>“what if”</em> and <em>“what’s next”.</em>
        </h2>
        <Link className="btn white" href="/admissions">
          Begin at IIIT Lucknow <MoveUpRight size={18} />
        </Link>
        <span className="vision-word" aria-hidden="true">
          IMAGINE.
        </span>
      </section>
    </main>
  );
}
