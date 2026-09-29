"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, ArrowUpRight, Mail, UserRound } from "lucide-react";
import { PageHero } from "./public-pages";
import faculty from "@/lib/faculty.json";
import { FacultyCarousel, type FacultySlide } from "./faculty-carousel";
/* Highlights for the carousel, drawn from real directory entries. */
const FACULTY_HIGHLIGHTS: FacultySlide[] = [
  {
    id: "rahul-kumar-verma",
    stat: "Head of Department, Computer Science",
    quote:
      "Teaching and research in computing, with the department carrying the institute's core computer science programme and its industry-facing work.",
    author: "Dr. Rahul Kumar Verma",
    role: "Assistant Professor",
    defaultImage: "/assets/images/dr.jpg",
    alt: "Dr. Rahul Kumar Verma",
  },
  {
    id: "nishu-gupta",
    stat: "Head of Department, Information Technology",
    quote:
      "Postdoctoral research at NTNU in Norway and VTT in Finland, bringing an international perspective to how technology is taught here.",
    author: "Dr. Nishu Gupta",
    role: "Assistant Professor",
    defaultImage: "/assets/images/dr_1.png",
    alt: "Dr. Nishu Gupta",
  },
  {
    id: "sirsendu-sekhar-barman",
    stat: "Head of Department, Mathematics",
    quote:
      "A department that anchors the quantitative side of every programme, and a PhD from IIT Kharagpur behind it.",
    author: "Dr. Sirsendu Sekhar Barman",
    role: "Assistant Professor",
    defaultImage: "/assets/images/dr.png",
    alt: "Dr. Sirsendu Sekhar Barman",
  },
  {
    id: "padma-tripathi",
    stat: "Head of Department, Management & Humanities",
    quote:
      "Faculty In-Charge for Research, with a PhD from IIM Lucknow and the department's work across management, policy and the humanities.",
    author: "Dr. Padma Tripathi",
    role: "Assistant Professor",
    defaultImage: "/assets/images/b34ae523-dr.png",
    alt: "Dr. Padma Tripathi",
  },
];

export function People({ slug }: { slug?: string }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const selected = faculty.find((f) => f.slug === slug);
  return (
    <>
      <PageHero
        title={selected?.name || "Meet the minds behind the ideas."}
        kicker="FACULTY & RESEARCHERS"
        description={
          selected?.qualification ||
          "Teachers, researchers, and mentors. Discover the people who make learning at IIIT Lucknow possible."
        }
      />
      <section className="section">
        {selected ? (
          <div className="two-col">
            <div>
              {selected.image ? (
                <img
                  className="faculty-portrait"
                  src={selected.image}
                  alt={selected.name}
                />
              ) : (
                <UserRound size={100} />
              )}
              <h2>{selected.name}</h2>
              <p>{selected.qualification}</p>
              <p>{selected.description}</p>
              {selected.email && (
                <a className="text-link" href={`mailto:${selected.email}`}>
                  <Mail size={17} />
                  {selected.email}
                </a>
              )}
            </div>
            <aside className="panel">
              <h3>Academic profile</h3>
              <p>
                Explore the original profile for research interests,
                publications, teaching, and collaboration details.
              </p>
              <a
                className="btn"
                href={selected.source}
                target="_blank"
                rel="noreferrer"
              >
                Full official profile <ArrowUpRight size={17} />
              </a>
              <a
                className="list-link"
                href="https://iiitl.irins.org/"
                target="_blank"
                rel="noreferrer"
              >
                Institutional research information <ArrowUpRight size={17} />
              </a>
              <Link className="list-link" href="/research">
                Explore research centres <ArrowUpRight size={17} />
              </Link>
              <p className="muted small">
                Directory data comes from the supplied official website snapshot
                and requires approval before launch.
              </p>
            </aside>
          </div>
        ) : (
          <>
            <FacultyCarousel items={FACULTY_HIGHLIGHTS} />
            <div className="filter-bar">
              <label className="search-input">
                <Search size={18} />
                <input
                  aria-label="Search faculty"
                  placeholder="Search by name or expertise"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </label>
              <label>
                Appointment
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {[
                    "All",
                    "Assistant Professor",
                    "Associate Professor",
                    "Professor",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="faculty-grid">
              {faculty
                .filter(
                  (f) =>
                    `${f.name} ${f.qualification} ${f.description}`
                      .toLowerCase()
                      .includes(q.toLowerCase()) &&
                    (filter === "All" || f.description.includes(filter)),
                )
                .map((f) => (
                  <Link
                    className="faculty-card"
                    href={`/people/faculty/${f.slug}`}
                    key={f.slug}
                  >
                    {f.image ? (
                      <img loading="lazy" src={f.image} alt={f.name} />
                    ) : (
                      <div className="faculty-placeholder">
                        <UserRound size={60} />
                      </div>
                    )}
                    <div>
                      <h3>{f.name}</h3>
                      <p>{f.qualification}</p>
                      <span className="text-link">
                        View profile <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
            {!faculty.some(
              (f) =>
                `${f.name} ${f.qualification} ${f.description}`
                  .toLowerCase()
                  .includes(q.toLowerCase()) &&
                (filter === "All" || f.description.includes(filter)),
            ) && (
              <div className="empty-state">
                No matching faculty. Try a different name or appointment.
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
