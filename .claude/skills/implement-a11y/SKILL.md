---
name: implement-a11y
description: Fix up to 5 open `accessibility` issues directly on main, verify locally, and commit with `Closes #N`. Used by the agent-a11y workflow; no branches or PRs.
---

# Implement Accessibility (direct on main)

Fix open `accessibility` issues, one commit each, directly on `main`. This runs unattended in CI: never ask questions, never create branches or PRs. The workflow pushes after you finish; do not push yourself.

## Selecting issues

1. `gh issue list --label accessibility --state open --json number,title,labels`
2. Skip any issue labelled `agent-failed`.
3. Take the lowest-numbered issues, **at most 5 per run**.

## Per issue

1. Read it with `gh issue view <N>`. Read every cited file at the cited lines and confirm the violation exists. If it is already fixed or not reproducible, skip it and leave it open.
2. Make the minimal, surgical fix across the files the issue lists. No refactors, renames, visual changes, or fixes for other problems you notice.
3. From `frontends/svelte/` run `npm run format`, then `npm run check`, `npm run lint`, and `npm test` (React: `npm test` from `frontends/react/`). Add a test only when the fix introduces a new interactive element or changes a component's props.
4. If any check still fails after a reasonable attempt, run `git checkout -- . && git clean -fd frontends/`, then `gh issue edit <N> --add-label agent-failed` (create the label with `gh label create agent-failed` if missing), and move on.
5. Otherwise commit only the fix:

```
fix: <what barrier is removed for users> [a11y-agent]

Closes #N
```

   One issue per commit. The `[a11y-agent]` marker is mandatory; it stops the workflow from re-triggering itself.

## Rules

- Never push, branch, rebase, or open PRs.
- Never commit with failing check, lint, or tests.
- Never touch files outside what the issue requires.
- Finish with a one-line summary of issues fixed, skipped, and labelled `agent-failed`.
