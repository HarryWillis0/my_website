---
name: a11y-audit
description: Audit the frontend files changed in a merge for accessibility violations and file new ones as GitHub issues labelled `accessibility`. Used by the agent-a11y workflow; skips anything already tracked.
---

# Accessibility Audit (merge diff)

Audit **only the frontend files changed in this merge** and file one GitHub issue per distinct, genuine violation, labelled `accessibility`. This runs unattended in CI: never ask questions, never edit files, never push.

## Input

The prompt supplies the list of changed files under `frontends/`. Audit only those, and only shipped UI (components, routes, layouts, `app.html`, styles). Skip tests, generated files, config, lockfiles, and non-UI files. If nothing auditable remains, stop and report that.

## Principles to audit against

### 1. Semantic HTML
- `<div>`/`<span>` used as interactive elements instead of native ones
- Missing or wrong landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- `<section>`/`<article>` without a heading; lists built from `<div>`s; tables missing `<caption>`, `<th scope>`, `<thead>`

### 2. Images and media
- `<img>` missing `alt`; decorative images without `alt=""`
- Complex images without a long description; meaningful `<figure>` without `<figcaption>`

### 3. Forms and interactive controls
- Inputs without an associated label (`for`/`id`, `aria-label`, `aria-labelledby`)
- Buttons with no accessible name
- Missing required-field indicators / `aria-required`; errors not tied to fields via `aria-describedby`
- Missing `autocomplete` on common fields

### 4. Keyboard navigation
- Click handlers on non-focusable elements; `tabindex` > 0
- Removed focus indicators (`outline: none` / `focus:outline-none`) with no replacement
- Modal dialogs/popovers that don't trap or restore focus

### 5. ARIA usage
- Icon-only controls without `aria-label`; duplicate landmark roles without labels
- `aria-hidden="true"` on focusable elements; roles conflicting with native semantics
- Missing required ARIA parent/child roles; dynamic updates without `aria-live`

### 6. Colour and contrast
- Text/background pairings likely below WCAG AA (4.5:1 normal, 3:1 large)
- Meaningful text rendered only via `::before`/`::after`

### 7. Page-level structure
- Missing `lang`, missing/empty `<title>`, multiple `<h1>`, skipped heading levels
- Multiple `<nav>` without distinguishing `aria-label`

### 8. Links
- Non-descriptive link text; `<a>` without `href` used as a button
- `target="_blank"` with no warning to the user

## Process

### 1. Find candidates

Read each changed file in full and note concrete violations with file path and line number.

### 2. Verify

Re-read each flagged line. Drop findings that are false positives (e.g. attribute supplied via props), already mitigated by SvelteKit, or in non-shipped files. Keep only problems a user with a disability would really hit, **and that sit in code touched by this merge**.

### 3. Dedupe against existing issues

```bash
gh issue list --label accessibility --state all --limit 200 --json number,title,body,labels
```

Do not file a finding if an existing `accessibility` issue (open, or closed as fixed) already covers the same violation at the same location. If a finding matches an issue labelled `agent-failed`, do not file it and do not touch that issue — a human must triage it.

### 4. File issues

Ensure the label exists (`gh label list`; if missing, `gh label create "accessibility" --description "Accessibility improvements and WCAG compliance" --color "0052cc"`).

One issue per distinct violation (not per file), created with `gh issue create --label accessibility`. Title format: `fix: <capability gained>` (e.g. `fix: make article images accessible to screen readers`). Body must contain:

- **Frontend(s) affected**
- **Problem**: the WCAG criterion or principle, why it matters, and a snippet of the violation
- **Fix**: the concrete change with a before/after snippet
- **Files to update**: paths and line numbers
- **Acceptance criteria**: bullet list of what done looks like

### 5. Report

End with a table of filed issues (number, title, WCAG criterion), or state that no new violations were found.

## What NOT to file

- Theoretical violations with no real user impact
- Violations in files this merge did not touch
- Anything already tracked by an existing `accessibility` issue
- Styling nits with no assistive-technology impact
- Violations in tests or build artefacts
