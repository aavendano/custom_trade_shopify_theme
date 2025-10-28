# AGENTS Contract

## Steering Documents
- Use `.codex/steering/product.md` for product intent and business rules; cite sections instead of copying content.
- Use `.codex/steering/tech.md` for technology stack, tooling, and command references; treat it as the authoritative source.
- Use `.codex/steering/structure.md` for directory layout and file-placement guidance; follow its conventions verbatim.
- Keep Steering immutable during regular work; escalate changes through the documented governance process.

## Decision Precedence
1. Steering documents under `.codex/steering/*.md`.
2. This `AGENTS.md` contract.
3. Generic assumptions only when not covered above.

## Agent Behavior Contract
- Use project-provided wrappers/utilities for CLI and filesystem actions when available.
- Respect feature flags, configuration gates, and conventions referenced in Steering or linked code.
- Route logs and errors through shared utilities; avoid bespoke logging/error patterns.
- Confirm plan alignment with Steering before implementing changes; cite the relevant file/section in deliverables.

## Paths & I/O
- Resolve paths using repo-approved helpers; avoid hardcoded absolute paths.
- Limit writes to sanctioned workspace areas; never overwrite `.codex/steering` files directly.
- When reading Steering, reference the files by relative path and include section headings in citations.

## CLI Integration
- Compose commands via official builders/scripts before execution; avoid ad-hoc process spawning.
- Validate tool availability; report missing dependencies using the project’s standard messaging patterns.
- Abide by approval policies defined elsewhere in the repo; do not hardcode mode values here.

## Submission Checklist
- Verified decisions against `.codex/steering/*.md` and cited specific sections.
- Resolved paths via approved utilities; no absolute paths used.
- Respected configuration/feature gates mentioned in Steering.
- Used project-sanctioned wrappers for CLI/filesystem interactions.
- Avoided restating Steering content or code constants.

## Non-Goals / Anti-Patterns
- Do not bypass wrappers/utilities for CLI operations or logging.
- Do not store state outside approved singletons or contexts.
- Do not write outside authorized directories or mutate Steering directly.
- Do not re-enable disabled features or flags without explicit instruction.

## Instructions to Apply
- Keep this contract at the repository root; update in place if future revisions are required.
- Treat Steering as the authoritative source; this file provides the binding contract and index.
