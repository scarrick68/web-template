export default function Page() {
  const docsUrl = "https://github.com/scarrick68/web-template/tree/main/docs";
  const repoUrl = "https://github.com/scarrick68/web-template";

  return (
    <div className="mx-auto max-w-6xl space-y-20">
      <section className="space-y-5 border-b border-base-300 pb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">About the project</p>
        <h1 className="max-w-4xl">A foundation for building and launching complete applications</h1>
        <p className="max-w-3xl text-base-content/75 md:text-lg">
          This template is for teams that want a practical open-source starting point for web, API, and mobile products.
          It combines clear architecture with default tooling so you can ship meaningful features quickly without turning
          generated code into framework lock-in.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href={docsUrl} className="btn btn-primary">View documentation</a>
          <a href={repoUrl} className="btn btn-outline">View on GitHub</a>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <h2>Why it exists</h2>
          <p className="text-base-content/75">
            New projects often spend weeks rebuilding the same foundations before solving product problems. This template
            exists to shorten that cycle: start with sensible defaults, keep boundaries explicit, and stay close to
            normal application code your team can own.
          </p>
          <p className="text-base-content/75">
            The goal is not to hide complexity. It is to move repetitive setup work out of the critical path while
            keeping decisions visible and easy to change.
          </p>
        </div>
        <div className="space-y-4">
          <article className="rounded border border-base-300 bg-base-100 px-5 py-4">
            <h3 className="text-lg font-semibold">Start with production-ready defaults</h3>
            <p className="mt-1 text-sm text-base-content/75">Ship from a strong baseline instead of assembling core patterns from scratch.</p>
          </article>
          <article className="rounded border border-base-300 bg-base-100 px-5 py-4">
            <h3 className="text-lg font-semibold">Keep architecture explicit and understandable</h3>
            <p className="mt-1 text-sm text-base-content/75">Each app has clear responsibilities, with integration points designed to be obvious.</p>
          </article>
          <article className="rounded border border-base-300 bg-base-100 px-5 py-4">
            <h3 className="text-lg font-semibold">Automate setup without hiding decisions</h3>
            <p className="mt-1 text-sm text-base-content/75">Workflows are scripted for speed, but behavior stays inspectable and overridable.</p>
          </article>
        </div>
      </section>

      <section className="space-y-5">
        <h2>What is included</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Vike frontend", "SSR/SSG-capable web app with maintainable routing, UI defaults, and testing setup."],
            ["Rails API", "Backend foundation with auth flows, admin tooling, and operational patterns."],
            ["Expo mobile app", "Companion mobile client structure aligned to the same API and contracts."],
            ["OpenAPI-generated integration", "Contract-driven API client generation and shared schema workflow."],
            ["Local development tooling", "Commands for setup, validation, and day-to-day cross-repo workflows."],
            ["Cloud provisioning and validation", "Infrastructure scripts and checks for repeatable deployment workflows."]
          ].map(([title, text]) => (
            <article key={title} className="space-y-1 border-l-2 border-primary/70 pl-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-6 text-base-content/75">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2>How the applications work together</h2>
        <div className="rounded border border-base-300 bg-base-100 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Node label="Vike web app" />
              <Node label="Expo mobile app" />
              <Arrow />
              <Node label="Rails API" />
            </div>
            <div className="space-y-2">
              <Node label="Postgres" />
              <Node label="OpenSearch" />
              <Node label="Object storage" />
              <Arrow />
              <Node label="Workspace orchestration" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2>Principles behind the template</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded border border-base-300 bg-base-100 p-4">
            <h3 className="text-lg font-semibold">Useful defaults over endless configuration</h3>
          </article>
          <article className="rounded border border-base-300 bg-base-100 p-4">
            <h3 className="text-lg font-semibold">Automation with visible behavior</h3>
          </article>
          <article className="rounded border border-base-300 bg-base-100 p-4">
            <h3 className="text-lg font-semibold">Strong boundaries between applications</h3>
          </article>
          <article className="rounded border border-base-300 bg-base-100 p-4">
            <h3 className="text-lg font-semibold">Generated code that stays maintainable application code</h3>
          </article>
        </div>
      </section>

      <section className="rounded border border-base-300 bg-base-100 px-6 py-8 md:px-8 md:py-10">
        <h2 className="mb-2">Build from a base your team can grow with</h2>
        <p className="max-w-3xl text-base-content/75">
          Start with documented defaults, clear architecture, and practical workflows. Adapt the template to your domain
          while keeping the generated output understandable and maintainable.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={docsUrl} className="btn btn-primary">Documentation</a>
          <a href={repoUrl} className="btn btn-outline">GitHub</a>
        </div>
      </section>
    </div>
  );
}

function Node({ label }: { label: string }) {
  return <div className="rounded border border-base-300 bg-base-200/20 px-4 py-3 text-sm font-medium">{label}</div>;
}

function Arrow() {
  return <div className="text-center text-base-content/40">↓</div>;
}