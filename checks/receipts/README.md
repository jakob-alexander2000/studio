# Receipts

One JSON file per run: `YYYY-MM-DD-<project>-<eval>.json`. The site reads these at build time.

```json
{
  "project": "persona",
  "eval": "weekly-report",
  "date": "YYYY-MM-DD",
  "commit": "abc1234",
  "model": "",
  "passed": 0,
  "total": 0,
  "cost_per_task": null,
  "p95_ms": null,
  "failures": [{ "case": "", "why": "" }],
  "judge_agreement": null
}
```

Keep the failures. They are the most interesting part of a case study.

## How they're made

`node checks/evals/run.mjs` clones [answer-checker](https://github.com/jakob-alexander2000/answer-checker) and runs two test sets with no API keys and no model calls. `unit` is every package's tests. `handbook-samples` runs 12 sample answers through the product's own GitHub Action. It writes one receipt per test set plus `latest.json`. A scheduled task runs it every Saturday and opens a "Receipts week NN" PR. If a test set scores lower than the week before, `latest.json` marks it `worse_than`, and that becomes a question for the next radar.

Until 22 Nov 2026 the runner checked CiteBot, Retrieval Autopsy and Style Distance one by one. They became answer-checker, and their old receipts stay here as history.

The site reads `latest.json` from `main`: the answer-check panels and the status strip show the date and score of the last check, and link here.
