#!/usr/bin/env node
// Runs the answer-check tools' own test sets and writes one receipt per tool to checks/receipts/.
// Usage: node checks/evals/run.mjs [workdir]   (needs Node 22, git, npm; no API keys)
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(new URL("../..", import.meta.url).pathname);
const work = resolve(process.argv[2] ?? "/tmp/studio-evals");
const date = new Date().toISOString().slice(0, 10);
mkdirSync(work, { recursive: true });

const TOOLS = [
  {
    project: "citebot",
    eval: "handbook-golden",
    what: "8 handbook questions through the agent loop; verify must pass true claims and fail the planted 25-day draft",
    install: "npm ci --no-audit --no-fund",
    run: (dir) => {
      const out = sh("npm run eval", dir);
      sh("git checkout -- evals/last-run.json", dir); // keep the tool's own repo untouched
      const cases = [...out.matchAll(/^\[(PASS|FAIL)\]\s+(\S+)/gm)].map((m) => ({ ok: m[1] === "PASS", id: m[2] }));
      return cases;
    },
  },
  {
    project: "retrieval-autopsy",
    eval: "unit-and-trap",
    what: "the four checks, BM25 ranking and the annual-leave trap (a dropped condition must fail Qualifier)",
    install: "npm ci --no-audit --no-fund --ignore-scripts",
    run: (dir) => vitest(dir, "npx vitest run --reporter=json"),
  },
  {
    project: "style-distance",
    eval: "unit-and-parity",
    what: "Burrows' Delta in the browser, and parity with the Python reference",
    install: "npm ci --no-audit --no-fund",
    run: (dir) => [
      ...vitest(dir, "npx vitest run --reporter=json"),
      ...vitest(dir, "npx vitest run --config vitest.parity.config.ts --reporter=json"),
    ],
  },
];

function sh(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
  } catch (error) {
    return `${error.stdout ?? ""}${error.stderr ?? ""}`;
  }
}

function vitest(dir, cmd) {
  const out = join(dir, ".receipt-vitest.json");
  sh(`${cmd} --outputFile=${out}`, dir);
  const json = JSON.parse(readFileSync(out, "utf8"));
  return json.testResults.flatMap((file) =>
    file.assertionResults.map((t) => ({ ok: t.status === "passed", id: t.fullName ?? t.title })),
  );
}

const index = { date, receipts: [] };
for (const tool of TOOLS) {
  const dir = join(work, tool.project);
  if (!existsSync(dir)) sh(`git clone -q --depth 1 https://github.com/jakob-alexander2000/${tool.project} ${dir}`, work);
  else sh("git fetch -q --depth 1 origin HEAD && git reset -q --hard FETCH_HEAD", dir);
  sh(tool.install, dir);
  const commit = sh("git rev-parse --short HEAD", dir).trim();
  let cases = [];
  try {
    cases = tool.run(dir);
  } catch (error) {
    cases = [{ ok: false, id: `runner error: ${String(error.message ?? error).slice(0, 200)}` }];
  }
  const receipt = {
    project: tool.project,
    eval: tool.eval,
    what: tool.what,
    date,
    commit,
    model: "",
    passed: cases.filter((c) => c.ok).length,
    total: cases.length,
    cost_per_task: null,
    p95_ms: null,
    failures: cases.filter((c) => !c.ok).map((c) => ({ case: c.id, why: "failed" })),
    judge_agreement: null,
  };
  const file = `${date}-${tool.project}-${tool.eval}.json`;
  writeFileSync(join(repoRoot, "checks/receipts", file), `${JSON.stringify(receipt, null, 2)}\n`);
  index.receipts.push({ project: tool.project, eval: tool.eval, passed: receipt.passed, total: receipt.total, commit, file });
  console.log(`${tool.project}: ${receipt.passed} of ${receipt.total}`);
}

// Compare with last week's index, then replace it. The site reads latest.json.
const latestPath = join(repoRoot, "checks/receipts/latest.json");
if (existsSync(latestPath)) {
  const before = JSON.parse(readFileSync(latestPath, "utf8"));
  for (const now of index.receipts) {
    const was = before.receipts?.find((r) => r.project === now.project);
    if (was && now.passed / Math.max(now.total, 1) < was.passed / Math.max(was.total, 1)) {
      now.worse_than = { date: before.date, passed: was.passed, total: was.total };
      console.log(`WORSE: ${now.project} ${was.passed}/${was.total} -> ${now.passed}/${now.total}`);
    }
  }
}
writeFileSync(latestPath, `${JSON.stringify(index, null, 2)}\n`);
