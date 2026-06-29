export default function Page() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-8">
          <div className="badge badge-accent badge-outline">About this template</div>
          <h1>A production-ready web template for shipping real products</h1>
          <p className="text-base-content/80 md:text-lg">
            This template gives you a polished frontend starting point with practical defaults for SEO, authentication
            flows, API integration, and testing. It is designed to be reused, extended, and maintained by teams that
            want velocity without cutting architecture corners.
          </p>
          <div className="card-actions mt-2 flex-wrap gap-2">
            <a href="/signup" className="btn btn-primary">Try sign-up flow</a>
            <a href="/signin" className="btn btn-outline">Try sign-in flow</a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h2 className="text-base">Built for immediate use</h2>
            <p className="text-sm text-base-content/80">
              Includes ready-to-use routes for home, about, sign-up, sign-in, and authenticated user checks so teams
              can start implementing product features on day one.
            </p>
          </div>
        </article>
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h2 className="text-base">Contract-aware frontend</h2>
            <p className="text-sm text-base-content/80">
              OpenAPI-driven generated hooks and models, plus contract-aware tests, help keep frontend behavior aligned
              with backend API changes.
            </p>
          </div>
        </article>
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h2 className="text-base">Hybrid rendering model</h2>
            <p className="text-sm text-base-content/80">
              Mix SSG pages for crawlable marketing content with SSR routes for authenticated product surfaces in a
              single Vike application.
            </p>
          </div>
        </article>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-7">
          <h2>Core frontend advantages</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
              <li>React + Vike scaffold with filesystem routing and SSR/SSG support.</li>
              <li>Token-auth compatible header extraction and propagation for authenticated API calls.</li>
              <li>Shared API error normalization for consistent user-facing failures.</li>
              <li>Vitest + Testing Library setup for route-level and API behavior tests.</li>
            </ul>
            <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
              <li>SEO defaults with route-level metadata and canonical URL support.</li>
              <li>SSG-ready content routes for fast first paint and search indexing.</li>
              <li>DaisyUI-based component styling for maintainable UI evolution.</li>
              <li>CI-friendly workflow that supports lint, test, and production build checks.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-7">
          <h2>Why pair it with the API template</h2>
          <p className="text-sm text-base-content/80">
            The frontend template is intentionally designed to work well with the Rails API template. Together they
            provide a practical full-stack baseline with explicit auth boundaries, contract-first integration, and
            built-in operational tooling.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="alert alert-success">
              <span className="text-sm">
                API-template auth architecture separates token-auth user flows from admin session flows, which maps
                cleanly to this frontend's sign-in and authenticated-user pages.
              </span>
            </div>
            <div className="alert alert-success">
              <span className="text-sm">
                OpenAPI is maintained in the API template and synced into this frontend, enabling generated clients and
                contract-aware testing.
              </span>
            </div>
            <div className="alert alert-success">
              <span className="text-sm">
                API-template observability and operator tooling (for example metrics, dashboards, and admin tools)
                supports faster debugging while frontend teams iterate on product UX.
              </span>
            </div>
            <div className="alert alert-success">
              <span className="text-sm">
                Security and reliability defaults such as throttling and standardized error envelopes create stable
                backend behavior for frontend feature development.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-7">
          <h2>Full-stack orchestration benefits</h2>
          <p className="text-sm text-base-content/80">
            In the product-template workspace, a Ruby-first orchestration layer ties repositories together with shared
            contracts, coordination scripts, and cross-repository workflows.
          </p>
          <div className="stats stats-vertical border border-base-300 bg-base-200/40 md:stats-horizontal">
            <div className="stat">
              <div className="stat-title">Shared contracts</div>
              <div className="stat-desc text-xs">OpenAPI sync keeps producer and consumer repos aligned.</div>
            </div>
            <div className="stat">
              <div className="stat-title">Developer workflow</div>
              <div className="stat-desc text-xs">Commands such as bootstrap, doctor, dev, and sync-openapi reduce setup friction.</div>
            </div>
            <div className="stat">
              <div className="stat-title">Integration confidence</div>
              <div className="stat-desc text-xs">Workspace-level testing strategy focuses on cross-repository compatibility and smoke checks.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="alert alert-info">
        <div>
          <h2 className="text-base font-semibold">Verification target</h2>
          <p className="text-sm">
            This route is configured for SSG. Run a production build and confirm generated artifacts exist under the
            client build output for the about route.
          </p>
        </div>
      </section>
    </div>
  );
}