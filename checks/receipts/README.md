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
