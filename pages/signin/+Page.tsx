import { FormEvent, useState } from "react";
import { extractDtaAuthHeaders } from "../../src/api/auth";
import { apiBaseLabel, apiFetch, parseJsonResponse } from "../../src/api/client";
import { clearAuthTokens, saveAuthTokens } from "../../src/auth/tokenStore";

// Minimal sign-in page for token-auth login.
// On success, it stores DTA headers locally and redirects to /me.

type SignInState = {
  loading: boolean;
  error: string | null;
};

type ErrorPayload = {
  errors?: string[] | Record<string, string[]>;
  message?: string;
};

const DEFAULT_STATE: SignInState = {
  loading: false,
  error: null,
};

// Normalize API error shapes into a single user-readable message.
function normalizeApiError(payload: ErrorPayload) {
  if (Array.isArray(payload.errors)) {
    return payload.errors.join(" ");
  }

  if (payload.errors && typeof payload.errors === "object") {
    return Object.values(payload.errors)
      .flat()
      .join(" ");
  }

  return payload.message || "Sign in failed. Please check your credentials and try again.";
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<SignInState>(DEFAULT_STATE);

  // Submit credentials to DTA, persist returned headers, and route to /me.
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      const response = await apiFetch("/auth/sign_in", {
        method: "POST",
        json: { email, password },
      });

      const payload = (await parseJsonResponse(response)) as ErrorPayload;

      if (!response.ok) {
        clearAuthTokens();
        setStatus({ loading: false, error: normalizeApiError(payload) });
        return;
      }

      const authHeaders = extractDtaAuthHeaders(response);
      if (!authHeaders) {
        clearAuthTokens();
        setStatus({ loading: false, error: "Sign in succeeded but auth headers were missing." });
        return;
      }

      saveAuthTokens(authHeaders);
      window.location.assign("/me");
    } catch {
      clearAuthTokens();
      setStatus({
        loading: false,
        error: "Unable to reach the API. Check VITE_API_BASE_URL and ensure Rails is running.",
      });
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-900/10 bg-white/85 p-7 shadow-[0_24px_60px_-40px_rgba(10,15,28,0.6)] md:p-9">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Authenticate</p>
      <h1 className="mb-3">Sign in</h1>
      <p className="mb-6 text-slate-700">
        This form submits to the token-auth sign-in endpoint at <strong>/auth/sign_in</strong>.
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
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-800">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="Your password"
          />
        </label>

        {status.error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{status.error}</p>}

        <button
          type="submit"
          disabled={status.loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status.loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
