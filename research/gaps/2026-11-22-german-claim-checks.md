# German claim checks: what's left after MÖVE and BenGER

Date: 2026-11-22 · From radar: 2026-W47

- **Who has this problem:** teams putting German policies, handbooks and HR documents behind an AI assistant (Langdock's customers are this kind of team).
- **What they use now:** general benchmarks, which now include German ones: [MÖVE](https://arxiv.org/abs/2606.13111) for public administration tasks, [BenGER](https://aclanthology.org/2026.findings-emnlp.1266/) for legal reasoning, and the [German Language LLM Index](https://dach.peerbench.ai/) for general German ability.
- **Why that's not enough:** they score whole answers or tasks. None of them checks, claim by claim, whether an answer kept the conditions in the source, like "unless", "only after probation" or "for full-time staff". That is exactly what CiteBot and Retrieval Autopsy already do.
- **Could I ship a proof in two weeks?** Yes, if it stays narrow: about 50 public German handbook or policy passages, a handful of questions each, a claim checker, and my own hand labels to measure the checker against.
- **Score:** pain [4] × reach [3] × fit [5] = 60. My estimate, not measured.
- **Change to the plan:** position the benchmark as "dropped conditions in German document answers", not a general German QA benchmark, and cite MÖVE and BenGER as the neighbours.
