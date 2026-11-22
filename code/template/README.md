# Repo template

Every new repo starts with these. Tick them off when the template has them.

- [ ] Strict TypeScript, ESLint, Prettier
- [ ] Unit tests, Playwright end-to-end tests
- [ ] Property-based tests (fast-check) for parsers and tool schemas
- [ ] CI: build, types, lint, tests on every push
- [ ] Secret scanning (gitleaks), dependency updates (Renovate), static analysis (Semgrep or CodeQL)
- [ ] GitHub Actions pinned to commit hashes, least-privilege tokens
- [ ] LLM security: model output is untrusted, never raw into a shell or SQL, tool calls sandboxed, agent permissions capped (OWASP Top 10 for LLM applications)
- [ ] Performance budget: Lighthouse CI (LCP < 2.5 s, INP < 200 ms, CLS < 0.1); for AI, p50 and p95 latency, tokens and cost per task
- [ ] Traces on every model call: prompt version, model, tokens, cost
- [ ] `AGENTS.md` with the repo's rules
