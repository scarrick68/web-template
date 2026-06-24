# ADR 0004: Web Template Rename Utility Is First-Rename-Only

## Status

Accepted

## Date

2026-06-24

## Key Takeaway

- The web-template rename utility is implemented in Ruby for ecosystem consistency and supports first-time rename only.

## Context

The web template includes `bin/template_rename` to quickly move from template naming (`web-template`) to project naming.

We need scripting consistency across the product-template workspace:

- Maintainer scripting preference is Ruby.
- `api-template` scripting is Ruby-first.
- Workspace orchestration scripts are Ruby-first.

The utility includes remaining-reference warnings but intentionally ignores selected paths to keep warning output actionable.

## Decision

1. Keep the rename utility in Ruby.
2. Support first rename only.
3. Explicitly reject consecutive rename attempts.
4. Document recovery flow: if rename is wrong, run `git restore .` (and optional clean) and rerun rename from a clean working tree.
5. Keep warning scan focused by ignoring docs and self-referential command/test paths.

## Ignored Warning Paths

- Prefix: `docs/`
- Files:
  - `lib/template_rename_command.rb`
  - `test/lib/template_rename_command_test.rb`
- Generated/noise directories:
  - `.git/`
  - `node_modules/`
  - `dist/`
  - `tmp/`
  - `coverage/`
- Files intentionally modified by rename flow:
  - `package.json`
  - `package-lock.json`
  - `pages/+config.ts`
  - `pages/+Layout.tsx`
  - `README.md`

## Validation Evidence

Validated with:

1. Unit tests for `TemplateRenameCommand`.
2. Smoke test by running rename utility.
3. `npm test` success after rename.
4. `npm run dev` startup success after rename.

## Consequences

Positive:

- Fast and simple first-time bootstrap rename.
- Tooling consistency across related repos.
- Practical warnings with reduced noise.

Tradeoffs:

- Consecutive renames are intentionally unsupported.
- Users must reset to clean state if first rename is incorrect.

## Related Docs

- ../template-rename.md
- ../README.md
