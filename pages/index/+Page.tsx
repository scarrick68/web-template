export default function Page() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-5 p-6 md:p-8">
          <div className="badge badge-primary badge-outline">Rails + Vike Starter</div>

          <h1 className="max-w-3xl">
            Ship a real product shell, not a throwaway demo.
          </h1>

          <p className="max-w-2xl text-base-content/80 md:text-lg">
            This web template is built to connect to your Rails backend out of the box. Use it as the first screen for
            product demos, onboarding, and full-stack feature work.
          </p>

          <div className="card-actions mt-2 flex-wrap gap-2">
            <a href="/signup" className="btn btn-primary">
              Create account
            </a>
            <a href="/signin" className="btn btn-outline">
              Sign in
            </a>
            <a href="http://localhost:3000/docs" className="btn btn-ghost">
              Open API docs
            </a>
          </div>
        </div>
      </section>

      <aside className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-7">
          <h2>Included in this scaffold</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-base-content/80">
            <li>Server-rendered Vike pages with React.</li>
            <li>Signup flow wired to Rails `/auth` endpoint.</li>
            <li>Drop-in path for `/api/v1/users/me` follow-up integration.</li>
            <li>A UI baseline that looks intentional on desktop and mobile.</li>
          </ul>

          <div className="alert alert-info mt-4">
            <div className="text-sm">
              Browser API calls use an explicit base URL. Set <strong>VITE_API_BASE_URL</strong> to your API origin
              (for example <strong>http://localhost:5001</strong> in local development).
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
