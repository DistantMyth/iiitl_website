import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
const base = process.env.TEST_BASE_URL || "http://localhost:3001";
await page.goto(base, { waitUntil: "networkidle" });
// Walk the page so loading="lazy" images actually request, otherwise every
// below-the-fold image reports as "broken" purely because it never loaded.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForLoadState("networkidle");
await page.screenshot({ path: "/tmp/iiitl-desktop.png", fullPage: true });
console.log(
  "title",
  await page.title(),
  "heading",
  await page.locator("h1").innerText(),
);
// Only count images the browser was actually asked to load. A loading="lazy"
// image that never entered the viewport has not been requested yet, so calling
// it broken reports a false positive.
console.log(
  "broken images",
  await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs
        .filter((i) => i.loading !== "lazy" && (!i.complete || !i.naturalWidth))
        .map((i) => i.src),
    ),
);
await page.getByRole("button", { name: "Portal login" }).click();
await page.getByRole("link", { name: /Login as Faculty/ }).click();
await page
  .getByRole("navigation", { name: "Portal navigation" })
  .getByRole("link", { name: "Marks & grading" })
  .click();
await page.getByRole("button", { name: "Submit for moderation" }).click();
await page.goto(base + "/dashboard/exam-cell/moderation", {
  waitUntil: "networkidle",
});
await page.getByRole("button", { name: "Approve grades", exact: true }).click();
await page
  .getByRole("button", { name: "Publish results", exact: true })
  .click();
await page.goto(base + "/dashboard/student/results", {
  waitUntil: "networkidle",
});
await page.getByRole("button", { name: /Print \/ save grade card/ }).waitFor();
console.log("PASS grading flow");
await page.screenshot({ path: "/tmp/iiitl-portal.png", fullPage: true });
await page.goto(base + "/dashboard/student/no-dues", {
  waitUntil: "networkidle",
});
await page.getByPlaceholder("DEMO-BANK-001").fill("DEMO-BANK-001");
await page.getByRole("button", { name: "Initiate clearance" }).click();
await page.goto(base + "/dashboard/super-admin/clearance", {
  waitUntil: "networkidle",
});
for (let i = 0; i < 6; i++)
  await page
    .getByRole("button", { name: "Approve", exact: true })
    .nth(i)
    .click();
if (
  !(await page
    .getByRole("button", { name: "Approve", exact: true })
    .nth(6)
    .isDisabled())
)
  throw Error("Accounts must wait for unpaid fees");
await page.goto(base + "/dashboard/accounts/accounts", {
  waitUntil: "networkidle",
});
await page.getByRole("combobox").first().selectOption("Hostel rent");
await page.getByPlaceholder("DEMO-UTR-001").fill("DEMO-UTR-100");
await page.getByRole("button", { name: "Mark as paid" }).click();
await page.getByRole("combobox").first().selectOption("Mess advance");
await page.getByPlaceholder("DEMO-UTR-001").fill("DEMO-UTR-101");
await page.getByRole("button", { name: "Mark as paid" }).click();
await page.goto(base + "/dashboard/accounts/clearance", {
  waitUntil: "networkidle",
});
await page.getByRole("button", { name: "Approve", exact: true }).click();
await page.getByText("All departments cleared.", { exact: true }).waitFor();
console.log("PASS fee reconciliation and ordered clearance");
await page.goto(base + "/dashboard/institute-admin/content", {
  waitUntil: "networkidle",
});
await page
  .getByLabel("Homepage headline")
  .fill("A new world of possibilities.");
await page.getByRole("button", { name: "Save homepage" }).click();
await page.goto(base, { waitUntil: "networkidle" });
if ((await page.locator("h1").innerText()) !== "A new world of possibilities.")
  throw Error("CMS did not persist");
console.log("PASS CMS persistence");
await page.evaluate(() => localStorage.removeItem("iiitl-demo-v1"));
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base, { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/iiitl-mobile.png", fullPage: true });
if (
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
)
  throw Error("Mobile horizontal overflow");
await page.getByRole("button", { name: "Toggle navigation" }).click();
await page.getByRole("button", { name: "Academics", exact: false }).click();
await page.getByRole("link", { name: "Course explorer", exact: true }).click();
await page.getByPlaceholder("Name or course code").fill("CS301");
if ((await page.locator("tbody tr").count()) !== 1)
  throw Error("Course filter failed");
console.log("PASS mobile navigation and course search");
console.log("browser errors", errors);
if (errors.length) throw Error(errors.join("\n"));
await browser.close();
