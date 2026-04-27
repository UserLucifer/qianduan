# AGENTS.md

## Mission

Make the smallest correct change that solves the user's request.

Optimize for:
1. correctness
2. minimal diffs
3. preserving existing patterns
4. low maintenance cost
5. clear validation

Do not optimize for cleverness.

---

## Default operating mode

Before making changes:

- Read the relevant files first.
- Trace the actual execution path and nearby call sites.
- Understand the existing abstraction before adding a new one.
- Prefer extending current code over introducing parallel patterns.

When changing code:

- Fix the root cause, not just the symptom.
- Prefer the smallest viable patch.
- Keep behavior unchanged unless the user explicitly asks for behavior changes.
- Match local style and conventions.
- Reuse existing utilities, helpers, and components where possible.
- Avoid speculative refactors.

Avoid:

- unnecessary renames
- unnecessary file moves
- drive-by formatting changes
- introducing new dependencies without strong justification
- adding abstractions “for future flexibility”
- rewriting working code without a concrete payoff

---

## Simplicity rules

Choose the simplest solution that fully solves the problem.

Prefer:

- direct logic over indirection
- existing patterns over new frameworks
- explicit code over premature generalization
- fewer moving parts over architectural novelty

Add a new abstraction only when at least one of these is true:

- the pattern already repeats in multiple places
- it meaningfully reduces complexity
- it is required by the existing architecture
- it makes testing or correctness materially better

Do not create “helper” layers unless they clearly earn their keep.

---

## Change scope discipline

Keep edits tightly scoped to the task.

Do not touch unrelated files unless required for correctness.
Do not bundle opportunistic cleanups into the same change.
Do not silently change public interfaces, data formats, or user-visible behavior without calling it out.

When broader cleanup is clearly beneficial, mention it separately instead of folding it into the main patch.

---

## Debugging discipline

When debugging:

- reproduce the issue where possible
- identify the failure point
- verify the cause before patching
- confirm the fix with the narrowest effective validation

Do not guess when the code can be inspected.
Do not present a hypothesis as a fact.
Call out uncertainty explicitly.

---

## Validation

Always validate changes to the extent the repo supports.

Prefer this order:

1. targeted test for the changed logic
2. nearest relevant test suite
3. typecheck / lint for touched areas
4. broader project validation only when needed

In your final response, report:

- what changed
- why it changed
- exactly what you ran to validate it
- the result of that validation
- any remaining risk or unverified areas

Never claim tests passed unless you actually ran them.
If validation could not be run, say so plainly and explain why.

---

## Communication

Be concise, concrete, and technical.

When the task is non-trivial, first provide a short plan with the likely touch points.
While working, surface important findings early, especially:

- wrong assumptions in the request
- hidden constraints
- root cause discoveries
- tradeoffs that affect the implementation

At the end, give a crisp summary, not a long narrative.

---

## Repo conventions

Follow the existing repository conventions first.

Priority order:

1. instructions in this file
2. DESIGN.md in this file
3. existing codebase patterns
4. general language/framework conventions

When conventions conflict, prefer the more local convention.

---

## Files and structure

Prefer modifying an existing file over creating a new one.

Create a new file only when it is clearly warranted, such as:

- a new module with distinct responsibility
- a required test file
- a necessary config or migration
- a user-requested document

Do not create documentation files unless:
- behavior changed materially
- setup changed materially
- the user asked for docs

---

## Final quality bar

A change is not done until it is:

- correct
- minimal
- understandable
- validated as far as practical
- consistent with the existing codebase