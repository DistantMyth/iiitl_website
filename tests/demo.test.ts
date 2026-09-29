import test from "node:test";
import assert from "node:assert/strict";
import { gradePoint, gpa, validMarks, initialState } from "../lib/demo";
test("grading boundaries and failing grades", () => {
  assert.equal(gradePoint(90), 10);
  assert.equal(gradePoint(89), 9);
  assert.equal(gradePoint(40), 5);
  assert.equal(gradePoint(39), 0);
});
test("GPA is credit weighted, including failures", () => {
  assert.equal(
    gpa([
      { credits: 5, points: 10 },
      { credits: 3, points: 6 },
    ]),
    8.5,
  );
  assert.equal(
    gpa([
      { credits: 4, points: 0 },
      { credits: 4, points: 10 },
    ]),
    5,
  );
  assert.equal(gpa([]), 0);
});
test("workbook validation rejects altered roster, invalid marks, and missing rows", () => {
  assert.equal(validMarks(initialState.marks), true);
  for (const patch of [
    { quiz: 21 },
    { mid: -1 },
    { end: NaN },
    { roll: "OTHER" },
  ]) {
    const rows = structuredClone(initialState.marks);
    Object.assign(rows[0], patch);
    assert.equal(validMarks(rows), false);
  }
  assert.equal(validMarks(initialState.marks.slice(0, 2)), false);
});
