export default function Page() {
  return (
    <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-3xl border border-slate-900/10 bg-white/75 p-8 shadow-[0_20px_40px_-30px_rgba(20,29,44,0.45)] backdrop-blur-sm md:p-10">
        <p className="mb-3 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
          Rails + Vike Starter
        </p>
        <h1 className="mb-4 text-5xl leading-tight md:text-6xl">
          Ship a real product shell,
          <br />
          not a throwaway demo.
        </h1>
        <p className="max-w-xl text-lg text-slate-700">
          This web template is built to connect to your Rails backend out of the box. Use it as the first screen for
          product demos, onboarding, and full-stack feature work.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/signup"
            className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700"
          >
            Create account
          </a>
          <a
            href="/signin"
            className="inline-flex items-center rounded-full border border-slate-900/15 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-900/40"
          >
            Sign in
          </a>
          <a
            href="http://localhost:3000/docs"
            className="inline-flex items-center rounded-full border border-slate-900/15 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-900/40"
          >
            Open API docs
          </a>
        </div>
      </section>

      <aside className="rounded-3xl border border-slate-900/10 bg-slate-900 p-7 text-slate-100 shadow-[0_30px_50px_-35px_rgba(15,23,42,0.85)]">
        <h2 className="text-slate-50">Included in this scaffold</h2>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
          <li>Server-rendered Vike pages with React.</li>
          <li>Signup flow wired to Rails `/auth` endpoint.</li>
          <li>Drop-in path for `/api/v1/users/me` follow-up integration.</li>
          <li>A UI baseline that looks intentional on desktop and mobile.</li>
        </ul>
        <div className="mt-8 rounded-2xl border border-orange-300/30 bg-orange-300/10 p-4 text-sm text-orange-100">
          Dev mode defaults to a Vite proxy for <strong>/auth</strong> and <strong>/api</strong> to <strong>http://127.0.0.1:5000</strong>.
          Set <strong>VITE_RAILS_PROXY_TARGET</strong> to change the dev proxy target. Set <strong>VITE_API_BASE_URL</strong> only when the browser should call an absolute API URL directly.
        </div>
      </aside>
    </div>
  );
}
