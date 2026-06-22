import { useMemo } from "react";

export default function Page() {
  const email = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("email") || "";
  }, []);

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-emerald-700/20 bg-white/85 p-7 shadow-[0_24px_60px_-40px_rgba(10,15,28,0.6)] md:p-9">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Sign up successful</p>
      <h1 className="mb-3">Check your email</h1>
      <p className="mb-4 text-slate-700">
        Your account was created. We sent a confirmation email{email ? ` to ${email}` : ""}.
      </p>
      <p className="mb-6 text-slate-700">
        Confirm your email before trying to sign in. After confirmation, you can use your credentials from the web
        client or call authenticated API routes.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="/signup"
          className="inline-flex items-center rounded-full border border-slate-900/15 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-900/40"
        >
          Back to sign up
        </a>
        <a
          href="http://localhost:5000/auth/sign_in"
          className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700"
        >
          Open backend sign in
        </a>
      </div>
    </div>
  );
}
