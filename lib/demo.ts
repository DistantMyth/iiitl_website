import { courses, stages } from "./catalog";
export const gradePoint = (mark: number) =>
  mark >= 90
    ? 10
    : mark >= 80
      ? 9
      : mark >= 70
        ? 8
        : mark >= 60
          ? 7
          : mark >= 50
            ? 6
            : mark >= 40
              ? 5
              : 0;
export const gpa = (rows: { credits: number; points: number }[]) => {
  const credits = rows.reduce((s, r) => s + r.credits, 0);
  return credits
    ? rows.reduce((s, r) => s + r.credits * r.points, 0) / credits
    : 0;
};
export const initialState = {
  hero: "Shaping a smarter tomorrow.",
  marks: [
    { roll: "BCSAI2023001", name: "Aarav Sharma", quiz: 17, mid: 25, end: 43 },
    { roll: "BCSAI2023002", name: "Ananya Singh", quiz: 19, mid: 27, end: 46 },
    { roll: "BCSAI2023003", name: "Rohan Verma", quiz: 15, mid: 23, end: 39 },
  ],
  gradeStatus: "Draft",
  moderationNote: "",
  fees: [
    {
      name: "Tuition fee",
      amount: 110000,
      status: "Paid",
      utr: "DEMO-2026-001",
    },
    {
      name: "Institute charges",
      amount: 12500,
      status: "Paid",
      utr: "DEMO-2026-002",
    },
    { name: "Hostel rent", amount: 18000, status: "Pending", utr: "" },
    { name: "Mess advance", amount: 15000, status: "Pending", utr: "" },
  ],
  clearance: false,
  reason: "Graduation",
  bank: "",
  stages: stages.map((name) => ({ name, status: "Pending", note: "" })),
  requests: [] as { id: string; type: string; text: string; status: string }[],
  notices: [] as { title: string; body: string }[],
  tenders: [
    {
      id: "IIITL/PROC/2026/014",
      title: "Supply and installation of laboratory workstations",
      closing: "2026-10-20",
      status: "Active",
      description:
        "Demonstration procurement record for computing laboratory workstations.",
      corrigenda: "",
    },
    {
      id: "IIITL/PROC/2026/009",
      title: "Campus network maintenance services",
      closing: "2026-10-12",
      status: "Extended",
      description:
        "Demonstration procurement record for annual network maintenance.",
      corrigenda: "Submission date extended to 12 October 2026.",
    },
    {
      id: "IIITL/PROC/2026/003",
      title: "Library digital resource subscription",
      closing: "2026-08-10",
      status: "Archived",
      description: "Archived demonstration procurement record.",
      corrigenda: "",
    },
  ],
  permissions: ["users:manage", "cms:homepage", "grades:publish"],
  audit: [] as string[],
  syllabus: courses[0].description,
  gallery: [] as { src: string; alt: string }[],
  brochureName: "",
  stats: ["10", "4", "2015"],
  users: [
    { name: "Aarav Sharma", role: "Student", active: true },
    { name: "Demo Faculty", role: "Faculty", active: true },
  ],
};
export type DemoState = typeof initialState;
export function download(name: string, text: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function validMarks(rows: DemoState["marks"]) {
  return (
    rows.length === 3 &&
    rows.every(
      (r, i) =>
        r.roll === initialState.marks[i].roll &&
        r.name === initialState.marks[i].name &&
        ["quiz", "mid", "end"].every((k, j) => {
          const v = r[k as "quiz"];
          return Number.isFinite(v) && v >= 0 && v <= [20, 30, 50][j];
        }),
    )
  );
}
