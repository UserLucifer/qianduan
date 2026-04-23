# AGENTS.md

## Mission
Make the smallest correct change that solves the user's request.

Optimize for:
1. **Correctness**: Type safety, SSR/CSR hydration safety, and Next.js best practices.
2. **Minimal diffs**: Do not touch what is unrelated to the task.
3. **Preserving existing patterns**: Follow the existing directory structure and local conventions.
4. **Low maintenance cost**: Prefer simple, explicit solutions over clever abstractions.
5. **Compilation integrity**: Ensure the code compiles and passes the required validation for the task scope.

Do not optimize for cleverness.

---

## Hard constraints
- **Never open or launch the browser unless the user explicitly asks for it.**
- **Do not use the `open browser` skill by default.**
- **Do not perform browser-based validation, visual inspection, screenshots, or E2E-style reproduction unless explicitly requested by the user.**
- **Never run `npm run lint` unless the user explicitly asks for it.**
- **Do not treat full-project lint as part of the default completion flow.**
- Prefer terminal-based validation only.
- If static validation passes but some runtime uncertainty remains, **report the remaining risk** instead of opening the browser.

---

## Default operating mode

### Before making changes
- **Read the relevant files first.**
- **Trace the execution path**: Understand how data flows between Server Components, Client Components, hooks, utilities, and shared abstractions.
- **Consult `DESIGN.md`** when UI, styling, tokens, or component conventions may be affected.
- **Understand the existing abstraction** before adding or changing one.
- **Keep the task narrowly scoped** to the user's request.

### When changing code
- **Fix the root cause**, not just the symptom.
- **Prefer the smallest viable patch.**
- **Match local style and conventions.**
- Reuse existing utilities, components, and patterns whenever possible.
- Avoid opportunistic refactors unless they are required to safely complete the requested change.
- Do not make unrelated cleanup changes.

### Browser policy
- Assume browser usage is disallowed unless the user explicitly requests browser-based testing.
- Terminal output and static analysis are the default source of truth.
- Do not open the browser for post-change verification.

---

## Change scope discipline
Keep edits tightly scoped to the task.

- Do not touch unrelated files.
- Do not bundle opportunistic cleanup.
- Do not rename, move, or restructure files unless required by the task.
- Do not introduce new abstractions unless the current code makes it necessary.
- **No browser automation by default.**
- **No automatic repo-wide linting.**

---

## Debugging & Validation (Efficiency First)

### When debugging
- **Identify the failure point first** using terminal logs, type errors, test failures, and build/dev output.
- Verify the fix with the **lowest-cost validation** that provides high confidence.
- Do not perform browser-based verification unless explicitly requested.
- Do not escalate to broader validation unless the narrower validation is insufficient.

### Default validation philosophy
Use fast, task-relevant validation by default.

The default completion gate is:
1. **Typecheck**: `npx tsc --noEmit`
2. **Targeted test**: Run the nearest relevant test suite if applicable
3. **Compilation/log sanity check**: Confirm terminal build/dev output shows no relevant errors for the changed area

### Lint policy
- **Never run `npm run lint` unless the user explicitly asks for it.**
- **Do not run full-project lint automatically after a task, even if the task is complete.**
- **Do not substitute repo-wide lint for focused validation.**
- If the user wants lint, run it and report the result accurately.
- If the user does not ask for lint, do not run it and do not delay completion waiting for it.
- The user is responsible for any manual module-complete or pre-merge full-project lint step.

### Remaining uncertainty
If `tsc`, relevant tests, and terminal compilation output pass, but runtime behavior still has some uncertainty, **report that uncertainty explicitly** instead of opening the browser or widening validation without permission.

---

## Validation (Completion Rule)

A task is considered complete when the required validation for the task scope passes.

### Default validation order
1. **Typecheck**: Run `npx tsc --noEmit`
2. **Targeted test**: Run `npm run test [file_path]` or the nearest relevant test if applicable
3. **Compilation check**: Ensure build/dev terminal output shows no relevant errors
4. **Lint**: **Skip by default**. Run only if the user explicitly requests it

### Strict rule for lint
- `npm run lint` is **not** a default validation step
- `npm run lint` is **not** required for task completion
- `npm run lint` must **not** be run implicitly
- `npm run lint` must **not** block task completion unless the user explicitly requested lint validation

### Final response requirements
In the final response, report:
- What changed and why
- Results of `tsc`
- Results of targeted tests, if any were run
- Relevant terminal compilation/build status
- Confirmation that the code is syntactically and logically sound based on the checks actually performed
- Any remaining risk areas that may require manual runtime verification
- **State clearly when lint was not run**
- **Do not imply lint was performed if it was not**
- **Do not imply browser verification unless the user explicitly requested it and it was actually performed**

---

## Communication
Be concise and technical.

- **Plan first** for non-trivial tasks with a short implementation outline
- **Status update** should use terminal validation as the completion signal
- Keep reasoning task-focused and implementation-oriented
- Do not over-explain unrelated possibilities
- Do not claim stronger validation than was actually performed
- Do not delay task completion for non-requested repo-wide checks

---

## Testing hooks for this repo

Primary install command:
`npm install`

Primary dev/run command:
`npm run dev`

Primary targeted test command:
`npm run test [file_path]`

Primary lint command:
`npm run lint`

Primary typecheck command:
`npx tsc --noEmit`

---

## Practical repo workflow

### During normal task execution
Use this default workflow:
1. Read relevant files
2. Make the smallest correct change
3. Run `npx tsc --noEmit`
4. Run the nearest relevant test if applicable
5. Check terminal build/dev output if relevant
6. Report completion and any remaining runtime risk
7. **Do not run `npm run lint` unless the user explicitly asked for it**

### After a module is complete
- The **user** may manually run:
  - `npm run lint`
- This is a **manual quality gate owned by the user**, not an automatic agent step

### Before merge or release
Broader validation may be performed only when explicitly requested by the user, such as:
- full-project lint
- broader test suites
- production build checks

---

## Final quality bar
A change is not done until it is:

- **Correct and type-safe** for the changed scope
- **Minimal and understandable**
- **Consistent** with `DESIGN.md`, local patterns, and repo conventions
- **Validated without browser usage unless explicitly requested**
- **Backed by terminal-based evidence appropriate to the task scope**

By default:
- **Do not run `npm run lint`**
- **Do not open the browser**
- **Do not expand validation scope without explicit user instruction**

The user controls repo-wide lint and any broader manual validation steps.