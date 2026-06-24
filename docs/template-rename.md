# Web Template Rename Utility

## Purpose

`bin/template_rename` is a convenience utility for first-time project bootstrap rename from `web-template` to your chosen app name.

## Why Ruby Is Used

The rename utility is implemented in Ruby for consistency across this template ecosystem:

- Ruby is the primary scripting language used by the maintainer.
- The related `api-template` repo uses Ruby scripting.
- The orchestration workspace scripts also use Ruby.

This keeps script style and maintenance workflow consistent across repos.

## Supported Scope

This utility supports first-time rename only.

- Allowed: `web-template` -> `<your-app-name>`
- Not supported: consecutive renames (rename after already renamed state)

If rename is incorrect, restore your workspace and run again from clean state:

```bash
git restore .
git clean -fd
bin/template_rename <new-app-name-kebab-case>
```

## Remaining-Reference Warnings

After rewrite, the utility scans for old-name references and warns about remaining paths outside modified files.

Ignored paths in warning scan:

- `docs/` (prefix)
- `lib/template_rename_command.rb`
- `test/lib/template_rename_command_test.rb`
- `.git/`, `node_modules/`, `dist/`, `tmp/`, `coverage/`
- files intentionally modified by rename flow (`package.json`, `package-lock.json`, `pages/+config.ts`, `pages/+Layout.tsx`, `README.md`)

## Validation Performed

The utility is covered by unit tests and was smoke tested by successfully running:

1. `bin/template_rename ...`
2. `npm test`
3. `npm run dev`

These validation runs completed successfully.

## Recommendation

Treat this utility as a one-time bootstrap helper. For post-bootstrap renaming, prefer manual edits on a clean branch.
