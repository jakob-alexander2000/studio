---
name: review
description: Review a code diff in one of Jakob's repos before he does, against code/template/README.md and checks/gates.md.
---

# Review

Check, in this order, and report only real problems with file and line:

1. Correctness: does it do what the spec or test says?
2. Security: secrets, unsafe input, model output used unescaped, tool permissions too wide.
3. Tests: is there a test that fails without this change?
4. Performance: anything that blows the budget in `code/template/README.md`.
5. Copy: run the `unslop` rules on any user-facing text.

Keep it short. No style nits unless they hide a bug.
