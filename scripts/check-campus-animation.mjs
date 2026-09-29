import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.TEST_BASE_URL || "http://localhost:3001";
await page.goto(base, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.locator('.vapour-text[data-ready="true"]').first().waitFor();
assert.equal(await page.locator(".depth-latin").innerText(), "IIIT LUCKNOW");
assert.equal(await page.locator(".depth-branches").count(), 0);
assert.equal(
  await page.locator("#campus").innerText(),
  "IIIT LUCKNOW",
  "Only the English wordmark remains in the campus scene",
);
const go = async (p) => {
  const target = await page.locator("#campus").evaluate((el, p) => {
    const r = el.getBoundingClientRect();
    return scrollY + r.top - innerHeight + p * (r.height + innerHeight);
  }, p);
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    target,
  );
  await page.waitForTimeout(900);
  return await page.locator("#campus").evaluate((el) => {
    const y = (s) =>
      new DOMMatrix(getComputedStyle(el.querySelector(s)).transform).m42;
    return {
      text: y(".depth-copy"),
      base: y(".depth-base"),
      front: y(".depth-front"),
    };
  });
};
const checkWordmark = async () => {
  const geometry = await page.locator("#campus").evaluate((scene) => {
    const canvas = scene.querySelector(".depth-latin canvas");
    if (!canvas) throw new Error("Wordmark canvas is missing");
    const rect = canvas.getBoundingClientRect();
    const data = canvas
      .getContext("2d")
      .getImageData(0, 0, canvas.width, canvas.height).data;
    // Mean alpha per horizontal band, used to prove the top-to-bottom fade.
    const bands = 10;
    const sums = new Array(bands).fill(0);
    const counts = new Array(bands).fill(0);
    let top = canvas.height;
    let bottom = 0;
    for (let y = 0; y < canvas.height; y++) {
      const band = Math.min(bands - 1, Math.floor((y / canvas.height) * bands));
      for (let x = 0; x < canvas.width; x++) {
        const alpha = data[(y * canvas.width + x) * 4 + 3];
        if (alpha > 8) {
          sums[band] += alpha;
          counts[band] += 1;
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
      }
    }
    const mean = sums.map((sum, i) => (counts[i] ? sum / counts[i] : 0));
    const building = scene
      .querySelector(".depth-front")
      .getBoundingClientRect();
    return {
      mean,
      top: rect.top + (top * rect.height) / canvas.height,
      bottom: rect.top + (bottom * rect.height) / canvas.height,
      roof: building.top + building.height * 0.175,
    };
  });
  const upper = Math.max(...geometry.mean.slice(0, 3));
  const lower = Math.min(...geometry.mean.slice(-3));
  assert.ok(
    upper > lower * 1.35,
    `Wordmark should fade from a solid top to a faint base: ${JSON.stringify(geometry.mean)}`,
  );
  assert.ok(
    geometry.top > 0 && geometry.bottom < 900,
    "Wordmark stays within the stage",
  );
  assert.equal(
    await page.locator(".depth-sanskrit").count(),
    0,
    "The Hindi subtitle is removed",
  );
};
const early = await go(0.18);
const alpha = () =>
  page.locator(".depth-latin canvas").evaluate((c) => {
    const data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let sum = 0;
    for (let i = 3; i < data.length; i += 4) sum += data[i];
    return sum;
  });
const earlyAlpha = await alpha();
await go(0.4);
const forming = await page
  .locator(".depth-latin canvas")
  .evaluate((c) => c.toDataURL());
const formingAlpha = await alpha();
await page.screenshot({ path: "/tmp/iiitl-campus-forming.png" });
const assembled = await go(0.56);
await checkWordmark();
const fullAlpha = await alpha();
const fullText = await page
  .locator(".depth-latin canvas")
  .evaluate((c) => c.toDataURL());
await page.screenshot({ path: "/tmp/iiitl-campus-desktop.png" });
assert.ok(
  early.text - assembled.text > 80,
  "Text must rise out of the building",
);
assert.ok(
  earlyAlpha < formingAlpha && formingAlpha < fullAlpha,
  "Particles should form the text, not dissolve it",
);
assert.ok(
  Math.abs(assembled.base - assembled.front) < 0.01,
  "Building layers stay aligned",
);
const late = await go(0.78);
assert.ok(
  late.text > assembled.text + 50,
  "After the reveal the text sinks back down behind the building",
);
const midHold = await go(0.565);
assert.ok(
  Math.abs(midHold.text - assembled.text) < 1,
  "Text holds still between the reveal and the sink",
);
assert.equal(
  await page.locator(".depth-latin canvas").evaluate((c) => c.toDataURL()),
  fullText,
  "Sinking must not re-trigger the particle animation",
);
assert.ok(
  Math.abs(late.base - assembled.base) > 5,
  "Building retains parallax after the reveal",
);
await go(0.4);
assert.equal(
  await page.locator(".depth-latin canvas").evaluate((c) => c.toDataURL()),
  forming,
  "The forming state is reversible",
);
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await go(0.56);
await checkWordmark();
await page.screenshot({ path: "/tmp/iiitl-campus-mobile.png" });
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  "No mobile overflow",
);
const bounds = await page.locator(".depth-latin canvas").evaluate((c) => {
  const a = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let left = c.width,
    right = 0,
    count = 0;
  for (let y = 0; y < c.height; y++)
    for (let x = 0; x < c.width; x++)
      if (a[(y * c.width + x) * 4 + 3]) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        count++;
      }
  return { left, right, width: c.width, count };
});
assert.ok(
  bounds.count > 1000 && bounds.left > 0 && bounds.right < bounds.width - 1,
  "Full text should fit within the mobile canvas",
);
await page.emulateMedia({ reducedMotion: "reduce" });
await page.waitForTimeout(400);
const staticBefore = await go(0.56);
const still = await page
  .locator(".depth-latin canvas")
  .evaluate((c) => c.toDataURL());
const staticAfter = await go(0.73);
assert.deepEqual(staticAfter, staticBefore, "Reduced motion disables parallax");
assert.equal(
  await page.locator(".depth-latin canvas").evaluate((c) => c.toDataURL()),
  still,
  "Reduced motion disables particle changes",
);
await go(0.56);
await page.screenshot({ path: "/tmp/iiitl-campus-reduced.png" });
assert.deepEqual(errors, []);
console.log(
  "PASS uppercase title, no Hindi subtitle, top-down fade, text forms and rises, stays visible, parallax, reversible particles, mobile fit, reduced motion, no runtime errors",
);
await browser.close();
