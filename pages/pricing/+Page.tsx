export default function Page() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="alert alert-warning border border-warning/40 bg-warning/10 text-warning-content">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">Demo pricing page</h1>
          <p className="text-sm md:text-base">
            This page is a template demo only. We are not selling anything here. Replace these plans with your real
            product pricing and billing details.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2>Pricing</h2>
        <p className="max-w-3xl text-base-content/75">
          A conservative pricing layout that you can adapt to usage-based, seat-based, or enterprise pricing models.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded border border-base-300 bg-base-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Starter</h3>
          <p className="mt-1 text-sm text-base-content/70">For early prototypes and internal tools.</p>
          <p className="mt-4 text-3xl font-bold">$0<span className="ml-1 text-sm font-medium text-base-content/70">/mo</span></p>
          <ul className="mt-4 space-y-2 text-sm text-base-content/75">
            <li>Up to 3 team members</li>
            <li>Core web features</li>
            <li>Community support</li>
          </ul>
          <button className="btn btn-outline mt-6 w-full" type="button">Select Starter</button>
        </article>

        <article className="rounded border-2 border-primary bg-base-100 p-6 shadow-sm">
          <span className="badge badge-primary badge-outline">Recommended</span>
          <h3 className="mt-2 text-lg font-semibold">Growth</h3>
          <p className="mt-1 text-sm text-base-content/70">For product teams shipping to customers.</p>
          <p className="mt-4 text-3xl font-bold">$99<span className="ml-1 text-sm font-medium text-base-content/70">/mo</span></p>
          <ul className="mt-4 space-y-2 text-sm text-base-content/75">
            <li>Unlimited team members</li>
            <li>Advanced analytics</li>
            <li>Priority support</li>
          </ul>
          <button className="btn btn-primary mt-6 w-full" type="button">Select Growth</button>
        </article>

        <article className="rounded border border-base-300 bg-base-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Enterprise</h3>
          <p className="mt-1 text-sm text-base-content/70">For compliance and large-scale operations.</p>
          <p className="mt-4 text-3xl font-bold">Custom</p>
          <ul className="mt-4 space-y-2 text-sm text-base-content/75">
            <li>Private networking options</li>
            <li>Custom onboarding</li>
            <li>SLA and security reviews</li>
          </ul>
          <button className="btn btn-outline mt-6 w-full" type="button">Contact Sales</button>
        </article>
      </section>
    </div>
  );
}
