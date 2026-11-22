# Working in the studio

You are helping Jakob, a computer science student building AI tools that show their working. Read this before touching any file.

## Rules

1. Never invent a fact, number, source, quote or date. Unknown means a visible `[placeholder]` or left out.
2. Cite every claim in research with a link you actually opened.
3. Write in Jakob's voice: first person, plain, friendly, concrete. Load `.claude/skills/unslop/SKILL.md` before writing any copy or UI.
4. Put output in the right layer folder, dated `YYYY-MM-DD`. One file per thing.
5. Nothing ships without passing `checks/gates.md`. A failure is written down, not hidden.
6. This repo is public. No location, phone, income, employer names, private repo contents, unpublished numbers or personal notes. Anything not meant for the public goes in `private/`, which git ignores.

## Where things go

- `research/radar/` weekly radar, `research/signals.csv` trend counts, `research/gaps/` opportunities, `research/learning/` syllabus and teach-backs, `research/briefs/` one brief per project.
- `design/system/` the design system, `design/references/` references with reasons, `design/specs/` spec sheets, `design/practice/` weekly studies.
- `code/template/` the starter every new repo copies.
- `checks/gates.md` release gates, `checks/evals/` eval sets, `checks/receipts/` dated results as JSON.
- `log/` one note per week: shipped, learned, next.

## Skills

- `radar`: write the weekly radar.
- `brief`: turn a gap into a project brief.
- `unslop`: rules for copy and UI that doesn't look AI-made.
- `review`: review a diff before Jakob does.
- `eval-receipt`: run an eval set and write the receipt.
