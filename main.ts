import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Everyday Things, Two Lines, Longer Run
// u-suga-everyday-things-two-lines-longer-run-f8734479
// Winner from SCREENING.md (candidate 12): the escalator. A staircase a
// 10-year-old stands on every day, joined to the child in a way not met
// before, with line 2 honestly naming what the analogy maps and what it
// leaves out (the motor and chain, one way at one steady speed).

const LINE_1 =
  "An escalator is a staircase that walks for you, carrying your shoes upstairs while you stand still and hold the rail.";
const LINE_2 =
  "It maps the steps moving so you don't have to climb, but it leaves out the motor and chain underneath, and that it only goes one way at one steady speed.";

const ENTRY = `${LINE_1}\n${LINE_2}\n`;

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

// Gate, enforced in code: UTF-8 text, 1 to 400 characters, not only
// whitespace, exactly TWO lines.
const charCount = [...ENTRY].length;
if (charCount < 1 || charCount > 400) {
  fail(`entry is ${charCount} characters, outside the 1-400 gate`);
}
if (ENTRY.trim().length === 0) {
  fail("entry is only whitespace");
}
const lines = ENTRY.split("\n");
if (lines.length !== 3 || lines[2] !== "") {
  fail(`entry must be exactly two lines, found ${lines.length - 1} lines`);
}
if (lines[0].trim().length === 0 || lines[1].trim().length === 0) {
  fail("one of the two lines is empty");
}
// Each line must be a single sentence: exactly one sentence-ending full
// stop, at the end of the line.
for (const [index, line] of lines.slice(0, 2).entries()) {
  const stops = [...line].filter((ch) => ch === ".").length;
  if (stops !== 1 || !line.endsWith(".")) {
    fail(`line ${index + 1} must be exactly one sentence, found ${stops} full stops`);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-identical.
const readBack = readFileSync(outPath, "utf8");
if (readBack !== ENTRY) {
  fail("read-back differs from the entry written");
}

const sha256 = createHash("sha256").update(ENTRY, "utf8").digest("hex");
console.log(`chars: ${charCount}`);
console.log(`sha256: ${sha256}`);
console.log(`wrote: ${outPath}`);
console.log(ENTRY);
