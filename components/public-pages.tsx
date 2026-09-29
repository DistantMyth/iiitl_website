"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Download,
  BookOpen,
  CalendarDays,
  MapPin,
  Check,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import {
  programs,
  programPath,
  courses,
  groups,
  committees,
  slugify,
} from "@/lib/catalog";
import { download } from "@/lib/demo";
import { useDemo } from "./provider";
import { Modal, Login } from "./shell";
import { MarqueeRows } from "./marquee-rows";
import { GalleryCarousel } from "./gallery-carousel";
import { PhotoChoreography } from "./photo-choreography";
export type Legacy = {
  slug: string;
  title: string;
  text: string;
  links: { label: string; url: string }[];
  images: string[];
  source: string;
};
export function PageHero({
  title,
  kicker = "EXPLORE IIIT LUCKNOW",
  description,
}: {
  title: string;
  kicker?: string;
  description?: string;
}) {
  return (
    <section className="page-hero">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        {kicker.replaceAll("EXPLORE ", "")}
      </div>
      <span className="eyebrow">{kicker}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <span className="page-hero-decoration" aria-hidden="true">
        ↗
      </span>
    </section>
  );
}
export function ProgramBrowser({ code }: { code?: string }) {
  const [level, setLevel] = useState("All");
  const [q, setQ] = useState("");
  const p = programs.find((p) => p.code === code);
  return (
    <>
      <PageHero
        title={p ? `${p.degree} ${p.name}` : "Make your next move."}
        kicker="ACADEMICS"
        description={
          p?.description ||
          "From your first line of code to an original research contribution. Find the program that fits your curiosity."
        }
      />
      <section className="section">
        {p ? (
          <>
            <div className="fact-grid">
              <div>
                <span>Degree</span>
                <strong>{p.degree}</strong>
              </div>
              <div>
                <span>Level</span>
                <strong>{p.level}</strong>
              </div>
              <div>
                <span>Duration</span>
                <strong>
                  {p.duration}
                  {p.code === "phd" ? "+" : ""} years
                </strong>
              </div>
              <div>
                <span>Learning</span>
                <strong>On campus</strong>
              </div>
            </div>
            <div className="two-col">
              <article>
                <h2>A foundation for what’s next.</h2>
                <p>
                  {p.description} Coursework, practical learning, and
                  independent projects help you connect theory with real
                  challenges.
                </p>
                <h3>Admission pathway</h3>
                <p>
                  {p.level === "Undergraduate"
                    ? "Explore the JEE Main and JoSAA / CSAB counselling route."
                    : p.code === "mtech-cs"
                      ? "Explore GATE and CCMT counselling."
                      : "Consult the program’s admission notice for selection criteria and application dates."}{" "}
                  Eligibility and dates must be checked against the official
                  current notice.
                </p>
                <Link className="btn" href="/admissions">
                  Admission guide <ArrowUpRight size={17} />
                </Link>
              </article>
              <div className="panel">
                <h3>Your academic resources</h3>
                {[
                  ["Explore the curriculum", "/academics/course-structure"],
                  ["Academic calendar", "/academics/calendar"],
                  ["Fees & scholarships", "/academics/fees"],
                  ["Meet the faculty", "/people/faculty"],
                ].map(([n, p]) => (
                  <Link className="list-link" key={p} href={p}>
                    {n}
                    <ArrowRight size={17} />
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="filter-bar">
              <div className="tabs">
                {["All", "Undergraduate", "Postgraduate", "Doctoral"].map(
                  (l) => (
                    <button
                      key={l}
                      className={level === l ? "selected" : ""}
                      onClick={() => setLevel(l)}
                    >
                      {l}
                    </button>
                  ),
                )}
              </div>
              <label className="search-input">
                <Search size={18} />
                <input
                  aria-label="Search programs"
                  placeholder="Search programs"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </label>
            </div>
            <div className="program-grid">
              {programs
                .filter(
                  (p) =>
                    (level === "All" || p.level === level) &&
                    `${p.name} ${p.degree}`
                      .toLowerCase()
                      .includes(q.toLowerCase()),
                )
                .map((p) => (
                  <Link
                    key={p.code}
                    className="program-card"
                    href={programPath(p)}
                  >
                    <div className="card-top">
                      <GraduationCap />
                      <ArrowUpRight />
                    </div>
                    <span className="eyebrow">
                      {p.degree} · {p.duration} YEARS
                    </span>
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <span className="text-link">Explore program →</span>
                  </Link>
                ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
export function Curriculum() {
  const [program, setProgram] = useState("csai");
  const [semester, setSemester] = useState("3");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("All");
  const [selected, setSelected] = useState<(typeof courses)[number] | null>(
    null,
  );
  return (
    <>
      <PageHero
        title="Follow your curiosity."
        kicker="COURSE EXPLORER"
        description="Explore subjects, credits, prerequisites, and what you’ll learn each semester."
      />
      <section className="section">
        <div className="demo-note">
          Sample curriculum · Course allocations and assessment policies will be
          replaced with approved institutional data.
        </div>
        <div className="filter-bar">
          <label>
            Program
            <select
              value={program}
              onChange={(e) => {
                setProgram(e.target.value);
                setSemester("1");
              }}
            >
              {programs.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.degree} {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Semester
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {Array.from(
                {
                  length:
                    programs.find((p) => p.code === program)!.duration * 2,
                },
                (_, i) => (
                  <option key={i}>{i + 1}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Subject type
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {["All", "Core", "Elective"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Find a subject
            <input
              placeholder="Name or course code"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        </div>
        <div className="section-heading">
          <h2>Semester {semester}</h2>
          <button className="btn secondary" onClick={() => window.print()}>
            <Download size={17} /> Print / save PDF
          </button>
        </div>
        <p className="muted">
          Illustrative course set · 21 credits ·{" "}
          {programs.find((p) => p.code === program)?.name}
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Subject</th>
                <th>Type</th>
                <th>L–T–P</th>
                <th>Credits</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {courses
                .filter(
                  (c) =>
                    (kind === "All" || c.area === kind) &&
                    `${c.name} ${c.code}`
                      .toLowerCase()
                      .includes(q.toLowerCase()),
                )
                .map((c) => (
                  <tr key={c.code}>
                    <td className="mono">{c.code}</td>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>
                      <span className="badge">{c.area}</span>
                    </td>
                    <td>{c.ltp}</td>
                    <td>{c.credits}</td>
                    <td>
                      <button
                        className="text-link"
                        onClick={() => setSelected(c)}
                      >
                        Syllabus <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Modal
          title={selected?.name || "Subject details"}
          open={!!selected}
          onOpenChange={(v) => !v && setSelected(null)}
        >
          {selected && (
            <>
              <span className="badge">
                {selected.code} · {selected.credits} credits
              </span>
              <h3>What you’ll learn</h3>
              <p>{selected.description}</p>
              <h3>Prerequisites</h3>
              <p>{selected.prerequisite}</p>
              <h3>Illustrative assessment</h3>
              <p>
                Continuous assessment 20% · Mid-semester 30% · End-semester 50%
              </p>
              <button
                className="btn secondary"
                onClick={() =>
                  download(
                    `${selected.code}-syllabus.txt`,
                    `${selected.name}\nDEMONSTRATION SYLLABUS\n${selected.description}\nPrerequisite: ${selected.prerequisite}`,
                  )
                }
              >
                <Download size={16} /> Download syllabus
              </button>
            </>
          )}
        </Modal>
      </section>
    </>
  );
}
export function Admissions() {
  const [tab, setTab] = useState("Undergraduate");
  return (
    <>
      <PageHero
        title="Your future starts here."
        kicker="ADMISSIONS"
        description="An ambitious community. A world of questions. A place to make your mark."
      />
      <section className="section">
        <div className="tabs">
          {["Undergraduate", "Postgraduate", "Doctoral"].map((t) => (
            <button
              className={tab === t ? "selected" : ""}
              key={t}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="two-col">
          <div>
            <h2>A clear path to IIITL.</h2>
            {(tab === "Undergraduate"
              ? [
                  "Explore the four B.Tech programs",
                  "Check JEE Main eligibility and results",
                  "Register for JoSAA / CSAB counselling",
                  "Complete seat acceptance and reporting",
                ]
              : tab === "Postgraduate"
                ? [
                    "Choose your postgraduate program",
                    "Check program-specific eligibility",
                    "Apply through CCMT or the institute notice",
                    "Complete selection and admission formalities",
                  ]
                : [
                    "Explore research areas and supervisors",
                    "Read the doctoral admission notice",
                    "Submit application and supporting documents",
                    "Participate in the selection process",
                  ]
            ).map((s, i) => (
              <div className="step" key={s}>
                <b>0{i + 1}</b>
                <div>
                  <h3>{s}</h3>
                  <p>
                    {
                      [
                        "Choose the direction that matches your interests.",
                        "Read the official notice for the current admission cycle.",
                        "Keep required academic documents ready.",
                        "Follow the instructions published by the admissions section.",
                      ][i]
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
          <aside className="panel">
            <span className="eyebrow">ADMISSION RESOURCES</span>
            <h3>Everything you need to begin.</h3>
            <p>
              Dates, fees, eligibility, and seat availability are governed by
              the official admission notices.
            </p>
            {[
              ["Program catalog", "/academics"],
              ["Fee structure", "/academics/fees"],
              ["Scholarships", "/legacy/scholarships-offered"],
              ["Contact admissions", "/contact"],
            ].map(([n, p]) => (
              <Link className="list-link" key={p} href={p}>
                {n}
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <a
              className="btn"
              href={
                tab === "Undergraduate"
                  ? "https://josaa.nic.in/"
                  : tab === "Postgraduate"
                    ? "https://ccmt.admissions.nic.in/"
                    : "https://iiitl.ac.in/index.php/phd-advertisement-3/"
              }
              target="_blank"
              rel="noreferrer"
            >
              Official application information <ArrowUpRight size={17} />
            </a>
          </aside>
        </div>
        <h2>Questions before you apply?</h2>
        {[
          [
            "How do I apply for a B.Tech program?",
            "Undergraduate admissions follow the JEE Main and JoSAA / CSAB route. Consult the current counselling and institute notices.",
          ],
          [
            "Can I visit the campus?",
            "Contact the institute in advance to discuss visiting arrangements.",
          ],
          [
            "Where can I find fees and financial support?",
            "Visit Fees & Scholarships for the source documents and available scholarship information.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <ChevronDown size={18} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
export function Calendar() {
  const [month, setMonth] = useState(9);
  const events = [
    {
      date: "2026-09-14",
      title: "Mid-semester examinations",
      type: "Academic",
    },
    { date: "2026-10-02", title: "Gandhi Jayanti", type: "Holiday" },
    { date: "2026-10-12", title: "Research seminar", type: "Research" },
    {
      date: "2026-11-23",
      title: "End-semester examinations",
      type: "Academic",
    },
    { date: "2026-12-21", title: "ANTIC 2026 conference", type: "Research" },
  ];
  const visible = events.filter((e) => +e.date.slice(5, 7) === month);
  return (
    <>
      <PageHero
        title="Make room for what matters."
        kicker="ACADEMIC CALENDAR"
        description="Teaching, examinations, institute events, and important dates in one place."
      />
      <section className="section">
        <div className="demo-note">
          Illustrative calendar · Verify academic dates against the official
          calendar before planning.
        </div>
        <div className="filter-bar">
          <label>
            Month
            <select value={month} onChange={(e) => setMonth(+e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => (
                <option value={i + 1} key={i}>
                  {new Date(2026, i).toLocaleString("en", { month: "long" })}{" "}
                  2026
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn secondary"
            onClick={() =>
              download(
                "iiitl-demo-calendar.ics",
                `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//IIITL//Demo//EN\r\n${visible.map((e) => `BEGIN:VEVENT\r\nUID:${e.date}-demo@iiitl.local\r\nDTSTAMP:20260929T000000Z\r\nDTSTART;VALUE=DATE:${e.date.replaceAll("-", "")}\r\nSUMMARY:[DEMO] ${e.title}\r\nEND:VEVENT`).join("\r\n")}\r\nEND:VCALENDAR`,
                "text/calendar",
              )
            }
          >
            <Download size={16} /> Export month to calendar
          </button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <b key={d}>{d}</b>
          ))}
          {Array.from(
            { length: new Date(2026, month - 1, 1).getDay() },
            (_, i) => (
              <div key={`b${i}`} className="calendar-empty" />
            ),
          )}
          {Array.from(
            { length: new Date(2026, month, 0).getDate() },
            (_, i) => (
              <div key={i}>
                <span>{i + 1}</span>
                {visible
                  .filter((e) => +e.date.slice(8) === i + 1)
                  .map((e) => (
                    <small key={e.title}>{e.title}</small>
                  ))}
              </div>
            ),
          )}
        </div>
        <h2>On the calendar</h2>
        {visible.length ? (
          visible.map((e) => (
            <div className="list-link" key={e.date}>
              <span>
                <span className="badge">{e.type}</span> {e.title}
              </span>
              <time>{e.date}</time>
            </div>
          ))
        ) : (
          <p>No events in this demo month.</p>
        )}
      </section>
    </>
  );
}
export function Tenders() {
  const { data } = useDemo();
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const tender = data.tenders.find((t) => t.id === selected);
  return (
    <>
      <PageHero
        title="Opportunities to build together."
        kicker="TENDERS & PROCUREMENT"
        description="Procurement notices, bid timelines, and corrigenda, organised in one place."
      />
      <section className="section">
        <div className="demo-note">
          Demonstration tender records · Not invitations to bid.
        </div>
        <div className="filter-bar">
          <div className="tabs">
            {["All", "Active", "Extended", "Archived", "Corrigenda"].map(
              (s) => (
                <button
                  className={filter === s ? "selected" : ""}
                  key={s}
                  onClick={() => setFilter(s)}
                >
                  {s}
                </button>
              ),
            )}
          </div>
          <label className="search-input">
            <Search size={16} />
            <input
              placeholder="Search tenders"
              aria-label="Search tenders"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        </div>
        {data.tenders
          .filter(
            (t) =>
              (filter === "All" ||
                (filter === "Corrigenda"
                  ? !!t.corrigenda
                  : t.status === filter)) &&
              `${t.title} ${t.id}`.toLowerCase().includes(q.toLowerCase()),
          )
          .map((t) => (
            <button
              className="tender-card"
              key={t.id}
              onClick={() => setSelected(t.id)}
            >
              <div>
                <span className="mono">{t.id}</span>
                <h3>{t.title}</h3>
                <span>
                  Closing {t.closing} ·{" "}
                  {Math.max(
                    0,
                    Math.ceil(
                      (new Date(t.closing + "T23:59:59+05:30").getTime() -
                        Date.now()) /
                        86400000,
                    ),
                  )}{" "}
                  days remaining
                </span>
              </div>
              <span className="badge green">{t.status}</span>
              <ArrowUpRight />
            </button>
          ))}
        <a
          className="text-link"
          href="https://gem.gov.in/"
          target="_blank"
          rel="noreferrer"
        >
          Government e-Marketplace <ArrowUpRight size={17} />
        </a>
        <Modal
          title={tender?.title || "Tender"}
          open={!!tender}
          onOpenChange={(v) => !v && setSelected(null)}
        >
          {tender && (
            <>
              <span className="badge">{tender.id}</span>
              <p>{tender.description}</p>
              <p>Closing date: {tender.closing}</p>
              {tender.corrigenda && (
                <div className="demo-note">
                  <strong>Corrigendum</strong>
                  <p>{tender.corrigenda}</p>
                </div>
              )}
              <button
                className="btn secondary"
                onClick={() =>
                  download(
                    `${tender.id.replaceAll("/", "-")}.txt`,
                    `DEMONSTRATION ONLY\n${tender.title}\n${tender.description}\nClosing: ${tender.closing}\n${tender.corrigenda}`,
                  )
                }
              >
                <Download size={16} /> Download demo notice
              </button>
            </>
          )}
        </Modal>
      </section>
    </>
  );
}
export function ContactForm({ grievance = false }: { grievance?: boolean }) {
  const { update, toast } = useDemo();
  const [done, setDone] = useState("");
  return (
    <form
      className="panel"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const id = `REQ-${Date.now().toString().slice(-7)}`;
        update(
          (d) => ({
            ...d,
            requests: [
              ...d.requests,
              {
                id,
                type: grievance ? "Grievance" : "Enquiry",
                text: String(f.get("message")),
                status: "Submitted",
              },
            ],
          }),
          "Demo request created",
        );
        setDone(id);
        toast("Request saved in this browser. No message was sent.");
        e.currentTarget.reset();
      }}
    >
      <h3>{grievance ? "Submit a grievance" : "Let’s connect."}</h3>
      <p className="muted">
        Demo form: your request stays in this browser and is not sent to the
        institute.
      </p>
      {!grievance && (
        <label>
          Your name
          <input name="name" required />
        </label>
      )}
      <label>
        Email {grievance ? "(optional for anonymous requests)" : ""}
        <input name="email" type="email" required={!grievance} />
      </label>
      <label>
        Regarding
        <select name="topic">
          {(grievance
            ? ["Student grievance", "Anti-ragging", "Internal complaints"]
            : [
                "Admissions",
                "Industry collaboration",
                "Research collaboration",
                "International collaboration",
                "Press & media",
              ]
          ).map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label>
        Your message
        <textarea name="message" rows={5} required minLength={10} />
      </label>
      <button className="btn">
        Save demo request <ArrowRight size={16} />
      </button>
      {done && (
        <p role="status" className="success">
          Saved locally. Tracking ID: {done}
        </p>
      )}
    </form>
  );
}
export function Contact() {
  return (
    <>
      <PageHero
        title="Good conversations start here."
        kicker="CONTACT & VISIT"
        description="Find us in Lucknow. Connect with the people who can help."
      />
      <section className="section two-col">
        <div>
          <MapPin size={32} />
          <h2>Come find your perspective.</h2>
          <p>
            Indian Institute of Information Technology, Lucknow
            <br />
            Chak Ganjaria, C. G. City
            <br />
            Lucknow, Uttar Pradesh 226002, India
          </p>
          <a
            className="btn secondary"
            href="https://www.google.com/maps/search/?api=1&query=IIIT+Lucknow"
            target="_blank"
            rel="noreferrer"
          >
            Open directions <ArrowUpRight size={18} />
          </a>
          <div className="contact-photo">
            <img
              src="/assets/images/homepage/institute-pic-f.jpg"
              alt="IIIT Lucknow academic building"
            />
          </div>
          <Link className="text-link" href="/legacy/reach-us">
            Official contact directory <ArrowRight size={16} />
          </Link>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
export function LegacyPage({
  page,
  title,
}: {
  page: Legacy | null;
  title: string;
}) {
  return (
    <>
      <PageHero title={page?.title || title} kicker="INSTITUTE INFORMATION" />
      <section className="section">
        <div className="legacy-layout">
          <article className="prose">
            {page?.images[0] && (
              <img
                className="legacy-image"
                src={page.images[0]}
                alt={page.title}
                loading="lazy"
              />
            )}
            {page?.text ? (
              page.text
                .match(/.{1,800}(?:\s|$)/g)
                ?.map((t, i) => <p key={i}>{t}</p>)
            ) : (
              <>
                <h2>{title}</h2>
                <p>
                  This section brings together the institute’s information and
                  resources for {title.toLowerCase()}.
                </p>
                <div className="demo-note">
                  Approved content and documents for this section are pending
                  institutional review. No official records have been invented
                  for this preview.
                </div>
              </>
            )}
            {page && (
              <a
                className="text-link"
                href={page.source}
                target="_blank"
                rel="noreferrer"
              >
                View original institute page <ArrowUpRight size={17} />
              </a>
            )}
          </article>
          <aside className="panel">
            <h3>Resources & documents</h3>
            {page?.links.length ? (
              page.links.map((l, i) => (
                <a
                  className="list-link"
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                  <ArrowUpRight size={16} />
                </a>
              ))
            ) : (
              <>
                <Link className="list-link" href="/forms">
                  Forms & downloads <ArrowUpRight size={16} />
                </Link>
                <Link className="list-link" href="/contact">
                  Contact the institute <ArrowUpRight size={16} />
                </Link>
              </>
            )}
            <p className="muted small">
              Legacy source documents open on the original host. Their
              availability and currency require verification.
            </p>
          </aside>
        </div>
        {/ICC|SGRC|Ragging|grievance/i.test(title) && <ContactForm grievance />}
      </section>
    </>
  );
}
export function NewsPage({
  items,
}: {
  items: {
    title: string;
    slug: string;
    date: string;
    text: string;
    source: string;
  }[];
}) {
  const { data } = useDemo();
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(12);
  const matches = items.filter((n) =>
    n.title.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHero
        title="The latest from our community."
        kicker="NEWS & ANNOUNCEMENTS"
      />
      <section className="section">
        <label className="search-input">
          <Search size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search notices"
            placeholder="Search notices and events"
          />
        </label>
        {data.notices.map((n, i) => (
          <article className="tender-card" key={i}>
            <div>
              <span className="badge">Demo publication</span>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
            </div>
          </article>
        ))}
        <div className="news-grid">
          {matches.slice(0, limit).map((n) => (
            <Link href={`/news/${n.slug}`} className="news-card" key={n.slug}>
              <time>{n.date}</time>
              <h3>{n.title}</h3>
              <span className="text-link">
                Read notice <ArrowUpRight size={17} />
              </span>
            </Link>
          ))}
        </div>
        {matches.length === 0 && (
          <p className="empty-state">
            No matching announcements. Try a broader search.
          </p>
        )}
        {matches.length > limit && (
          <button
            className="btn secondary"
            onClick={() => setLimit((n) => n + 12)}
          >
            Show more announcements ({matches.length - limit} remaining)
          </button>
        )}
      </section>
    </>
  );
}
const CAMPUS_MARQUEE = [
  {
    kicker: "Clubs",
    title: "Find your people",
    href: "/campus-life/clubs",
    thumbnail: "/assets/images/dsc_0650.jpg",
  },
  {
    kicker: "Sports",
    title: "Bring your A-game",
    href: "/campus-life/sports",
    thumbnail: "/assets/images/table_tennis_team.jpg",
  },
  {
    kicker: "Convocation",
    title: "A thousand little moments",
    href: "/campus-life/gallery",
    thumbnail: "/assets/images/convocation-pics.jpg",
  },
  {
    kicker: "Hostels",
    title: "Your home on campus",
    href: "/campus-life/hostels",
    thumbnail: "/assets/images/girls_hostel_galary_2.jpg",
  },
  {
    kicker: "Wellbeing",
    title: "Space to be heard",
    href: "/campus-life/counselling",
    thumbnail: "/assets/images/reception_area.jpg",
  },
  {
    kicker: "Culture",
    title: "Equinox, every year",
    href: "/campus-life/cultural",
    thumbnail: "/assets/images/equinox1.jpg",
  },
];

function CampusChoreography() {
  return (
    <PhotoChoreography
      label="Moments across campus"
      images={{
        topLeft: "/assets/images/landing-inner-campustour.jpg",
        topRight: "/assets/images/homepage/institute-pic-f.jpg",
        bottomLeft: "/assets/images/lab2_1.jpg",
        bottomRight: "/assets/images/convocation-pics.jpg",
      }}
    />
  );
}

const CAMPUS_PHOTOS = [
  {
    src: "/assets/images/convocation-pics.jpg",
    alt: "Convocation celebrations on the main ground",
    title: "Convocation",
    subtitle: "The day the class of the year walks out",
  },
  {
    src: "/assets/images/dsc_0650.jpg",
    alt: "Students taking part in Equinox",
    title: "Equinox",
    subtitle: "The annual socio-cultural-technical festival",
  },
  {
    src: "/assets/images/lab2_1.jpg",
    alt: "Students working in a laboratory",
    title: "In the lab",
    subtitle: "Where theory gets its hands dirty",
  },
  {
    src: "/assets/images/table_tennis_team.jpg",
    alt: "The institute table tennis team",
    title: "Table tennis",
    subtitle: "A little friendly rivalry",
  },
  {
    src: "/assets/images/girls_hostel_galary_2.jpg",
    alt: "Life in the girls hostel",
    title: "Hostel life",
    subtitle: "Home between terms",
  },
  {
    src: "/assets/images/reception_area.jpg",
    alt: "Reception and common area at the institute",
    title: "Common ground",
    subtitle: "Between classes, everyone ends up here",
  },
  {
    src: "/assets/images/iiitl_building.jpg",
    alt: "The institute building at night",
    title: "The campus",
    subtitle: "The place, after hours",
  },
  {
    src: "/assets/images/republic_day22.jpg",
    alt: "Republic Day celebrations on campus",
    title: "Republic Day",
    subtitle: "Flags, speeches and a full campus",
  },
];

function CampusCoverflow() {
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null);
  return (
    <div className="marquee-wrap">
      <span className="eyebrow">AROUND THE INSTITUTE</span>
      <h2>
        Moments worth <em>staying for.</em>
      </h2>
      <GalleryCarousel
        slides={CAMPUS_PHOTOS}
        // Upstream is manual; this one turns on its own and stops the moment
        // anyone hovers, focuses, drags or tabs away.
        autoRotate={4200}
        label="Campus moments"
        onSelect={(slide) => setOpen({ src: slide.src, alt: slide.alt })}
      />
      <Modal
        title={open?.alt || "Campus photograph"}
        open={!!open}
        onOpenChange={(v) => !v && setOpen(null)}
      >
        {open && (
          <img className="lightbox-image" src={open.src} alt={open.alt} />
        )}
      </Modal>
    </div>
  );
}

function CampusMarquee() {
  return (
    <div className="marquee-wrap">
      <span className="eyebrow">LIFE AROUND CAMPUS</span>
      <h2>
        There is more to <em>the routine.</em>
      </h2>
      <MarqueeRows cards={CAMPUS_MARQUEE} />
    </div>
  );
}

export function Landing({ type }: { type: string }) {
  const isCampus = type === "campus-life";
  const isResearch = type === "research";
  const isGovern = type === "governance";
  const title = isCampus
    ? "This is where you belong."
    : isResearch
      ? "Ask bigger questions."
      : isGovern
        ? "Built on responsibility."
        : type === "placements"
          ? "Built here. Bound for everywhere."
          : type === "careers"
            ? "Help shape what comes next."
            : "A community of curious minds.";
  return (
    <>
      <PageHero
        title={title}
        kicker={type.toUpperCase().replaceAll("-", " ")}
      />
      <LandingBody type={type} />
    </>
  );
}

/**
 * The body of a section landing page, minus its page header.
 *
 * Split out of `Landing` so the homepage can show the identical campus-life
 * content without stacking a second <PageHero> under its own.
 */
/**
 * The body of a section landing page, minus its page header.
 *
 * Split out of `Landing` so the homepage can show the identical campus-life
 * content without stacking a second <PageHero> under its own.
 */
export function LandingBody({ type }: { type: string }) {
  const isCampus = type === "campus-life";
  const isResearch = type === "research";
  const isGovern = type === "governance";

  const cards = isCampus
    ? [
        [
          "Clubs & societies",
          "Find your people in technical, cultural, literary, and sports communities.",
          "/campus-life/clubs",
        ],
        [
          "Hostels & mess",
          "Your home on campus, everyday meals, and support.",
          "/campus-life/hostels",
        ],
        [
          "Counselling & wellbeing",
          "Space to talk, listen, and look after yourself.",
          "/campus-life/counselling",
        ],
        [
          "Campus gallery",
          "A glimpse of the moments that make us.",
          "/campus-life/gallery",
        ],
      ]
    : isResearch
      ? [
          [
            "CDSAI",
            "Data science and artificial intelligence research.",
            "/research/cdsai",
          ],
          [
            "WCARL",
            "Wireless communication and advanced research.",
            "/research/wcarl",
          ],
          [
            "CREATE",
            "Incubation, entrepreneurship, and ideas in action.",
            "/research/create",
          ],
          [
            "Publications",
            "Explore the work of our faculty and researchers.",
            "/research/publications",
          ],
        ]
      : isGovern
        ? committees.map((c) => [
            c,
            "Institutional leadership, responsibilities, and source documents.",
            `/governance/${slugify(c)}`,
          ])
        : type === "careers"
          ? [
              [
                "Faculty positions",
                "Teaching and research opportunities.",
                "/legacy/faculty-positions",
              ],
              [
                "Non-teaching positions",
                "Support our academic community.",
                "/legacy/advertisement-for-non-teaching",
              ],
              [
                "Project opportunities",
                "Contribute to funded research.",
                "/legacy/project-vacancy",
              ],
            ]
          : [
              [
                "Meet our faculty",
                "Research interests and academic profiles.",
                "/people/faculty",
              ],
              [
                "Explore programs",
                "Computing, business, and allied disciplines.",
                "/academics",
              ],
              [
                "Industry collaboration",
                "Connect with the institute.",
                "/contact",
              ],
            ];
  return (
    <>
      <section className="section">
        {isCampus && (
          <img
            className="wide-photo"
            src="/assets/images/convocation-pics.jpg"
            alt="An institutional celebration at IIIT Lucknow"
          />
        )}
        {isCampus && <CampusCoverflow />}
        {isCampus && <CampusMarquee />}
        {isCampus && <CampusChoreography />}
        {type === "placements" && (
          <div className="two-col">
            <div>
              <h2>Connect talent with opportunity.</h2>
              <p>
                Explore recruitment opportunities, connect with the placement
                team, and discover the programs that prepare our students for
                industry.
              </p>
              <a
                className="btn"
                href="https://placements.iiitl.ac.in/"
                target="_blank"
                rel="noreferrer"
              >
                Official placement portal <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="panel">
              <h3>For recruiters</h3>
              <p>
                Discuss campus hiring, internships, and industry partnerships
                with the institute.
              </p>
              <Link href="/contact" className="text-link">
                Contact industry relations →
              </Link>
            </div>
          </div>
        )}
        <div className="resource-grid">
          {cards.map(([n, d, p]) => (
            <Link className="resource-card" href={p} key={p}>
              <ArrowUpRight />
              <h3>{n}</h3>
              <p>{d}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
export function Clubs({ club }: { club?: string }) {
  const clubs = [
    ["Axios", "Technical community", "axios"],
    ["Zephyr", "Dance society", "zephyr"],
    ["Goonj", "Drama society", "goonj"],
    ["Utkrisht", "Fine arts society", "utkrisht"],
    ["After Dark", "Photography society", "after-dark"],
    ["Estrella", "Music society", "estrella"],
    ["Crotonia", "Literary society", "crotonia"],
    ["Eifer", "Sports community", "eifer"],
    ["E-Cell", "Entrepreneurship", "e-cell"],
  ];
  return (
    <>
      <PageHero
        title={
          club
            ? clubs.find((c) => c[2] === club)?.[0] || "Campus community"
            : "Find your kind of people."
        }
        kicker="CLUBS & SOCIETIES"
        description="Build something. Take the stage. Start a conversation. There’s a community for your curiosity."
      />
      <section className="section resource-grid">
        {clubs
          .filter((c) => !club || c[2] === club)
          .map(([n, d, s]) => (
            <div className="resource-card" key={s}>
              <span className="eyebrow">{d}</span>
              <h2>{n}</h2>
              <p>
                A place to learn together, share your work, and participate in
                campus activities.
              </p>
              {club ? (
                <>
                  <Link className="text-link" href="/news">
                    Find events →
                  </Link>
                  <Login
                    trigger={
                      <button className="btn secondary">
                        Explore as a student
                      </button>
                    }
                  />
                </>
              ) : (
                <Link className="text-link" href={`/campus-life/clubs/${s}`}>
                  Explore community <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          ))}
      </section>
    </>
  );
}
export function Directory({
  pages,
}: {
  pages: { title: string; slug: string }[];
}) {
  const [q, setQ] = useState("");
  return (
    <>
      <PageHero title="Everything, in one place." kicker="SITE DIRECTORY" />
      <section className="section">
        <label className="search-input">
          <Search size={18} />
          <input
            placeholder="Search all institute pages"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="resource-grid">
          {pages
            .filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))
            .map((p) => (
              <Link
                className="list-link"
                key={p.slug}
                href={`/legacy/${p.slug}`}
              >
                {p.title}
                <ArrowUpRight size={15} />
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
