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
    <div className="mx-auto max-w-xl">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-8">
          <div className="badge badge-info badge-outline">Authenticate</div>
          <h1>Sign in</h1>
          <p className="text-base-content/80">
            This form submits to the token-auth sign-in endpoint at <strong>/auth/sign_in</strong>.
          </p>
          <p className="text-sm text-base-content/70">
            API target: <strong>{apiBaseLabel}</strong>. Leave <strong>VITE_API_BASE_URL</strong> empty to use the Vite dev
            proxy, or set it when the browser should call an absolute API URL directly.
          </p>

          <form className="mt-2 space-y-4" onSubmit={onSubmit}>
            <label className="form-control w-full">
              <span className="label-text mb-1">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                placeholder="you@example.com"
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Your password"
              />
            </label>

            {status.error && (
              <div className="alert alert-error">
                <span>{status.error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status.loading}
              className="btn btn-primary w-full"
            >
              {status.loading && <span className="loading loading-spinner loading-xs" aria-hidden="true" />}
              {status.loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
