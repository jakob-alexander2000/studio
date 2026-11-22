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

`node checks/evals/run.mjs` clones CiteBot, Retrieval Autopsy and Style Distance, runs each tool's own test set (no API keys, no model calls), and writes one receipt per tool plus `latest.json`. A scheduled task runs it every Saturday and opens a "Receipts week NN" PR. If a tool scores lower than the week before, `latest.json` marks it `worse_than`, and that becomes a question for the next radar.

The site reads `latest.json` from `main`: the answer-check panels and the status strip show the date and score of the last check, and link here.
