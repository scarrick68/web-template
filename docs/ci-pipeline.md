# CI Pipeline

## Purpose

The web template includes a GitHub Actions pipeline that validates code quality and production build readiness on every pull request and on pushes to `main`.

Workflow file:
- [.github/workflows/ci.yml](../.github/workflows/ci.yml)

## Triggers

The pipeline runs on:
- `pull_request`
- `push` to `main`

## What CI Runs

The `quality` job runs on `ubuntu-latest` and executes:

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`

This order ensures:
- deterministic dependency install from `package-lock.json`
- static analysis first
- test validation second
- production build verification last

## Concurrency Behavior

The workflow uses concurrency cancellation:
- Group: `web-template-ci-${{ github.workflow }}-${{ github.ref }}`
- Newer runs on the same branch/PR cancel older in-progress runs

This keeps CI fast and avoids wasting compute on outdated commits.

## Local Parity Commands

Run the same checks locally from `/repos/web-template`:

```bash
npm ci
npm run lint
npm test
npm run build
```

## Extending CI

Common next steps:
- split the single `quality` job into separate `lint`, `test`, and `build` jobs for faster parallel feedback
- add coverage upload/reporting if required
- add branch protection rules requiring this workflow to pass before merge
