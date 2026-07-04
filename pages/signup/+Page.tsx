import { FormEvent, useState } from "react";
import { apiBaseLabel } from "../../src/api/client";
import { normalizeApiErrorMessage } from "../../src/api/errors";
import { usePostAuth } from "../../src/gen/api";

type SignupState = {
  loading: boolean;
  error: string | null;
};

const DEFAULT_STATE: SignupState = {
  loading: false,
  error: null,
};

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState<SignupState>(DEFAULT_STATE);
  const signupMutation = usePostAuth();

  const signupCreatePath = "/auth";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      setStatus({ loading: false, error: "Password confirmation does not match." });
      return;
    }

    setStatus({ loading: true, error: null });

    try {
      const confirmSuccessUrl = `${window.location.origin}/signup/confirmed`;
      const dtaSignupPayload = {
        email,
        password,
        password_confirmation: passwordConfirmation,
        confirm_success_url: confirmSuccessUrl,
      };

      const response = await signupMutation.mutateAsync({
        data: dtaSignupPayload,
      });

      if (response.status !== 200) {
        const message = normalizeApiErrorMessage(response.data, "Sign up failed. Please try again.");
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
    <div className="mx-auto max-w-xl">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-8">
          <div className="badge badge-primary badge-outline">Create API account</div>
          <h1>Sign up</h1>
          <p className="text-base-content/80">
            This form submits to the token-auth registration endpoint at <strong>{signupCreatePath}</strong>.
          </p>
          <p className="text-sm text-base-content/70">
            API target: <strong>{apiBaseLabel}</strong>. Set <strong>VITE_API_BASE_URL</strong> to the API origin for your
            current environment.
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
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                placeholder="At least 8 characters"
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Confirm password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Repeat password"
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
              {status.loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
