export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-8">
          <div className="badge badge-accent badge-outline">About this template</div>
          <h1>Built for launch-ready product pages</h1>
          <p className="text-base-content/80 md:text-lg">
            This About page is statically generated during build and served as HTML. It demonstrates how to publish
            crawlable, fast-first-paint pages while keeping dynamic app routes for authenticated flows.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h2 className="text-base">SEO-first</h2>
            <p className="text-sm text-base-content/80">Prerendered HTML is discoverable by search engines without client-side execution.</p>
          </div>
        </article>
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h2 className="text-base">Fast delivery</h2>
            <p className="text-sm text-base-content/80">The static page can be cached aggressively by CDNs for globally quick response times.</p>
          </div>
        </article>
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h2 className="text-base">Hybrid ready</h2>
            <p className="text-sm text-base-content/80">You can mix SSG marketing routes with SSR/authenticated product routes in the same app.</p>
          </div>
        </article>
      </section>

      <section className="alert alert-info">
        <div>
          <h2 className="text-base font-semibold">Verification target</h2>
          <p className="text-sm">
            Run a production build and confirm a generated HTML artifact exists for the about route under the client
            build output.
          </p>
        </div>
      </section>
    </div>
  );
}