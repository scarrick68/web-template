export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-900/10 bg-white/85 p-7 shadow-[0_24px_60px_-40px_rgba(10,15,28,0.6)] md:p-10">
      <section className="space-y-4">
        <p className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
          About this template
        </p>
        <h1 className="text-4xl leading-tight md:text-5xl">Built for launch-ready product pages</h1>
        <p className="text-lg text-slate-700">
          This About page is statically generated during build and served as HTML. It demonstrates how to publish
          crawlable, fast-first-paint pages while keeping dynamic app routes for authenticated flows.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">SEO-first</h2>
          <p className="mt-2 text-sm text-slate-700">Prerendered HTML is discoverable by search engines without client-side execution.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">Fast delivery</h2>
          <p className="mt-2 text-sm text-slate-700">The static page can be cached aggressively by CDNs for globally quick response times.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">Hybrid ready</h2>
          <p className="mt-2 text-sm text-slate-700">You can mix SSG marketing routes with SSR/authenticated product routes in the same app.</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-900/10 bg-slate-900 p-5 text-slate-100">
        <h2 className="text-xl text-white">Verification target</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Run a production build and confirm a generated HTML artifact exists for the about route under the client
          build output.
        </p>
      </section>
    </div>
  );
}