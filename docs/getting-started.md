# Getting Started

Use one of the setup paths below, then run the shared post-setup checks.

## Path 1: Workspace Orchestration (Recommended)

Use this path when you are initializing a full product workspace (API + web +  API contracts).

1. Review the workspace bootstrap guide and command catalog.
   - [/product-template-workspace/docs/getting-started.md](/product-template-workspace/docs/getting-started.md)
   - [/product-template-workspace/docs/scripting.md](/product-template-workspace/docs/scripting.md)

2. From workspace root, run the one-command initializer.
   - `bin/init_new_project <product-slug>`

3. Understand what it orchestrates.
   - Environment checks (`preinstall`, `doctor`)
   - Dependency/repo prep (`bootstrap`, `pull`)
   - Rename orchestration (`new_product`)
   - Post-rename validation (`validate_product`)
   - Optional dev launch prompt

4. Continue with shared checks below in this document.

## Path 2: This Repo Only (Local Rename Tool)

Use this path when you only need to initialize the web template itself.

1. Run local rename in this repo.
   - From `/repos/web-template`, run `bin/template_rename <your-app-name-kebab-case>`.
   - Rename utility docs: [/repos/web-template/docs/template-rename.md](/repos/web-template/docs/template-rename.md)

2. Install dependencies in this repo.
   - From `/repos/web-template`, run `npm install`.

## Shared Post-Setup Checks

Run these checks regardless of which setup path you used.

1. Set SEO site identity defaults.
   - Update `siteName`, `siteUrl`, `defaultTitle`, and default metadata in [/repos/web-template/config/seo.defaults.yml](/repos/web-template/config/seo.defaults.yml).

2. Update crawl artifacts with your production domain.
   - Replace placeholder URLs in [/repos/web-template/public/robots.txt](/repos/web-template/public/robots.txt).
   - Replace placeholder URLs in [/repos/web-template/public/sitemap.xml](/repos/web-template/public/sitemap.xml).

## Verify Web Template Only

1. Verify web template commands.
   - From `/repos/web-template`, run `npm test`.
   - From `/repos/web-template`, run `npm run build`.
   - From `/repos/web-template`, run `npm run dev`.

2. Interact with the running app.
   - Open `http://localhost:3000/`.
   - Open `http://localhost:3000/about`.
   - Exercise sign-up/sign-in flows from the UI.

## Verify Full Workspace

1. Verify workspace commands.
   - From `/product-template-workspace`, run `bin/start-day --with-dev`.
   - This will run a series of checks and launch the dev servers for both API and web template. See warnings and errors if the task fails.