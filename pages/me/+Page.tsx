import { useEffect } from "react";
import { apiBaseLabel } from "../../src/api/client";
import { normalizeApiErrorMessage, type ApiErrorPayload } from "../../src/api/errors";
import { clearAuthTokens, getAuthTokens } from "../../src/auth/tokenStore";
import { useGetApiV1UsersMe } from "../../src/gen/api";

// Minimal authenticated smoke page.
// It verifies stored DTA headers can call /api/v1/users/me.

type ApiUser = {
  id: number;
  email: string;
  name?: string | null;
  admin: boolean;
  created_at: string;
  updated_at: string;
};

type MeState = {
  loading: boolean;
  error: string | null;
  user: ApiUser | null;
};

export default function Page() {
  const authHeaders = getAuthTokens();
  const shouldLoad = Boolean(authHeaders);
  const meQuery = useGetApiV1UsersMe({
    query: {
      enabled: shouldLoad,
      retry: false,
    },
  });

  useEffect(() => {
    if (shouldLoad && meQuery.data && meQuery.data.status !== 200) {
      clearAuthTokens();
    }
  }, [shouldLoad, meQuery.data]);

  const result = meQuery.data;
  const isSuccess = result?.status === 200;
  const isErrorResponse = result && result.status !== 200;
  const user = isSuccess ? (result.data.data as ApiUser | undefined) : null;

  let error: string | null = null;

  if (!shouldLoad) {
    error = "No stored auth session. Please sign in first.";
  } else if (isErrorResponse) {
    error = normalizeApiErrorMessage(result.data as ApiErrorPayload, "Unable to load current user.");
  } else if (isSuccess && !user) {
    error = "Current user payload missing data.";
  } else if (meQuery.error) {
    error = "Unable to reach the API. Check VITE_API_BASE_URL and ensure Rails is running.";
  }

  const state: MeState = {
    loading: shouldLoad ? meQuery.isLoading : false,
    error,
    user: user || null,
  };

  // Clear local auth and return user to sign-in flow.
  function onSignOut() {
    clearAuthTokens();
    window.location.assign("/signin");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-8">
          <div className="badge badge-secondary badge-outline">Authenticated API smoke test</div>
          <h1>My account</h1>
          <p className="text-sm text-base-content/70">
            API target: <strong>{apiBaseLabel}</strong>
          </p>

          {state.loading && (
            <div className="alert alert-info mt-3">
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              <span>Loading current user...</span>
            </div>
          )}

          {!state.loading && state.error && (
            <div className="mt-3 space-y-4">
              <div className="alert alert-error">
                <span>{state.error}</span>
              </div>
              <a href="/signin" className="btn btn-outline">
                Go to sign in
              </a>
            </div>
          )}

          {!state.loading && state.user && (
            <div className="mt-3 space-y-5">
              <div className="card border border-base-300 bg-base-200/50">
                <div className="card-body gap-1 p-4">
                  <p className="text-sm text-base-content/70">Signed in as</p>
                  <p className="text-base font-semibold">{state.user.email}</p>
                </div>
              </div>

              <div className="mockup-code text-xs">
                <pre className="overflow-x-auto whitespace-pre-wrap break-all p-4">
                  {JSON.stringify(state.user, null, 2)}
                </pre>
              </div>

              <div className="card-actions flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void meQuery.refetch()}
                  className="btn btn-outline"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="btn btn-primary"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
