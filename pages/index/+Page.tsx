export default function Page() {
  return (
    <div className="space-y-18 md:space-y-20">
      <section className="grid gap-8 border border-base-300 bg-base-100 p-6 shadow-sm md:p-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="badge badge-primary badge-outline">Rails + Vike Template</div>
          <h1 className="max-w-3xl">Build production-ready applications faster.</h1>
          <p className="max-w-2xl text-base-content/80 md:text-lg">
            A clean full-stack starter designed for real teams: frontend with Vike + React, backend-ready API integration,
            pragmatic defaults, and deployment-oriented structure.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="/signup" className="btn btn-primary">Get Started</a>
            <a href="/#getting-started" className="btn btn-outline">Documentation</a>
          </div>
        </div>
        <div className="rounded border border-base-300 bg-base-200/30 p-3">
          <div className="mb-2 flex items-center justify-between border-b border-base-300 px-2 pb-2 text-xs text-base-content/70">
            <span>Northline Dashboard</span>
            <span>localhost:3000</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-base-300 bg-base-100 p-3">
              <p className="mb-2 text-xs text-base-content/60">Active users</p>
              <p className="text-2xl font-semibold">12,480</p>
              <p className="text-xs text-success">+8.2% this week</p>
            </div>
            <div className="rounded border border-base-300 bg-base-100 p-3">
              <p className="mb-2 text-xs text-base-content/60">API health</p>
              <p className="text-2xl font-semibold">99.96%</p>
              <p className="text-xs text-base-content/70">p95 latency 182ms</p>
            </div>
            <div className="rounded border border-base-300 bg-base-100 p-3 sm:col-span-2">
              <p className="mb-2 text-xs text-base-content/60">Deployment status</p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-outline">API: healthy</span>
                <span className="badge badge-outline">Web: healthy</span>
                <span className="badge badge-outline">Search: healthy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded border border-base-300 bg-base-100 px-4 py-3 text-center text-sm font-medium">Open Source</div>
        <div className="rounded border border-base-300 bg-base-100 px-4 py-3 text-center text-sm font-medium">MIT Licensed</div>
        <div className="rounded border border-base-300 bg-base-100 px-4 py-3 text-center text-sm font-medium">Fast</div>
        <div className="rounded border border-base-300 bg-base-100 px-4 py-3 text-center text-sm font-medium">Type Safe</div>
        <div className="rounded border border-base-300 bg-base-100 px-4 py-3 text-center text-sm font-medium">Production Ready</div>
      </section>

      <section id="features" className="space-y-5">
        <div className="max-w-3xl space-y-2">
          <h2>Features for real product work</h2>
          <p className="text-base-content/75">
            A reusable baseline for SaaS, AI, and business applications that balances clarity, speed, and maintainability.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Fast Development", "Hot reload, practical structure, and route patterns designed for iterative delivery."],
            ["Authentication", "Sign-in and sign-up flows wired for token-auth based Rails APIs."],
            ["Analytics Ready", "Clear layout for metrics screens and observability-driven feature work."],
            ["Cloud Deployments", "Deployment-friendly defaults with infra workflows for production setup."],
            ["AI Friendly", "Simple architecture and conventions that AI coding agents can reliably extend."],
            ["Mobile Alignment", "API and UI patterns that map cleanly to companion mobile clients."]
          ].map(([title, description]) => (
            <article key={title} className="rounded border border-base-300 bg-base-100 p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-6 text-base-content/75">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="space-y-5">
        <div className="max-w-3xl space-y-2">
          <h2>Architecture overview</h2>
          <p className="text-base-content/75">Designed for a clear data path between frontend and backend systems.</p>
        </div>
        <div className="rounded border border-base-300 bg-base-100 p-6 shadow-sm">
          <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-sm font-medium">
            {[
              "Frontend (Vike + React)",
              "Rails API",
              "Postgres",
              "OpenSearch"
            ].map((node, index) => (
              <div key={node} className="flex w-full flex-col items-center">
                <div className="w-full rounded border border-base-300 bg-base-200/40 px-4 py-3 text-center">{node}</div>
                {index < 3 ? <span className="py-1 text-base-content/40">↓</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="max-w-3xl space-y-2">
          <h2>Product screenshots</h2>
          <p className="text-base-content/75">Use real product views to explain what users can do on day one.</p>
        </div>
        <div className="space-y-4 rounded border border-base-300 bg-base-100 p-5 shadow-sm">
          <div role="tablist" className="tabs tabs-box border border-base-300 bg-base-200/40">
            <a role="tab" className="tab tab-active">Dashboard</a>
            <a role="tab" className="tab">Users</a>
            <a role="tab" className="tab">Analytics</a>
            <a role="tab" className="tab">Settings</a>
          </div>
          <div className="rounded border border-base-300 bg-base-200/20 p-4">
            <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-base-content/75">
{`┌───────────────────────────────────────────────┐
│ Revenue     $248,900        +12.4%            │
│ Active Users 12,480         +8.2%             │
│ Conversion   5.7%           +0.6%             │
├───────────────────────────────────────────────┤
│ Latest Deploy: main  •  3m ago  •  healthy    │
└───────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </section>

      <section id="getting-started" className="space-y-5">
        <div className="max-w-3xl space-y-2">
          <h2>Getting started in three steps</h2>
          <p className="text-base-content/75">A visual baseline to keep onboarding straightforward.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["1. Clone", "Copy the template and initialize your workspace."],
            ["2. Configure", "Set environment values, auth, and service endpoints."],
            ["3. Deploy", "Run validation and ship with CI and production defaults."]
          ].map(([title, detail]) => (
            <article key={title} className="rounded border border-base-300 bg-base-100 p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-base-content/75">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="space-y-5">
        <div className="max-w-3xl space-y-2">
          <h2>Frequently asked questions</h2>
          <p className="text-base-content/75">Defaults you can keep, customize, or replace as your product evolves.</p>
        </div>
        <div className="space-y-3">
          {[
            ["Can I use this for non-SaaS apps?", "Yes. The page and component structure is intentionally generic and suitable for most product types."],
            ["Do I need Rails to use the frontend?", "No. Rails integration is provided by default, but the app can target any compatible API."],
            ["Is this production-friendly?", "Yes. It includes lint/test/build scripts, SEO defaults, and deployment-ready structure."],
            ["Can we simplify the landing page further?", "Yes. Remove sections you do not need while preserving the spacing rhythm and typography scale."],
            ["Is the local CMS intended for production serving?", "No. Local CMS tooling is for authoring workflows; production serves the built web output." ]
          ].map(([question, answer]) => (
            <div key={question} className="collapse-plus collapse border border-base-300 bg-base-100">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">{question}</div>
              <div className="collapse-content text-sm text-base-content/75">{answer}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="rounded border border-base-300 bg-base-100 p-8 text-center shadow-sm md:p-10">
        <h2 className="mb-2">Ready to build?</h2>
        <p className="mx-auto mb-5 max-w-2xl text-base-content/75">
          Start with a clean, modern baseline and adapt it to your product without redesigning from scratch.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <a href="/signup" className="btn btn-primary">Get Started</a>
          <a href="/signin" className="btn btn-outline">Sign In</a>
        </div>
      </section>
    </div>
  );
}
