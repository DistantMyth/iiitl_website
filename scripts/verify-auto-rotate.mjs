import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const base = "http://127.0.0.1:4310";

await page.goto(`${base}/campus-life`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const frame = page.locator(".marquee-wrap .gallery-carousel-frame").first();
await frame.waitFor();
console.log("PASS coverflow present on /campus-life");

const idx = () =>
  page.locator(".marquee-wrap .gallery-carousel-count").innerText();
const start = await idx();
console.log("start index:", start);

// 1. It rotates on its own with no interaction at all.
await page.waitForTimeout(5200);
const afterIdle = await idx();
console.log("after 5.2s idle:", afterIdle);
assert.notEqual(
  afterIdle,
  start,
  "carousel should auto-advance with no interaction",
);

// 2. Hovering pauses it.
await frame.hover();
await page.waitForTimeout(300);
const paused1 = await idx();
const pausedAttr = await frame.getAttribute("data-paused");
console.log("data-paused while hovered:", pausedAttr);
assert.equal(pausedAttr, "true", "hovering should mark the carousel paused");
await page.waitForTimeout(5200);
const paused2 = await idx();
console.log("after 5.2s hovered:", paused2);
assert.equal(paused2, paused1, "carousel must not advance while hovered");

// 3. Leaving resumes it.
await page.mouse.move(5, 5);
await page.waitForTimeout(300);
assert.equal(
  await frame.getAttribute("data-paused"),
  "false",
  "leaving should resume",
);
await page.waitForTimeout(5200);
const afterResume = await idx();
console.log("after resume 5.2s:", afterResume);
assert.notEqual(
  afterResume,
  paused2,
  "carousel should advance again after leaving",
);

// 4. Card transforms actually differ (the rake is painting).
const t0 = await page
  .locator(".marquee-wrap .gallery-carousel-card")
  .first()
  .evaluate((n) => n.style.transform);
assert.ok(
  t0 && t0.includes("rotateY"),
  "cards should be transformed with a Y rotation",
);
console.log("card transform sample:", t0.slice(0, 70) + "...");

// 5. Captions track the active card.
const caption = await page
  .locator(".marquee-wrap .gallery-carousel-caption strong")
  .innerText();
console.log("caption:", caption);
assert.ok(caption.length > 0, "caption should not be empty");

// 6. Manual controls still work alongside autoplay.
const beforeClick = await idx();
await page
  .locator('.marquee-wrap button[aria-label="Next photograph"]')
  .click();
await page.waitForTimeout(900);
const afterClick = await idx();
console.log("next click:", beforeClick, "->", afterClick);
assert.notEqual(afterClick, beforeClick, "next button should advance");

// The prev button steps back.
const beforePrev = await idx();
await page
  .locator('.marquee-wrap button[aria-label="Previous photograph"]')
  .click();
await page.waitForTimeout(900);
const afterPrev = await idx();
console.log("prev click:", beforePrev, "->", afterPrev);
assert.notEqual(afterPrev, beforePrev, "previous button should step back");

// 7. Lightbox opens from the carousel.
await page.locator(".marquee-wrap .gallery-carousel-open").click();
await page.waitForTimeout(600);
const lightbox = await page.locator(".lightbox-image").count();
assert.ok(lightbox > 0, "lightbox should open from the carousel");
console.log("PASS lightbox opens");

// 8. Gallery page still fine, and its carousel is still manual.
await page.goto(`${base}/campus-life/gallery`, { waitUntil: "networkidle" });
await page.locator(".gallery-carousel-frame").first().waitFor();
const g0 = await page.locator(".gallery-carousel-count").first().innerText();
await page.waitForTimeout(5200);
const g1 = await page.locator(".gallery-carousel-count").first().innerText();
console.log("gallery page:", g0, "->", g1);
assert.equal(
  g1,
  g0,
  "gallery-page carousel should stay manual (opt-in autoplay)",
);

assert.deepEqual(errors, [], "no console/page errors");
console.log(
  "PASS autoplay, hover-pause, resume, rake, caption, controls, lightbox, manual default, no errors",
);
await browser.close();
