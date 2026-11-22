# Release gates

Nothing ships, and no number goes on the site, without passing these and leaving a receipt.

| Gate | What it checks | How | Blocks release when |
| --- | --- | --- | --- |
| Brief | The problem is real and sourced | A brief in `research/briefs/` | No brief, or uncited claims |
| Unslop | Copy and UI avoid the banned patterns | Copy scan plus the `unslop` skill | Any banned pattern |
| Accessibility | WCAG 2.2 AA: contrast, focus, keyboard, labels | axe in Playwright, phone at 390 px | Any serious violation |
| Code | Types, lint, tests, security scans | CI | Anything red |
| Performance | Web Vitals, AI latency and cost | Lighthouse CI, traces | Over budget |
| Evals | Accuracy, faithfulness, injection, cost per task | Eval set per project | Worse than the last receipt |
| Honesty | Every number traces to a receipt | Each figure links to its JSON | A number without a receipt |

When a model grades output, check it against 30 to 50 answers I labelled myself and record how often it agreed.
