"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Building2,
  BookOpen,
  Shield,
  Download,
} from "lucide-react";
import { PageHero, ContactForm } from "./public-pages";
import { Login } from "./shell";
export function StudentServices({ kind }: { kind: string }) {
  const hostel = kind === "hostels";
  return (
    <>
      <PageHero
        title={
          hostel
            ? "A home for your next chapter."
            : kind === "sports"
              ? "Show up. Team up. Play."
              : "You don’t have to figure it out alone."
        }
        kicker="STUDENT LIFE & SUPPORT"
        description={
          hostel
            ? "Campus accommodation, everyday meals, and the people who help you settle in."
            : kind === "sports"
              ? "Make space for movement, teamwork, and a little friendly competition."
              : "Find a starting point for academic, personal, and campus concerns."
        }
      />
      <section className="section">
        <div className="two-col">
          <div>
            <img
              className="wide-photo"
              src={
                hostel
                  ? "/assets/images/girls_hostel_galary_2.jpg"
                  : kind === "sports"
                    ? "/assets/images/table_tennis_team.jpg"
                    : "/assets/images/homepage/institute-pic-f.jpg"
              }
              alt={
                hostel
                  ? "Campus hostel facilities"
                  : kind === "sports"
                    ? "IIIT Lucknow table tennis team"
                    : "IIIT Lucknow campus"
              }
            />
            <h2>
              {hostel
                ? "Make yourself at home."
                : kind === "sports"
                  ? "Find your team."
                  : "A good place to start."}
            </h2>
            <p>
              {hostel
                ? "Explore room allotment information and campus support. The student portal demonstrates your room assignment, daily mess menu, and a maintenance request workflow."
                : kind === "sports"
                  ? "Campus sports bring students together through recreation and competition. Explore the sports community and discover activities through campus announcements."
                  : "Whether you’re settling into campus life, managing academic pressure, or looking for support, contact the institute for current counselling services and appointment arrangements."}
            </p>
          </div>
          <aside className="panel">
            <h3>
              {hostel ? "Your campus essentials" : "Find the right support"}
            </h3>
            {(hostel
              ? [
                  ["Room allotment", "/legacy/room-allotment"],
                  ["Official forms", "/forms"],
                  ["Fee structure", "/academics/fees"],
                ]
              : kind === "sports"
                ? [
                    ["Sports community", "/campus-life/clubs/eifer"],
                    ["Campus events", "/news"],
                  ]
                : [
                    ["Contact the institute", "/contact"],
                    ["Student grievance committee", "/governance/sgrc"],
                    ["Anti-ragging support", "/governance/anti-ragging"],
                    ["Internal Complaints Committee", "/governance/icc"],
                  ]
            ).map(([n, p]) => (
              <Link className="list-link" key={p} href={p}>
                {n}
                <ArrowUpRight size={17} />
              </Link>
            ))}
            <div style={{ marginTop: 25 }}>
              <Login
                trigger={
                  <button className="btn">
                    Explore student services <ArrowUpRight size={17} />
                  </button>
                }
              />
            </div>
            <p className="muted small" style={{ marginTop: 20 }}>
              Room records, menus, and requests in the portal are illustrative.
              Confirm operational details with the institute.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
export function RtiExtras() {
  const [pages, setPages] = useState(0);
  const [exempt, setExempt] = useState(false);
  return (
    <section className="section">
      <div className="two-col">
        <div className="panel">
          <h2>RTI application preview</h2>
          <p>
            Illustrative fee calculator. Verify the applicable rules,
            exemptions, and payment process with the CPIO before filing.
          </p>
          <label>
            Requested copy pages
            <input
              type="number"
              min={0}
              value={pages}
              onChange={(e) => setPages(Math.max(0, Number(e.target.value)))}
            />
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={exempt}
              onChange={(e) => setExempt(e.target.checked)}
            />{" "}
            Demonstrate fee exemption
          </label>
          <div className="ledger-total">
            Demo estimate<strong>₹{exempt ? 0 : 10 + pages * 2}</strong>
          </div>
          <p className="small" style={{ marginTop: 15 }}>
            Sample calculation: ₹10 application + ₹2 per page. Not a payment
            demand.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
export function ResearchDetail({ kind }: { kind: string }) {
  const content: Record<
    string,
    { title: string; description: string; areas: string[]; url: string }
  > = {
    wcarl: {
      title: "Wireless Communication & Advanced Research Lab",
      description:
        "Explore wireless systems, communication technologies, and the research questions behind a more connected world.",
      areas: [
        "Wireless networks",
        "Communication systems",
        "Signal processing",
      ],
      url: "https://iiitl.ac.in/index.php/research/",
    },
    create: {
      title: "CREATE. Build what comes next.",
      description:
        "A starting point for student ideas, entrepreneurship, and research with a path to practical impact.",
      areas: [
        "Idea exploration",
        "Mentorship & incubation",
        "Industry connections",
      ],
      url: "https://iiitl.ac.in/index.php/incubation-centrecreate/",
    },
    publications: {
      title: "Ideas, shared with the world.",
      description:
        "Explore the institute’s research output through the institutional research information network and faculty profiles.",
      areas: [
        "Faculty research profiles",
        "Publications & citations",
        "Collaboration opportunities",
      ],
      url: "https://iiitl.irins.org/",
    },
  };
  const c = content[kind];
  return (
    <>
      <PageHero
        title={c.title}
        kicker="RESEARCH & INNOVATION"
        description={c.description}
      />
      <section className="section">
        <div className="resource-grid">
          {c.areas.map((a) => (
            <div className="resource-card" key={a}>
              <BookOpen size={26} />
              <h3>{a}</h3>
              <Link className="text-link" href="/people/faculty">
                Connect with faculty <ArrowUpRight size={17} />
              </Link>
            </div>
          ))}
        </div>
        <div className="two-col">
          <div>
            <h2>Good questions bring people together.</h2>
            <p>
              Discover research interests, connect with the institute, and
              explore opportunities to collaborate.
            </p>
            <Link className="btn" href="/contact">
              Discuss a collaboration <ArrowUpRight size={17} />
            </Link>
          </div>
          <aside className="panel">
            <h3>Explore the source</h3>
            <p>
              Current publications, laboratory rosters, grants, and incubation
              opportunities will be populated from approved institute records.
            </p>
            <a
              className="text-link"
              href={c.url}
              target="_blank"
              rel="noreferrer"
            >
              Official research resources <ArrowUpRight size={17} />
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
