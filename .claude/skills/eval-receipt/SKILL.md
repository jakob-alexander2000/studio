---
name: eval-receipt
description: Run a project's eval set from checks/evals and write a dated JSON receipt to checks/receipts, comparing with the last run.
---

# Eval receipt

1. Load `checks/evals/<project>/golden.jsonl` and `rubric.md`.
2. Run every case. Record pass or fail, cost, latency and the model used.
3. If a model judged the answers, compare its grades with `labels.jsonl` and record the agreement.
4. Write `checks/receipts/YYYY-MM-DD-<project>-<eval>.json` in the schema from `checks/receipts/README.md`. Include every failure with one line on why.
5. Compare with the previous receipt. Any regression fails the Evals gate.
6. Turn the most interesting failure into a question for next week's radar.
