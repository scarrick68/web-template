import { FormEvent, useState } from "react";
import { extractDtaAuthHeaders } from "../../src/api/auth";
import { apiBaseLabel } from "../../src/api/client";
import { normalizeApiErrorMessage, type ApiErrorPayload } from "../../src/api/errors";
import { clearAuthTokens, saveAuthTokens } from "../../src/auth/tokenStore";
import { usePostAuthSignIn } from "../../src/gen/api";

// Minimal sign-in page for token-auth login.
// On success, it stores DTA headers locally and redirects to /me.

type SignInState = {
  loading: boolean;
  error: string | null;
};

const DEFAULT_STATE: SignInState = {
  loading: false,
  error: null,
};

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<SignInState>(DEFAULT_STATE);
  const signInMutation = usePostAuthSignIn();

  // Submit credentials to DTA, persist returned headers, and route to /me.
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      const response = await signInMutation.mutateAsync({
        data: { email, password },
      });

      if (response.status !== 200) {
        clearAuthTokens();
        const errorMessage = normalizeApiErrorMessage(response.data as ApiErrorPayload,
          "Sign in failed. Please check your credentials and try again.",
        );
        setStatus({ loading: false, error: errorMessage });
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
