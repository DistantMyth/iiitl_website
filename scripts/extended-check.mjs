import { chromium } from "@playwright/test";
import ExcelJS from "exceljs";
import fs from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:3001";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(base + "/dashboard/faculty/grades", {
  waitUntil: "networkidle",
});
const promise = page.waitForEvent("download");
await page.getByRole("button", { name: "Download Excel template" }).click();
const dl = await promise;
const path = "/tmp/iiitl-test-workbook.xlsx";
await dl.saveAs(path);
const book = new ExcelJS.Workbook();
await book.xlsx.readFile(path);
book.worksheets[0].getCell("C2").value = 20;
await book.xlsx.writeFile(path);
await page.locator("input[type=file]").setInputFiles(path);
await page
  .getByText("Workbook validated and imported.", { exact: false })
  .waitFor();
if ((await page.getByLabel("Aarav Sharma quiz").inputValue()) !== "20")
  throw Error("Workbook not applied");
book.worksheets[0].getCell("A2").value = "WRONG";
await book.xlsx.writeFile(path);
await page.locator("input[type=file]").setInputFiles(path);
await page.getByRole("alert").waitFor();
console.log("PASS XLSX download, import, and tampered roster rejection");
await page.goto(base + "/dashboard/accounts/accounts", {
  waitUntil: "networkidle",
});
const fp = page.waitForEvent("download");
await page.getByRole("button", { name: "Export Excel" }).click();
const fdl = await fp;
await fdl.saveAs("/tmp/iiitl-test-fees.xlsx");
const fees = new ExcelJS.Workbook();
await fees.xlsx.readFile("/tmp/iiitl-test-fees.xlsx");
fees.worksheets[0].getCell("C4").value = "Paid";
fees.worksheets[0].getCell("D4").value = "DEMO-IMPORT-001";
await fees.xlsx.writeFile("/tmp/iiitl-test-fees.xlsx");
await page
  .locator("input[type=file]")
  .setInputFiles("/tmp/iiitl-test-fees.xlsx");
await page
  .getByText("Demo bank records reconciled.", { exact: true })
  .waitFor();
console.log("PASS bank workbook roundtrip");
await page.goto(base, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Accessibility settings" }).click();
await page.getByRole("checkbox", { name: "High contrast" }).check();
if (
  !(await page
    .locator("html")
    .evaluate((e) => e.classList.contains("high-contrast")))
)
  throw Error("Contrast toggle failed");
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Accessibility settings" }).click();
await page.getByRole("checkbox", { name: "High contrast" }).uncheck();
await page.keyboard.press("Escape");
await page.keyboard.press("Control+k");
await page.getByPlaceholder("Search programs, fees, faculty…").fill("calendar");
await page
  .getByRole("dialog")
  .getByRole("link", { name: "Academic calendar" })
  .click();
console.log("PASS accessibility settings and keyboard search");
await page.goto(base + "/academics/calendar", { waitUntil: "networkidle" });
const cp = page.waitForEvent("download");
await page.getByRole("button", { name: "Export month to calendar" }).click();
const cdl = await cp;
await cdl.saveAs("/tmp/iiitl-calendar.ics");
if (
  !(await fs.readFile("/tmp/iiitl-calendar.ics", "utf8")).includes(
    "BEGIN:VEVENT",
  )
)
  throw Error("Calendar empty");
const routeSet = new Set([
  "/",
  "/admissions",
  "/academics",
  "/academics/course-structure",
  "/academics/calendar",
  "/academics/fees",
  "/academics/phd",
  "/research",
  "/research/wcarl",
  "/research/create",
  "/research/cdsai",
  "/research/publications",
  "/campus-life",
  "/campus-life/clubs",
  "/campus-life/clubs/axios",
  "/campus-life/cultural",
  "/campus-life/gallery",
  "/campus-life/hostels",
  "/campus-life/counselling",
  "/campus-life/sports",
  "/people/faculty",
  "/people/staff",
  "/people/alumni",
  "/people/research-scholars",
  "/placements",
  "/careers",
  "/tenders",
  "/forms",
  "/media",
  "/statutory/rti",
  "/statutory/nirf",
  "/directory",
  "/news",
  "/contact",
  "/about",
  "/about/directorate",
  "/about/founding-director",
  "/about/at-a-glance",
  "/about/demo",
  "/governance",
  ...[
    "board-of-governors",
    "senate",
    "finance-committee",
    "building-works",
    "rajbhasha",
    "icc",
    "disciplinary",
    "anti-ragging",
    "sgrc",
  ].map((s) => "/governance/" + s),
]);
const legacy = JSON.parse(await fs.readFile("lib/legacy.json", "utf8"));
legacy.forEach((p) => routeSet.add("/legacy/" + p.slug));
let bad = [];
for (const route of routeSet) {
  const r = await page.request.get(base + route);
  if (r.status() !== 200) bad.push([route, r.status()]);
}
if (bad.length) throw Error("Broken routes " + JSON.stringify(bad));
console.log("PASS " + routeSet.size + " public routes");
const unknown = await page.request.get(base + "/not-a-real-page");
if (unknown.status() !== 404) throw Error("Expected 404");
for (const route of [
  "/",
  "/academics",
  "/people/faculty",
  "/tenders",
  "/dashboard/student",
  "/dashboard/faculty/grades",
  "/dashboard/accounts/clearance",
]) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + route, { waitUntil: "networkidle" });
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw Error("Overflow " + route);
}
console.log("PASS mobile overflow checks");
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(base, { waitUntil: "networkidle" });
if (
  (await page
    .locator(".scroll-cue svg")
    .evaluate((e) => getComputedStyle(e).animationName)) !== "none"
)
  throw Error("Reduced motion ignored");
await page.screenshot({ path: "/tmp/iiitl-mobile-final.png", fullPage: true });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(base, { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/iiitl-desktop-final.png", fullPage: true });
await page.locator("#campus").scrollIntoViewIfNeeded();
await page.screenshot({ path: "/tmp/iiitl-depth.png" });
if (errors.length) throw Error(errors.join("\n"));
console.log("PASS reduced motion, exports, and browser error checks");
await browser.close();
