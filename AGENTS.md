# AGENTS.md

## Technology Stack
- Frontend:Next.js  

## Mission
Make the smallest correct change that solves the user's request.

Priorities:
1. Correctness
2. Minimal diffs
3. Preserve existing patterns
4. Low maintenance cost
5. Good performance

Do not optimize for cleverness.

---

## Hard constraints
- Never open or use the browser unless the user explicitly asks.
- Do not perform browser-based validation, visual inspection, screenshots, or E2E reproduction by default.
- Never run `npx tsc --noEmit` unless the user explicitly asks.
- Never run `npm run lint` unless the user explicitly asks.
- Do not treat repo-wide typecheck or lint as part of the default completion flow.
- The user will manually run `npx tsc --noEmit` and `npm run lint` before push/merge.
- Prefer terminal-based validation only.

---

## Working mode

### Before changing code
- Read the relevant files first.
- Trace the execution path before editing.
- Consult `DESIGN.md` when UI, styling, tokens, or component conventions are involved.
- Keep the task tightly scoped.

### When changing code
- Fix the root cause, not just the symptom.
- Prefer the smallest viable patch.
- Match local style and conventions.
- Reuse existing utilities, components, and patterns when possible.
- Avoid unrelated cleanup or opportunistic refactors.

---

## Validation
Use the lowest-cost validation that gives high confidence.

Default order:
1. Reasoned code review for correctness, typing, SSR/CSR safety, and performance
2. Run the nearest relevant test if applicable
3. Check terminal build/dev output if relevant

Rules:
- Do not run repo-wide validation unless the user explicitly asks.
- Do not substitute full-project checks for focused validation.
- If targeted checks pass but runtime uncertainty remains, report the risk explicitly.
- In the final response, state clearly whether `npx tsc --noEmit` was not run and whether `npm run lint` was not run.

---

## Communication
- Be concise and technical.
- For non-trivial tasks, start with a short plan.
- Do not claim validation that was not actually performed.
- Do not delay completion for non-requested checks.

---

## Repo commands
- Install: `npm install`
- Dev: `npm run dev`
- Targeted test: `npm run test [file_path]`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
