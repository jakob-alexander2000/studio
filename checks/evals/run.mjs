#!/usr/bin/env node
// Runs answer-checker's own test sets and writes one receipt per test set to checks/receipts/.
// Usage: node checks/evals/run.mjs [workdir]   (needs Node 22, Python 3, git, npm; no API keys)
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(new URL("../..", import.meta.url).pathname);
const work = resolve(process.argv[2] ?? "/tmp/studio-evals");
const date = new Date().toISOString().slice(0, 10);
mkdirSync(work, { recursive: true });

// Since 23 Nov 2026 the three tools live on as one product, answer-checker. Its test sets replace theirs.
// Older receipts for citebot, retrieval-autopsy and style-distance stay in checks/receipts as history.
const PACKAGES = ["core", "api", "action", "web"];

const TOOLS = [
  {
    project: "answer-checker",
    repo: "answer-checker",
    eval: "unit",
    what: "every package's tests: the four checks in English and German, claim mode on recorded cases, the voice check with Python parity, the API, the GitHub Action and the playground",
    install: "npm ci --no-audit --no-fund",
    run: (dir) => PACKAGES.flatMap((pkg) => vitest(join(dir, "packages", pkg), "npx vitest run --reporter=json")),
  },
  {
    project: "answer-checker",
    repo: "answer-checker",
    eval: "handbook-samples",
    what: "12 sample answers through the product's own GitHub Action: each faithful answer must pass, each drifted one must fail the named check",
    install: "",
    run: (dir) => {
      const out = join(dir, ".receipt-action");
      sh(`rm -rf ${out} && npx tsx packages/action/src/cli.ts --config examples/handbook/checks.yml --receipts ${out}`, dir);
      const receipt = JSON.parse(readFileSync(join(out, "latest.json"), "utf8")).receipts[0];
      const full = JSON.parse(readFileSync(join(out, receipt.file), "utf8"));
      return full.cases.map((c) => ({ ok: c.ok, id: c.id }));
    },
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
  const dir = join(work, tool.repo);
  if (!existsSync(dir)) sh(`git clone -q --depth 1 https://github.com/jakob-alexander2000/${tool.repo} ${dir}`, work);
  else if (tool.install) sh("git fetch -q --depth 1 origin HEAD && git reset -q --hard FETCH_HEAD", dir);
  if (tool.install) sh(tool.install, dir);
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
  console.log(`${tool.project} ${tool.eval}: ${receipt.passed} of ${receipt.total}`);
}

// Compare with last week's index, then replace it. The site reads latest.json.
const latestPath = join(repoRoot, "checks/receipts/latest.json");
if (existsSync(latestPath)) {
  const before = JSON.parse(readFileSync(latestPath, "utf8"));
  for (const now of index.receipts) {
    const was = before.receipts?.find((r) => r.project === now.project && r.eval === now.eval);
    if (was && now.passed / Math.max(now.total, 1) < was.passed / Math.max(was.total, 1)) {
      now.worse_than = { date: before.date, passed: was.passed, total: was.total };
      console.log(`WORSE: ${now.project} ${now.eval} ${was.passed} of ${was.total}, now ${now.passed} of ${now.total}`);
    }
  }
}
writeFileSync(latestPath, `${JSON.stringify(index, null, 2)}\n`);
