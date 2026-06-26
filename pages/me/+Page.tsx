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
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-900/10 bg-white/85 p-7 shadow-[0_24px_60px_-40px_rgba(10,15,28,0.6)] md:p-9">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Authenticated API smoke test</p>
      <h1 className="mb-3">My account</h1>
      <p className="mb-6 text-sm text-slate-600">
        API target: <strong>{apiBaseLabel}</strong>
      </p>

      {state.loading && <p className="text-sm text-slate-700">Loading current user...</p>}

      {!state.loading && state.error && (
        <div className="space-y-4">
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{state.error}</p>
          <a
            href="/signin"
            className="inline-flex items-center rounded-full border border-slate-900/15 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-900/40"
          >
            Go to sign in
          </a>
        </div>
      )}

      {!state.loading && state.user && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Signed in as</p>
            <p className="text-base font-semibold text-slate-900">{state.user.email}</p>
          </div>

          <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
            {JSON.stringify(state.user, null, 2)}
          </pre>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void meQuery.refetch()}
              className="inline-flex items-center rounded-full border border-slate-900/15 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-900/40"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
