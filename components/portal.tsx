"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  Wallet,
  ClipboardCheck,
  FileText,
  Settings,
  Users,
  LogOut,
  Download,
  Upload,
  Check,
  Clock,
  Plus,
  RotateCcw,
  Building2,
  Shield,
  Image as ImageIcon,
} from "lucide-react";
import { useDemo } from "./provider";
import { Modal, Login } from "./shell";
import { roles, Role, courses, stages, programs } from "@/lib/catalog";
import { download, gradePoint, gpa, validMarks, DemoState } from "@/lib/demo";
const moduleNames: Record<string, string> = {
  overview: "Overview",
  results: "My results",
  fees: "Fees & ledger",
  "no-dues": "No-dues clearance",
  hostel: "Hostel & mess",
  requests: "Service requests",
  grades: "Marks & grading",
  moderation: "Result moderation",
  accounts: "Student ledgers",
  clearance: "Clearance approvals",
  content: "Website content",
  tenders: "Tender management",
  users: "People & access",
  roles: "Roles & permissions",
  audit: "Audit activity",
  curriculum: "Curriculum",
  media: "Media & brochures",
};
const roleModules: Record<Role, string[]> = {
  Student: ["overview", "results", "fees", "no-dues", "hostel", "requests"],
  Faculty: ["overview", "grades", "curriculum", "clearance"],
  "Exam Cell": ["overview", "moderation"],
  Accounts: ["overview", "accounts", "clearance"],
  Registrar: ["overview", "tenders"],
  "Institute Admin": [
    "overview",
    "content",
    "media",
    "curriculum",
    "users",
    "tenders",
    "accounts",
  ],
  "Super Admin": [
    "overview",
    "content",
    "media",
    "curriculum",
    "grades",
    "moderation",
    "accounts",
    "clearance",
    "users",
    "roles",
    "tenders",
    "audit",
  ],
};
export function Portal({
  roleSlug,
  module = "overview",
}: {
  roleSlug: string;
  module?: string;
}) {
  const role =
    roles.find((r) => r.toLowerCase().replaceAll(" ", "-") === roleSlug) ||
    "Student";
  const { data, reset } = useDemo();
  const allowed = roleModules[role].includes(module);
  return (
    <div className="portal">
      <aside className="portal-sidebar">
        <Link href="/" className="portal-brand">
          <img src="/assets/logos/iiitl_crest_logo.png" alt="" />
          <div>
            IIIT Lucknow<small>CAMPUS PORTAL</small>
          </div>
        </Link>
        <span className="sidebar-caption">YOUR WORKSPACE</span>
        <nav aria-label="Portal navigation">
          {roleModules[role].map((m, i) => (
            <Link
              href={`/dashboard/${roleSlug}${m === "overview" ? "" : "/" + m}`}
              key={m}
              className={module === m ? "active" : ""}
            >
              {
                [
                  <LayoutDashboard key="a" size={18} />,
                  <BookOpen key="b" size={18} />,
                  <ClipboardCheck key="c" size={18} />,
                  <FileText key="d" size={18} />,
                ][i % 4]
              }
              {moduleNames[m]}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Login
            trigger={
              <button>
                <Users size={17} /> Switch role
              </button>
            }
          />
          <Modal
            title="Reset the demonstration?"
            trigger={
              <button>
                <RotateCcw size={17} /> Reset demo data
              </button>
            }
          >
            <p>
              This clears local edits, results, fee changes, and requests for
              every demo role in this browser.
            </p>
            <button className="btn" onClick={reset}>
              Reset demo
            </button>
          </Modal>
          <Link href="/">
            <LogOut size={17} /> Back to website
          </Link>
        </div>
      </aside>
      <div className="portal-body">
        <header className="portal-header">
          <span>
            Campus portal{" "}
            <span className="muted">/ {moduleNames[module] || "Module"}</span>
          </span>
          <div>
            <span className="badge green">DEMO WORKSPACE</span>
            <div className="avatar">{role[0]}</div>
            <strong>{role}</strong>
          </div>
        </header>
        <main id="main" className="portal-main">
          <div className="demo-note">
            Demo mode · Sample records · Changes stay in this browser · No real
            authentication, payment, or email delivery.
          </div>
          {allowed ? (
            <>
              <div className="portal-title">
                <div>
                  <span className="eyebrow">
                    {role === "Student"
                      ? "BCSAI2023001 · ACADEMIC YEAR 2026–27"
                      : `${role.toUpperCase()} WORKSPACE`}
                  </span>
                  <h1>
                    {module === "overview"
                      ? `Welcome ${role === "Student" ? "back, Aarav." : "to your workspace."}`
                      : moduleNames[module]}
                  </h1>
                </div>
                <span className="muted">IIIT Lucknow</span>
              </div>
              {module === "overview" ? (
                <Overview role={role} roleSlug={roleSlug} />
              ) : module === "grades" ? (
                <Grades />
              ) : module === "moderation" ? (
                <Moderation />
              ) : module === "results" ? (
                <Results />
              ) : module === "fees" || module === "accounts" ? (
                <Finance
                  editable={
                    module === "accounts" &&
                    (role === "Accounts" || role === "Super Admin")
                  }
                />
              ) : module === "no-dues" || module === "clearance" ? (
                <Clearance role={role} />
              ) : module === "requests" ? (
                <Requests />
              ) : module === "hostel" ? (
                <Hostel />
              ) : module === "content" ? (
                <Content />
              ) : module === "tenders" ? (
                <TenderManager />
              ) : module === "users" || module === "roles" ? (
                <Access mode={module} />
              ) : module === "curriculum" ? (
                <CurriculumEditor />
              ) : module === "media" ? (
                <MediaManager />
              ) : (
                <div className="panel">
                  <h3>Local activity log</h3>
                  {data.audit.length ? (
                    data.audit.map((a, i) => (
                      <p className="audit-line" key={i}>
                        {a}
                      </p>
                    ))
                  ) : (
                    <p>
                      No activity yet. Changes to the demo will appear here.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="panel">
              <Shield />
              <h2>This workspace doesn’t include that module.</h2>
              <Link className="btn" href={`/dashboard/${roleSlug}`}>
                Return to overview
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
function Overview({ role, roleSlug }: { role: Role; roleSlug: string }) {
  const { data } = useDemo();
  const pending = data.fees
    .filter((f) => f.status !== "Paid")
    .reduce((s, f) => s + f.amount, 0);
  return (
    <>
      <div className="dashboard-stats">
        {(role === "Student"
          ? [
              ["Current semester", "III", "B.Tech CSAI"],
              [
                "Results",
                data.gradeStatus === "Published"
                  ? "Published"
                  : "Awaiting release",
                "Examination cell",
              ],
              [
                "Fees pending",
                `₹${pending.toLocaleString("en-IN")}`,
                "Hostel & mess ledger",
              ],
              [
                "Clearance",
                `${data.stages.filter((s) => s.status === "Approved").length} / 7`,
                "Department approvals",
              ],
            ]
          : [
              ["Grade submission", data.gradeStatus, "CS301 · Batch 2023"],
              [
                "Student records",
                String(data.marks.length),
                "Demonstration cohort",
              ],
              [
                "Pending fees",
                `₹${pending.toLocaleString("en-IN")}`,
                "Sample student ledger",
              ],
              [
                "Open requests",
                String(data.requests.length),
                "Campus services",
              ],
            ]
        ).map(([n, v, d]) => (
          <div className="stat-card" key={n}>
            <span>{n}</span>
            <strong>{v}</strong>
            <small>{d}</small>
          </div>
        ))}
      </div>
      <div className="two-col">
        <section className="panel">
          <div className="section-heading">
            <h2>Your next steps</h2>
            <ArrowUpRight size={20} />
          </div>
          {roleModules[role]
            .filter((m) => m !== "overview")
            .slice(0, 5)
            .map((m) => (
              <Link
                className="list-link"
                key={m}
                href={`/dashboard/${roleSlug}/${m}`}
              >
                <span>{moduleNames[m]}</span>
                <ArrowRight size={18} />
              </Link>
            ))}
        </section>
        <section className="panel blue-panel">
          <span className="eyebrow">A CONNECTED CAMPUS</span>
          <h2>
            One place.
            <br />
            More possibilities.
          </h2>
          <p>
            Explore your academic journey, keep track of campus services, and
            stay connected to what’s happening.
          </p>
          <Link className="text-link" href="/academics/calendar">
            Open academic calendar <ArrowUpRight size={18} />
          </Link>
        </section>
      </div>
      <section className="panel">
        <h3>Recent activity</h3>
        {data.audit.slice(0, 5).map((a, i) => (
          <p className="audit-line" key={i}>
            {a}
          </p>
        ))}
        {!data.audit.length && (
          <p className="muted">
            Your demo activity will appear here as you explore the portal.
          </p>
        )}
      </section>
    </>
  );
}
async function workbookDownload(kind: "marks" | "fees", data: DemoState) {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(kind === "marks" ? "Marks" : "Fees");
  sheet.addRow(
    kind === "marks"
      ? [
          "Roll number",
          "Student name",
          "Quiz (20)",
          "Midsem (30)",
          "Endsem (50)",
        ]
      : ["Fee category", "Amount", "Status", "UTR"],
  );
  (kind === "marks"
    ? data.marks.map((r) => [r.roll, r.name, r.quiz, r.mid, r.end])
    : data.fees.map((f) => [f.name, f.amount, f.status, f.utr])
  ).forEach((r) => sheet.addRow(r));
  sheet.columns.forEach((c) => (c.width = 26));
  sheet.getRow(1).font = { bold: true };
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `iiitl-demo-${kind}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Grades() {
  const { data, update, toast } = useDemo();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const locked = ["Submitted", "Approved", "Published"].includes(
    data.gradeStatus,
  );
  async function importFile(file: File) {
    setError("");
    setBusy(true);
    try {
      if (file.size > 2e6)
        throw Error("Please select a workbook smaller than 2 MB.");
      const ExcelJS = await import("exceljs");
      const book = new ExcelJS.Workbook();
      await book.xlsx.load(await file.arrayBuffer());
      const sheet = book.worksheets[0];
      if (!sheet || sheet.rowCount !== 4)
        throw Error(
          "The workbook must contain one header and exactly three student rows.",
        );
      const rows = data.marks.map((r, i) => ({
        roll: String(sheet.getCell(i + 2, 1).value),
        name: String(sheet.getCell(i + 2, 2).value),
        quiz:
          typeof sheet.getCell(i + 2, 3).value === "number"
            ? Number(sheet.getCell(i + 2, 3).value)
            : NaN,
        mid:
          typeof sheet.getCell(i + 2, 4).value === "number"
            ? Number(sheet.getCell(i + 2, 4).value)
            : NaN,
        end:
          typeof sheet.getCell(i + 2, 5).value === "number"
            ? Number(sheet.getCell(i + 2, 5).value)
            : NaN,
      }));
      if (!validMarks(rows))
        throw Error(
          "Check roll numbers and marks: quiz 0–20, midsem 0–30, endsem 0–50.",
        );
      update(
        (d) => ({ ...d, marks: rows, gradeStatus: "Draft" }),
        "Marks workbook imported",
      );
      toast("Workbook validated and imported. Review before submitting.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to read the workbook.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="panel">
        <div className="filter-bar">
          <label>
            Program
            <select>
              <option>B.Tech CSAI</option>
            </select>
          </label>
          <label>
            Batch
            <select>
              <option>2023</option>
            </select>
          </label>
          <label>
            Assigned course
            <select>
              <option>CS301 — Design & Analysis of Algorithms</option>
            </select>
          </label>
        </div>
        <div className="button-row">
          <button
            className="btn secondary"
            onClick={() =>
              workbookDownload("marks", data).catch(() =>
                setError("Could not generate workbook."),
              )
            }
          >
            <Download size={17} /> Download Excel template
          </button>
          <label className={`btn secondary ${locked ? "disabled" : ""}`}>
            <Upload size={17} />
            {busy ? "Reading workbook…" : "Import completed Excel"}
            <input
              className="sr-only"
              type="file"
              accept=".xlsx"
              disabled={locked || busy}
              onChange={(e) => {
                if (e.target.files?.[0]) importFile(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </label>
          <span className="badge">{data.gradeStatus}</span>
        </div>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {data.moderationNote && (
          <div className="demo-note">
            Exam Cell feedback: {data.moderationNote}
          </div>
        )}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Quiz /20</th>
                <th>Midsem /30</th>
                <th>Endsem /50</th>
                <th>Total /100</th>
                <th>GP</th>
              </tr>
            </thead>
            <tbody>
              {data.marks.map((r, i) => (
                <tr key={r.roll}>
                  <td>
                    <strong>{r.name}</strong>
                    <small className="block mono">{r.roll}</small>
                  </td>
                  {(["quiz", "mid", "end"] as const).map((k, j) => (
                    <td key={k}>
                      <input
                        className="mark-input"
                        aria-label={`${r.name} ${k}`}
                        type="number"
                        min="0"
                        max={[20, 30, 50][j]}
                        disabled={locked}
                        value={Number.isFinite(r[k]) ? r[k] : ""}
                        onChange={(e) =>
                          update((d) => ({
                            ...d,
                            marks: d.marks.map((x, n) =>
                              n === i
                                ? {
                                    ...x,
                                    [k]:
                                      e.target.value === ""
                                        ? NaN
                                        : Number(e.target.value),
                                  }
                                : x,
                            ),
                          }))
                        }
                      />
                    </td>
                  ))}
                  <td>{r.quiz + r.mid + r.end}</td>
                  <td>{gradePoint(r.quiz + r.mid + r.end)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel-footer">
          <p className="muted">
            Illustrative absolute grading. This demo course has no lab
            component.
          </p>
          <button
            className="btn"
            disabled={locked || !validMarks(data.marks)}
            onClick={() => {
              update(
                (d) => ({ ...d, gradeStatus: "Submitted", moderationNote: "" }),
                "Faculty submitted CS301 for moderation",
              );
              toast("Submitted to Exam Cell. Switch roles to review.");
            }}
          >
            Submit for moderation <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </>
  );
}
function Moderation() {
  const { data, update, toast } = useDemo();
  const [note, setNote] = useState("");
  return (
    <div className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">CS301 · B.TECH CSAI · BATCH 2023</span>
          <h2>Review the course submission.</h2>
        </div>
        <span className="badge">{data.gradeStatus}</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Roll number</th>
              <th>Name</th>
              <th>Total</th>
              <th>Grade points</th>
            </tr>
          </thead>
          <tbody>
            {data.marks.map((r) => (
              <tr key={r.roll}>
                <td>{r.roll}</td>
                <td>{r.name}</td>
                <td>{r.quiz + r.mid + r.end}</td>
                <td>{gradePoint(r.quiz + r.mid + r.end)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <label>
        Moderation note
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Explain a requested correction or approval."
        />
      </label>
      <div className="button-row">
        <button
          className="btn secondary"
          disabled={data.gradeStatus !== "Submitted" || !note.trim()}
          onClick={() => {
            update(
              (d) => ({ ...d, gradeStatus: "Returned", moderationNote: note }),
              "Exam Cell returned marks for correction",
            );
            toast("Returned to faculty with your feedback.");
          }}
        >
          Return for correction
        </button>
        <button
          className="btn"
          disabled={data.gradeStatus !== "Submitted"}
          onClick={() => {
            update(
              (d) => ({ ...d, gradeStatus: "Approved", moderationNote: note }),
              "Exam Cell approved grades",
            );
            toast("Approved. Ready to publish.");
          }}
        >
          Approve grades <Check size={17} />
        </button>
        <button
          className="btn"
          disabled={data.gradeStatus !== "Approved"}
          onClick={() => {
            update(
              (d) => ({ ...d, gradeStatus: "Published" }),
              "Results published locally; email dispatch simulated",
            );
            toast("Results published in the student demo. No email was sent.");
          }}
        >
          Publish results <ArrowUpRight size={17} />
        </button>
      </div>
      <p className="muted">
        Faculty must submit before moderation. Publication makes results visible
        in the Student workspace.
      </p>
    </div>
  );
}
function Results() {
  const { data } = useDemo();
  const rows = courses.map((c, i) => ({
    ...c,
    points:
      i === 0
        ? gradePoint(data.marks[0].quiz + data.marks[0].mid + data.marks[0].end)
        : [9, 8, 9, 8][i - 1],
  }));
  return (
    <div className="panel printable">
      <span className="eyebrow">
        DEMONSTRATION GRADE CARD · NOT AN OFFICIAL TRANSCRIPT
      </span>
      <h2>Semester III · 2026–27</h2>
      {data.gradeStatus !== "Published" ? (
        <div className="empty-state">
          <Clock size={36} />
          <h3>Your results haven’t been published yet.</h3>
          <p>
            Complete the Faculty submission and Exam Cell approval workflow to
            see this semester’s grade card.
          </p>
          <Login
            trigger={
              <button className="btn secondary">Switch demo role</button>
            }
          />
        </div>
      ) : (
        <>
          <p>Aarav Sharma · BCSAI2023001 · B.Tech CSAI</p>
          <div className="dashboard-stats">
            <div className="stat-card">
              <span>SGPA</span>
              <strong>{gpa(rows).toFixed(2)}</strong>
              <small>{rows.reduce((s, r) => s + r.credits, 0)} credits</small>
            </div>
            <div className="stat-card">
              <span>CGPA</span>
              <strong>
                {gpa([...rows, { credits: 40, points: 8.4 }]).toFixed(2)}
              </strong>
              <small>Includes 40 prior demo credits at 8.40</small>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Subject</th>
                  <th>Credits</th>
                  <th>Grade points</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.code}>
                    <td>{r.code}</td>
                    <td>{r.name}</td>
                    <td>{r.credits}</td>
                    <td>{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted">
            CS301 uses the submitted marks. Other course grades and previous
            credits are seeded demo values.
          </p>
          <button className="btn secondary" onClick={() => window.print()}>
            <Download size={17} /> Print / save grade card as PDF
          </button>
        </>
      )}
    </div>
  );
}
function Finance({ editable }: { editable: boolean }) {
  const { data, update, toast } = useDemo();
  const [q, setQ] = useState("");
  const [utr, setUtr] = useState("");
  const [fee, setFee] = useState("Hostel rent");
  const [error, setError] = useState("");
  async function importFees(file: File) {
    try {
      if (file.size > 2e6) throw Error("Workbook must be smaller than 2 MB.");
      const ExcelJS = await import("exceljs");
      const book = new ExcelJS.Workbook();
      await book.xlsx.load(await file.arrayBuffer());
      const s = book.worksheets[0];
      if (!s || s.rowCount !== 5) throw Error("Expected four fee records.");
      const rows = data.fees.map((r, i) => ({
        name: String(s.getCell(i + 2, 1).value),
        amount: Number(s.getCell(i + 2, 2).value),
        status: String(s.getCell(i + 2, 3).value),
        utr: String(s.getCell(i + 2, 4).value || ""),
      }));
      if (
        rows.some(
          (r, i) =>
            r.name !== data.fees[i].name ||
            r.amount !== data.fees[i].amount ||
            !["Paid", "Pending", "Partial"].includes(r.status) ||
            (r.status === "Paid" && !r.utr.trim()),
        )
      )
        throw Error(
          "Preserve fee categories and amounts, use Paid / Pending / Partial, and provide a UTR for paid records.",
        );
      update((d) => ({ ...d, fees: rows }), "Bank workbook reconciled");
      toast("Demo bank records reconciled.");
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid workbook.");
    }
  }
  return (
    <>
      <div className="panel">
        <div className="section-heading">
          <h2>Student fee ledger</h2>
          <button
            className="btn secondary"
            onClick={() =>
              workbookDownload("fees", data).catch(() =>
                setError("Export failed."),
              )
            }
          >
            <Download size={16} /> Export Excel
          </button>
        </div>
        <label>
          Find student
          <input
            placeholder="BCSAI2023001 or Aarav Sharma"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        {!q ||
        "bcsa i2023001 bc sai2023001 bcsai2023001 aarav sharma".includes(
          q.toLowerCase(),
        ) ? (
          <>
            <p>
              <strong>Aarav Sharma</strong> · BCSAI2023001 · B.Tech CSAI
            </p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fee category</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Transaction reference</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fees.map((f) => (
                    <tr key={f.name}>
                      <td>{f.name}</td>
                      <td>₹{f.amount.toLocaleString("en-IN")}</td>
                      <td>
                        <span
                          className={`badge ${f.status === "Paid" ? "green" : ""}`}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td>{f.utr || "—"}</td>
                      <td>
                        {f.status === "Paid" ? (
                          <button
                            className="text-link"
                            onClick={() =>
                              download(
                                "demo-receipt.txt",
                                `DEMONSTRATION RECEIPT — NOT VALID FOR PAYMENT\nAarav Sharma BCSAI2023001\n${f.name}: INR ${f.amount}\nReference: ${f.utr}`,
                              )
                            }
                          >
                            Download <Download size={15} />
                          </button>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ledger-total">
              Outstanding balance{" "}
              <strong>
                ₹
                {data.fees
                  .filter((f) => f.status !== "Paid")
                  .reduce((s, f) => s + f.amount, 0)
                  .toLocaleString("en-IN")}
              </strong>
            </div>
          </>
        ) : (
          <div className="empty-state">
            No matching student in the demo cohort.
          </div>
        )}
      </div>
      {editable ? (
        <div className="panel">
          <h3>Reconcile a payment</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update(
                (d) => ({
                  ...d,
                  fees: d.fees.map((f) =>
                    f.name === fee ? { ...f, status: "Paid", utr } : f,
                  ),
                }),
                "Accounts reconciled " + fee,
              );
              toast("Payment marked paid in the demo ledger.");
              setUtr("");
            }}
          >
            <div className="filter-bar">
              <label>
                Fee
                <select value={fee} onChange={(e) => setFee(e.target.value)}>
                  {data.fees.map((f) => (
                    <option key={f.name}>{f.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Bank / UTR reference
                <input
                  required
                  minLength={4}
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="DEMO-UTR-001"
                />
              </label>
              <button className="btn">
                Mark as paid <Check size={16} />
              </button>
            </div>
          </form>
          <label className="btn secondary">
            <Upload size={16} /> Import bank reconciliation
            <input
              className="sr-only"
              type="file"
              accept=".xlsx"
              onChange={(e) => {
                if (e.target.files?.[0]) importFees(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="panel">
          <h3>Payment options</h3>
          <p>
            For the demonstration, accounts staff can reconcile fees by
            switching to the Accounts role. Real payments are not processed
            here.
          </p>
          <Login
            trigger={
              <button className="btn secondary">Switch to a staff demo</button>
            }
          />
        </div>
      )}
    </>
  );
}
function Clearance({ role }: { role: Role }) {
  const { data, update, toast } = useDemo();
  const [note, setNote] = useState("");
  const student = role === "Student";
  const complete = data.stages.every((s) => s.status === "Approved");
  const pending = data.fees
    .filter((f) => f.status !== "Paid")
    .reduce((s, f) => s + f.amount, 0);
  return (
    <>
      <div className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BCSAI2023001 · AARAV SHARMA</span>
            <h2>Seven steps. One clearance.</h2>
          </div>
          <span className="badge green">
            {data.stages.filter((s) => s.status === "Approved").length} of 7
            approved
          </span>
        </div>
        {student && !data.clearance ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update(
                (d) => ({ ...d, clearance: true }),
                "Student initiated no-dues request",
              );
              toast(
                "Clearance request initiated. Switch to the staff roles to review.",
              );
            }}
          >
            <label>
              Reason
              <select
                value={data.reason}
                onChange={(e) =>
                  update((d) => ({ ...d, reason: e.target.value }))
                }
              >
                {["Graduation", "Withdrawal", "Caution money refund"].map(
                  (r) => (
                    <option key={r}>{r}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Demo bank reference (use sample data only)
              <input
                required
                minLength={4}
                value={data.bank}
                onChange={(e) =>
                  update((d) => ({ ...d, bank: e.target.value }))
                }
                placeholder="DEMO-BANK-001"
              />
            </label>
            <button className="btn">
              Initiate clearance <ArrowRight size={17} />
            </button>
          </form>
        ) : !data.clearance ? (
          <p>
            No clearance request yet. Initiate one in the Student workspace.
          </p>
        ) : (
          <>
            <p>
              Reason: {data.reason} · Demo bank reference: {data.bank}
            </p>
            <div className="clearance-progress">
              <span
                style={{
                  width: `${(data.stages.filter((s) => s.status === "Approved").length / 7) * 100}%`,
                }}
              />
            </div>
            <div className="clearance-list">
              {data.stages.map((s, i) => {
                const authorized =
                  role === "Super Admin" ||
                  (role === "Faculty" && i === 2) ||
                  (role === "Accounts" && i === 6);
                const previous = data.stages
                  .slice(0, i)
                  .every((s) => s.status === "Approved");
                return (
                  <div key={s.name}>
                    <span
                      className={`step-icon ${s.status === "Approved" ? "done" : ""}`}
                    >
                      {s.status === "Approved" ? <Check size={17} /> : i + 1}
                    </span>
                    <div>
                      <strong>{s.name}</strong>
                      <small>
                        {s.note ||
                          [
                            "Academic credits and requirements",
                            "Library returns and outstanding fines",
                            "Laboratory assets and equipment",
                            "Room inspection and vacation",
                            "Mess balance reconciliation",
                            "Sports equipment returns",
                            "Final balance and refund verification",
                          ][i]}
                      </small>
                    </div>
                    <span className="badge">{s.status}</span>
                    {!student && authorized && (
                      <div className="button-row">
                        <button
                          className="btn small"
                          disabled={
                            !previous ||
                            s.status === "Approved" ||
                            (i === 6 && pending > 0)
                          }
                          onClick={() => {
                            update(
                              (d) => ({
                                ...d,
                                stages: d.stages.map((x, n) =>
                                  n === i
                                    ? { ...x, status: "Approved", note }
                                    : x,
                                ),
                              }),
                              `${role} approved ${s.name}`,
                            );
                            toast(`${s.name} approved.`);
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="text-link"
                          disabled={!note.trim() || s.status === "Approved"}
                          onClick={() =>
                            update(
                              (d) => ({
                                ...d,
                                stages: d.stages.map((x, n) =>
                                  n === i
                                    ? { ...x, status: "Needs action", note }
                                    : x,
                                ),
                              }),
                              "Clearance clarification requested",
                            )
                          }
                        >
                          Needs action
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!student && (
              <>
                <label>
                  Review note
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Reason for clarification or approval"
                  />
                </label>
                <p className="muted">
                  Approvals follow the stage order. Faculty handles labs;
                  Accounts handles final clearance. Use Super Admin to
                  demonstrate the other department approvals. Accounts requires
                  a zero outstanding balance.
                </p>
              </>
            )}
            {complete && (
              <div className="success">
                <h3>All departments cleared.</h3>
                <p>
                  Illustrative caution deposit: ₹10,000 · Deductions: ₹0 ·
                  Refund preview: ₹10,000. No refund is executed.
                </p>
                <button
                  className="btn secondary"
                  onClick={() => window.print()}
                >
                  <Download size={17} /> Print demo clearance certificate
                </button>
                <p>
                  DEMO CERTIFICATE · No official signature or verification QR
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
function Requests() {
  const { data, update, toast } = useDemo();
  return (
    <>
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          update(
            (d) => ({
              ...d,
              requests: [
                ...d.requests,
                {
                  id: `REQ-${Date.now().toString().slice(-7)}`,
                  type: String(f.get("type")),
                  text: String(f.get("text")),
                  status: "Submitted",
                },
              ],
            }),
            "Student service request created",
          );
          toast("Request saved locally.");
          e.currentTarget.reset();
        }}
      >
        <h3>How can we help?</h3>
        <label>
          Request type
          <select name="type">
            {[
              "Bonafide certificate",
              "Transcript",
              "Leave application",
              "Hostel maintenance",
              "Fee clarification",
              "Grievance",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Details
          <textarea name="text" required minLength={10} />
        </label>
        <button className="btn">
          Submit demo request <ArrowRight size={17} />
        </button>
      </form>
      <div className="panel">
        <h3>Your requests</h3>
        {data.requests.length ? (
          data.requests.map((r) => (
            <div className="list-link" key={r.id}>
              <div>
                <strong>{r.type}</strong>
                <p>{r.text}</p>
                <small>{r.id}</small>
              </div>
              <span className="badge">{r.status}</span>
            </div>
          ))
        ) : (
          <p className="muted">
            No requests yet. Submit one above to see its status here.
          </p>
        )}
      </div>
    </>
  );
}
function Hostel() {
  const [day, setDay] = useState("Monday");
  return (
    <>
      <div className="two-col">
        <div className="panel">
          <Building2 size={27} />
          <h2>Your campus home.</h2>
          <span className="badge">Sample allotment</span>
          <p>Hostel A · Room 214 · Shared accommodation</p>
          <Link className="btn secondary" href="/dashboard/student/requests">
            Report a maintenance issue
          </Link>
        </div>
        <div className="panel">
          <h3>Daily mess menu</h3>
          <label>
            Day
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          {[
            [
              "Breakfast",
              day === "Monday" ? "Poha, fruit & tea" : "Paratha, curd & tea",
            ],
            [
              "Lunch",
              day === "Friday"
                ? "Rajma, rice & salad"
                : "Dal, rice, roti & vegetables",
            ],
            [
              "Dinner",
              day === "Sunday"
                ? "Paneer, roti & rice"
                : "Seasonal vegetables, dal & roti",
            ],
          ].map(([n, v]) => (
            <div className="list-link" key={n}>
              <strong>{n}</strong>
              <span>{v}</span>
            </div>
          ))}
          <p className="muted small">
            Illustrative menu for the demonstration.
          </p>
        </div>
      </div>
      <Link className="text-link" href="/campus-life/hostels">
        Hostel rules & official resources →
      </Link>
    </>
  );
}
function Content() {
  const { data, update, toast } = useDemo();
  const [hero, setHero] = useState(data.hero);
  const [stats, setStats] = useState(data.stats);
  return (
    <>
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          update((d) => ({ ...d, hero, stats }), "Homepage content updated");
          toast("Homepage updated in this browser.");
        }}
      >
        <h2>Make the first impression.</h2>
        <label>
          Homepage headline
          <input
            required
            maxLength={85}
            value={hero}
            onChange={(e) => setHero(e.target.value)}
          />
        </label>
        <div className="filter-bar">
          {["Program count", "B.Tech pathways", "Established year"].map(
            (n, i) => (
              <label key={n}>
                {n}
                <input
                  required
                  value={stats[i]}
                  onChange={(e) =>
                    setStats((s) =>
                      s.map((v, j) => (i === j ? e.target.value : v)),
                    )
                  }
                />
              </label>
            ),
          )}
        </div>
        <div className="button-row">
          <button className="btn">
            Save homepage <Check size={17} />
          </button>
          <Link className="btn secondary" href="/">
            Preview website <ArrowUpRight size={17} />
          </Link>
        </div>
      </form>
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          update(
            (d) => ({
              ...d,
              notices: [
                { title: String(f.get("title")), body: String(f.get("body")) },
                ...d.notices,
              ],
            }),
            "Notice published locally",
          );
          toast("Notice added to the public news page.");
          e.currentTarget.reset();
        }}
      >
        <h3>Publish an announcement</h3>
        <label>
          Title
          <input required name="title" />
        </label>
        <label>
          Announcement
          <textarea required name="body" />
        </label>
        <button className="btn">
          Publish demo notice <ArrowUpRight size={17} />
        </button>
      </form>
    </>
  );
}
function TenderManager() {
  const { data, update, toast } = useDemo();
  const [selected, setSelected] = useState(data.tenders[0].id);
  const item = data.tenders.find((t) => t.id === selected)!;
  return (
    <>
      <div className="panel">
        <h3>Manage tender lifecycle</h3>
        <label>
          Tender
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {data.tenders.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={item.status}
            onChange={(e) =>
              update(
                (d) => ({
                  ...d,
                  tenders: d.tenders.map((t) =>
                    t.id === selected ? { ...t, status: e.target.value } : t,
                  ),
                }),
                "Tender status changed",
              )
            }
          >
            {[
              "Active",
              "Extended",
              "Under evaluation",
              "Awarded",
              "Archived",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Closing date
          <input
            type="date"
            value={item.closing}
            onChange={(e) =>
              update((d) => ({
                ...d,
                tenders: d.tenders.map((t) =>
                  t.id === selected ? { ...t, closing: e.target.value } : t,
                ),
              }))
            }
          />
        </label>
        <label>
          Corrigendum
          <textarea
            value={item.corrigenda}
            onChange={(e) =>
              update((d) => ({
                ...d,
                tenders: d.tenders.map((t) =>
                  t.id === selected ? { ...t, corrigenda: e.target.value } : t,
                ),
              }))
            }
          />
        </label>
        <p className="muted">Changes save locally as you edit.</p>
        <Link className="btn secondary" href="/tenders">
          Preview procurement page <ArrowUpRight size={17} />
        </Link>
      </div>
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          update(
            (d) => ({
              ...d,
              tenders: [
                {
                  id: String(f.get("id")),
                  title: String(f.get("title")),
                  description: String(f.get("description")),
                  closing: String(f.get("date")),
                  status: "Active",
                  corrigenda: "",
                },
                ...d.tenders,
              ],
            }),
            "Demo tender created",
          );
          toast("Tender added.");
          e.currentTarget.reset();
        }}
      >
        <h3>New tender notice</h3>
        <label>
          Reference number
          <input name="id" required />
        </label>
        <label>
          Title
          <input name="title" required />
        </label>
        <label>
          Description
          <textarea name="description" required />
        </label>
        <label>
          Closing date
          <input type="date" name="date" required />
        </label>
        <button className="btn">
          Create tender <Plus size={17} />
        </button>
      </form>
    </>
  );
}
function Access({ mode }: { mode: string }) {
  const { data, update, toast } = useDemo();
  return (
    <div className="panel">
      <h2>
        {mode === "roles"
          ? "Design the right access."
          : "People in your campus."}
      </h2>
      <p className="muted">
        These controls demonstrate administration only. Client-side role
        selection is not authentication or authorization.
      </p>
      {mode === "roles" ? (
        <>
          <h3>Custom role permission preview</h3>
          {[
            "users:manage",
            "rbac:assign",
            "cms:homepage",
            "tenders:manage",
            "grades:upload",
            "grades:publish",
            "fees:manage",
            "nodues:clear",
          ].map((p) => (
            <label className="toggle" key={p}>
              <input
                type="checkbox"
                checked={data.permissions.includes(p)}
                onChange={(e) =>
                  update(
                    (d) => ({
                      ...d,
                      permissions: e.target.checked
                        ? [...d.permissions, p]
                        : d.permissions.filter((x) => x !== p),
                    }),
                    "Permission preview changed",
                  )
                }
              />
              {p}
            </label>
          ))}
          <p>
            Permission selections are stored for review; they do not alter the
            predefined demo workspaces.
          </p>
        </>
      ) : (
        <>
          {data.users.map((u, i) => (
            <div className="list-link" key={i}>
              <strong>{u.name}</strong>
              <label>
                Role
                <select
                  value={u.role}
                  onChange={(e) =>
                    update(
                      (d) => ({
                        ...d,
                        users: d.users.map((x, j) =>
                          j === i ? { ...x, role: e.target.value } : x,
                        ),
                      }),
                      "Demo user role changed",
                    )
                  }
                >
                  {roles.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <button
                className="btn secondary"
                onClick={() =>
                  update(
                    (d) => ({
                      ...d,
                      users: d.users.map((x, j) =>
                        j === i ? { ...x, active: !x.active } : x,
                      ),
                    }),
                    "Demo user status changed",
                  )
                }
              >
                {u.active ? "Suspend" : "Reactivate"}
              </button>
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              update(
                (d) => ({
                  ...d,
                  users: [
                    ...d.users,
                    {
                      name: String(f.get("name")),
                      role: "Student",
                      active: true,
                    },
                  ],
                }),
                "Demo user created",
              );
              toast("Demo user added.");
              e.currentTarget.reset();
            }}
          >
            <label>
              New user name
              <input required name="name" />
            </label>
            <button className="btn">
              Add demo user <Plus size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
function CurriculumEditor() {
  const { data, update, toast } = useDemo();
  return (
    <form
      className="panel"
      onSubmit={(e) => {
        e.preventDefault();
        toast("Course description saved locally.");
      }}
    >
      <h2>Assigned subject: CS301</h2>
      <p>Design & Analysis of Algorithms · 5 credits · 3–1–2</p>
      <label>
        Syllabus description
        <textarea
          rows={6}
          value={data.syllabus}
          onChange={(e) =>
            update(
              (d) => ({ ...d, syllabus: e.target.value }),
              "Syllabus edited",
            )
          }
        />
      </label>
      <button className="btn">
        Save syllabus <Check size={16} />
      </button>
      <p className="muted">
        This editing preview is separate from the sample public course catalog
        pending academic approval.
      </p>
    </form>
  );
}
function MediaManager() {
  const { data, update, toast } = useDemo();
  const [alt, setAlt] = useState("");
  return (
    <>
      <div className="panel">
        <h2>Campus media library</h2>
        <label>
          Image description
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image for screen readers"
          />
        </label>
        <label className="btn secondary">
          <Upload size={17} /> Add image
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={!alt.trim()}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 700000) {
                toast("Use an image smaller than 700 KB for local storage.");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                update(
                  (d) => ({
                    ...d,
                    gallery: [
                      ...d.gallery,
                      { src: String(reader.result), alt },
                    ],
                  }),
                  "Media image added",
                );
                toast("Image added to the demo gallery.");
                setAlt("");
              };
              reader.readAsDataURL(f);
            }}
          />
        </label>
        <div className="gallery-grid">
          {data.gallery.map((m, i) => (
            <div key={i}>
              <img src={m.src} alt={m.alt} />
              <p>{m.alt}</p>
              <button
                className="text-link"
                disabled={i === 0}
                onClick={() =>
                  update((d) => {
                    const g = [...d.gallery];
                    [g[i - 1], g[i]] = [g[i], g[i - 1]];
                    return { ...d, gallery: g };
                  })
                }
              >
                Move earlier
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3>Admission brochure replacement preview</h3>
        <label className="btn secondary">
          <Upload size={17} /> Choose PDF
          <input
            type="file"
            className="sr-only"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                update(
                  (d) => ({ ...d, brochureName: f.name }),
                  "Brochure replacement selected",
                );
                toast(
                  "Filename recorded. Production will upload the document.",
                );
              }
            }}
          />
        </label>
        <p>{data.brochureName || "No replacement selected."}</p>
        <p className="muted">
          File selection demonstrates the workflow. PDF contents are not stored
          or published.
        </p>
      </div>
    </>
  );
}
