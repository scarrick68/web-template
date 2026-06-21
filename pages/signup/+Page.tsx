import { FormEvent, useState } from "react";

type SignupState = {
  loading: boolean;
  error: string | null;
};

const DEFAULT_STATE: SignupState = {
  loading: false,
  error: null,
};

const configuredApiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";

function apiUrl(path: string) {
  return configuredApiBaseUrl ? `${configuredApiBaseUrl}${path}` : path;
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState<SignupState>(DEFAULT_STATE);

  const apiBaseLabel = configuredApiBaseUrl || "(Vite proxy -> http://127.0.0.1:5000)";
  const signupCreatePath = "/auth";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      setStatus({ loading: false, error: "Password confirmation does not match." });
      return;
    }

    setStatus({ loading: true, error: null });

    try {
      const confirmSuccessUrl = `${window.location.origin}/`;

      const response = await fetch(apiUrl(signupCreatePath), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation: passwordConfirmation,
          confirm_success_url: confirmSuccessUrl,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        errors?: string[];
        message?: string;
        data?: Record<string, unknown>;
      };

      if (!response.ok) {
        const message = payload.errors?.join(" ") || payload.message || "Sign up failed. Please try again.";
        setStatus({ loading: false, error: message });
        return;
      }

      const successUrl = `/signup/success?email=${encodeURIComponent(email)}`;
      window.location.assign(successUrl);
    } catch {
      setStatus({
        loading: false,
        error: "Unable to reach the API. Check VITE_API_BASE_URL and ensure Rails is running.",
      });
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-900/10 bg-white/85 p-7 shadow-[0_24px_60px_-40px_rgba(10,15,28,0.6)] md:p-9">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700">Create API account</p>
      <h1 className="mb-3">Sign up</h1>
      <p className="mb-6 text-slate-700">
        This form submits to the token-auth registration endpoint at <strong>{signupCreatePath}</strong>.
      </p>
      <p className="mb-6 text-sm text-slate-600">
        API target: <strong>{apiBaseLabel}</strong>. Leave <strong>VITE_API_BASE_URL</strong> empty to use the Vite dev
        proxy, or set it when the browser should call an absolute API URL directly.
      </p>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-800">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-800">Password</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="At least 8 characters"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-800">Confirm password</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="Repeat password"
          />
        </label>

        {status.error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{status.error}</p>}
        <button
          type="submit"
          disabled={status.loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status.loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
